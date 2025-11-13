# 🎯 Identity Vault - 5-Minute Hackathon Demo Script

## Pre-Demo Checklist

- [ ] Two MetaMask accounts set up (User & Issuer)
- [ ] Both accounts funded with Mumbai MATIC
- [ ] Contract deployed and address in frontend/.env
- [ ] Frontend running on localhost:3000
- [ ] Mock document ready (PDF or JPG)
- [ ] Browser window prepared (F11 fullscreen recommended)

---

## Demo Flow (5 Minutes Total)

### **Act 1: Introduction & Connect (30 seconds)**

**Script:**
> "Hi! I'm presenting **Identity Vault** - a decentralized, self-sovereign identity system where users fully control their credentials. Unlike traditional systems where companies store your data, here everything is encrypted client-side, stored on IPFS, with only hashes on-chain for verification."

**Actions:**
1. Show landing page
2. Point to the three feature cards (Encryption, IPFS, Blockchain)
3. Click "Connect MetaMask Wallet"
4. Approve MetaMask connection
5. **Point out the DID in header**: "See, my decentralized identifier is generated from my Ethereum address"

**Key Message:** User-controlled, client-side security

---

### **Act 2: Upload & Encrypt Document (1 minute)**

**Script:**
> "Let me upload an identity document. Watch how the encryption happens entirely in the browser."

**Actions:**
1. Click "+ Upload Document"
2. Select file (e.g., passport-mock.pdf)
3. Choose document type: "Passport"
4. Click "Encrypt & Upload"
5. **While it's processing, explain:**
   - "The file is encrypted with AES-256-GCM right here in my browser"
   - "The encryption key is wrapped with my MetaMask key, so only I can decrypt it"
   - "The encrypted file gets uploaded to IPFS - no plaintext ever leaves my computer"
6. **Show the result:**
   - Document card appears with CID
   - Status: "Uploaded"
   - "This CID is the IPFS address of my *encrypted* file"

**Key Message:** Client-side encryption, decentralized storage

---

### **Act 3: Register On-Chain (1 minute)**

**Script:**
> "Now I'll register this credential on the blockchain. Only the *hash* of the CID goes on-chain, not the document itself."

**Actions:**
1. Click "Register On-Chain" on the document card
2. MetaMask pops up - **show gas estimate**
3. Click "Confirm"
4. **While waiting for confirmation:**
   - "The smart contract stores the CID hash, my address, and a timestamp"
   - "This creates an immutable, verifiable record"
5. **Once confirmed:**
   - Status changes to "Registered"
   - Transaction hash appears - click it to show on Mumbai Polygonscan
   - **Point out on block explorer**: "See, no personal data - just a hash"

**Key Message:** On-chain verification without exposing data

---

### **Act 4: Issue Verifiable Credential (1 minute)**

**Script:**
> "Now let's demonstrate the issuer flow. In a real scenario, this would be a trusted authority like a government or university."

**Actions:**
1. Click "Show Issuer Panel"
2. **Switch to Issuer account in MetaMask** (Account 2)
3. In Issuer Panel:
   - Copy User's DID from header (when you switch back to User account briefly)
   - Paste into "Subject DID"
   - Copy CID from document card
   - Paste into "Document CID"
4. Click "Sign & Issue VC"
5. MetaMask signature request appears
6. Approve the signature
7. **Explain:** "This creates a signed Verifiable Credential - a JSON-LD document cryptographically linking the issuer to the credential"

**Key Message:** Decentralized trust through cryptographic signatures

---

### **Act 5: Verify Credential (1 minute)**

**Script:**
> "Now anyone can verify this credential independently. Let me act as a verifier - maybe an employer or border control."

**Actions:**
1. Navigate to "Verify" page
2. Paste the CID
3. Click "Verify"
4. **Show the results:**
   - ✅ Valid status
   - Owner address matches User
   - Issuer DID displayed
   - Issuance timestamp
   - Link to transaction
5. **Explain:** "The verifier queries the blockchain directly - no middleman, no API keys, fully decentralized"

**Key Message:** Independent, trustless verification

---

### **Act 6: Audit Logs & Transparency (30 seconds)**

**Script:**
> "For compliance, every action is logged."

**Actions:**
1. Navigate to "Audit Logs" page
2. **Show the log entries:**
   - Upload action with timestamp
   - Register action with transaction hash
   - Issue VC action
