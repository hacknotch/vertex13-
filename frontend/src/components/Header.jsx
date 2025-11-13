import { Link, useLocation } from 'react-router-dom';

export default function Header({ wallet }) {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  const shortAddress = wallet.account 
    ? `${wallet.account.slice(0, 6)}...${wallet.account.slice(-4)}`
    : '';
  
  return (
    <header className="bg-dark border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              🔐 Identity Vault
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link 
                to="/dashboard" 
                className={`transition-colors ${isActive('/dashboard') ? 'text-primary' : 'text-gray-300 hover:text-white'}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/verify" 
                className={`transition-colors ${isActive('/verify') ? 'text-primary' : 'text-gray-300 hover:text-white'}`}
              >
                Verify
              </Link>
              <Link 
                to="/logs" 
                className={`transition-colors ${isActive('/logs') ? 'text-primary' : 'text-gray-300 hover:text-white'}`}
              >
                Audit Logs
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-400">Connected Wallet</p>
              <p className="text-sm font-mono">{shortAddress}</p>
            </div>
            
            <div className="text-right">
              <p className="text-xs text-gray-400">DID</p>
              <p className="text-xs font-mono text-primary truncate max-w-[150px]">{wallet.did}</p>
            </div>
            
            <button 
              onClick={wallet.disconnect}
              className="text-sm px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
