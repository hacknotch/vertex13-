/**
 * Generate did:ethr identifier from Ethereum address
 * @param {string} address - Ethereum address
 * @param {string} chainId - Optional chain ID (default: mainnet)
 * @returns {string} DID string
 */
export function createDID(address, chainId = '1') {
  if (!address) {
    throw new Error('Address is required to create DID');
  }
  
  // Format: did:ethr:chainId:address
  // For mainnet, chainId can be omitted: did:ethr:address
  if (chainId === '1') {
    return `did:ethr:${address.toLowerCase()}`;
  }
  
  return `did:ethr:0x${chainId}:${address.toLowerCase()}`;
}

/**
 * Parse DID to extract address and chain ID
 * @param {string} did
 * @returns {object} {address, chainId}
 */
export function parseDID(did) {
  if (!did || !did.startsWith('did:ethr:')) {
    throw new Error('Invalid DID format');
  }
  
  const parts = did.split(':');
  
  if (parts.length === 3) {
    // Format: did:ethr:address (mainnet)
    return {
      address: parts[2],
      chainId: '1',
    };
  } else if (parts.length === 4) {
    // Format: did:ethr:chainId:address
    return {
      address: parts[3],
      chainId: parts[2],
    };
  }
  
  throw new Error('Invalid DID format');
}

/**
 * Validate DID format
 * @param {string} did
 * @returns {boolean}
 */
export function isValidDID(did) {
  try {
    parseDID(did);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get DID for current chain
 * @param {string} address
 * @returns {string}
 */
export function getCurrentChainDID(address) {
  const chainId = import.meta.env.VITE_CHAIN_ID || '1';
  return createDID(address, chainId);
}