3. **Explain:** "Users can prove consent and track access for GDPR compliance"

**Key Message:** Transparency and auditability

---

### **Act 7: Revocation Demo (1 minute)**

**Script:**
> "Finally, if a credential needs to be revoked - say it's lost or stolen - the issuer or owner can revoke it on-chain."

**Actions:**
1. Go back to Dashboard
2. Click "Revoke" on the document card
3. Confirm in the confirmation dialog
4. MetaMask transaction pops up - approve
5. **Wait for confirmation**
6. Status changes to "Revoked"
7. Navigate back to "Verify" page
8. Paste the same CID again
9. Click "Verify"
10. **Show the result:** "❌ Invalid / Revoked"

**Key Message:** Revocation is instant and verifiable

---

## Closing Statement (30 seconds)

**Script:**
> "So to recap: Identity Vault gives users full control over their identity documents through client-side encryption, decentralized storage on IPFS, and blockchain-based verification. It's self-sovereign - no central authority can access or censor your data. The tech stack is React, MetaMask, IPFS via Web3.Storage, and a Solidity smart contract on Polygon Mumbai. This is an MVP demo, but the path to production includes ZK-SNARKs for selective disclosure, multi-sig recovery, and mobile apps. Thank you!"

---

## Backup Talking Points (If Asked)

### **Security**
- "All encryption uses AES-256-GCM, the same standard used by banks and governments"
- "Keys never leave the browser - even we can't decrypt user data"
- "Attack surface: XSS could compromise keys, so production needs strict CSP headers and hardware security modules"

### **ZK-SNARKs / Selective Disclosure**
- "Right now, selective disclosure is mocked - you share everything or nothing"
- "Production would use zero-knowledge proofs like Polygon ID to prove 'age > 18' without revealing your birthdate"
- "Circom and SnarkJS are the libraries we'd integrate"

### **IPFS Availability**
- "We're using Web3.Storage for hackathon convenience, but production should pin to multiple nodes"
- "Pinata, Infura, and running your own IPFS node ensure redundancy"

### **Smart Contract Security**
- "This contract hasn't been audited - it's testnet only"
- "Production needs formal verification, OpenZeppelin's audit process, and bug bounties"

### **Scalability**
- "Polygon Mumbai handles this well with low gas costs (~$0.01 per transaction)"
- "For high volume, we could batch operations or use Layer 2 rollups like Optimism"

### **Compliance**
- "GDPR: users can delete data from IPFS (if they control the pin), but hashes remain on-chain"
- "Right to be forgotten is complex in blockchain - we'd need legal frameworks around pseudonymous hashes"

---

## Common Demo Failures & Fixes

### MetaMask doesn't pop up
- **Fix:** Refresh page, reconnect wallet

### Transaction stuck
- **Fix:** Speed up in MetaMask or cancel & retry

### IPFS upload fails
- **Fix:** Check Web3.Storage token in .env, check network connection

### Wrong network error
- **Fix:** App should auto-prompt to switch; if not, manually switch to Mumbai in MetaMask

---

## Post-Demo Q&A Prep

**Q: How do you recover if you lose your MetaMask keys?**
> A: Currently you can't - it's a known limitation. Production would implement social recovery (trusted friends) or Shamir secret sharing to split keys.

**Q: Can't someone just delete data from IPFS?**
> A: Yes, but only if they control the pin. With distributed pinning, multiple nodes hold copies. The on-chain hash proves *something* existed at that CID, even if it's later unpinned.

**Q: What stops fake issuers?**
> A: In production, we'd have a registry of trusted issuer DIDs, maintained by a decentralized DAO or federated trust network. For MVP, it's open - anyone can issue.

**Q: How much does this cost per user?**
> A: Mumbai is free (testnet). On Polygon mainnet, each registration costs ~$0.01-0.02. IPFS via Web3.Storage is currently free for reasonable usage.

**Q: Is this GDPR compliant?**
> A: Partially. Users control their data (good), but blockchain hashes are immutable (complex). Legal interpretation is evolving - we'd work with compliance experts for production.

---

## Time Management

- **If ahead of time:** Show issuer panel in more detail, or demonstrate selective disclosure mockup
- **If behind time:** Skip audit logs, go straight from verify to revoke
- **Critical path:** Upload → Register → Verify (minimum viable demo)

---

Good luck with your demo! 🚀
