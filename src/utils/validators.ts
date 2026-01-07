/**
 * Validation utilities for addresses and parameters
 */
import type { PaymentButtonConfig, Currency } from "../types/index.js";

/**
 * Validate Ethereum address format
 */
export function isValidEthereumAddress(address: string): boolean {
  // Ethereum address should be 42 characters (0x + 40 hex chars)
  if (!address || typeof address !== "string") {
    return false;
  }

  // Check format: 0x followed by 40 hexadecimal characters
  const addressRegex = /^0x[a-fA-F0-9]{40}$/;
  return addressRegex.test(address);
}

/**
 * Validate amount is positive number
 */
export function isValidAmount(amount: number): boolean {
  return typeof amount === "number" && amount > 0 && isFinite(amount);
}

/**
 * Validate currency is supported
 */
export function isValidCurrency(currency: string): currency is Currency {
  return currency === "ETH" || currency === "USDT" || currency === "USDC";
}

/**
 * Validate payment button configuration
 */
export function validatePaymentConfig(
  config: Partial<PaymentButtonConfig>
): { valid: boolean; error?: string } {
  if (!config.recipientAddress) {
    return { valid: false, error: "Recipient address is required" };
  }

  if (!isValidEthereumAddress(config.recipientAddress)) {
    return {
      valid: false,
      error: "Invalid Ethereum address format. Must be 0x followed by 40 hexadecimal characters",
    };
  }

  if (config.amount === undefined || config.amount === null) {
    return { valid: false, error: "Amount is required" };
  }

  if (!isValidAmount(config.amount)) {
    return { valid: false, error: "Amount must be a positive number" };
  }

  if (!config.currency) {
    return { valid: false, error: "Currency is required" };
  }

  if (!isValidCurrency(config.currency)) {
    return {
      valid: false,
      error: "Currency must be one of: ETH, USDT, USDC",
    };
  }

  if (config.framework && !["react", "html", "vue"].includes(config.framework)) {
    return {
      valid: false,
      error: "Framework must be one of: react, html, vue",
    };
  }

  return { valid: true };
}
