import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useWallet } from './hooks/useWallet';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Verifier from './pages/Verifier';
import AuditLogs from './pages/AuditLogs';
import Header from './components/Header';

function App() {
  const wallet = useWallet();

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        {wallet.isConnected && <Header wallet={wallet} />}
        
        <main className="flex-1">
          <Routes>
            <Route 
              path="/" 
              element={
                wallet.isConnected ? 
                <Navigate to="/dashboard" /> : 
                <Landing wallet={wallet} />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                wallet.isConnected ? 
                <Dashboard wallet={wallet} /> : 
                <Navigate to="/" />
              } 
            />
            <Route 
              path="/verify" 
              element={<Verifier wallet={wallet} />} 
            />
            <Route 
              path="/logs" 
              element={
                wallet.isConnected ? 
                <AuditLogs wallet={wallet} /> : 
                <Navigate to="/" />
              } 
            />
          </Routes>
        </main>
        
        <Toaster 
          position="top-right"
          toastOptions={{
            className: 'bg-dark text-gray-100 border border-gray-700',
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #374151',
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
