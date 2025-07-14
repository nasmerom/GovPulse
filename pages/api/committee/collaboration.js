export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Get documents or collaboration data
    const { action, documentId } = req.query;
    
    if (action === 'documents') {
      // Return list of documents
      const documents = [
        {
          id: 1,
          title: "H.R. 1234 - Infrastructure Investment Act",
          committee: "Transportation and Infrastructure",
          status: "draft",
          version: "2.1.3",
          lastModified: "2024-01-17T14:30:00Z",
          modifiedBy: "Sarah Chen",
          collaborators: [
            { name: "Sarah Chen", role: "Lead Staffer", office: "Rep. Johnson", status: "online" },
            { name: "Mike Rodriguez", role: "Policy Analyst", office: "Rep. Smith", status: "editing" },
            { name: "Lisa Wang", role: "Legal Counsel", office: "Sen. Davis", status: "online" }
          ],
          content: `SECTION 1. SHORT TITLE.

This Act may be cited as the "Infrastructure Investment and Jobs Act".

SEC. 2. FINDINGS.

Congress finds that—

(1) the Nation's infrastructure is in critical need of modernization and repair;

(2) investment in infrastructure creates jobs and strengthens the economy;

(3) climate-resilient infrastructure is essential for long-term sustainability;

(4) broadband access is critical for economic opportunity and education;

(5) the Federal Government should partner with State and local governments to address infrastructure needs.`,
          tags: ["infrastructure", "transportation", "climate", "jobs"],
          changeTracking: [
            {
              id: 1,
              version: "2.1.3",
              author: "Mike Rodriguez",
              timestamp: "2024-01-17T14:30:00Z",
              changes: "Updated funding allocation percentages and added climate resilience language",
              type: "edit"
            }
          ]
        }
      ];
      
      res.status(200).json(documents);
    } else if (action === 'collaborators') {
      // Return active collaborators
      const collaborators = [
        {
          id: 1,
          name: "Sarah Chen",
          role: "Lead Staffer",
          office: "Rep. Johnson",
          committee: "Transportation and Infrastructure",
          status: "online",
          lastActivity: "2 minutes ago",
          currentDocument: "H.R. 1234 - Infrastructure Investment Act"
        },
        {
          id: 2,
          name: "Mike Rodriguez",
          role: "Policy Analyst",
          office: "Rep. Smith",
          committee: "Transportation and Infrastructure",
          status: "editing",
          lastActivity: "Just now",
          currentDocument: "H.R. 1234 - Infrastructure Investment Act"
        }
      ];
      
      res.status(200).json(collaborators);
    } else if (action === 'document' && documentId) {
      // Return specific document with full details
      const document = {
        id: parseInt(documentId),
        title: "H.R. 1234 - Infrastructure Investment Act",
        committee: "Transportation and Infrastructure",
        status: "draft",
        version: "2.1.3",
        lastModified: "2024-01-17T14:30:00Z",
        modifiedBy: "Sarah Chen",
        collaborators: [
          { name: "Sarah Chen", role: "Lead Staffer", office: "Rep. Johnson", status: "online" },
          { name: "Mike Rodriguez", role: "Policy Analyst", office: "Rep. Smith", status: "editing" },
          { name: "Lisa Wang", role: "Legal Counsel", office: "Sen. Davis", status: "online" }
        ],
        content: `SECTION 1. SHORT TITLE.

This Act may be cited as the "Infrastructure Investment and Jobs Act".

SEC. 2. FINDINGS.

Congress finds that—

(1) the Nation's infrastructure is in critical need of modernization and repair;

(2) investment in infrastructure creates jobs and strengthens the economy;

(3) climate-resilient infrastructure is essential for long-term sustainability;

(4) broadband access is critical for economic opportunity and education;

(5) the Federal Government should partner with State and local governments to address infrastructure needs.

SEC. 3. AUTHORIZATION OF APPROPRIATIONS.

(a) IN GENERAL.—There are authorized to be appropriated to carry out this Act—

(1) $110,000,000,000 for fiscal year 2024;

(2) $120,000,000,000 for fiscal year 2025;

(3) $130,000,000,000 for fiscal year 2026.

(b) ALLOCATION.—Of the amounts authorized under subsection (a)—

(1) 40 percent shall be for highway and bridge projects;

(2) 25 percent shall be for public transportation;

(3) 20 percent shall be for broadband infrastructure;

(4) 10 percent shall be for water infrastructure;

(5) 5 percent shall be for electric vehicle charging infrastructure.`,
        tags: ["infrastructure", "transportation", "climate", "jobs"],
        changeTracking: [
          {
            id: 1,
            version: "2.1.3",
            author: "Mike Rodriguez",
            timestamp: "2024-01-17T14:30:00Z",
            changes: "Updated funding allocation percentages and added climate resilience language",
            type: "edit"
          },
          {
            id: 2,
            version: "2.1.2",
            author: "Sarah Chen",
            timestamp: "2024-01-17T12:15:00Z",
            changes: "Added broadband infrastructure section",
            type: "addition"
          },
          {
            id: 3,
            version: "2.1.1",
            author: "Lisa Wang",
            timestamp: "2024-01-17T10:45:00Z",
            changes: "Legal review and compliance updates",
            type: "review"
          }
        ]
      };
      
      res.status(200).json(document);
    }
  } else if (req.method === 'POST') {
    // Handle document operations
    const { action, documentId, content, author, changes } = req.body;

    if (action === 'create_document') {
      // Create new document
      const newDocument = {
        id: Date.now(),
        title: req.body.title,
        committee: req.body.committee,
        status: 'draft',
        version: '1.0.0',
        lastModified: new Date().toISOString(),
        modifiedBy: author || 'Unknown',
        collaborators: [{ name: author || 'Unknown', role: 'Creator', office: 'Committee Staff', status: 'online' }],
        content: req.body.content || '',
        tags: req.body.tags || [],
        changeTracking: []
      };

      res.status(201).json(newDocument);
    } else if (action === 'update_document') {
      // Update document with version control
      const updatedDocument = {
        id: documentId,
        content: content,
        version: incrementVersion(req.body.currentVersion || '1.0.0'),
        lastModified: new Date().toISOString(),
        modifiedBy: author || 'Unknown',
        changeTracking: [
          {
            id: Date.now(),
            version: incrementVersion(req.body.currentVersion || '1.0.0'),
            author: author || 'Unknown',
            timestamp: new Date().toISOString(),
            changes: changes || 'Document updated',
            type: 'edit'
          }
        ]
      };

      res.status(200).json(updatedDocument);
    } else if (action === 'add_comment') {
      // Add comment to document
      const newComment = {
        id: Date.now(),
        documentId: documentId,
        author: author || 'Unknown',
        content: req.body.content,
        timestamp: new Date().toISOString(),
        replies: []
      };

      res.status(201).json(newComment);
    } else if (action === 'join_collaboration') {
      // Join document collaboration session
      const collaborator = {
        id: Date.now(),
        name: author || 'Unknown',
        role: req.body.role || 'Staffer',
        office: req.body.office || 'Committee Staff',
        status: 'online',
        lastActivity: 'Just now',
        currentDocument: req.body.documentTitle || 'Unknown Document'
      };

      res.status(200).json(collaborator);
    }
  } else if (req.method === 'PUT') {
    // Handle real-time updates
    const { action, documentId, userId, status } = req.body;

    if (action === 'update_status') {
      // Update user status (online, editing, offline)
      const statusUpdate = {
        userId: userId,
        status: status,
        timestamp: new Date().toISOString(),
        documentId: documentId
      };

      res.status(200).json(statusUpdate);
    } else if (action === 'sync_changes') {
      // Sync real-time changes
      const changeSync = {
        documentId: documentId,
        changes: req.body.changes,
        author: req.body.author,
        timestamp: new Date().toISOString(),
        type: 'realtime_sync'
      };

      res.status(200).json(changeSync);
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

// Helper function to increment version
function incrementVersion(version) {
  const parts = version.split('.');
  parts[2] = (parseInt(parts[2]) + 1).toString();
  return parts.join('.');
}

// WebSocket-like functionality for real-time collaboration
// In a real implementation, you would use WebSockets or Server-Sent Events
function handleRealTimeCollaboration(io) {
  io.on('connection', (socket) => {
    console.log('User connected to collaboration session');

    socket.on('join_document', (documentId) => {
      socket.join(`document_${documentId}`);
      console.log(`User joined document ${documentId}`);
    });

    socket.on('document_change', (data) => {
      // Broadcast changes to all users in the document room
      socket.to(`document_${data.documentId}`).emit('document_updated', {
        changes: data.changes,
        author: data.author,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('user_status_change', (data) => {
      // Broadcast user status changes
      socket.to(`document_${data.documentId}`).emit('user_status_updated', {
        userId: data.userId,
        status: data.status,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from collaboration session');
    });
  });
} 