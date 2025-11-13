import { ethers } from 'ethers';

// Contract ABI - minimal interface for CredentialsRegistry
const CONTRACT_ABI = [
  "function issue(bytes32 cidHash, address owner, string memory issuerDid) public returns (bool)",
  "function revoke(bytes32 cidHash) public",
  "function isValid(bytes32 cidHash) public view returns (bool valid, address owner, string memory issuerDid, uint256 issuedAt)",
  "event CredentialIssued(bytes32 indexed cidHash, address indexed owner, string issuerDid, uint256 timestamp)",
  "event CredentialRevoked(bytes32 indexed cidHash, uint256 timestamp)"
];

/**
 * Get contract instance
 * @param {object} provider - Ethers provider
 * @returns {ethers.Contract}
 */
export function getContract(provider) {
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  
  if (!contractAddress || contractAddress === '0x...') {
    throw new Error('Contract address not configured. Please deploy contract and set VITE_CONTRACT_ADDRESS');
  }
  
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
}

/**
 * Issue a credential on-chain
 * @param {string} cidHash - Keccak256 hash of CID
 * @param {string} ownerAddress
 * @param {string} issuerDid
 * @param {object} provider
 * @returns {Promise<{txHash: string, receipt: object}>}
 */
export async function issueCredential(cidHash, ownerAddress, issuerDid, provider) {
  try {
    const contract = getContract(provider);
    const tx = await contract.issue(cidHash, ownerAddress, issuerDid);
    
    console.log('Transaction sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt);
    
    return {
      txHash: tx.hash,
      receipt,
    };
  } catch (error) {
    console.error('Failed to issue credential:', error);
    throw error;
  }
}

/**
 * Revoke a credential on-chain
 * @param {string} cidHash
 * @param {object} provider
 * @returns {Promise<{txHash: string, receipt: object}>}
 */
export async function revokeCredential(cidHash, provider) {
  try {
    const contract = getContract(provider);
    const tx = await contract.revoke(cidHash);
    
    console.log('Revoke transaction sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('Revoke confirmed:', receipt);
    
    return {
      txHash: tx.hash,
      receipt,
    };
  } catch (error) {
    console.error('Failed to revoke credential:', error);
    throw error;
  }
}

/**
 * Check if credential is valid on-chain
 * @param {string} cidHash
 * @param {object} provider
 * @returns {Promise<{valid: boolean, owner: string, issuerDid: string, issuedAt: number}>}
 */
export async function checkCredentialValidity(cidHash, provider) {
  try {
    const contract = getContract(provider);
    const [valid, owner, issuerDid, issuedAt] = await contract.isValid(cidHash);
    
    return {
      valid,
      owner,
      issuerDid,
      issuedAt: Number(issuedAt),
    };
  } catch (error) {
    console.error('Failed to check credential validity:', error);
    throw error;
  }
}

/**
 * Get contract address
 * @returns {string}
 */
export function getContractAddress() {
  return import.meta.env.VITE_CONTRACT_ADDRESS || 'Not configured';
}

/**
 * Get block explorer URL for transaction
 * @param {string} txHash
 * @returns {string}
 */
export function getExplorerUrl(txHash) {
  const chainId = import.meta.env.VITE_CHAIN_ID || '80001';
  
  if (chainId === '80001') {
    return `https://mumbai.polygonscan.com/tx/${txHash}`;
  } else if (chainId === '137') {
    return `https://polygonscan.com/tx/${txHash}`;
  } else if (chainId === '1') {
    return `https://etherscan.io/tx/${txHash}`;
  } else if (chainId === '11155111') {
    return `https://sepolia.etherscan.io/tx/${txHash}`;
  }
  
  return `#${txHash}`;
}
