export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Get cases for a representative
    const { representativeId, status, priority } = req.query;
    
    // Mock case data - replace with database query
    const cases = [
      {
        id: 1,
        correspondenceId: 1,
        constituent: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        subject: "Healthcare Reform Support",
        category: "Healthcare",
        priority: "High",
        status: "under_review",
        stage: "Case Review",
        assignedTo: "Legislative Aide",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-16T14:30:00Z",
        estimatedResolution: "2024-02-15",
        notes: [
          {
            id: 1,
            author: "Legislative Aide",
            content: "Case assigned for review. Healthcare committee meeting scheduled.",
            timestamp: "2024-01-16T14:30:00Z",
            type: "status_update"
          }
        ],
        workflow: {
          currentStage: 2,
          stages: [
            { id: 1, name: "Received", completed: true, date: "2024-01-15T10:00:00Z" },
            { id: 2, name: "Under Review", completed: true, date: "2024-01-16T14:30:00Z" },
            { id: 3, name: "Research", completed: false, date: null },
            { id: 4, name: "Draft Response", completed: false, date: null },
            { id: 5, name: "Approval", completed: false, date: null },
            { id: 6, name: "Sent", completed: false, date: null }
          ]
        },
        notifications: [
          {
            id: 1,
            type: "status_update",
            sent: true,
            sentAt: "2024-01-16T15:00:00Z",
            template: "case_assigned",
            recipient: "sarah.johnson@email.com"
          }
        ]
      },
      {
        id: 2,
        correspondenceId: 2,
        constituent: "Mike Chen",
        email: "mike.chen@email.com",
        subject: "Climate Change Concerns",
        category: "Environment",
        priority: "Medium",
        status: "research",
        stage: "Research",
        assignedTo: "Policy Analyst",
        createdAt: "2024-01-14T09:00:00Z",
        updatedAt: "2024-01-17T11:20:00Z",
        estimatedResolution: "2024-02-10",
        notes: [
          {
            id: 2,
            author: "Policy Analyst",
            content: "Researching current climate policy positions and drafting comprehensive response.",
            timestamp: "2024-01-17T11:20:00Z",
            type: "status_update"
          }
        ],
        workflow: {
          currentStage: 3,
          stages: [
            { id: 1, name: "Received", completed: true, date: "2024-01-14T09:00:00Z" },
            { id: 2, name: "Under Review", completed: true, date: "2024-01-15T16:00:00Z" },
            { id: 3, name: "Research", completed: true, date: "2024-01-17T11:20:00Z" },
            { id: 4, name: "Draft Response", completed: false, date: null },
            { id: 5, name: "Approval", completed: false, date: null },
            { id: 6, name: "Sent", completed: false, date: null }
          ]
        },
        notifications: [
          {
            id: 2,
            type: "status_update",
            sent: true,
            sentAt: "2024-01-15T16:30:00Z",
            template: "case_assigned",
            recipient: "mike.chen@email.com"
          },
          {
            id: 3,
            type: "status_update",
            sent: true,
            sentAt: "2024-01-17T12:00:00Z",
            template: "research_started",
            recipient: "mike.chen@email.com"
          }
        ]
      }
    ];

    // Filter cases based on query parameters
    let filteredCases = cases;
    if (status && status !== 'all') {
      filteredCases = filteredCases.filter(c => c.status === status);
    }
    if (priority && priority !== 'all') {
      filteredCases = filteredCases.filter(c => c.priority === priority);
    }

    res.status(200).json(filteredCases);
  } else if (req.method === 'POST') {
    // Create new case or update existing case
    const { action, caseId, status, stage, notes, assignedTo } = req.body;

    if (action === 'create_case') {
      // Create new case from correspondence
      const newCase = {
        id: Date.now(),
        correspondenceId: req.body.correspondenceId,
        constituent: req.body.constituent,
        email: req.body.email,
        subject: req.body.subject,
        category: req.body.category,
        priority: req.body.priority,
        status: 'under_review',
        stage: 'Case Review',
        assignedTo: assignedTo || 'Legislative Aide',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedResolution: req.body.estimatedResolution,
        notes: [],
        workflow: {
          currentStage: 2,
          stages: [
            { id: 1, name: "Received", completed: true, date: new Date().toISOString() },
            { id: 2, name: "Under Review", completed: true, date: new Date().toISOString() },
            { id: 3, name: "Research", completed: false, date: null },
            { id: 4, name: "Draft Response", completed: false, date: null },
            { id: 5, name: "Approval", completed: false, date: null },
            { id: 6, name: "Sent", completed: false, date: null }
          ]
        },
        notifications: []
      };

      // Send initial notification
      await sendNotification(newCase, 'case_created');

      res.status(201).json(newCase);
    } else if (action === 'update_status') {
      // Update case status and send notification
      const updatedCase = {
        // Mock update - replace with database update
        id: caseId,
        status: status,
        stage: stage,
        updatedAt: new Date().toISOString(),
        notes: notes ? [...notes, {
          id: Date.now(),
          author: req.body.author || 'System',
          content: notes,
          timestamp: new Date().toISOString(),
          type: 'status_update'
        }] : notes
      };

      // Send status update notification
      await sendNotification(updatedCase, 'status_updated');

      res.status(200).json(updatedCase);
    } else if (action === 'advance_stage') {
      // Advance to next workflow stage
      const nextStage = req.body.nextStage;
      const updatedCase = {
        id: caseId,
        status: getStatusFromStage(nextStage),
        stage: nextStage,
        updatedAt: new Date().toISOString()
      };

      // Send stage advancement notification
      await sendNotification(updatedCase, 'stage_advanced');

      res.status(200).json(updatedCase);
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

// Helper function to send notifications
async function sendNotification(caseData, templateType) {
  const templates = {
    case_created: {
      subject: "Your Case Has Been Received",
      body: `Dear ${caseData.constituent},\n\nThank you for contacting our office regarding "${caseData.subject}". We have received your correspondence and assigned it case number #${caseData.id}.\n\nOur team is currently reviewing your request and will provide updates as we work toward a resolution.\n\nEstimated resolution date: ${caseData.estimatedResolution}\n\nBest regards,\nOffice of Representative [Name]`
    },
    case_assigned: {
      subject: "Your Case is Under Review",
      body: `Dear ${caseData.constituent},\n\nYour case #${caseData.id} regarding "${caseData.subject}" has been assigned to ${caseData.assignedTo} for review.\n\nWe are actively working on your request and will provide updates as we progress through our review process.\n\nThank you for your patience.\n\nBest regards,\nOffice of Representative [Name]`
    },
    research_started: {
      subject: "Research Underway on Your Case",
      body: `Dear ${caseData.constituent},\n\nWe wanted to let you know that research has begun on your case #${caseData.id} regarding "${caseData.subject}".\n\nOur policy team is gathering information and analyzing the relevant details to provide you with a comprehensive response.\n\nWe will continue to keep you updated on our progress.\n\nBest regards,\nOffice of Representative [Name]`
    },
    status_updated: {
      subject: "Update on Your Case",
      body: `Dear ${caseData.constituent},\n\nWe have an update on your case #${caseData.id} regarding "${caseData.subject}".\n\nCurrent status: ${caseData.stage}\n\nWe will continue to work on your request and provide additional updates as we progress.\n\nBest regards,\nOffice of Representative [Name]`
    },
    stage_advanced: {
      subject: "Progress Update on Your Case",
      body: `Dear ${caseData.constituent},\n\nGood news! Your case #${caseData.id} regarding "${caseData.subject}" has advanced to the next stage: ${caseData.stage}.\n\nWe are making steady progress and will continue to keep you informed of any developments.\n\nBest regards,\nOffice of Representative [Name]`
    }
  };

  const template = templates[templateType];
  if (template) {
    // Mock email sending - replace with actual email service
    console.log(`Sending notification to ${caseData.email}:`, template);
    
    // In a real implementation, you would:
    // 1. Use an email service (SendGrid, AWS SES, etc.)
    // 2. Store notification record in database
    // 3. Handle delivery status tracking
  }
}

// Helper function to map stage to status
function getStatusFromStage(stage) {
  const stageMap = {
    'Case Review': 'under_review',
    'Research': 'research',
    'Draft Response': 'drafting',
    'Approval': 'pending_approval',
    'Sent': 'completed'
  };
  return stageMap[stage] || 'under_review';
} 