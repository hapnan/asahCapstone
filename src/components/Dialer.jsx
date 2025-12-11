import { useState } from "react";
import { Backspace } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { CallButton } from "./CallButton";

/**
 * Dialer Component
 * A clean phone dialer interface with:
 * - Number pad for entering phone numbers
 * - Input field to display the entered number
 * - Call button that uses the useTwilioDevice hook
 * - Backspace to delete digits
 */
export function Dialer() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callState, setCallState] = useState(null);
  const [activeCall, setActiveCall] = useState(null);

  /**
   * Dial pad buttons
   */
  const dialPadButtons = [
    { digit: "1", letters: "" },
    { digit: "2", letters: "ABC" },
    { digit: "3", letters: "DEF" },
    { digit: "4", letters: "GHI" },
    { digit: "5", letters: "JKL" },
    { digit: "6", letters: "MNO" },
    { digit: "7", letters: "PQRS" },
    { digit: "8", letters: "TUV" },
    { digit: "9", letters: "WXYZ" },
    { digit: "*", letters: "" },
    { digit: "0", letters: "+" },
    { digit: "#", letters: "" },
  ];

  /**
   * Handle digit press
   */
  const handleDigitPress = (digit) => {
    setPhoneNumber((prev) => prev + digit);
  };

  /**
   * Handle backspace
   */
  const handleBackspace = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  /**
   * Handle manual input change
   */
  const handleInputChange = (e) => {
    // Only allow digits, +, *, and #
    const value = e.target.value.replace(/[^\d+*#]/g, "");
    setPhoneNumber(value);
  };

  /**
   * Handle call state changes from CallButton
   */
  const handleCallStateChange = (state, call) => {
    setCallState(state);
    setActiveCall(call);
  };

  /**
   * Format phone number for display
   */
  const formatPhoneNumber = (number) => {
    // Basic US phone number formatting
    if (number.length === 10) {
      return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
    }
    if (number.length === 11 && number.startsWith("1")) {
      return `+1 (${number.slice(1, 4)}) ${number.slice(4, 7)}-${number.slice(7)}`;
    }
    return number;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Phone Dialer</CardTitle>
        <CardDescription>Enter a phone number and press call</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Phone Number Display */}
        <div className="relative">
          <Input
            type="tel"
            value={phoneNumber}
            onChange={handleInputChange}
            placeholder="Enter phone number"
            className="text-2xl text-center font-mono h-14 pr-12"
            disabled={callState === "OnCall" || callState === "Connecting"}
          />
          {phoneNumber && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={handleBackspace}
              disabled={callState === "OnCall" || callState === "Connecting"}
            >
              <Backspace className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Formatted Number Display */}
        {phoneNumber && (
          <div className="text-center text-sm text-muted-foreground">
            {formatPhoneNumber(phoneNumber)}
          </div>
        )}

        {/* Dial Pad */}
        <div className="grid grid-cols-3 gap-2">
          {dialPadButtons.map((button) => (
            <Button
              key={button.digit}
              variant="outline"
              size="lg"
              className="h-16 flex flex-col items-center justify-center"
              onClick={() => handleDigitPress(button.digit)}
              disabled={callState === "OnCall" || callState === "Connecting"}
            >
              <span className="text-2xl font-semibold">{button.digit}</span>
              {button.letters && (
                <span className="text-xs text-muted-foreground">
                  {button.letters}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Call Button */}
        <div className="pt-4">
          <CallButton
            phoneNumber={phoneNumber}
            onCallStateChange={handleCallStateChange}
          />
        </div>

        {/* Call Info Display */}
        {activeCall && (
          <div className="pt-2 text-center space-y-1">
            <div className="text-sm font-medium">Call Status: {callState}</div>
            {activeCall.parameters?.CallSid && (
              <div className="text-xs text-muted-foreground">
                Call SID: {activeCall.parameters.CallSid.slice(0, 10)}...
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
