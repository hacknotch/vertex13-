import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getCurrentChainDID } from '../utils/did';
import { saveUserDID, getUserDID } from '../utils/storage';

export function useWallet() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [did, setDid] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if already connected
    checkConnection();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnect();
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
      const userDid = getCurrentChainDID(accounts[0]);
      setDid(userDid);
      saveUserDID(userDid);
    }
  };

  const handleChainChanged = () => {
    // Reload on chain change
    window.location.reload();
  };

  const checkConnection = async () => {
    if (!window.ethereum) return;
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();
        
        setProvider(provider);
        setAccount(address);
        setChainId(network.chainId.toString());
        
        const userDid = getCurrentChainDID(address);
        setDid(userDid);
        saveUserDID(userDid);
      }
    } catch (err) {
      console.error('Failed to check connection:', err);
    }
  };

  const connect = async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      
      setProvider(provider);
      setAccount(address);
      setChainId(network.chainId.toString());
      
      const userDid = getCurrentChainDID(address);
      setDid(userDid);
      saveUserDID(userDid);
      
      // Check if on correct network
      const expectedChainId = import.meta.env.VITE_CHAIN_ID || '80001';
      if (network.chainId.toString() !== expectedChainId) {
        await switchNetwork(expectedChainId);
      }
      
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setProvider(null);
    setDid(null);
    setChainId(null);
  };

  const switchNetwork = async (targetChainId) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${parseInt(targetChainId).toString(16)}` }],
      });
    } catch (err) {
      // If network not added, add it
      if (err.code === 4902) {
        await addNetwork(targetChainId);
      } else {
        throw err;
      }
    }
  };

  const addNetwork = async (targetChainId) => {
    // Polygon Mumbai config
    if (targetChainId === '80001') {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x13881',
          chainName: 'Polygon Mumbai Testnet',
          nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18
          },
          rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
          blockExplorerUrls: ['https://mumbai.polygonscan.com/']
        }]
      });
    }
  };

  return {
    account,
    provider,
    did,
    chainId,
    isConnecting,
    error,
    connect,
    disconnect,
    isConnected: !!account,
  };
}
