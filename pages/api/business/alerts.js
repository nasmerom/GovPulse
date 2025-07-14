/**
 * Business Alert System - Advanced notifications for business accounts
 * Provides real-time alerts, intelligent filtering, and customizable notifications
 */

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return handleCreateAlert(req, res);
  } else if (req.method === 'GET') {
    return handleGetAlerts(req, res);
  } else if (req.method === 'PUT') {
    return handleUpdateAlert(req, res);
  } else if (req.method === 'DELETE') {
    return handleDeleteAlert(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function handleCreateAlert(req, res) {
  try {
    const {
      userId,
      alertType,
      criteria,
      frequency,
      channels,
      priority,
      industry,
      state,
      district
    } = req.body;

    console.log('[Alerts] Creating alert:', { alertType, criteria, frequency, priority });

    const alert = {
      id: generateAlertId(),
      userId,
      alertType,
      criteria,
      frequency,
      channels,
      priority,
      industry,
      state,
      district,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastTriggered: null,
      triggerCount: 0,
      nextCheck: calculateNextCheck(frequency)
    };

    // Validate alert criteria
    const validation = validateAlertCriteria(alertType, criteria);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Store alert (in real implementation, would save to database)
    console.log('[Alerts] Alert created successfully:', alert.id);

    return res.status(201).json({
      success: true,
      alert,
      message: 'Alert created successfully'
    });

  } catch (error) {
    console.error('[Alerts] Error creating alert:', error);
    return res.status(500).json({
      error: error.message || 'Failed to create alert'
    });
  }
}

async function handleGetAlerts(req, res) {
  try {
    const { userId, status, alertType } = req.query;

    console.log('[Alerts] Fetching alerts for user:', userId);

    // Simulate fetching alerts from database
    const alerts = generateMockAlerts(userId, status, alertType);

    return res.status(200).json({
      success: true,
      alerts,
      total: alerts.length
    });

  } catch (error) {
    console.error('[Alerts] Error fetching alerts:', error);
    return res.status(500).json({
      error: error.message || 'Failed to fetch alerts'
    });
  }
}

async function handleUpdateAlert(req, res) {
  try {
    const { alertId } = req.query;
    const updates = req.body;

    console.log('[Alerts] Updating alert:', alertId, updates);

    // Validate updates
    const validation = validateAlertUpdates(updates);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Update alert (in real implementation, would update database)
    const updatedAlert = {
      id: alertId,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      alert: updatedAlert,
      message: 'Alert updated successfully'
    });

  } catch (error) {
    console.error('[Alerts] Error updating alert:', error);
    return res.status(500).json({
      error: error.message || 'Failed to update alert'
    });
  }
}

async function handleDeleteAlert(req, res) {
  try {
    const { alertId } = req.query;

    console.log('[Alerts] Deleting alert:', alertId);

    // Delete alert (in real implementation, would delete from database)
    return res.status(200).json({
      success: true,
      message: 'Alert deleted successfully'
    });

  } catch (error) {
    console.error('[Alerts] Error deleting alert:', error);
    return res.status(500).json({
      error: error.message || 'Failed to delete alert'
    });
  }
}

// Helper functions
function generateAlertId() {
  return 'alert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function validateAlertCriteria(alertType, criteria) {
  const validTypes = [
    'bill_tracking',
    'regulatory_changes',
    'committee_activity',
    'voting_records',
    'lobbying_activity',
    'campaign_finance',
    'market_impact',
    'competitive_intelligence'
  ];

  if (!validTypes.includes(alertType)) {
    return { valid: false, error: 'Invalid alert type' };
  }

  // Validate criteria based on alert type
  switch (alertType) {
    case 'bill_tracking':
      if (!criteria.keywords && !criteria.billIds && !criteria.sponsors) {
        return { valid: false, error: 'Bill tracking requires keywords, bill IDs, or sponsors' };
      }
      break;
    case 'regulatory_changes':
      if (!criteria.agencies && !criteria.industries) {
        return { valid: false, error: 'Regulatory alerts require agencies or industries' };
      }
      break;
    case 'committee_activity':
      if (!criteria.committees && !criteria.topics) {
        return { valid: false, error: 'Committee alerts require committees or topics' };
      }
      break;
    case 'voting_records':
      if (!criteria.legislators && !criteria.issues) {
        return { valid: false, error: 'Voting alerts require legislators or issues' };
      }
      break;
    case 'lobbying_activity':
      if (!criteria.companies && !criteria.issues) {
        return { valid: false, error: 'Lobbying alerts require companies or issues' };
      }
      break;
    case 'campaign_finance':
      if (!criteria.candidates && !criteria.donors) {
        return { valid: false, error: 'Campaign finance alerts require candidates or donors' };
      }
      break;
    case 'market_impact':
      if (!criteria.sectors && !criteria.indicators) {
        return { valid: false, error: 'Market impact alerts require sectors or indicators' };
      }
      break;
    case 'competitive_intelligence':
      if (!criteria.competitors && !criteria.activities) {
        return { valid: false, error: 'Competitive intelligence alerts require competitors or activities' };
      }
      break;
  }

  return { valid: true };
}

function validateAlertUpdates(updates) {
  const allowedFields = [
    'criteria',
    'frequency',
    'channels',
    'priority',
    'status'
  ];

  const invalidFields = Object.keys(updates).filter(field => !allowedFields.includes(field));
  if (invalidFields.length > 0) {
    return { valid: false, error: `Invalid fields: ${invalidFields.join(', ')}` };
  }

  return { valid: true };
}

function calculateNextCheck(frequency) {
  const now = new Date();
  switch (frequency) {
    case 'realtime':
      return new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
    case 'hourly':
      return new Date(now.getTime() + 60 * 60 * 1000); // 1 hour
    case 'daily':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 day
    case 'weekly':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week
    default:
      return new Date(now.getTime() + 24 * 60 * 60 * 1000); // Default to daily
  }
}

function generateMockAlerts(userId, status, alertType) {
  const mockAlerts = [
    {
      id: 'alert_001',
      userId,
      alertType: 'bill_tracking',
      criteria: {
        keywords: ['technology', 'privacy', 'data'],
        sponsors: ['Senator Smith'],
        priority: 'high'
      },
      frequency: 'daily',
      channels: ['email', 'push', 'dashboard'],
      priority: 'high',
      industry: 'technology',
      state: 'CA',
      district: '12',
      status: 'active',
      createdAt: '2024-01-15T10:00:00Z',
      lastTriggered: '2024-01-20T14:30:00Z',
      triggerCount: 5,
      nextCheck: '2024-01-21T10:00:00Z'
    },
    {
      id: 'alert_002',
      userId,
      alertType: 'regulatory_changes',
      criteria: {
        agencies: ['EPA', 'FDA'],
        industries: ['healthcare', 'pharmaceutical'],
        keywords: ['environmental', 'safety']
      },
      frequency: 'hourly',
      channels: ['email', 'sms'],
      priority: 'critical',
      industry: 'healthcare',
      state: 'NY',
      district: '10',
      status: 'active',
      createdAt: '2024-01-10T09:00:00Z',
      lastTriggered: '2024-01-20T16:45:00Z',
      triggerCount: 12,
      nextCheck: '2024-01-20T17:45:00Z'
    },
    {
      id: 'alert_003',
      userId,
      alertType: 'committee_activity',
      criteria: {
        committees: ['Senate Finance', 'House Energy'],
        topics: ['tax reform', 'energy policy'],
        keywords: ['renewable', 'subsidy']
      },
      frequency: 'daily',
      channels: ['email', 'dashboard'],
      priority: 'medium',
      industry: 'energy',
      state: 'TX',
      district: '7',
      status: 'active',
      createdAt: '2024-01-12T11:00:00Z',
      lastTriggered: '2024-01-20T09:15:00Z',
      triggerCount: 3,
      nextCheck: '2024-01-21T11:00:00Z'
    },
    {
      id: 'alert_004',
      userId,
      alertType: 'competitive_intelligence',
      criteria: {
        competitors: ['Competitor A', 'Competitor B'],
        activities: ['lobbying', 'campaign_contributions'],
        keywords: ['merger', 'acquisition']
      },
      frequency: 'realtime',
      channels: ['email', 'push', 'sms'],
      priority: 'high',
      industry: 'finance',
      state: 'IL',
      district: '5',
      status: 'active',
      createdAt: '2024-01-08T08:00:00Z',
      lastTriggered: '2024-01-20T15:20:00Z',
      triggerCount: 8,
      nextCheck: '2024-01-20T15:25:00Z'
    },
    {
      id: 'alert_005',
      userId,
      alertType: 'voting_records',
      criteria: {
        legislators: ['Representative Johnson', 'Senator Brown'],
        issues: ['healthcare', 'education'],
        keywords: ['bipartisan', 'amendment']
      },
      frequency: 'weekly',
      channels: ['email'],
      priority: 'low',
      industry: 'general',
      state: 'OH',
      district: '3',
      status: 'inactive',
      createdAt: '2024-01-05T12:00:00Z',
      lastTriggered: '2024-01-15T10:30:00Z',
      triggerCount: 2,
      nextCheck: '2024-01-22T12:00:00Z'
    }
  ];

  // Filter alerts based on query parameters
  let filteredAlerts = mockAlerts;

  if (status) {
    filteredAlerts = filteredAlerts.filter(alert => alert.status === status);
  }

  if (alertType) {
    filteredAlerts = filteredAlerts.filter(alert => alert.alertType === alertType);
  }

  return filteredAlerts;
}

// Alert processing functions
export async function processAlerts() {
  console.log('[Alerts] Processing alerts...');
  
  try {
    // Get all active alerts
    const activeAlerts = await getActiveAlerts();
    
    for (const alert of activeAlerts) {
      if (shouldCheckAlert(alert)) {
        await checkAlert(alert);
      }
    }
    
    console.log('[Alerts] Alert processing complete');
  } catch (error) {
    console.error('[Alerts] Error processing alerts:', error);
  }
}

async function getActiveAlerts() {
  // In real implementation, would fetch from database
  return generateMockAlerts('user_123', 'active');
}

function shouldCheckAlert(alert) {
  const now = new Date();
  const nextCheck = new Date(alert.nextCheck);
  return now >= nextCheck;
}

async function checkAlert(alert) {
  console.log('[Alerts] Checking alert:', alert.id);
  
  try {
    let triggered = false;
    let data = null;
    
    switch (alert.alertType) {
      case 'bill_tracking':
        triggered = await checkBillTracking(alert.criteria);
        data = await getBillData(alert.criteria);
        break;
      case 'regulatory_changes':
        triggered = await checkRegulatoryChanges(alert.criteria);
        data = await getRegulatoryData(alert.criteria);
        break;
      case 'committee_activity':
        triggered = await checkCommitteeActivity(alert.criteria);
        data = await getCommitteeData(alert.criteria);
        break;
      case 'voting_records':
        triggered = await checkVotingRecords(alert.criteria);
        data = await getVotingData(alert.criteria);
        break;
      case 'lobbying_activity':
        triggered = await checkLobbyingActivity(alert.criteria);
        data = await getLobbyingData(alert.criteria);
        break;
      case 'campaign_finance':
        triggered = await checkCampaignFinance(alert.criteria);
        data = await getCampaignFinanceData(alert.criteria);
        break;
      case 'market_impact':
        triggered = await checkMarketImpact(alert.criteria);
        data = await getMarketData(alert.criteria);
        break;
      case 'competitive_intelligence':
        triggered = await checkCompetitiveIntelligence(alert.criteria);
        data = await getCompetitiveData(alert.criteria);
        break;
    }
    
    if (triggered) {
      await triggerAlert(alert, data);
    }
    
    // Update next check time
    await updateAlertNextCheck(alert);
    
  } catch (error) {
    console.error('[Alerts] Error checking alert:', alert.id, error);
  }
}

async function checkBillTracking(criteria) {
  // Simulate bill tracking check
  const { keywords, billIds, sponsors } = criteria;
  
  // In real implementation, would check against live bill data
  const hasNewActivity = Math.random() > 0.7; // 30% chance of new activity
  
  return hasNewActivity;
}

async function checkRegulatoryChanges(criteria) {
  // Simulate regulatory changes check
  const { agencies, industries } = criteria;
  
  // In real implementation, would check against regulatory databases
  const hasNewRegulations = Math.random() > 0.8; // 20% chance of new regulations
  
  return hasNewRegulations;
}

async function checkCommitteeActivity(criteria) {
  // Simulate committee activity check
  const { committees, topics } = criteria;
  
  // In real implementation, would check against committee schedules and activities
  const hasNewActivity = Math.random() > 0.6; // 40% chance of new activity
  
  return hasNewActivity;
}

async function checkVotingRecords(criteria) {
  // Simulate voting records check
  const { legislators, issues } = criteria;
  
  // In real implementation, would check against voting databases
  const hasNewVotes = Math.random() > 0.9; // 10% chance of new votes
  
  return hasNewVotes;
}

async function checkLobbyingActivity(criteria) {
  // Simulate lobbying activity check
  const { companies, issues } = criteria;
  
  // In real implementation, would check against lobbying disclosure databases
  const hasNewActivity = Math.random() > 0.85; // 15% chance of new activity
  
  return hasNewActivity;
}

async function checkCampaignFinance(criteria) {
  // Simulate campaign finance check
  const { candidates, donors } = criteria;
  
  // In real implementation, would check against FEC databases
  const hasNewActivity = Math.random() > 0.9; // 10% chance of new activity
  
  return hasNewActivity;
}

async function checkMarketImpact(criteria) {
  // Simulate market impact check
  const { sectors, indicators } = criteria;
  
  // In real implementation, would check against market data APIs
  const hasSignificantChange = Math.random() > 0.8; // 20% chance of significant change
  
  return hasSignificantChange;
}

async function checkCompetitiveIntelligence(criteria) {
  // Simulate competitive intelligence check
  const { competitors, activities } = criteria;
  
  // In real implementation, would check against various data sources
  const hasNewActivity = Math.random() > 0.75; // 25% chance of new activity
  
  return hasNewActivity;
}

async function getBillData(criteria) {
  // Simulate bill data
  return {
    bills: [
      {
        id: 'HR1234',
        title: 'Technology Privacy Act',
        status: 'Introduced',
        sponsor: 'Senator Smith',
        summary: 'Bill to enhance privacy protections for technology users'
      }
    ],
    activity: 'New bill introduced matching criteria'
  };
}

async function getRegulatoryData(criteria) {
  // Simulate regulatory data
  return {
    regulations: [
      {
        id: 'REG001',
        title: 'New Environmental Standards',
        agency: 'EPA',
        status: 'Proposed',
        impact: 'High'
      }
    ],
    activity: 'New regulation proposed matching criteria'
  };
}

async function getCommitteeData(criteria) {
  // Simulate committee data
  return {
    hearings: [
      {
        id: 'HEAR001',
        title: 'Tax Reform Hearing',
        committee: 'Senate Finance',
        date: '2024-01-25',
        witnesses: ['Expert A', 'Expert B']
      }
    ],
    activity: 'New hearing scheduled matching criteria'
  };
}

async function getVotingData(criteria) {
  // Simulate voting data
  return {
    votes: [
      {
        id: 'VOTE001',
        bill: 'HR1234',
        legislator: 'Representative Johnson',
        vote: 'Yea',
        date: '2024-01-20'
      }
    ],
    activity: 'New vote recorded matching criteria'
  };
}

async function getLobbyingData(criteria) {
  // Simulate lobbying data
  return {
    disclosures: [
      {
        id: 'LOBBY001',
        company: 'Tech Corp',
        issue: 'Privacy Legislation',
        amount: 50000,
        date: '2024-01-20'
      }
    ],
    activity: 'New lobbying disclosure matching criteria'
  };
}

async function getCampaignFinanceData(criteria) {
  // Simulate campaign finance data
  return {
    contributions: [
      {
        id: 'CONT001',
        donor: 'Industry PAC',
        candidate: 'Senator Brown',
        amount: 2500,
        date: '2024-01-20'
      }
    ],
    activity: 'New campaign contribution matching criteria'
  };
}

async function getMarketData(criteria) {
  // Simulate market data
  return {
    indicators: [
      {
        name: 'Technology Sector Index',
        change: '+2.5%',
        impact: 'Positive'
      }
    ],
    activity: 'Significant market movement detected'
  };
}

async function getCompetitiveData(criteria) {
  // Simulate competitive data
  return {
    activities: [
      {
        company: 'Competitor A',
        activity: 'New lobbying registration',
        date: '2024-01-20',
        impact: 'Medium'
      }
    ],
    activity: 'New competitive activity detected'
  };
}

async function triggerAlert(alert, data) {
  console.log('[Alerts] Triggering alert:', alert.id);
  
  try {
    // Update alert statistics
    alert.triggerCount++;
    alert.lastTriggered = new Date().toISOString();
    
    // Send notifications through specified channels
    for (const channel of alert.channels) {
      await sendNotification(channel, alert, data);
    }
    
    // Log alert trigger
    console.log('[Alerts] Alert triggered successfully:', alert.id);
    
  } catch (error) {
    console.error('[Alerts] Error triggering alert:', alert.id, error);
  }
}

async function sendNotification(channel, alert, data) {
  switch (channel) {
    case 'email':
      await sendEmailNotification(alert, data);
      break;
    case 'push':
      await sendPushNotification(alert, data);
      break;
    case 'sms':
      await sendSMSNotification(alert, data);
      break;
    case 'dashboard':
      await sendDashboardNotification(alert, data);
      break;
  }
}

async function sendEmailNotification(alert, data) {
  // In real implementation, would send email
  console.log('[Alerts] Sending email notification for alert:', alert.id);
}

async function sendPushNotification(alert, data) {
  // In real implementation, would send push notification
  console.log('[Alerts] Sending push notification for alert:', alert.id);
}

async function sendSMSNotification(alert, data) {
  // In real implementation, would send SMS
  console.log('[Alerts] Sending SMS notification for alert:', alert.id);
}

async function sendDashboardNotification(alert, data) {
  // In real implementation, would update dashboard
  console.log('[Alerts] Sending dashboard notification for alert:', alert.id);
}

async function updateAlertNextCheck(alert) {
  // Update next check time based on frequency
  alert.nextCheck = calculateNextCheck(alert.frequency);
  
  // In real implementation, would update database
  console.log('[Alerts] Updated next check time for alert:', alert.id);
} 