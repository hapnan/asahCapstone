# ASAH Capstone Project

A modern React application built with Vite featuring customer management, task tracking, and predictive analytics dashboard.

## 🚀 Features

- **Dashboard Analytics**: Interactive data visualization with charts and tables
- **Customer Management**: View and manage customer data with predictive insights
- **Task Management**: Track and organize tasks efficiently
- **History Tracking**: Monitor historical data and trends
- **Authentication**: Secure login and registration with WebAuthn support
- **Responsive Design**: Modern UI with dark/light theme support
- **Drag & Drop**: Interactive data tables with sorting and reordering capabilities

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2
- **Build Tool**: Vite
- **Routing**: TanStack Router with protected routes
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS 4.1
- **Data Tables**: TanStack Table with drag-and-drop support (@dnd-kit)
- **Charts**: Recharts for data visualization
- **Forms**: TanStack Form with Zod validation
- **Authentication**: SimpleWebAuthn
- **Theme**: next-themes for dark/light mode
- **Icons**: Tabler Icons & Lucide React

## 📁 Project Structure

```
src/
├── app/              # Application pages
│   ├── dashboard/    # Dashboard with analytics
│   ├── history/      # Historical data view
│   ├── login/        # Authentication
│   ├── register/     # User registration
│   └── task/         # Task management
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components (buttons, cards, etc.)
│   └── data-table/  # Data table components
├── hooks/           # Custom React hooks
├── layouts/         # Layout components
├── lib/             # Utilities and contexts
│   ├── api.js       # API client
│   ├── authContext.jsx
│   └── themeContext.jsx
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

## 🎨 UI Components

Built with Radix UI and styled with Tailwind CSS, the application includes:

- Data tables with sorting, filtering, and drag-and-drop
- Interactive charts and visualizations
- Modal dialogs and dropdowns
- Tabs and navigation components
- Theme toggle (dark/light mode)
- Responsive sidebar navigation

## 📊 API Integration

The app communicates with a backend API for:

- Customer data management
- Predictive analytics
- Authentication
- Task tracking

API configuration is managed through `src/lib/api.js` with automatic credential handling.

## 🚀 Deployment

This project is configured for deployment on Vercel (see `vercel.json`).

To deploy:

```bash
npm run build
```

The build output will be in the `dist` directory.

## 📝 License

This project is part of a capstone project.

## 👥 Contributing

This is a capstone project. For any questions or suggestions, please open an issue.
