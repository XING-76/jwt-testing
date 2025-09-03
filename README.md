# JWT Cross-Site Testing Tool

A Vue 3-based JWT cross-site testing tool for generating JWT tokens using RS256 algorithm and building cross-site redirect URLs, facilitating JWT-related security testing and validation.

## 🚀 Features

- **JWT Token Generation**: Generate JWT tokens using RS256 algorithm (RSA asymmetric encryption)
- **Cross-Site Redirect**: Automatically build redirect URLs containing JWT
- **RSA Key Management**: Support for RSA private/public key pairs
- **Form Validation**: Complete input validation and error handling
- **Modal Popup**: Beautiful URL display modal with copy functionality
- **Responsive Design**: Support for desktop and mobile devices
- **Modern UI**: Beautiful interface built with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **JWT Library**: jose (for RSA operations and JWT handling)
- **Styling Framework**: Tailwind CSS
- **Development Language**: JavaScript
- **Testing Framework**: Vitest + Vue Test Utils
- **Runtime Environment**: Node.js 20+
- **Cryptography**: RSA-256 (RS256) asymmetric encryption

## 📦 Installation & Setup

### Prerequisites

- Node.js 20+
- npm or yarn
- RSA private/public key pair for JWT signing

### Environment Variables Setup

Create a `.env` file in the project root with your RSA keys:

```bash
# RSA Private Key (PKCS8 format)
VITE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
-----END PRIVATE KEY-----"

# RSA Public Key (SPKI format)
VITE_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
-----END PUBLIC KEY-----"
```

**Note**: Make sure your RSA keys are in the correct format:

- Private key should be in PKCS8 format
- Public key should be in SPKI format

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

2. **Configure RSA Keys**

   - Set up RSA private key in `VITE_PRIVATE_KEY` environment variable
   - Set up RSA public key in `VITE_PUBLIC_KEY` environment variable
   - Keys should be in PKCS8 (private) and SPKI (public) formats

3. **Enter User ID**

   - Set the sub field in JWT payload

4. **Generate and Redirect**
   - Click "Generate JWT and Redirect" button
   - System generates JWT token using RS256 algorithm and RSA private key
   - Modal pops up showing the generated URL
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

**Algorithm**: RS256 (RSA Signature with SHA-256)

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
│   │   ├── jwt.js                          # JWT utility functions (RS256)
│   │   ├── keys.js                         # RSA key management
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
├── .env                                    # Environment variables (RSA keys)
└── README.md                               # Project documentation
```

## 🔧 Component Overview

### App.vue

Main application component including:

- Form input and validation
- JWT generation logic using RS256 algorithm
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

- JWT token generation with RS256 algorithm using RSA private keys
- JWT token verification and decryption using RSA public keys
- Redirect URL building and JWT token extraction
- Time control with nbf (not before) and exp (expiration) fields
- Comprehensive error handling and validation

### RSA Key Management (utils/keys.js)

RSA key management utilities including:

- Private and public key import from environment variables
- Key format validation (PKCS8 for private, SPKI for public)
- Secure key handling for JWT operations

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
- JWT generation and verification flow testing using RS256
- URL building and JWT extraction functionality
- Error handling and edge case testing
- RSA key import and validation testing

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
- Do not use test RSA keys in production environments
- JWT tokens expire after 180 seconds (3 minutes)
- Tokens include nbf (not before) time for additional security
- Uses RS256 algorithm with RSA asymmetric encryption for enhanced security
- Private keys should be kept secure and never exposed in client-side code
- Recommended to use in secure testing environments

## 📋 Deployment Requirements

- **Environment Variables**: Must configure `VITE_PRIVATE_KEY` and `VITE_PUBLIC_KEY`
- **RSA Key Format**: Private key in PKCS8 format, public key in SPKI format
- **Vercel Deployment**: Supports Node.js 20+ (will discontinue Node.js 18 support after September 2025)
- **Other Platforms**: Recommended to use Node.js 20+ for best compatibility

## 🤝 Contributing

Welcome to submit Issues and Pull Requests to improve this project.
