/**
 * HTML/JS component template generator
 */
import type { PaymentButtonConfig, GeneratedCode } from "../types/index.js";
import { CONTRACTS } from "../utils/contract-addresses.js";

/**
 * Generate standalone HTML file with payment button
 */
export function generateHtmlComponent(
  config: PaymentButtonConfig
): GeneratedCode {
  const {
    recipientAddress,
    amount,
    currency,
    buttonText = "Pay with Crypto",
    buttonStyle = {},
  } = config;

  const isToken = currency !== "ETH";
  const contract = isToken ? CONTRACTS[currency] : null;

  // Format amount based on currency decimals
  const formattedAmount = isToken
    ? (amount * Math.pow(10, contract!.decimals)).toString()
    : amount.toString();

  const defaultStyle = {
    backgroundColor: buttonStyle.backgroundColor || "#4F46E5",
    textColor: buttonStyle.textColor || "#FFFFFF",
    borderRadius: buttonStyle.borderRadius || "8px",
    padding: buttonStyle.padding || "12px 24px",
    fontSize: buttonStyle.fontSize || "16px",
  };

  const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cryptocurrency Payment</title>
  <script src="https://cdn.ethers.io/lib/ethers-6.9.0.umd.min.js"></script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background-color: #f5f5f5;
    }
    .payment-container {
      background: white;
      padding: 32px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
      min-width: 300px;
    }
    .payment-button {
      background-color: ${defaultStyle.backgroundColor};
      color: ${defaultStyle.textColor};
      border: none;
      border-radius: ${defaultStyle.borderRadius};
      padding: ${defaultStyle.padding};
      font-size: ${defaultStyle.fontSize};
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s;
      width: 100%;
      margin-top: 16px;
    }
    .payment-button:hover:not(:disabled) {
      opacity: 0.9;
    }
    .payment-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .status-message {
      margin-top: 16px;
      padding: 12px;
      border-radius: 8px;
      font-size: 14px;
    }
    .status-success {
      background-color: #D1FAE5;
      color: #065F46;
    }
    .status-error {
      background-color: #FEE2E2;
      color: #991B1B;
    }
    .status-info {
      background-color: #DBEAFE;
      color: #1E40AF;
    }
    .account-info {
      font-size: 12px;
      color: #666;
      margin-top: 8px;
    }
    .amount-info {
      font-size: 14px;
      color: #666;
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <div class="payment-container">
    <h2>Cryptocurrency Payment</h2>
    <div class="amount-info">Amount: ${amount} ${currency}</div>
    <button id="paymentButton" class="payment-button">${buttonText}</button>
    <div id="statusMessage"></div>
    <div id="accountInfo" class="account-info"></div>
  </div>

  <script>
    const recipientAddress = '${recipientAddress}';
    const amount = ${amount};
    const currency = '${currency}';
    ${isToken ? `const contractAddress = '${contract!.address}';` : ''}
    ${isToken ? `const tokenAmount = '${formattedAmount}';` : ''}
    ${isToken ? `const tokenDecimals = ${contract!.decimals};` : ''}

    let provider = null;
    let signer = null;
    let account = null;

    const paymentButton = document.getElementById('paymentButton');
    const statusMessage = document.getElementById('statusMessage');
    const accountInfo = document.getElementById('accountInfo');

    function updateStatus(message, type) {
      statusMessage.textContent = message;
      statusMessage.className = 'status-message status-' + type;
      statusMessage.style.display = 'block';
    }

    function clearStatus() {
      statusMessage.style.display = 'none';
      statusMessage.textContent = '';
      statusMessage.className = '';
    }

    function updateAccountInfo(address) {
      if (address) {
        accountInfo.textContent = 'Connected: ' + address.slice(0, 6) + '...' + address.slice(-4);
      } else {
        accountInfo.textContent = '';
      }
    }

    async function connectWallet() {
      if (typeof window.ethereum === 'undefined') {
        updateStatus('Please install MetaMask or another Ethereum wallet', 'error');
        return false;
      }

      try {
        provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        signer = await provider.getSigner();
        account = accounts[0];
        updateAccountInfo(account);
        return true;
      } catch (error) {
        updateStatus('Failed to connect wallet: ' + error.message, 'error');
        return false;
      }
    }

    async function checkExistingConnection() {
      if (typeof window.ethereum === 'undefined') {
        return;
      }

      try {
        provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_accounts', []);
        if (accounts.length > 0) {
          signer = await provider.getSigner();
          account = accounts[0];
          updateAccountInfo(account);
          paymentButton.textContent = '${buttonText}';
        }
      } catch (error) {
        console.error('Error checking existing connection:', error);
      }

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          account = accounts[0];
          updateAccountInfo(account);
        } else {
          account = null;
          signer = null;
          updateAccountInfo(null);
          paymentButton.textContent = 'Connect Wallet';
        }
      });
    }

    async function processPayment() {
      if (!account) {
        const connected = await connectWallet();
        if (!connected) return;
      }

      clearStatus();
      paymentButton.disabled = true;
      paymentButton.textContent = 'Processing...';

      try {
        ${isToken ? generateTokenTransferJS(contract!.address, formattedAmount) : generateEthTransferJS(formattedAmount)}

        updateStatus('Payment successful! Transaction hash: ' + tx.hash, 'success');
        paymentButton.textContent = 'Payment Successful!';
      } catch (error) {
        updateStatus('Payment failed: ' + error.message, 'error');
        paymentButton.textContent = account ? '${buttonText}' : 'Connect Wallet';
      } finally {
        paymentButton.disabled = false;
      }
    }

    paymentButton.addEventListener('click', async () => {
      if (!account) {
        await connectWallet();
        if (account) {
          paymentButton.textContent = '${buttonText}';
        }
      } else {
        await processPayment();
      }
    });

    // Check for existing connection on load
    checkExistingConnection();
  </script>
</body>
</html>`;

  return {
    code: htmlCode,
    filename: "payment-button.html",
    dependencies: [],
    instructions: `1. Save this file as payment-button.html
2. Open it in a web browser
3. Make sure you have MetaMask or another Ethereum wallet installed
4. Click the button to connect your wallet and make a payment
5. The file includes ethers.js from CDN, so no additional installation is needed`,
  };
}

function generateEthTransferJS(amount: string): string {
  return `const tx = await signer.sendTransaction({
          to: recipientAddress,
          value: ethers.parseEther(amount.toString()),
        });
        await tx.wait();`;
}

function generateTokenTransferJS(contractAddress: string, amount: string): string {
  return `// ERC-20 Token Transfer
        const tokenAbi = [
          'function transfer(address to, uint256 amount) external returns (bool)',
        ];
        const tokenContract = new ethers.Contract(contractAddress, tokenAbi, signer);
        const tx = await tokenContract.transfer(recipientAddress, tokenAmount);
        await tx.wait();`;
}
