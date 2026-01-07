/**
 * Payment Button Generator Handler
 */
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type {
  PaymentButtonConfig,
  GeneratedCode,
  PaymentButtonToolArgs,
} from "../types/index.js";
import { validatePaymentConfig } from "../utils/validators.js";
import { generateReactComponent } from "../templates/react-component.js";
import { generateHtmlComponent } from "../templates/html-component.js";

export class PaymentButtonHandler {
  /**
   * List available tools
   */
  async listTools(): Promise<Tool[]> {
    return [
      {
        name: "generate_payment_button",
        description:
          "Generate a cryptocurrency payment button component code that can be integrated into your frontend project. Supports ETH, USDT, and USDC on Ethereum mainnet. The generated component handles wallet connection and payment processing.",
        inputSchema: {
          type: "object",
          properties: {
            recipientAddress: {
              type: "string",
              description:
                "The Ethereum wallet address that will receive the payment (must be a valid 0x address)",
            },
            amount: {
              type: "number",
              description:
                "The payment amount in the specified currency (e.g., 0.1 for 0.1 ETH)",
            },
            currency: {
              type: "string",
              enum: ["ETH", "USDT", "USDC"],
              description: "The cryptocurrency to accept (ETH, USDT, or USDC)",
            },
            framework: {
              type: "string",
              enum: ["react", "html"],
              description:
                "The frontend framework for the generated component (react or html). Default: react",
              default: "react",
            },
            buttonText: {
              type: "string",
              description:
                "Custom text to display on the payment button. Default: 'Pay with Crypto'",
              default: "Pay with Crypto",
            },
            buttonStyle: {
              type: "object",
              description: "Optional custom styling for the button",
              properties: {
                backgroundColor: {
                  type: "string",
                  description: "Button background color (hex code)",
                },
                textColor: {
                  type: "string",
                  description: "Button text color (hex code)",
                },
                borderRadius: {
                  type: "string",
                  description: "Button border radius (e.g., '8px')",
                },
                padding: {
                  type: "string",
                  description: "Button padding (e.g., '12px 24px')",
                },
                fontSize: {
                  type: "string",
                  description: "Button font size (e.g., '16px')",
                },
              },
            },
          },
          required: ["recipientAddress", "amount", "currency"],
        },
      },
    ];
  }

  /**
   * Handle tool execution
   */
  async handleTool(
    name: string,
    args: PaymentButtonToolArgs
  ): Promise<{
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
  }> {
    try {
      if (name !== "generate_payment_button") {
        return {
          content: [
            {
              type: "text",
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
      }

      // Validate input
      const validation = validatePaymentConfig(args);
      if (!validation.valid) {
        return {
          content: [
            {
              type: "text",
              text: `Validation error: ${validation.error}`,
            },
          ],
          isError: true,
        };
      }

      // Prepare config with defaults
      const config: PaymentButtonConfig = {
        recipientAddress: args.recipientAddress,
        amount: args.amount,
        currency: args.currency,
        framework: args.framework || "react",
        buttonText: args.buttonText,
        buttonStyle: args.buttonStyle,
      };

      // Generate code based on framework
      let generatedCode: GeneratedCode;
      if (config.framework === "html") {
        generatedCode = generateHtmlComponent(config);
      } else {
        generatedCode = generateReactComponent(config);
      }

      // Format response
      const response = this.formatResponse(generatedCode, config);

      return {
        content: [
          {
            type: "text",
            text: response,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error generating payment button: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * Format the response with code and instructions
   */
  private formatResponse(
    generatedCode: GeneratedCode,
    config: PaymentButtonConfig
  ): string {
    const parts: string[] = [];

    parts.push("# Payment Button Component Generated\n");
    parts.push(`**Framework:** ${config.framework}\n`);
    parts.push(`**Currency:** ${config.currency}\n`);
    parts.push(`**Amount:** ${config.amount} ${config.currency}\n`);
    parts.push(`**Recipient:** ${config.recipientAddress}\n`);

    parts.push("\n## Generated Code\n");
    parts.push(`\`\`\`${config.framework === "html" ? "html" : "tsx"}\n`);
    parts.push(generatedCode.code);
    parts.push("\n```\n");

    if (generatedCode.dependencies && generatedCode.dependencies.length > 0) {
      parts.push("\n## Dependencies\n");
      parts.push(
        `Install the required dependencies:\n\`\`\`bash\nnpm install ${generatedCode.dependencies.join(" ")}\n\`\`\`\n`
      );
    }

    parts.push("\n## Instructions\n");
    parts.push(generatedCode.instructions);

    parts.push("\n## Usage Notes\n");
    parts.push(
      "- The component automatically handles wallet connection (MetaMask, etc.)\n"
    );
    parts.push(
      "- Users need to have an Ethereum wallet browser extension installed\n"
    );
    parts.push(
      "- All transactions are processed on Ethereum Mainnet\n"
    );
    if (config.currency !== "ETH") {
      parts.push(
        `- For ${config.currency} payments, the component uses the standard ERC-20 transfer function\n`
      );
    }
    parts.push(
      "- The component includes error handling and transaction status feedback\n"
    );

    return parts.join("");
  }
}
