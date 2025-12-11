/**
 * OPTIMIZED TWILIO INTEGRATION - USAGE GUIDE
 *
 * This implementation solves the connection limit issue by using a single
 * shared Twilio Device instance across your entire application.
 */

// ============================================================================
// STEP 1: Wrap your app with TwilioProvider (in main.jsx or App.jsx)
// ============================================================================

import { TwilioProvider } from "./lib/twilioContext";
import { CallStatusWidget } from "./components/CallStatusWidget";

function App() {
  return (
    <TwilioProvider>
      {/* Your app content */}
      <YourRoutes />

      {/* Place this once - it handles incoming calls and shows call status */}
      <CallStatusWidget />
    </TwilioProvider>
  );
}

// ============================================================================
// STEP 2: Use CallButtonCompact in your table cells
// ============================================================================

import { CallButtonCompact } from "./components/CallButtonCompact";

// In your table column definition:
const columns = [
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span>{row.original.phone}</span>
        <CallButtonCompact phoneNumber={row.original.phone} />
      </div>
    ),
  },
  // ... other columns
];

// ============================================================================
// ALTERNATIVE: Use in a custom table cell component
// ============================================================================

function CustomerTableCell({ customer }) {
  return (
    <div className="flex items-center justify-between p-2">
      <div>
        <p className="font-medium">{customer.name}</p>
        <p className="text-sm text-muted-foreground">{customer.phone}</p>
      </div>
      <CallButtonCompact
        phoneNumber={customer.phone}
        size="sm"
        variant="ghost"
      />
    </div>
  );
}

// ============================================================================
// BENEFITS OF THIS APPROACH:
// ============================================================================

/**
 * 1. SINGLE DEVICE INSTANCE
 *    - Only ONE Twilio Device is created for the entire app
 *    - No connection limit issues, even with 100+ call buttons
 *
 * 2. AUTOMATIC STATE MANAGEMENT
 *    - All buttons automatically disable when a call is active
 *    - Only the active call's button shows "hang up"
 *
 * 3. CENTRALIZED CALL HANDLING
 *    - CallStatusWidget shows incoming calls anywhere in the app
 *    - Shows active call status with hang up button
 *
 * 4. MINIMAL RE-RENDERS
 *    - Buttons only re-render when call state changes
 *    - No unnecessary API calls or device initializations
 *
 * 5. EASY TO USE
 *    - Just add <CallButtonCompact phoneNumber={phone} /> anywhere
 *    - No need to manage device lifecycle in each component
 */

// ============================================================================
// MIGRATION FROM OLD IMPLEMENTATION:
// ============================================================================

// BEFORE (caused connection errors):
// import { CallButton } from "./components/CallButton";
// <CallButton phoneNumber="+1234567890" /> // Each created its own device!

// AFTER (optimized):
// 1. Wrap app with <TwilioProvider>
// 2. Add <CallStatusWidget /> once in your layout
// 3. Use <CallButtonCompact phoneNumber="+1234567890" /> in table cells

// ============================================================================
// ADVANCED: Access Twilio state anywhere in your app
// ============================================================================

import { useTwilio, CallState } from "./lib/twilioContext";

function MyCustomComponent() {
  const { callState, callTo, isDeviceReady, connectCall } = useTwilio();

  return (
    <div>
      <p>Device Ready: {isDeviceReady ? "Yes" : "No"}</p>
      <p>Call State: {callState}</p>
      {callTo && <p>Calling: {callTo}</p>}

      <button onClick={() => connectCall("+1234567890")}>
        Custom Call Button
      </button>
    </div>
  );
}

export default App;
