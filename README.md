# ASAH Capstone Project

A modern React application built with Vite featuring customer management, task tracking, predictive analytics dashboard, and integrated Twilio voice calling.

## 🚀 Features

- **Dashboard Analytics**: Interactive data visualization with charts and tables
- **Customer Management**: View and manage customer data with predictive insights
- **Twilio Voice Integration**: Click-to-call functionality directly from data tables with optimized single-device architecture
- **Authentication**: Secure login and registration with WebAuthn support
- **Responsive Design**: Modern UI with dark/light theme support

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2
- **Build Tool**: Vite (with Rolldown)
- **Routing**: TanStack Router with protected routes
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS 4.1
- **Data Tables**: TanStack Table with shadcn/ui components
- **Charts**: Recharts for data visualization
- **Forms**: TanStack Form with Zod validation
- **Authentication**: SimpleWebAuthn
- **Voice Calling**: Twilio Voice SDK 2.17
- **Theme**: next-themes for dark/light mode
- **Icons**: Tabler Icons & Lucide React
- **Notifications**: Sonner for toast notifications

## 📁 Project Structure

```
src/
├── app/              # Application pages
│   ├── dashboard/    # Dashboard with analytics and call buttons
│   ├── history/      # Historical data view
│   ├── login/        # Authentication
│   ├── register/     # User registration
│   └── task/         # Task management
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components (buttons, cards, etc.)
│   ├── data-table/  # Data table components with filtering & sorting
│   ├── CallButtonCompact.jsx      # Compact call button for tables
│   ├── CallStatusWidget.jsx       # Active call status widget
│   ├── app-sidebar.jsx            # Application sidebar
│   └── site-header.jsx            # Site header
├── hooks/           # Custom React hooks
├── layouts/         # Layout components
│   └── protected-layout.jsx       # Protected route wrapper
├── lib/             # Utilities and contexts
│   ├── api.js       # API client
│   ├── authContext.jsx            # Authentication context
│   ├── themeContext.jsx           # Theme management
│   ├── twilioContext.jsx          # Twilio Device singleton
│   └── utils.js     # Utility functions
└── routes/          # Route definitions
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/hapnan/asahCapstone.git
cd asahCapstone
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000
# Add Twilio configuration if using voice features
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Authentication

The application uses WebAuthn for secure authentication. Protected routes are automatically guarded and redirect unauthenticated users to the login page.

## 📞 Twilio Voice Integration

The application features an optimized Twilio integration for click-to-call functionality:

### Architecture Highlights

- **Single Device Instance**: Uses a singleton pattern to prevent connection limit errors
- **Shared State**: All call buttons share the same Twilio Device via React Context
- **Automatic Synchronization**: When one call is active, all other buttons automatically disable
- **Call Status Widget**: Fixed widget displays incoming call notifications and active call status
- **Compact Buttons**: Lightweight call buttons designed for data table cells

### Key Components

- **TwilioProvider** (`src/lib/twilioContext.jsx`): Context provider managing the singleton Device
- **CallButtonCompact** (`src/components/CallButtonCompact.jsx`): Compact call button for table rows
- **CallStatusWidget** (`src/components/CallStatusWidget.jsx`): Global call status and notifications

### Usage in Tables

```jsx
import { CallButtonCompact } from "@/components/CallButtonCompact";

// In your table column definition:
{
  id: "actions",
  cell: ({ row }) => (
    <CallButtonCompact phoneNumber={row.original.phone} />
  ),
}
```

### Benefits

- ✅ Works with unlimited rows (no connection limits)
- ✅ One API call per session (vs. one per button)
- ✅ Automatic state management across all buttons
- ✅ Clean, minimal UI for data tables
- ✅ Incoming call handling with notifications

See [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for detailed documentation.

## 🎨 UI Components

Built with Radix UI and styled with Tailwind CSS, the application includes:

- Data tables with sorting, filtering, and pagination
- Interactive charts and visualizations (area charts, bar charts)
- Modal dialogs and dropdowns
- Tabs and navigation components
- Theme toggle (dark/light mode)
- Responsive sidebar navigation with collapsible sections
- Toast notifications for user feedback

## 📊 API Integration

The app communicates with a backend API for:

- Customer data management
- Predictive analytics
- Authentication
- Task tracking
- Twilio token generation (`/voice/token` endpoint)

API configuration is managed through `src/lib/api.js` with automatic credential handling.

### Backend Requirements for Twilio

Your backend should provide a `/voice/token` endpoint that returns:

```json
{
  "token": "your-twilio-jwt-token"
}
```

## 🚀 Deployment

This project is configured for deployment on Vercel (see `vercel.json`).

To deploy:

```bash
npm run build
```

The build output will be in the `dist` directory.

## 🎯 Key Features Summary

### Data Management

- Sortable and filterable data tables
- Column visibility controls
- Real-time data updates
- CSV/JSON data import support

### Voice Communication

- Click-to-call from any table row
- Single shared Twilio Device (optimized)
- Incoming call notifications
- Active call status display

### User Experience

- Dark/light theme switching
- Responsive design (mobile-friendly)
- Toast notifications for feedback
- Loading states and skeletons
- Protected routes with authentication

### Analytics & Visualization

- Interactive area charts
- Predictive analytics dashboard
- Historical trend analysis
- Real-time data visualization

## 📝 License

This project is part of a capstone project.

## 👥 Contributing

This is a capstone project. For any questions or suggestions, please open an issue.

## 📚 Additional Documentation

- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Detailed Twilio integration documentation
- [TWILIO_USAGE_GUIDE.js](TWILIO_USAGE_GUIDE.js) - Complete usage guide and examples
