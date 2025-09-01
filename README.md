# JWT Cross-Site Testing Tool

A Vue 3-based JWT cross-site testing tool for generating JWT tokens and building cross-site redirect URLs, facilitating JWT-related security testing and validation.

## 🚀 Features

- **JWT Token Generation**: Generate JWT tokens using HS256 algorithm
- **Cross-Site Redirect**: Automatically build redirect URLs containing JWT
- **Form Validation**: Complete input validation and error handling
- **Modal Popup**: Beautiful URL display modal with copy functionality
- **Responsive Design**: Support for desktop and mobile devices
- **Modern UI**: Beautiful interface built with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **JWT Library**: jose
- **Styling Framework**: Tailwind CSS
- **Development Language**: JavaScript
- **Testing Framework**: Vitest + Vue Test Utils
- **Runtime Environment**: Node.js 20+

## 📦 Installation & Setup

### Prerequisites

- Node.js 20+
- npm or yarn

### Install Dependencies

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Production Version

```bash
npm run preview
```

### Run Tests

```bash
# Run all tests
npm run test:run

# Watch mode
npm run test

# Test UI
npm run test:ui
```

## 🎯 Usage Guide

### Basic Usage Flow

1. **Enter Target Website URL**

   - Input the target website address to redirect to
   - Supports http/https protocols

2. **Set JWT Secret Key**

   - Enter the secret key for signing JWT
   - Supports plain text keys and base64url format
   - Automatic key format detection and processing
   - Supports show/hide toggle for the key
   - Compatible with jwt.io verification

3. **Enter User ID**

   - Set the sub field in JWT payload

4. **Generate and Redirect**
   - Click "Generate JWT and Redirect" button
   - System generates JWT token and builds redirect URL
   - Modal pops up showing the generated URL
   - Console shows key format information (base64url or plain text)
   - Automatically redirects to target website after 2 seconds

### JWT Token Structure

Generated JWT token contains:

```json
{
  "sub": "User input ID",
  "iat": "Issued at time",
  "nbf": "Not before time (5 seconds before issued time)",
  "exp": "Expiration time (180 seconds after issued time)"
}
```

### Redirect URL Format

```
{Target Website URL}#jwt={Generated JWT Token}
```

## 📁 Project Structure

```
jwt-testing/
├── src/
│   ├── components/
│   │   ├── UrlModal.vue                    # URL display modal component
│   │   └── __tests__/
│   │       └── UrlModal.test.js            # Modal component tests
│   ├── utils/
│   │   ├── jwt.js                          # JWT utility functions
│   │   └── __tests__/
│   │       └── jwt.test.js                 # JWT utility function tests
│   ├── App.vue                             # Main application component
│   ├── main.js                             # Application entry point
│   ├── style.css                           # Global styles
│   └── test-setup.js                       # Test environment setup
├── public/                                 # Static assets
├── package.json                            # Project configuration
├── vite.config.js                          # Vite configuration
├── tailwind.config.js                      # Tailwind CSS configuration
└── README.md                               # Project documentation
```

## 🔧 Component Overview

### App.vue

Main application component including:

- Form input and validation
- JWT generation logic
- Error handling
- Auto-redirect functionality

### UrlModal.vue

URL display modal component including:

- Responsive modal design
- URL copy functionality
- Background overlay close
- Beautiful UI design

### JWT Utility Functions (utils/jwt.js)

JWT-related utility functions including:

- JWT token generation with automatic key format detection
- Support for both plain text and base64url format keys
- JWT token verification and decryption
- Redirect URL building and JWT token extraction
- Time control with nbf (not before) and exp (expiration) fields
- Comprehensive error handling and validation

## 🎨 Design

- Built with Tailwind CSS for styling
- Responsive layout supporting various screen sizes
- Modern UI design style
- Excellent user experience and interaction design

## 🧪 Test Coverage

Project includes comprehensive test suite:

### JWT Utility Function Tests

- JWT token format validation and structure verification
- JWT payload parsing and sub field verification
- Base64 encoding/decoding and padding handling
- URL building and JWT extraction functionality
- Error handling and edge case testing
- Key format detection and processing validation

### Component Tests

- Modal component show/hide logic and visibility control
- User interaction event handling (click, copy, close)
- URL copy functionality with clipboard API integration
- Error handling and fallback behavior testing
- Component props validation and event emission

### Test Commands

```bash
npm run test:run    # Run all tests
npm run test        # Watch mode
npm run test:ui     # Test UI interface
```

## 🔒 Security Considerations

- This tool is for testing and development purposes only
- Do not use test keys in production environments
- JWT tokens expire after 180 seconds (3 minutes)
- Tokens include nbf (not before) time for additional security
- Recommended to use in secure testing environments

## 📋 Deployment Requirements

- **Vercel Deployment**: Supports Node.js 20+ (will discontinue Node.js 18 support after September 2025)
- **Other Platforms**: Recommended to use Node.js 20+ for best compatibility

## 🤝 Contributing

Welcome to submit Issues and Pull Requests to improve this project.
