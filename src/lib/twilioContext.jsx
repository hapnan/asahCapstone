import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Device } from "@twilio/voice-sdk";
import { voiceAPI } from "./api";

import { CallState } from "./twilioCallState";

const TwilioContext = createContext(null);

/**
 * TwilioProvider - Manages a single Twilio Device instance for the entire app
 * This prevents creating multiple device instances and hitting connection limits
 */
export function TwilioProvider({ children }) {
  const [callState, setCallState] = useState(CallState.DISCONNECTED);
  const [activeCall, setActiveCall] = useState(null);
  const [error, setError] = useState(null);
  const [callFrom, setCallFrom] = useState(null);
  const [callTo, setCallTo] = useState(null);
  const [isDeviceReady, setIsDeviceReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const deviceRef = useRef(null);
  const tokenRef = useRef(null);
  const initPromiseRef = useRef(null);

  /**
   * Setup event handlers for a call
   */
  const setupCallHandlers = useCallback((call) => {
    call.on("accept", () => {
      console.log("Call accepted");
      setCallState(CallState.ON_CALL);
    });

    call.on("disconnect", () => {
      console.log("Call disconnected");
      setActiveCall(null);
      setCallFrom(null);
      setCallTo(null);
      setCallState(CallState.READY);
    });

    call.on("cancel", () => {
      console.log("Call canceled");
      setActiveCall(null);
      setCallFrom(null);
      setCallTo(null);
      setCallState(CallState.READY);
    });

    call.on("reject", () => {
      console.log("Call rejected");
      setActiveCall(null);
      setCallFrom(null);
      setCallTo(null);
      setCallState(CallState.READY);
    });

    call.on("error", (err) => {
      console.error("Call error:", err);
      setError(err.message);
      setActiveCall(null);
      setCallTo(null);
      setCallState(CallState.ERROR);
    });
  }, []);

  /**
   * Initialize Twilio Device with token from backend
   * Uses a singleton pattern - only initializes once
   */
  const initializeDevice = useCallback(async () => {
    // If already initializing, return the existing promise
    if (initPromiseRef.current) {
      return initPromiseRef.current;
    }

    // If already initialized, return immediately
    if (deviceRef.current && isDeviceReady) {
      return Promise.resolve();
    }

    // Create initialization promise
    initPromiseRef.current = (async () => {
      try {
        setIsInitializing(true);
        setError(null);

        // Fetch token from backend
        const response = await voiceAPI.getToken();
        if (!response.ok) {
          throw new Error("Failed to fetch access token");
        }

        const { data } = await response.json();

        // Validate token
        if (!data.token || typeof data.token !== "string") {
          throw new Error("Invalid token received from server");
        }

        tokenRef.current = data.token;

        // Create and configure Twilio Device
        const device = new Device(tokenRef.current, {
          logLevel: 1, // Debug logging
          codecPreferences: ["opus", "pcmu"],
          edge: "ashburn",
          allowIncomingWhileBusy: false,
        });

        deviceRef.current = device;

        // Device event handlers
        device.on("registered", () => {
          console.log("Twilio Device registered");
          setIsDeviceReady(true);
          setCallState(CallState.READY);
          setIsInitializing(false);
        });

        device.on("error", (err) => {
          console.error("Device error:", err.code, err.message);
          setError(err.message);
          setCallState(CallState.ERROR);
          setIsInitializing(false);
        });

        device.on("unregistered", () => {
          console.log("Device unregistered");
          setIsDeviceReady(false);
          setCallState(CallState.DISCONNECTED);
        });

        // Handle incoming calls
        device.on("incoming", (call) => {
          console.log("Incoming call from:", call.parameters.From);
          setCallFrom(call.parameters.From);
          setActiveCall(call);
          setCallState(CallState.INCOMING);

          // Setup call event handlers
          setupCallHandlers(call);
        });

        // Register the device
        await device.register();
      } catch (err) {
        console.error("Failed to initialize device:", err);
        setError(err.message);
        setCallState(CallState.ERROR);
        setIsInitializing(false);
        throw err;
      } finally {
        // Clear the promise reference
        initPromiseRef.current = null;
      }
    })();

    return initPromiseRef.current;
  }, [isDeviceReady, setupCallHandlers]);

  /**
   * Connect a call to a phone number
   */
  const connectCall = useCallback(
    async (phoneNumber, customParams = {}) => {
      if (!deviceRef.current || !isDeviceReady) {
        setError("Device not ready");
        return;
      }

      // Check if there's already an active call
      if (activeCall) {
        setError("Another call is already in progress");
        return;
      }

      try {
        setError(null);
        setCallState(CallState.CONNECTING);
        setCallTo(phoneNumber);

        const connectOptions = {
          params: {
            To: phoneNumber,
            ...customParams,
          },
          rtcConstraints: {
            audio: true,
          },
        };

        const call = await deviceRef.current.connect(connectOptions);
        setActiveCall(call);

        // Setup call event handlers
        setupCallHandlers(call);

        call.on("ringing", (hasEarlyMedia) => {
          console.log("Call is ringing, early media:", hasEarlyMedia);
        });
      } catch (err) {
        console.error("Failed to connect call:", err);
        setError(err.message);
        setCallState(CallState.READY);
        setCallTo(null);
      }
    },
    [isDeviceReady, activeCall, setupCallHandlers],
  );

  /**
   * Disconnect the active call
   */
  const disconnectCall = useCallback(() => {
    if (activeCall) {
      activeCall.disconnect();
    }
  }, [activeCall]);

  /**
   * Accept an incoming call
   */
  const acceptCall = useCallback(() => {
    if (activeCall && callState === CallState.INCOMING) {
      activeCall.accept({
        rtcConstraints: {
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        },
      });
    }
  }, [activeCall, callState]);

  /**
   * Reject an incoming call
   */
  const rejectCall = useCallback(() => {
    if (activeCall && callState === CallState.INCOMING) {
      activeCall.reject();
      setActiveCall(null);
      setCallFrom(null);
      setCallTo(null);
      setCallState(CallState.READY);
    }
  }, [activeCall, callState]);

  /**
   * Cleanup device on unmount
   */
  useEffect(() => {
    return () => {
      const device = deviceRef.current;
      if (device) {
        device.unregister();
        device.destroy();
      }
    };
  }, []);

  const value = {
    // State
    callState,
    activeCall,
    error,
    callFrom,
    callTo,
    isDeviceReady,
    isInitializing,

    // Actions
    initializeDevice,
    connectCall,
    disconnectCall,
    acceptCall,
    rejectCall,
  };

  return (
    <TwilioContext.Provider value={value}>{children}</TwilioContext.Provider>
  );
}

/**
 * Hook to use Twilio context
 * @returns {Object} - Twilio device state and control functions
 */
export function useTwilio() {
  const context = useContext(TwilioContext);
  if (!context) {
    throw new Error("useTwilio must be used within a TwilioProvider");
  }
  return context;
}
