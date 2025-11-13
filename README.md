# Decentralized Identity Vault - Hackathon MVP

**Self-sovereign, user-controlled credential ownership powered by IPFS, Ethereum, and client-side encryption.**

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.x
- MetaMask browser extension
- Polygon Mumbai testnet MATIC (get from [Mumbai Faucet](https://faucet.polygon.technology/))
- Web3.Storage API token (get from [https://web3.storage](https://web3.storage))

###Installation

```bash
# Clone/navigate to project
cd identity-vault

# Install frontend dependencies
cd frontend
npm install

# Install contract dependencies
cd ../contract
npm install

# Optional: Install backend dependencies (if using)
cd ../backend
npm install
```

### Configuration

#### 1. Frontend Environment Variables

Create `frontend/.env`:

```env
VITE_WEB3_STORAGE_TOKEN=your_web3_storage_api_token_here
VITE_CONTRACT_ADDRESS=0x...  # After deployment
VITE_RPC_URL=https://rpc-mumbai.maticvigil.com
VITE_CHAIN_ID=80001
VITE_NETWORK_NAME=Polygon Mumbai
```

#### 2. Contract Environment Variables

Create `contract/.env`:

```env
PRIVATE_KEY=your_deployer_private_key_here  # TEST WALLET ONLY
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
POLYGONSCAN_API_KEY=your_polygonscan_api_key_for_verification  # Optional
```

---

## 📦 Deployment

### 1. Deploy Smart Contract

```bash
cd contract
npx hardhat compile
npx hardhat run scripts/deploy.js --network mumbai
```

**Copy the deployed contract address** and update `frontend/.env` with `VITE_CONTRACT_ADDRESS`.

### 2. Verify Contract (Optional)

```bash
npx hardhat verify --network mumbai <CONTRACT_ADDRESS>
```

---

## 🏃 Running Locally

### Frontend

```bash
cd frontend
npm run dev
```

Frontend will be available at `http://localhost:3000`

### Backend (Optional - only if needed for pinning relay)

```bash
cd backend
npm start
```

---

## 🧪 Running Tests

### Frontend Tests (Encryption & Utils)

```bash
cd frontend
npm test
```

### Smart Contract Tests

```bash
cd contract
npx hardhat test
```

---

## 🎯 Demo Script (5-Minute Hackathon Demo)

### **Preparation**
1. Have two MetaMask accounts ready: User (Account 1) and Issuer (Account 2)
2. Both accounts funded with Mumbai MATIC
3. Frontend running on localhost
4. Contract deployed and address configured

### **Demo Flow**

#### **1. Connect Wallet & Show Landing** (30 seconds)
- Open app in browser
- Show landing page explaining features
- Click "Connect MetaMask Wallet"
- Approve connection → redirected to Dashboard
- **Point out**: DID displayed in header (did:ethr:0x...)

#### **2. Upload & Encrypt Document** (1 minute)
- Click "+ Upload Document" button
- Select a PDF or JPG file (e.g., mock passport)
- Choose document type: "Passport"
- Click "Encrypt & Upload"
- **Explain while loading**:
  - File encrypted client-side with AES-256-GCM
  - AES key wrapped with MetaMask encryption key
  - Encrypted blob uploaded to IPFS
- **Show result**: CID displayed, document card appears

#### **3. Register Credential On-Chain** (1 minute)
- On the document card, click "Register On-Chain"
- MetaMask pops up → approve transaction
- Wait for confirmation
- **Show**: Transaction hash link, status changes to "Registered"
- **Explain**: Only CID hash stored on-chain, not the document itself

#### **4. Issue Verifiable Credential** (1 minute)
- Click "Show Issuer Panel"
- Switch to Issuer account in MetaMask (Account 2)
- In Issuer Panel:
  - Enter User's DID (copy from header when switched back)
  - Enter CID from document card
  - Click "Sign & Issue VC"
- MetaMask signature request → approve
- **Explain**: VC is a signed JSON-LD credential linking issuer to document

#### **5. Verify Credential** (1 minute)
- Navigate to "Verify" page
- Paste the CID
- Click "Verify"
- **Show results**:
  - ✅ Valid status
  - Issuer DID
  - Owner address
  - Issuance timestamp
  - Transaction hash link
- **Explain**: Verifier can independently check on-chain and signature

#### **6. Show Audit Logs** (30 seconds)
- Navigate to "Audit Logs" page
- **Show**: All actions logged with timestamps, CIDs, tx hashes
- **Explain**: Consent and audit trail for compliance

#### **7. Selective Disclosure (Optional Bonus)** (30 seconds)
- Back on Dashboard, click "Share" on a document
- Check "Share minimal info (age > 18)"
- Click "Generate Proof"
- **Explain**: In production, this would be a ZK-SNARK proof revealing only necessary info

#### **8. Revoke Credential** (30 seconds)
- Click "Revoke" on document card
- Confirm in modal
- MetaMask transaction → approve
- Go back to Verify page, paste same CID
- **Show**: Status now "Revoked ❌"

### **Key Points to Emphasize**
- **Security**: All encryption client-side, no plaintext ever sent
- **Decentralization**: IPFS for storage, blockchain for registry
- **Self-Sovereign**: User controls keys, credentials, sharing
- **Transparency**: Audit logs, on-chain verification
- **Privacy**: Selective disclosure (ZKP in production)

---

## 🏗️ Architecture

```
┌──────────────┐
│   Frontend   │  React + Vite + Tailwind
│  (Browser)   │  - MetaMask integration (ethers.js)
└───────┬──────┘  - Client-side encryption (Web Crypto API)
        │         - IPFS upload (Web3.Storage)
        │
        ├─────────────────────────────────┐
        │                                 │
        ▼                                 ▼
┌───────────────┐                 ┌──────────────┐
│     IPFS      │                 │  Blockchain  │
│ (Web3.Storage)│                 │(Polygon Mumbai)│
│               │                 │              │
│ Encrypted     │                 │ Credentials  │
│ Files (CID)   │                 │ Registry     │
└───────────────┘                 │ (Solidity)   │
                                  └──────────────┘
                                         │
                                         │ verify
                                         ▼
                                  ┌──────────────┐
                                  │   Verifier   │
                                  └──────────────┘
```

### **Data Flow**

1. **Upload**:
   - User selects file
   - Browser: AES-256-GCM encrypt → Generate CID hash
   - Upload encrypted blob to IPFS → Get CID
   - Store metadata locally (docId, CID, wrapped key, IV)

2. **Register**:
   - Compute `cidHash = keccak256(CID)`
   - Call `CredentialsRegistry.issue(cidHash, owner, issuerDid)`
   - Transaction mined → status updated

3. **Issue VC**:
   - Issuer creates VC JSON with CID, subject DID
   - Sign with MetaMask (EIP-191)
   - Store VC locally in subject's app

4. **Verify**:
   - Verifier inputs CID or VC
   - Query `CredentialsRegistry.isValid(cidHash)`
   - Verify VC signature → Show result

5. **Revoke**:
   - Call `CredentialsRegistry.revoke(cidHash)`
   - Status updated on-chain

---

## 🔒 Security Notes

### **Implemented Mitigations**
- ✅ Client-side encryption (AES-256-GCM, 256-bit key)
- ✅ Key wrapping with MetaMask's eth_getEncryptionPublicKey (x25519-xsalsa20-poly1305)
- ✅ No plaintext data sent to server/IPFS
- ✅ Smart contract access control (only issuer/owner can revoke)
- ✅ Signature verification (EIP-191 for VCs)
- ✅ HTTPS required for backend (if used)

### **Attack Surface & Limitations (MVP)**
- ⚠️ **Browser security**: Encryption in browser; XSS could compromise keys
- ⚠️ **Key management**: Relies on MetaMask; no backup/recovery mechanism implemented
- ⚠️ **IPFS availability**: Depends on Web3.Storage uptime; no multi-pin redundancy in MVP
- ⚠️ **Smart contract**: Not audited; use testnet only
- ⚠️ **Selective disclosure**: Mock implementation; real ZKP (zk-SNARKs) needed for production
- ⚠️ **Frontend-only storage**: localStorage can be cleared; need backend DB for production
- ⚠️ **No rate limiting**: Vulnerable to spam uploads
- ⚠️ **Gas costs**: On-chain registration requires MATIC; users must have funds

### **Production Hardening TODO**
- [ ] Smart contract audit
- [ ] Implement zk-SNARKs for selective disclosure (Polygon ID, Circom)
- [ ] Backend database for metadata persistence
- [ ] Multi-IPFS pinning (Pinata, Infura, own node)
- [ ] Key backup/recovery (social recovery, shamir secret sharing)
- [ ] Rate limiting & spam prevention
- [ ] CSP headers & security hardening
- [ ] Mobile app with secure enclave
- [ ] Revocation lists & expiry
- [ ] DID document resolution (did:ethr resolver)

---

## 📁 Project Structure

```
identity-vault/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # UI components
│   │   │   ├── Header.jsx
│   │   │   ├── DocumentCard.jsx
│   │   │   ├── UploadModal.jsx
│   │   │   ├── IssuerPanel.jsx
│   │   │   └── ...
│   │   ├── pages/            # Route pages
│   │   │   ├── Landing.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Verifier.jsx
│   │   │   └── AuditLogs.jsx
│   │   ├── utils/            # Core utilities
│   │   │   ├── encryption.js  # AES-GCM, key wrapping
│   │   │   ├── ipfs.js        # Web3.Storage integration
│   │   │   ├── contract.js    # Ethers.js contract calls
│   │   │   ├── did.js         # DID utilities
│   │   │   ├── vc.js          # Verifiable Credentials
│   │   │   └── storage.js     # localStorage wrapper
│   │   ├── hooks/
│   │   │   └── useWallet.js   # MetaMask connection hook
│   │   ├── __tests__/         # Unit tests
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── contract/                 # Solidity smart contracts
│   ├── contracts/
│   │   └── CredentialsRegistry.sol
│   ├── scripts/
│   │   └── deploy.js
│   ├── test/
│   │   └── CredentialsRegistry.test.js
│   ├── hardhat.config.js
│   └── package.json
│
├── backend/                  # Optional Node.js backend
│   ├── index.js              # Express server
│   ├── routes/
│   │   └── pinning.js        # IPFS pinning relay
│   └── package.json
│
├── README.md                 # This file
└── demo-script.md            # Detailed demo walkthrough
```

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Wallet**: ethers.js v6 + MetaMask
- **Encryption**: Web Crypto API (AES-256-GCM), @metamask/eth-sig-util
- **Storage**: Web3.Storage (IPFS), localStorage
- **Routing**: React Router v6
- **Notifications**: react-hot-toast

### **Smart Contract**
- **Language**: Solidity ^0.8.20
- **Framework**: Hardhat
- **Network**: Polygon Mumbai Testnet
- **Testing**: Hardhat (Mocha/Chai)

### **Backend (Optional)**
- **Runtime**: Node.js + Express
- **Purpose**: IPFS pinning relay (if client can't upload directly)

---

## 📜 Smart Contract API

### **CredentialsRegistry.sol**

```solidity
function issue(
    bytes32 cidHash, 
    address owner, 
    string memory issuerDid
) public returns (bool)
```
- Issues a new credential
- Stores: `{valid: true, owner, issuerDid, timestamp}`
- Emits: `CredentialIssued` event

```solidity
function revoke(bytes32 cidHash) public
```
- Revokes credential (only issuer or owner)
- Sets `valid = false`
- Emits: `CredentialRevoked` event

```solidity
function isValid(bytes32 cidHash) public view returns (
    bool valid, 
    address owner, 
    string memory issuerDid, 
    uint256 issuedAt
)
```
- Query credential status
- Returns all metadata

---

## 🧰 Useful Commands

### **Frontend**
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm test             # Run Jest tests
```

### **Contract**
```bash
npx hardhat compile          # Compile contracts
npx hardhat test             # Run tests
npx hardhat run scripts/deploy.js --network mumbai
npx hardhat verify --network mumbai <ADDRESS>
npx hardhat node             # Local blockchain for testing
```

---

## 🐛 Troubleshooting

### **MetaMask not connecting**
- Ensure MetaMask installed and unlocked
- Check browser console for errors
- Try refreshing page after unlocking MetaMask

### **Wrong network**
- App will prompt to switch to Mumbai
- If fails, manually add Mumbai network in MetaMask

### **IPFS upload fails**
- Check `VITE_WEB3_STORAGE_TOKEN` in `.env`
- Verify token is valid (not expired)
- Try regenerating token at web3.storage

### **Transaction fails**
- Ensure sufficient MATIC balance
- Check gas limit/price
- Verify contract address is correct

### **Encryption errors**
- Update MetaMask to latest version
- Some MetaMask versions don't support `eth_getEncryptionPublicKey`
- Check browser console for detailed error

---

## 👥 Demo Test Accounts

For hackathon judges, you can use these **testnet-only** accounts:

**User Account**:
- Address: (Generate your own for security)
- DID: `did:ethr:0x13881:<address>`

**Issuer Account**:
- Address: (Generate your own)
- DID: `did:ethr:0x13881:<address>`

**Get Mumbai MATIC**: https://faucet.polygon.technology/

---

## 📚 Additional Resources

- [Polygon Mumbai Faucet](https://faucet.polygon.technology/)
- [Web3.Storage Docs](https://web3.storage/docs/)
- [MetaMask Docs](https://docs.metamask.io/)
- [Ethers.js Docs](https://docs.ethers.org/v6/)
- [DID Method Spec: did:ethr](https://github.com/decentralized-identity/ethr-did-resolver/blob/master/doc/did-method-spec.md)
- [W3C Verifiable Credentials](https://www.w3.org/TR/vc-data-model/)
- [Polygon ID (for production ZKP)](https://polygon.technology/polygon-id)

---

## 🎓 What's Next (Post-Hackathon)

1. **Smart Contract Audit** by professional auditors
2. **Implement Real ZKP** for selective disclosure (Circom + SnarkJS)
3. **Backend Database** (PostgreSQL) for metadata persistence
4. **Mobile App** with biometric authentication
5. **Multi-chain Support** (Ethereum mainnet, Arbitrum, Optimism)
6. **DID Resolver** integration for full did:ethr support
7. **Revocation Lists** (on-chain or off-chain)
8. **UI/UX Polish** with professional design
9. **Documentation** for developers & end-users
10. **Compliance** (GDPR, eIDAS compatibility research)

---

## 📄 License

MIT License - Hackathon MVP (Not for production use)

---

## 🙏 Acknowledgments

- Built for [Hackathon Name]
- Powered by Polygon, IPFS, MetaMask, and Web3.Storage
- Inspired by SSI (Self-Sovereign Identity) principles

---

**For questions or issues during demo, contact: [Your Contact]**
