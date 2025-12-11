import { useState, useEffect, useRef, useCallback } from "react";
import { Device } from "@twilio/voice-sdk";
import { voiceAPI } from "../lib/api";

/**
 * Call states
 */
export const CallState = {
  DISCONNECTED: "Disconnected",
  READY: "Ready",
  CONNECTING: "Connecting",
  ON_CALL: "OnCall",
  INCOMING: "Incoming",
  ERROR: "Error",
};

/**
 * Custom hook to manage Twilio Device and handle VoIP calls
 * @returns {Object} - Device state and control functions
 */
export function useTwilioDevice() {
  const [callState, setCallState] = useState(CallState.DISCONNECTED);
  const [activeCall, setActiveCall] = useState(null);
  const [error, setError] = useState(null);
  const [callFrom, setCallFrom] = useState(null);
  const [isDeviceReady, setIsDeviceReady] = useState(false);

  const deviceRef = useRef(null);
  const tokenRef = useRef(null);

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
      setCallState(CallState.READY);
    });

    call.on("cancel", () => {
      console.log("Call canceled");
      setActiveCall(null);
      setCallFrom(null);
      setCallState(CallState.READY);
    });

    call.on("reject", () => {
      console.log("Call rejected");
      setActiveCall(null);
      setCallFrom(null);
      setCallState(CallState.READY);
    });

    call.on("error", (err) => {
      console.error("Call error:", err);
      setError(err.message);
      setActiveCall(null);
      setCallState(CallState.ERROR);
    });
  }, []);

  /**
   * Initialize Twilio Device with token from backend
   */
  const initializeDevice = useCallback(async () => {
    try {
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
      });

      device.on("error", (err) => {
        console.error("Device error:", err.code, err.message);
        setError(err.message);
        setCallState(CallState.ERROR);
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
    }
  }, [setupCallHandlers]);

  /**
   * Connect a call to a phone number
   * @param {string} phoneNumber - The phone number to call (E.164 format recommended)
   * @param {Object} customParams - Additional parameters to pass to the call
   */
  const connectCall = useCallback(
    async (phoneNumber, customParams = {}) => {
      if (!deviceRef.current || !isDeviceReady) {
        setError("Device not ready");
        return;
      }

      try {
        setError(null);
        setCallState(CallState.CONNECTING);

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
      }
    },
    [isDeviceReady, setupCallHandlers],
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
      setCallState(CallState.READY);
    }
  }, [activeCall, callState]);

  /**
   * Cleanup device on unmount
   */
  useEffect(() => {
    return () => {
      if (deviceRef.current) {
        deviceRef.current.unregister();
        deviceRef.current.destroy();
      }
    };
  }, []);

  return {
    // State
    callState,
    activeCall,
    error,
    callFrom,
    isDeviceReady,

    // Actions
    initializeDevice,
    connectCall,
    disconnectCall,
    acceptCall,
    rejectCall,
  };
}
