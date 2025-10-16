# 📈 FinStockHub

A React Native application for real-time stock market tracking with advanced features including WebSocket connectivity, price alerts, and interactive charts.

## 🚀 Features

- **Real-time Stock Data**: Live stock prices via Finnhub WebSocket API
- **Authentication**: Secure login with Auth0 (Google OAuth)
- **Price Alerts**: Set custom price alerts with background notifications
- **Interactive Charts**: Local price history visualization with smooth animations
- **Watchlist Management**: Track your favorite stocks with infinite scroll
- **Background Tasks**: iOS background fetch for price monitoring
- **Cross-platform**: Full support for iOS and Android

## 🛠️ Tech Stack

- **React Native**: 0.81.4 (stable version)
- **TypeScript**: Type-safe development
- **State Management**: Zustand for global state
- **Navigation**: React Navigation v7
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Charts**: React Native Gifted Charts
- **Authentication**: Auth0 with Google OAuth
- **Real-time Data**: Finnhub WebSocket API
- **Background Tasks**: React Native Background Fetch
- **Notifications**: Notifee



## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── AuthButton/      # Authentication button component
│   ├── Button/          # Generic button component
│   ├── Dropdown/        # Dropdown selection component
│   ├── Input/           # Text input component
│   ├── ModalDropdown/   # Modal-based dropdown
│   ├── StockCard/       # Stock display card
│   ├── StockGraphCard/  # Stock chart component (with React.memo optimization)
│   └── UserProfile/     # User profile component
├── screens/             # App screens
│   ├── Home/           # Main stock list screen
│   ├── Login/          # Authentication screen
│   ├── LimitPreference/ # Price alerts management
│   └── StockGraphs/    # Charts visualization screen
├── stores/              # Zustand state management
│   ├── authStore.ts    # Authentication state
│   ├── websocketStore.ts # WebSocket connection state
│   ├── priceHistoryStore.ts # Local price history
│   ├── limitAlertsStore.ts # Price alerts configuration
│   └── stocksStore.ts  # Stock symbols and data
├── services/            # API and external services
│   ├── stock.services.ts # Finnhub REST API
│   └── websocket.service.ts # WebSocket connection management
├── hooks/               # Custom React hooks
│   ├── useStockQuotes.ts # Stock data fetching logic
│   └── withMainLayout.tsx # Layout HOC
├── providers/           # React context providers
│   └── WebSocketProvider/ # WebSocket context
├── config/              # Configuration files
│   └── auth0.ts        # Auth0 setup
├── types/               # TypeScript type definitions
├── layouts/             # Layout components
├── stacks/              # Navigation stacks
└── backgroundService/   # Background task services
    └── backgroundNotifications.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- React Native CLI
- iOS: Xcode and CocoaPods
- Android: Android Studio and JDK

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/flexingCode/FinStockHub
   cd FinStockHub
   ```

2. **Install dependencies**
   
   **Recommended (using pnpm):**
   ```bash
   pnpm install
   ```
   
   **Alternative options:**
   ```bash
   npm install
   # or
   yarn install
   ```
   
   > **Note**: If using npm, you might need the `--legacy-peer-deps` flag

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   FINNHUB_API_KEY=your_finnhub_api_key
   FINNHUB_API_URL=https://finnhub.io/api/v1
   AUTH0_IOS=org.reactjs.native.example.finstockhub://your-auth0-domain.us.auth0.com/ios/org.reactjs.native.example.finstockhub/callback
   AUTH0_ANDROID=com.finstockhub://your-auth0-domain.us.auth0.com/android/com.finstockhub/callback
   ```

### Running the Application

#### iOS

1. **Install iOS dependencies:**
   ```bash
   cd ios && pod install && cd ..
   ```

2. **Run the app:**
   ```bash
   npm run ios
   # or
   pnpm ios
   ```
   
   **Alternative**: Open `ios/FinStockHub.xcworkspace` in Xcode and run

#### Android

1. **Run the app:**
   ```bash
   npm run android
   # or
   pnpm android
   ```
   
   **Alternative**: Open the `android` folder in Android Studio and run

## 🔧 Development

### Available Scripts

- `npm start` - Start Metro bundler
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run lint` - Run ESLint

### Debug Environment Variables

For development and testing, you can use these environment keys:

```env
FINNHUB_API_KEY=d3mpti1r01qmso34v000d3mpti1r01qmso34v00g
FINNHUB_API_URL=https://finnhub.io/api/v1
AUTH0_IOS=org.reactjs.native.example.finstockhub://dev-8crvukra8kuadxc5.us.auth0.com/ios/org.reactjs.native.example.finstockhub/callback
AUTH0_ANDROID=com.finstockhub://dev-8crvukra8kuadxc5.us.auth0.com/android/com.finstockhub/callback
```

## 🔑 API Configuration

### Finnhub API
- **REST API**: Used for initial stock data and symbol information
- **WebSocket API**: Real-time price updates
- **Rate Limits**: 60 calls/minute (free tier)

### Auth0 Configuration
- **Provider**: Google OAuth 2.0
- **Platform Support**: iOS and Android
- **Deep Linking**: Configured for both platforms

## 📊 Key Features Implementation

### Real-time Data
- WebSocket connection to Finnhub for live price updates
- Subscription management with automatic cleanup
- Local price history storage for chart visualization

### Performance Optimizations
- `React.memo` for expensive components (StockGraphCard)
- `useCallback` for list rendering
- Zustand for efficient state management
- Background task optimization

### Authentication Flow
- Secure Auth0 integration
- Deep linking configuration
- Persistent authentication state

## 🏗️ Build & Deployment

### Android APK Generation
```bash
cd android
./gradlew assembleRelease
```
The unsigned APK will be generated at `android/app/build/outputs/apk/release/app-release.apk`

### iOS Build
```bash
cd ios
xcodebuild -workspace FinStockHub.xcworkspace -scheme FinStockHub -configuration Release
```
## Android APK

