import { ethers } from 'ethers';

/**
 * Upload encrypted file to IPFS via Pinata
 * @param {ArrayBuffer} encryptedData
 * @param {string} fileName
 * @returns {Promise<string>} CID
 */
export async function uploadToIPFS(encryptedData, fileName = 'encrypted-document') {
  try {
    // Convert ArrayBuffer to Blob
    const blob = new Blob([encryptedData], { type: 'application/octet-stream' });
    
    // Pinata JWT token
    const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyMmRhNDI4Yy03ZDg1LTRjODctOTMwMy05MzljMjkyYjk4YjAiLCJlbWFpbCI6Imt1bGthcm5pcHJlZXRhbTBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjFiMmIwNWI3ZjExMjc2YTQ3YmQ1Iiwic2NvcGVkS2V5U2VjcmV0IjoiMDBjNzRkOTNkZjZhZDE4OWU3OWM5ZTkxYjUyOTdhZGU4YzgzOGVhZGViYTFkNGQxMTI3ZGUyZmJmYmZjYTRkZiIsImV4cCI6MTc5NDU2NzM3MH0.BIBabhsc7y6--YM79Nk6OPNWqj_O_THlXq79l8T4Osc';
    
    // Create FormData for Pinata
    const formData = new FormData();
    formData.append('file', blob, fileName);
    
    // Add metadata
    const metadata = JSON.stringify({
      name: fileName,
      keyvalues: {
        type: 'encrypted-identity-document',
        timestamp: new Date().toISOString()
      }
    });
    formData.append('pinataMetadata', metadata);
    
    // Upload to Pinata
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${JWT}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Upload failed: ${error}`);
    }
    
    const data = await response.json();
    return data.IpfsHash; // Pinata returns IpfsHash instead of cid
    
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error(`Failed to upload to IPFS: ${error.message}`);
  }
}

/**
 * Retrieve file from IPFS
 * @param {string} cid
 * @returns {Promise<ArrayBuffer>}
 */
export async function retrieveFromIPFS(cid) {
  try {
    // Use Pinata gateway
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;
    
    const response = await fetch(gatewayUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to retrieve from IPFS: ${response.statusText}`);
    }
    
    return await response.arrayBuffer();
    
  } catch (error) {
    console.error('IPFS retrieval error:', error);
    throw new Error(`Failed to retrieve from IPFS: ${error.message}`);
  }
}

/**
 * Compute keccak256 hash of CID for on-chain storage
 * @param {string} cid
 * @returns {string} Hash as bytes32 hex string
 */
export function cidToHash(cid) {
  return ethers.keccak256(ethers.toUtf8Bytes(cid));
}

/**
 * Pin file to ensure redundancy (optional, for production)
 * @param {string} cid
 */
export async function pinCID(cid) {
  // Pinata automatically pins uploaded files
  console.log(`CID ${cid} is automatically pinned by Pinata`);
  return true;
}
