import { useState } from 'react';
import toast from 'react-hot-toast';
import { checkCredentialValidity, getExplorerUrl } from '../utils/contract';
import { cidToHash } from '../utils/ipfs';

export default function Verifier({ wallet }) {
  const [cid, setCid] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!cid) {
      toast.error('Please enter a CID');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const cidHash = cidToHash(cid);
      const validity = await checkCredentialValidity(cidHash, wallet.provider || window.ethereum);
      setResult(validity);
      toast.success('Verification complete');
    } catch (error) {
      toast.error(`Verification failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darker py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Verify Credential</h1>

        <div className="card mb-6">
          <label className="block text-sm font-medium mb-2">IPFS CID</label>
          <input type="text" placeholder="bafybei..." value={cid} onChange={(e) => setCid(e.target.value)} className="input mb-4" />
          <button onClick={handleVerify} className="btn-primary w-full" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>

        {result && (
          <div className="card">
            <h3 className="text-2xl font-bold mb-4">
              {result.valid ? '✅ Valid Credential' : '❌ Invalid / Revoked'}
            </h3>
            {result.valid && (
              <div className="space-y-3">
                <div><span className="text-gray-400">Owner:</span> <code>{result.owner}</code></div>
                <div><span className="text-gray-400">Issuer DID:</span> {result.issuerDid}</div>
                <div><span className="text-gray-400">Issued At:</span> {new Date(result.issuedAt * 1000).toLocaleString()}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
