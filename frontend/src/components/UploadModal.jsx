import { useState } from 'react';
import toast from 'react-hot-toast';
import { encryptFileComplete, getEncryptionPublicKey } from '../utils/encryption';
import { uploadToIPFS, cidToHash } from '../utils/ipfs';
import { saveDocument, addAuditLog } from '../utils/storage';

export default function UploadModal({ wallet, onClose, onComplete }) {
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState('passport');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.size <= 10 * 1024 * 1024) {
      setFile(selected);
    } else {
      toast.error('File must be less than 10MB');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);
    try {
      // Step 1: Get encryption public key
      setProgress('Requesting encryption key...');
      const publicKey = await getEncryptionPublicKey(wallet.account, wallet.provider);

      // Step 2: Encrypt file
      setProgress('Encrypting file client-side...');
      const encrypted = await encryptFileComplete(file, publicKey);

      // Step 3: Upload to IPFS
      setProgress('Uploading to IPFS...');
      const cid = await uploadToIPFS(encrypted.encryptedData, encrypted.fileName);

      // Step 4: Compute CID hash
      const cidHash = cidToHash(cid);

      // Step 5: Save metadata locally
      const docId = Date.now().toString();
      const document = {
        docId,
        name: file.name,
        cid,
        cidHash,
        docType,
        uploadedAt: new Date().toISOString(),
        wrappedKey: encrypted.wrappedKey,
        iv: encrypted.iv,
        status: 'uploaded',
      };
      saveDocument(document);

      // Log audit
      addAuditLog({
        action: 'UPLOAD',
        docId,
        cid,
        details: `Uploaded ${file.name}`,
      });

      toast.success('File encrypted and uploaded to IPFS!');
      onComplete();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      setProgress('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-dark rounded-xl p-8 max-w-md w-full mx-4 border border-gray-700" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6">Upload Document</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Document Type</label>
          <select value={docType} onChange={(e) => setDocType(e.target.value)} className="input" disabled={uploading}>
            <option value="passport">Passport</option>
            <option value="drivers_license">Driver's License</option>
            <option value="national_id">National ID</option>
            <option value="birth_certificate">Birth Certificate</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">File (PDF/JPG/PNG, max 10MB)</label>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="w-full" disabled={uploading} />
          {file && <p className="text-sm text-gray-400 mt-2">{file.name} ({(file.size / 1024).toFixed(2)} KB)</p>}
        </div>

        {progress && <div className="mb-4 p-3 bg-primary/20 rounded-lg text-sm">{progress}</div>}

        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-800" disabled={uploading}>
            Cancel
          </button>
          <button onClick={handleUpload} className="flex-1 btn-primary" disabled={uploading || !file}>
            {uploading ? 'Uploading...' : 'Encrypt & Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}
