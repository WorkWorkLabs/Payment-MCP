#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { PaymentButtonHandler } from "./handlers/payment-button.js";

/**
 * Payment Button Generator MCP Server
 *
 * A Model Context Protocol server that provides tools for generating
 * cryptocurrency payment button components that can be integrated into
 * frontend projects. Supports ETH, USDT, and USDC on Ethereum mainnet.
 */

async function main() {
  const server = new Server(
    {
      name: "payment-button-generator-mcp",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);

  const paymentButtonHandler = new PaymentButtonHandler();

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: await paymentButtonHandler.listTools(),
    };
  });

  // Handle tool calls
  server.setRequestHandler(
    CallToolRequestSchema,
    async (request: { params: { name: string; arguments?: any } }) => {
      return await paymentButtonHandler.handleTool(
        request.params.name,
        request.params.arguments || {}
      );
    }
  );

  console.error("Payment Button Generator MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
