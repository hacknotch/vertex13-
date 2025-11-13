/**
 * Local storage keys
 */
const KEYS = {
  DOCUMENTS: 'identity_vault_documents',
  AUDIT_LOGS: 'identity_vault_audit_logs',
  VCS: 'identity_vault_vcs',
  USER_DID: 'identity_vault_user_did',
};

/**
 * Save document metadata
 * @param {object} document
 */
export function saveDocument(document) {
  const documents = getDocuments();
  const existingIndex = documents.findIndex(d => d.docId === document.docId);
  
  if (existingIndex >= 0) {
    documents[existingIndex] = { ...documents[existingIndex], ...document };
  } else {
    documents.push(document);
  }
  
  localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(documents));
}

/**
 * Get all documents
 * @returns {Array}
 */
export function getDocuments() {
  const data = localStorage.getItem(KEYS.DOCUMENTS);
  return data ? JSON.parse(data) : [];
}

/**
 * Get document by ID
 * @param {string} docId
 * @returns {object|null}
 */
export function getDocumentById(docId) {
  const documents = getDocuments();
  return documents.find(d => d.docId === docId) || null;
}

/**
 * Delete document
 * @param {string} docId
 */
export function deleteDocument(docId) {
  const documents = getDocuments();
  const filtered = documents.filter(d => d.docId !== docId);
  localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(filtered));
}

/**
 * Add audit log entry
 * @param {object} logEntry
 */
export function addAuditLog(logEntry) {
  const logs = getAuditLogs();
  logs.unshift({ ...logEntry, id: Date.now().toString(), timestamp: new Date().toISOString() });
  localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(logs));
}

/**
 * Get all audit logs
 * @returns {Array}
 */
export function getAuditLogs() {
  const data = localStorage.getItem(KEYS.AUDIT_LOGS);
  return data ? JSON.parse(data) : [];
}

/**
 * Save Verifiable Credential
 * @param {object} vc
 */
export function saveVC(vc) {
  const vcs = getVCs();
  vcs.push({ ...vc, savedAt: new Date().toISOString() });
  localStorage.setItem(KEYS.VCS, JSON.stringify(vcs));
}

/**
 * Get all VCs
 * @returns {Array}
 */
export function getVCs() {
  const data = localStorage.getItem(KEYS.VCS);
  return data ? JSON.parse(data) : [];
}

/**
 * Get VC by CID
 * @param {string} cid
 * @returns {object|null}
 */
export function getVCByCID(cid) {
  const vcs = getVCs();
  return vcs.find(vc => vc.credentialSubject?.cid === cid) || null;
}

/**
 * Save user DID
 * @param {string} did
 */
export function saveUserDID(did) {
  localStorage.setItem(KEYS.USER_DID, did);
}

/**
 * Get user DID
 * @returns {string|null}
 */
export function getUserDID() {
  return localStorage.getItem(KEYS.USER_DID);
}

/**
 * Clear all storage (for testing)
 */
export function clearAllStorage() {
  Object.values(KEYS).forEach(key => localStorage.removeItem(key));
}
