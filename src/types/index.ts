/**
 * Type definitions for Payment Button Generator MCP
 */

export type Currency = "ETH" | "USDT" | "USDC";

export type Framework = "react" | "html" | "vue";

export interface PaymentButtonConfig {
  recipientAddress: string;
  amount: number;
  currency: Currency;
  framework?: Framework;
  buttonText?: string;
  buttonStyle?: ButtonStyle;
}

export interface ButtonStyle {
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  padding?: string;
  fontSize?: string;
}

export interface GeneratedCode {
  code: string;
  filename: string;
  dependencies?: string[];
  instructions: string;
}

export interface PaymentButtonToolArgs {
  recipientAddress: string;
  amount: number;
  currency: Currency;
  framework?: Framework;
  buttonText?: string;
  buttonStyle?: ButtonStyle;
}

export interface ContractConfig {
  address: string;
  decimals: number;
  symbol: string;
}
