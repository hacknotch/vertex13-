# 🚀 Identity Vault - Quick Start

## ⚡ 3-Step Setup

### 1. Install Dependencies

```bash
# Frontend
cd identity-vault/frontend
npm install

# Contract
cd ../contract
npm install
```

### 2. Configure Environment

**Frontend `.env`:**
```env
VITE_WEB3_STORAGE_TOKEN=your_token_here
VITE_CONTRACT_ADDRESS=0x...
VITE_RPC_URL=https://rpc-mumbai.maticvigil.com
VITE_CHAIN_ID=80001
VITE_NETWORK_NAME=Polygon Mumbai
```

**Contract `.env`:**
```env
PRIVATE_KEY=0x...
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
```

### 3. Deploy & Run

```bash
# Deploy contract
cd contract
npx hardhat compile
npx hardhat run scripts/deploy.js --network mumbai

# Copy contract address to frontend/.env

# Run frontend
cd ../frontend
npm run dev
```

---

## 📝 Remaining Files to Create

**IMPORTANT:** The project foundation is complete, but you need to manually create these component files using the code templates in `SETUP_COMPLETE.md`:

### Frontend Components (in `frontend/src/components/`)
- `UploadModal.jsx` - File upload and encryption modal
- `DocumentCard.jsx` - Document display card with actions
- `IssuerPanel.jsx` - VC issuance interface

### Frontend Pages (in `frontend/src/pages/`)
- `Verifier.jsx` - Credential verification page
- `AuditLogs.jsx` - Audit log display

### Tests
- `frontend/src/__tests__/encryption.test.js` - Encryption unit tests
- `contract/test/CredentialsRegistry.test.js` - Smart contract tests

**All code templates are provided in `SETUP_COMPLETE.md` - copy and paste them into the respective files.**

---

## 📦 What's Already Created

✅ **Frontend Core:**
- Vite + React + Tailwind configuration
- Wallet connection hook (`useWallet.js`)
- All utility files (encryption, IPFS, contract, DID, VC, storage)
- App routing and main structure
- Header component
- Landing and Dashboard pages

✅ **Smart Contract:**
- `CredentialsRegistry.sol` with issue/revoke/isValid functions
- Hardhat configuration
- Deployment script

✅ **Documentation:**
- Comprehensive README
- Detailed demo script
- Setup guide

---

## 🎯 Demo Checklist

Before your hackathon demo:

- [ ] MetaMask installed with 2 accounts
- [ ] Both accounts funded with Mumbai MATIC ([Faucet](https://faucet.polygon.technology/))
- [ ] Web3.Storage account created and token obtained
- [ ] Contract deployed to Mumbai testnet
- [ ] Contract address in frontend/.env
- [ ] Frontend running (`npm run dev`)
- [ ] Mock PDF/JPG document ready
- [ ] Practiced demo flow (see `demo-script.md`)

---

## 🆘 Quick Troubleshooting

**MetaMask not connecting?**
→ Refresh page, unlock MetaMask

**IPFS upload fails?**
→ Check `VITE_WEB3_STORAGE_TOKEN` in `.env`

**Transaction fails?**
→ Ensure Mumbai MATIC balance, check gas

**Encryption error?**
→ Update MetaMask to latest version

---

## 📚 Key Files Reference

| File | Purpose |
|------|---------|
| `README.md` | Full documentation |
| `SETUP_COMPLETE.md` | Component code templates |
| `demo-script.md` | 5-minute demo walkthrough |
| `frontend/src/utils/encryption.js` | AES-256-GCM encryption |
| `frontend/src/utils/contract.js` | Smart contract interaction |
| `contract/contracts/CredentialsRegistry.sol` | On-chain registry |

---

## 🎓 Architecture Recap

```
User Browser
    ↓ (encrypt with AES-256-GCM)
    ↓ (wrap key with MetaMask)
    ↓
  IPFS (encrypted blob) → Returns CID
    ↓
Smart Contract (stores keccak256(CID))
    ↓
Verifier queries contract → Validates credential
```

---

## ✨ Next Steps

1. **Copy component code** from `SETUP_COMPLETE.md` into your project
2. **Install dependencies** (`npm install` in frontend and contract folders)
3. **Get Web3.Storage token** from https://web3.storage
4. **Deploy contract** to Mumbai testnet
5. **Run frontend** and test the flow
6. **Practice demo** using `demo-script.md`

---

**Need help?** Check `README.md` for detailed instructions or `SETUP_COMPLETE.md` for all component code.

**Ready to demo?** Follow `demo-script.md` for the perfect 5-minute presentation.

Good luck! 🚀
