# Payment-MCP

A Model Context Protocol (MCP) server that provides onchain tools for AI applications like Claude Code and Cursor, allowing them to easily build components for receiving and making payments using cryptocurrency.

## Features

- **Create Payment Requests**: Generate payment requests with specified amounts and currencies
- **Check Payment Status**: Monitor the status of payment requests
- **Make Payments**: Initiate cryptocurrency payments to specified addresses
- **Wallet Management**: Retrieve wallet addresses for different cryptocurrencies

## Supported Cryptocurrencies


- Ethereum (ETH)
- USD Coin (USDC)
- Tether (USDT)

## Setup

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

### Development

Run in development mode with hot reload:
```bash
npm run dev
```

### Usage

Start the MCP server:
```bash
npm start
```

## Available Tools

### `create_payment_request`
Create a new payment request with a specified amount and currency.

**Parameters:**
- `amount` (number): The amount to request
- `currency` (string): Cryptocurrency symbol (BTC, ETH, USDC, USDT)
- `description` (string, optional): Description of the payment request

### `check_payment_status`
Check the status of a payment request by its ID.

**Parameters:**
- `paymentRequestId` (string): The ID of the payment request

### `make_payment`
Initiate a cryptocurrency payment to a specified address.

**Parameters:**
- `to` (string): Recipient's cryptocurrency address
- `amount` (number): Amount to send
- `currency` (string): Cryptocurrency symbol (BTC, ETH, USDC, USDT)

### `get_wallet_address`
Get the wallet address for a specific cryptocurrency.

**Parameters:**
- `currency` (string): Cryptocurrency symbol (BTC, ETH, USDC, USDT)

## Project Structure

```
Payment-MCP/
├── src/
│   ├── index.ts              # Main server entry point
│   └── handlers/
│       └── payment.ts        # Payment tool handlers
├── dist/                     # Compiled output (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Development Status

⚠️ **Note**: This is an early version. The payment functionality currently returns mock data. Integration with actual blockchain services and payment providers is pending implementation.

## License
GPL-3.0 