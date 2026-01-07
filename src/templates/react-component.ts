/**
 * React component template generator
 */
import type { PaymentButtonConfig, GeneratedCode } from "../types/index.js";
import { CONTRACTS } from "../utils/contract-addresses.js";

/**
 * Generate React component code for payment button
 */
export function generateReactComponent(
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

  const componentCode = `import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface PaymentButtonProps {
  onPaymentSuccess?: (txHash: string) => void;
  onPaymentError?: (error: Error) => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0].address);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts.length > 0 ? accounts[0] : null);
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setErrorMessage('Please install MetaMask or another Ethereum wallet');
      setStatus('error');
      return;
    }

    setIsConnecting(true);
    setErrorMessage('');

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
    } catch (error) {
      const err = error as Error;
      setErrorMessage(err.message || 'Failed to connect wallet');
      setStatus('error');
      if (onPaymentError) {
        onPaymentError(err);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handlePayment = async () => {
    if (!account) {
      await connectWallet();
      return;
    }

    if (!window.ethereum) {
      setErrorMessage('Please install MetaMask or another Ethereum wallet');
      setStatus('error');
      return;
    }

    setIsProcessing(true);
    setStatus('pending');
    setErrorMessage('');

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      ${isToken ? generateTokenTransferCode(recipientAddress, contract!.address, formattedAmount) : generateEthTransferCode(recipientAddress, formattedAmount)}

      setStatus('success');
      if (onPaymentSuccess) {
        onPaymentSuccess(tx.hash);
      }
    } catch (error) {
      const err = error as Error;
      setErrorMessage(err.message || 'Payment failed');
      setStatus('error');
      if (onPaymentError) {
        onPaymentError(err);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const buttonStyles: React.CSSProperties = {
    backgroundColor: '${defaultStyle.backgroundColor}',
    color: '${defaultStyle.textColor}',
    borderRadius: '${defaultStyle.borderRadius}',
    padding: '${defaultStyle.padding}',
    fontSize: '${defaultStyle.fontSize}',
    border: 'none',
    cursor: isProcessing || isConnecting ? 'not-allowed' : 'pointer',
    fontWeight: '600',
    transition: 'opacity 0.2s',
    opacity: isProcessing || isConnecting ? 0.7 : 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  };

  const getButtonText = () => {
    if (isConnecting) return 'Connecting...';
    if (isProcessing) return 'Processing...';
    if (status === 'pending') return 'Confirming...';
    if (status === 'success') return 'Payment Successful!';
    if (!account) return 'Connect Wallet';
    return '${buttonText}';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
      <button
        onClick={handlePayment}
        disabled={isProcessing || isConnecting}
        style={buttonStyles}
      >
        {getButtonText()}
      </button>
      
      {account && (
        <div style={{ fontSize: '12px', color: '#666' }}>
          Connected: {account.slice(0, 6)}...{account.slice(-4)}
        </div>
      )}

      {status === 'error' && errorMessage && (
        <div style={{ color: '#EF4444', fontSize: '14px', textAlign: 'center' }}>
          {errorMessage}
        </div>
      )}

      {status === 'success' && (
        <div style={{ color: '#10B981', fontSize: '14px', textAlign: 'center' }}>
          Payment successful! Check your wallet for transaction details.
        </div>
      )}

      <div style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
        Amount: ${amount} ${currency}
      </div>
    </div>
  );
};

export default PaymentButton;
`;

  return {
    code: componentCode,
    filename: "PaymentButton.tsx",
    dependencies: ["react", "ethers"],
    instructions: `1. Install dependencies: npm install react ethers
2. Import and use the component in your app:
   import PaymentButton from './PaymentButton';
   
   <PaymentButton 
     onPaymentSuccess={(txHash) => console.log('Payment successful:', txHash)}
     onPaymentError={(error) => console.error('Payment error:', error)}
   />
3. Make sure your users have MetaMask or another Ethereum wallet installed
4. The component will handle wallet connection and payment processing automatically`,
  };
}

function generateEthTransferCode(recipientAddress: string, amount: string): string {
  return `const tx = await signer.sendTransaction({
        to: '${recipientAddress}',
        value: ethers.parseEther('${amount}'),
      });
      await tx.wait();`;
}

function generateTokenTransferCode(recipientAddress: string, contractAddress: string, amount: string): string {
  return `// ERC-20 Token Transfer
      const tokenAbi = [
        'function transfer(address to, uint256 amount) external returns (bool)',
      ];
      const tokenContract = new ethers.Contract('${contractAddress}', tokenAbi, signer);
      const tx = await tokenContract.transfer('${recipientAddress}', '${amount}');
      await tx.wait();`;
}
