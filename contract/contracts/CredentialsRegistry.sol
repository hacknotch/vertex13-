// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CredentialsRegistry
 * @dev Simple registry for decentralized identity credentials
 * Stores only content hashes (CID hashes) on-chain for verification
 */
contract CredentialsRegistry {
    
    struct Credential {
        bool valid;
        address owner;
        string issuerDid;
        uint256 issuedAt;
        address issuer;
    }
    
    // Mapping from CID hash to Credential
    mapping(bytes32 => Credential) public credentials;
    
    // Events
    event CredentialIssued(
        bytes32 indexed cidHash,
        address indexed owner,
        string issuerDid,
        uint256 timestamp
    );
    
    event CredentialRevoked(
        bytes32 indexed cidHash,
        uint256 timestamp
    );
    
    /**
     * @dev Issue a new credential
     * @param cidHash Keccak256 hash of the IPFS CID
     * @param owner Address of the credential owner
     * @param issuerDid DID of the issuer
     * @return bool Success
     */
    function issue(
        bytes32 cidHash,
        address owner,
        string memory issuerDid
    ) public returns (bool) {
        require(cidHash != bytes32(0), "Invalid CID hash");
        require(owner != address(0), "Invalid owner address");
        require(bytes(issuerDid).length > 0, "Invalid issuer DID");
        require(!credentials[cidHash].valid, "Credential already exists");
        
        credentials[cidHash] = Credential({
            valid: true,
            owner: owner,
            issuerDid: issuerDid,
            issuedAt: block.timestamp,
            issuer: msg.sender
        });
        
        emit CredentialIssued(cidHash, owner, issuerDid, block.timestamp);
        
        return true;
    }
    
    /**
     * @dev Revoke a credential
     * @param cidHash Keccak256 hash of the IPFS CID
     * Only issuer or owner can revoke
     */
    function revoke(bytes32 cidHash) public {
        Credential storage cred = credentials[cidHash];
        require(cred.valid, "Credential does not exist or already revoked");
        require(
            msg.sender == cred.issuer || msg.sender == cred.owner,
            "Only issuer or owner can revoke"
        );
        
        cred.valid = false;
        
        emit CredentialRevoked(cidHash, block.timestamp);
    }
    
    /**
     * @dev Check if a credential is valid
     * @param cidHash Keccak256 hash of the IPFS CID
     * @return valid Is the credential valid
     * @return owner Owner address
     * @return issuerDid Issuer DID
     * @return issuedAt Issuance timestamp
     */
    function isValid(bytes32 cidHash) 
        public 
        view 
        returns (
            bool valid,
            address owner,
            string memory issuerDid,
            uint256 issuedAt
        ) 
    {
        Credential memory cred = credentials[cidHash];
        return (cred.valid, cred.owner, cred.issuerDid, cred.issuedAt);
    }
    
    /**
     * @dev Get credential issuer address
     * @param cidHash Keccak256 hash of the IPFS CID
     * @return Address of the issuer
     */
    function getIssuer(bytes32 cidHash) public view returns (address) {
        return credentials[cidHash].issuer;
    }
}
