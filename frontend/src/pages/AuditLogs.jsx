import { useState, useEffect } from 'react';
import { getAuditLogs } from '../utils/storage';
import { getExplorerUrl } from '../utils/contract';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setLogs(getAuditLogs());
  }, []);

  return (
    <div className="min-h-screen bg-darker py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Audit Logs</h1>

        {logs.length === 0 ? (
          <div className="card text-center py-16">
            <p className="text-gray-400">No audit logs yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="card flex justify-between items-center">
                <div>
                  <span className="badge-info mr-2">{log.action}</span>
                  <span className="text-sm">{log.details}</span>
                  {log.cid && <code className="ml-2 text-xs text-gray-400">{log.cid.slice(0, 12)}...</code>}
                </div>
                <div className="text-right text-sm text-gray-400">
                  <div>{new Date(log.timestamp).toLocaleString()}</div>
                  {log.txHash && (
                    <a href={getExplorerUrl(log.txHash)} target="_blank" rel="noopener" className="text-primary hover:underline">
                      View TX ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
