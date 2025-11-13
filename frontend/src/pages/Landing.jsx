export default function Landing({ wallet }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-darker via-dark to-darker">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Decentralized Identity Vault
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              User-controlled, self-sovereign credential ownership powered by IPFS & Blockchain
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="card">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Client-Side Encryption</h3>
              <p className="text-gray-400">
                AES-256-GCM encryption happens in your browser. Your data never leaves unencrypted.
              </p>
            </div>
            
            <div className="card">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold mb-2">IPFS Storage</h3>
              <p className="text-gray-400">
                Encrypted documents stored on decentralized IPFS network with redundancy.
              </p>
            </div>
            
            <div className="card">
              <div className="text-4xl mb-4">⛓️</div>
              <h3 className="text-xl font-semibold mb-2">Blockchain Registry</h3>
              <p className="text-gray-400">
                Only content hashes stored on-chain for verification and provenance tracking.
              </p>
            </div>
          </div>
          
          {wallet.error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-900 rounded-lg text-red-200">
              {wallet.error}
            </div>
          )}
          
          <button 
            onClick={wallet.connect}
            disabled={wallet.isConnecting}
            className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {wallet.isConnecting ? 'Connecting...' : 'Connect MetaMask Wallet'}
          </button>
          
          <p className="text-sm text-gray-400 mt-4">
            Hackathon MVP - Not for production use
          </p>
        </div>
      </div>
    </div>
  );
}
