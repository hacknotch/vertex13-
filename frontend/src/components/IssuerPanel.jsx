import { useState } from 'react';
import toast from 'react-hot-toast';
import { createVC, signVC } from '../utils/vc';
import { saveVC, addAuditLog } from '../utils/storage';
import { cidToHash } from '../utils/ipfs';

export default function IssuerPanel({ wallet, onIssue }) {
  const [subjectDid, setSubjectDid] = useState('');
  const [cid, setCid] = useState('');
  const [issuing, setIssuing] = useState(false);

  const handleIssue = async () => {
    if (!subjectDid || !cid) {
      toast.error('Please fill all fields');
      return;
    }

    setIssuing(true);
    try {
      const vc = createVC({
        issuerDid: wallet.did,
        subjectDid,
        cid,
        cidHash: cidToHash(cid),
        credentialType: 'IdentityDocument',
      });

      const signedVC = await signVC(vc, wallet.provider, wallet.account);
      saveVC(signedVC);
      addAuditLog({ action: 'ISSUE_VC', cid, details: `Issued VC to ${subjectDid}` });

      toast.success('VC issued and signed!');
      setSubjectDid('');
      setCid('');
      onIssue();
    } catch (error) {
      toast.error(`Failed to issue VC: ${error.message}`);
    } finally {
      setIssuing(false);
    }
  };

  return (
    <div className="card bg-secondary/10 border-secondary">
      <h3 className="text-xl font-bold mb-4">🎫 Issuer Panel</h3>
      <p className="text-sm text-gray-400 mb-4">Issue Verifiable Credentials (Demo)</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Subject DID</label>
          <input type="text" placeholder="did:ethr:0x..." value={subjectDid} onChange={(e) => setSubjectDid(e.target.value)} className="input" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Document CID</label>
          <input type="text" placeholder="bafybei..." value={cid} onChange={(e) => setCid(e.target.value)} className="input" />
        </div>

        <button onClick={handleIssue} className="btn-secondary w-full" disabled={issuing}>
          {issuing ? 'Issuing...' : 'Sign & Issue VC'}
        </button>
      </div>
    </div>
  );
}
