import { Phone, PhoneOff } from "lucide-react";
import { Button } from "./ui/button";
import { useTwilio, CallState } from "../lib/twilioContext";

/**
 * Optimized CallButton Component
 * Uses shared Twilio Device context - no per-button device initialization
 * Perfect for tables with many rows
 */
export function CallButton({
  phoneNumber,
  size = "sm",
  variant = "ghost",
  className = "",
}) {
  const { callState, callTo, isDeviceReady, connectCall, disconnectCall } =
    useTwilio();

  // Check if this button's number is the active call
  const isThisCallActive =
    callTo === phoneNumber &&
    (callState === CallState.CONNECTING || callState === CallState.ON_CALL);

  /**
   * Handle button click
   */
  const handleClick = (e) => {
    e.stopPropagation(); // Prevent row click if in table

    if (isThisCallActive) {
      disconnectCall();
    } else if (callState === CallState.READY) {
      connectCall(phoneNumber);
    }
  };

  /**
   * Determine if button should be disabled
   */
  const isDisabled =
    !isDeviceReady || (callState !== CallState.READY && !isThisCallActive);

  /**
   * Get button variant
   */
  const getButtonVariant = () => {
    if (isThisCallActive) {
      return "destructive";
    }
    return variant;
  };

  /**
   * Get button icon
   */
  const getIcon = () => {
    if (isThisCallActive) {
      return <PhoneOff className="h-4 w-4" />;
    }
    return <Phone className="h-4 w-4" />;
  };

  /**
   * Get tooltip/title text
   */
  const getTitle = () => {
    if (!isDeviceReady) return "Device not ready";
    if (isThisCallActive) return "Hang up";
    if (callState !== CallState.READY) return "Another call in progress";
    return `Call ${phoneNumber}`;
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isDisabled}
      variant={getButtonVariant()}
      size={size}
      className={className}
      title={getTitle()}
    >
      {getIcon()}
    </Button>
  );
}
