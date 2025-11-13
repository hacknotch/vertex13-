import { ethers } from 'ethers';

/**
 * Create a Verifiable Credential (simplified JSON-LD structure)
 * @param {object} params
 * @returns {object} VC object
 */
export function createVC({
  issuerDid,
  subjectDid,
  cid,
  cidHash,
  credentialType = 'IdentityDocument',
  additionalClaims = {}
}) {
  const vc = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://w3id.org/security/suites/secp256k1-2019/v1'
    ],
    type: ['VerifiableCredential', credentialType],
    issuer: issuerDid,
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      id: subjectDid,
      cid,
      cidHash,
      ...additionalClaims
    },
    proof: null // Will be filled by signVC
  };
  
  return vc;
}

/**
 * Sign a Verifiable Credential with MetaMask
 * @param {object} vc - Unsigned VC
 * @param {object} provider - Ethers provider
 * @param {string} signerAddress - Address of signer
 * @returns {Promise<object>} Signed VC
 */
export async function signVC(vc, provider, signerAddress) {
  try {
    // Create a deterministic string representation for signing
    const vcString = JSON.stringify({
      '@context': vc['@context'],
      type: vc.type,
      issuer: vc.issuer,
      issuanceDate: vc.issuanceDate,
      credentialSubject: vc.credentialSubject
    });
    
    // Hash the VC content
    const messageHash = ethers.keccak256(ethers.toUtf8Bytes(vcString));
    
    // Sign with MetaMask (EIP-191 personal_sign)
    const signer = await provider.getSigner();
    const signature = await signer.signMessage(ethers.getBytes(messageHash));
    
    // Add proof to VC
    const signedVC = {
      ...vc,
      proof: {
        type: 'EcdsaSecp256k1Signature2019',
        created: new Date().toISOString(),
        proofPurpose: 'assertionMethod',
        verificationMethod: `${vc.issuer}#controller`,
        signature,
        messageHash
      }
    };
    
    return signedVC;
  } catch (error) {
    console.error('Failed to sign VC:', error);
    throw error;
  }
}

/**
 * Verify a Verifiable Credential signature
 * @param {object} vc - Signed VC
 * @returns {Promise<{valid: boolean, recoveredAddress: string}>}
 */
export async function verifyVC(vc) {
  try {
    if (!vc.proof || !vc.proof.signature) {
      return { valid: false, error: 'No proof found' };
    }
    
    // Reconstruct the signed message
    const vcString = JSON.stringify({
      '@context': vc['@context'],
      type: vc.type,
      issuer: vc.issuer,
      issuanceDate: vc.issuanceDate,
      credentialSubject: vc.credentialSubject
    });
    
    const messageHash = ethers.keccak256(ethers.toUtf8Bytes(vcString));
    
    // Check if computed hash matches stored hash
    if (messageHash !== vc.proof.messageHash) {
      return { valid: false, error: 'Message hash mismatch' };
    }
    
    // Recover signer address from signature
    const recoveredAddress = ethers.verifyMessage(
      ethers.getBytes(messageHash),
      vc.proof.signature
    );
    
    // Extract expected address from issuer DID
    const issuerAddress = vc.issuer.split(':').pop().toLowerCase();
    
    const valid = recoveredAddress.toLowerCase() === issuerAddress;
    
    return {
      valid,
      recoveredAddress,
      expectedAddress: issuerAddress
    };
  } catch (error) {
    console.error('Failed to verify VC:', error);
    return { valid: false, error: error.message };
  }
}

/**
 * Create a selective disclosure proof (mock for demo)
 * @param {object} vc
 * @param {string} disclosure - What to disclose (e.g., "age_over_18")
 * @param {object} provider
 * @param {string} signerAddress
 * @returns {Promise<object>}
 */
export async function createSelectiveDisclosureProof(vc, disclosure, provider, signerAddress) {
  // Mock implementation for hackathon demo
  // In production, this would use zero-knowledge proofs
  
  const proof = {
    type: 'SelectiveDisclosureProof',
    created: new Date().toISOString(),
    disclosure,
    originalVCHash: ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(vc))),
    claim: null
  };
  
  // Example: age over 18 proof
  if (disclosure === 'age_over_18') {
    proof.claim = {
      type: 'AgeVerification',
      ageOver: 18,
      verified: true
    };
  }
  
  // Sign the proof
  const proofString = JSON.stringify({
    type: proof.type,
    disclosure: proof.disclosure,
    originalVCHash: proof.originalVCHash,
    claim: proof.claim
  });
  
  const signer = await provider.getSigner();
  const signature = await signer.signMessage(proofString);
  
  proof.signature = signature;
  
  return proof;
}

/**
 * Verify selective disclosure proof
 * @param {object} proof
 * @param {object} originalVC
 * @returns {boolean}
 */
export function verifySelectiveDisclosureProof(proof, originalVC) {
  try {
    // Check if original VC hash matches
    const vcHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(originalVC)));
    
    if (vcHash !== proof.originalVCHash) {
      return false;
    }
    
    // In production, verify ZKP here
    // For demo, we just check signature presence
    return !!proof.signature;
  } catch {
    return false;
  }
}
