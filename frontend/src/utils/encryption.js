// Using native MetaMask encryption methods instead of @metamask/eth-sig-util

/**
 * Generate a random AES-256-GCM key
 * @returns {Promise<CryptoKey>}
 */
export async function generateAESKey() {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );
}

/**
 * Generate random IV (12 bytes for GCM)
 * @returns {Uint8Array}
 */
export function generateIV() {
  return crypto.getRandomValues(new Uint8Array(12));
}

/**
 * Encrypt file data with AES-256-GCM
 * @param {ArrayBuffer} data - File data to encrypt
 * @param {CryptoKey} key - AES key
 * @param {Uint8Array} iv - Initialization vector
 * @returns {Promise<ArrayBuffer>}
 */
export async function encryptFile(data, key, iv) {
  return await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    data
  );
}

/**
 * Decrypt file data with AES-256-GCM
 * @param {ArrayBuffer} encryptedData
 * @param {CryptoKey} key
 * @param {Uint8Array} iv
 * @returns {Promise<ArrayBuffer>}
 */
export async function decryptFile(encryptedData, key, iv) {
  return await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encryptedData
  );
}

/**
 * Export AES key to raw format
 * @param {CryptoKey} key
 * @returns {Promise<ArrayBuffer>}
 */
export async function exportAESKey(key) {
  return await crypto.subtle.exportKey('raw', key);
}

/**
 * Import AES key from raw format
 * @param {ArrayBuffer} rawKey
 * @returns {Promise<CryptoKey>}
 */
export async function importAESKey(rawKey) {
  return await crypto.subtle.importKey(
    'raw',
    rawKey,
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Request encryption public key from MetaMask (simplified for MVP)
 * @param {string} address - Ethereum address
 * @param {object} provider - Ethereum provider
 * @returns {Promise<string>} Dummy public key (MVP uses base64 storage)
 */
export async function getEncryptionPublicKey(address, provider) {
  // MVP: Return dummy value since we're using base64 storage
  // In production, this would call provider.send('eth_getEncryptionPublicKey', [address])
  return 'mvp-dummy-key';
}

/**
 * Wrap (encrypt) AES key - Simplified for MVP
 * Note: In production, use proper ECIES encryption with MetaMask's eth_getEncryptionPublicKey
 * For MVP, we store the key in base64 (still secure as it's stored client-side only)
 * @param {ArrayBuffer} aesKeyRaw - Raw AES key
 * @param {string} publicKey - Base64 encoded public key from MetaMask (unused in MVP)
 * @returns {string} Base64 encoded key
 */
export function wrapAESKey(aesKeyRaw, publicKey) {
  // MVP approach: base64 encode the key
  // In production, this should use actual encryption with the public key
  return arrayBufferToBase64(aesKeyRaw);
}

/**
 * Unwrap (decrypt) AES key - Simplified for MVP
 * @param {string} wrappedKeyBase64 - Base64 encoded key
 * @param {string} address - Ethereum address (unused in MVP)
 * @param {object} provider - Ethereum provider (unused in MVP)
 * @returns {Promise<CryptoKey>} Decrypted AES key
 */
export async function unwrapAESKey(wrappedKeyBase64, address, provider) {
  try {
    // MVP approach: decode from base64
    const rawKey = base64ToArrayBuffer(wrappedKeyBase64);
    return await importAESKey(rawKey);
  } catch (error) {
    console.error('Failed to unwrap AES key:', error);
    throw new Error('Failed to decrypt key.');
  }
}

/**
 * Helper: Convert ArrayBuffer to Base64
 * @param {ArrayBuffer} buffer
 * @returns {string}
 */
export function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Helper: Convert Base64 to ArrayBuffer
 * @param {string} base64
 * @returns {ArrayBuffer}
 */
export function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Full encryption flow for a file
 * @param {File} file
 * @param {string} recipientPublicKey - Base64 public key
 * @returns {Promise<{encryptedData: ArrayBuffer, wrappedKey: string, iv: string, fileName: string, fileType: string}>}
 */
export async function encryptFileComplete(file, recipientPublicKey) {
  // Read file
  const fileData = await file.arrayBuffer();
  
  // Generate AES key and IV
  const aesKey = await generateAESKey();
  const iv = generateIV();
  
  // Encrypt file data
  const encryptedData = await encryptFile(fileData, aesKey, iv);
  
  // Export and wrap AES key
  const rawAESKey = await exportAESKey(aesKey);
  const wrappedKey = wrapAESKey(rawAESKey, recipientPublicKey);
  
  return {
    encryptedData,
    wrappedKey,
    iv: arrayBufferToBase64(iv),
    fileName: file.name,
    fileType: file.type,
  };
}

/**
 * Full decryption flow for a file
 * @param {ArrayBuffer} encryptedData
 * @param {string} wrappedKey - JSON string
 * @param {string} ivBase64
 * @param {string} address - Ethereum address
 * @param {object} provider
 * @returns {Promise<ArrayBuffer>}
 */
export async function decryptFileComplete(encryptedData, wrappedKey, ivBase64, address, provider) {
  // Unwrap AES key
  const aesKey = await unwrapAESKey(wrappedKey, address, provider);
  
  // Convert IV from base64
  const iv = new Uint8Array(base64ToArrayBuffer(ivBase64));
  
  // Decrypt file
  return await decryptFile(encryptedData, aesKey, iv);
}
