import { useEffect } from "react";
import { Phone, PhoneOff, PhoneIncoming } from "lucide-react";
import { Button } from "./ui/button";
import { useTwilioDevice, CallState } from "../hooks/useTwilioDevice";

/**
 * CallButton Component
 * Displays a call button that changes based on call state
 * - Shows Phone icon when ready to call
 * - Shows PhoneOff icon when on a call (to hang up)
 * - Shows PhoneIncoming icon for incoming calls
 */
export function CallButton({ phoneNumber, onCallStateChange }) {
  const {
    callState,
    activeCall,
    error,
    callFrom,
    isDeviceReady,
    initializeDevice,
    connectCall,
    disconnectCall,
    acceptCall,
    rejectCall,
  } = useTwilioDevice();

  // Initialize device on mount
  useEffect(() => {
    initializeDevice();
  }, [initializeDevice]);

  // Notify parent of call state changes
  useEffect(() => {
    if (onCallStateChange) {
      onCallStateChange(callState, activeCall);
    }
  }, [callState, activeCall, onCallStateChange]);

  /**
   * Handle button click based on current state
   */
  const handleClick = () => {
    switch (callState) {
      case CallState.READY:
        if (phoneNumber) {
          connectCall(phoneNumber);
        }
        break;
      case CallState.ON_CALL:
      case CallState.CONNECTING:
        disconnectCall();
        break;
      case CallState.INCOMING:
        acceptCall();
        break;
      default:
        break;
    }
  };

  /**
   * Get button icon based on call state
   */
  const getButtonIcon = () => {
    switch (callState) {
      case CallState.ON_CALL:
      case CallState.CONNECTING:
        return <PhoneOff className="h-5 w-5" />;
      case CallState.INCOMING:
        return <PhoneIncoming className="h-5 w-5 animate-pulse" />;
      case CallState.READY:
      default:
        return <Phone className="h-5 w-5" />;
    }
  };

  /**
   * Get button text based on call state
   */
  const getButtonText = () => {
    switch (callState) {
      case CallState.DISCONNECTED:
        return "Connecting...";
      case CallState.READY:
        return phoneNumber ? "Call" : "Ready";
      case CallState.CONNECTING:
        return "Connecting...";
      case CallState.ON_CALL:
        return "Hang Up";
      case CallState.INCOMING:
        return `Accept (${callFrom})`;
      case CallState.ERROR:
        return "Error";
      default:
        return "Call";
    }
  };

  /**
   * Get button variant based on call state
   */
  const getButtonVariant = () => {
    switch (callState) {
      case CallState.ON_CALL:
      case CallState.CONNECTING:
        return "destructive";
      case CallState.INCOMING:
        return "default";
      case CallState.ERROR:
        return "outline";
      default:
        return "default";
    }
  };

  /**
   * Determine if button should be disabled
   */
  const isButtonDisabled = () => {
    return (
      !isDeviceReady ||
      callState === CallState.DISCONNECTED ||
      callState === CallState.ERROR ||
      (callState === CallState.READY && !phoneNumber)
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleClick}
        disabled={isButtonDisabled()}
        variant={getButtonVariant()}
        size="lg"
        className="gap-2"
      >
        {getButtonIcon()}
        {getButtonText()}
      </Button>

      {/* Show reject button for incoming calls */}
      {callState === CallState.INCOMING && (
        <Button onClick={rejectCall} variant="outline" size="sm">
          Reject
        </Button>
      )}

      {/* Display error if any */}
      {error && <div className="text-sm text-destructive">{error}</div>}

      {/* Display device status */}
      {!isDeviceReady && callState !== CallState.ERROR && (
        <div className="text-sm text-muted-foreground">
          Initializing device...
        </div>
      )}
    </div>
  );
}
