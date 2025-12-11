import { useEffect } from "react";
import { PhoneIncoming, PhoneOff } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useTwilio, CallState } from "../lib/twilioContext";

/**
 * CallStatusWidget - Displays current call status and controls
 * Shows incoming calls and allows accepting/rejecting
 * Should be placed once in your layout (e.g., in a header or sidebar)
 */
export function CallStatusWidget() {
  const {
    callState,
    activeCall,
    error,
    callFrom,
    callTo,
    isDeviceReady,
    isInitializing,
    initializeDevice,
    disconnectCall,
    acceptCall,
    rejectCall,
  } = useTwilio();

  // Initialize device on mount
  useEffect(() => {
    initializeDevice();
  }, [initializeDevice]);

  // Don't show widget if device is not ready and no error
  if (!isDeviceReady && !error && !isInitializing) {
    return null;
  }

  // Show incoming call notification
  if (callState === CallState.INCOMING) {
    return (
      <Card className="fixed bottom-4 right-4 w-80 shadow-lg z-50 border-primary">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <PhoneIncoming className="h-5 w-5 animate-pulse text-primary" />
            <CardTitle className="text-lg">Incoming Call</CardTitle>
          </div>
          <CardDescription>From: {callFrom}</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button onClick={acceptCall} className="flex-1" size="sm">
            Accept
          </Button>
          <Button
            onClick={rejectCall}
            variant="outline"
            className="flex-1"
            size="sm"
          >
            Reject
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show active call status
  if (callState === CallState.ON_CALL || callState === CallState.CONNECTING) {
    return (
      <Card className="fixed bottom-4 right-4 w-80 shadow-lg z-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            {callState === CallState.CONNECTING
              ? "Connecting..."
              : "Call Active"}
          </CardTitle>
          {callTo && <CardDescription>To: {callTo}</CardDescription>}
          {activeCall?.parameters?.CallSid && (
            <CardDescription className="text-xs">
              SID: {activeCall.parameters.CallSid.slice(0, 10)}...
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <Button
            onClick={disconnectCall}
            variant="destructive"
            className="w-full"
            size="sm"
          >
            <PhoneOff className="h-4 w-4 mr-2" />
            Hang Up
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show error if any
  if (error) {
    return (
      <div className="fixed bottom-4 right-4 w-80 shadow-lg z-50">
        <Card className="border-destructive">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-destructive">
              Call Error
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Show initializing status
  if (isInitializing) {
    return (
      <div className="fixed bottom-4 right-4 w-80 shadow-lg z-50">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Initializing phone device...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return null;
}
