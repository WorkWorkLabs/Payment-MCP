/**
 * Contract addresses for Ethereum Mainnet
 */
import type { ContractConfig } from "../types/index.js";

export const CONTRACTS: Record<string, ContractConfig> = {
  USDT: {
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
    symbol: "USDT",
  },
  USDC: {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    symbol: "USDC",
  },
};

export const ETHEREUM_MAINNET_CHAIN_ID = 1;

export const ETHEREUM_MAINNET_RPC_URL = "https://eth.llamarpc.com";
