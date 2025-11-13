import { useState } from 'react';
import toast from 'react-hot-toast';
import { issueCredential, revokeCredential, getExplorerUrl } from '../utils/contract';
import { saveDocument, addAuditLog } from '../utils/storage';

export default function DocumentCard({ document, wallet, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const { txHash } = await issueCredential(document.cidHash, wallet.account, wallet.did, wallet.provider);
      
      saveDocument({ ...document, txHash, status: 'registered' });
      addAuditLog({ action: 'REGISTER', docId: document.docId, cid: document.cid, txHash, details: 'Registered on-chain' });
      
      toast.success('Registered on-chain!');
      onUpdate();
    } catch (error) {
      toast.error(`Registration failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!confirm('Are you sure you want to revoke this credential?')) return;
    
    setLoading(true);
    try {
      const { txHash } = await revokeCredential(document.cidHash, wallet.provider);
      
      saveDocument({ ...document, status: 'revoked' });
      addAuditLog({ action: 'REVOKE', docId: document.docId, cid: document.cid, txHash, details: 'Revoked credential' });
      
      toast.success('Credential revoked');
      onUpdate();
    } catch (error) {
      toast.error(`Revoke failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (document.status === 'revoked') return <span className="badge-danger">Revoked</span>;
    if (document.status === 'registered') return <span className="badge-success">Registered</span>;
    return <span className="badge-info">Uploaded</span>;
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">{document.name}</h3>
          <p className="text-sm text-gray-400">{document.docType}</p>
        </div>
        {getStatusBadge()}
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div><span className="text-gray-400">CID:</span> <code className="text-xs">{document.cid.slice(0, 12)}...</code></div>
        <div><span className="text-gray-400">Uploaded:</span> {new Date(document.uploadedAt).toLocaleString()}</div>
        {document.txHash && <a href={getExplorerUrl(document.txHash)} target="_blank" rel="noopener" className="text-primary hover:underline">View Transaction ↗</a>}
      </div>

      <div className="flex gap-2">
        {document.status === 'uploaded' && (
          <button onClick={handleRegister} className="btn-primary text-sm flex-1" disabled={loading}>
            {loading ? 'Registering...' : 'Register On-Chain'}
          </button>
        )}
        {document.status === 'registered' && (
          <button onClick={handleRevoke} className="btn-danger text-sm flex-1" disabled={loading}>
            {loading ? 'Revoking...' : 'Revoke'}
          </button>
        )}
      </div>
    </div>
  );
}
