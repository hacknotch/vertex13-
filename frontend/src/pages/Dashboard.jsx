import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getDocuments } from '../utils/storage';
import UploadModal from '../components/UploadModal';
import DocumentCard from '../components/DocumentCard';
import IssuerPanel from '../components/IssuerPanel';

export default function Dashboard({ wallet }) {
  const [documents, setDocuments] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showIssuerPanel, setShowIssuerPanel] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = () => {
    const docs = getDocuments();
    setDocuments(docs);
  };

  const handleUploadComplete = () => {
    loadDocuments();
    setShowUploadModal(false);
    toast.success('Document uploaded successfully!');
  };

  return (
    <div className="min-h-screen bg-darker py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-400">Manage your decentralized identity documents</p>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setShowIssuerPanel(!showIssuerPanel)}
              className="btn-outline text-sm"
            >
              {showIssuerPanel ? 'Hide' : 'Show'} Issuer Panel
            </button>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="btn-primary"
            >
              + Upload Document
            </button>
          </div>
        </div>

        {showIssuerPanel && (
          <div className="mb-8">
            <IssuerPanel wallet={wallet} onIssue={loadDocuments} />
          </div>
        )}

        {documents.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-2xl font-semibold mb-2">No Documents Yet</h3>
            <p className="text-gray-400 mb-6">
              Upload your first identity document to get started
            </p>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="btn-primary"
            >
              Upload Document
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <DocumentCard 
                key={doc.docId} 
                document={doc} 
                wallet={wallet}
                onUpdate={loadDocuments}
              />
            ))}
          </div>
        )}
      </div>

      {showUploadModal && (
        <UploadModal 
          wallet={wallet}
          onClose={() => setShowUploadModal(false)}
          onComplete={handleUploadComplete}
        />
      )}
    </div>
  );
}
