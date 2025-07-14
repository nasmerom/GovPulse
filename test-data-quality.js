async function testDataQuality() {
  console.log('🔍 Testing data quality...\n');
  
  try {
    // Test original endpoint
    console.log('1. Testing original Congress.gov endpoint...');
    const originalResponse = await fetch('http://localhost:3001/api/congress/member?congress=119&chamber=both');
    const originalData = await originalResponse.json();
    
    console.log(`   Original returned: ${originalData.members?.length || 0} members`);
    
    // Analyze the data
    const analysis = analyzeMembers(originalData.members || []);
    console.log('   Analysis:');
    console.log(`   - House members: ${analysis.houseCount}`);
    console.log(`   - Senate members: ${analysis.senateCount}`);
    console.log(`   - Democrats: ${analysis.democratsCount}`);
    console.log(`   - Republicans: ${analysis.republicansCount}`);
    console.log(`   - Invalid names: ${analysis.invalidNamesCount}`);
    console.log(`   - Missing parties: ${analysis.missingPartiesCount}`);
    console.log(`   - Missing states: ${analysis.missingStatesCount}`);
    
    // Show sample data
    console.log('\n   Sample members:');
    (originalData.members || []).slice(0, 5).forEach(member => {
      console.log(`   - ${member.name} (${member.partyName}, ${member.state}, ${member.chamber})`);
    });
    
    // Test clean endpoint
    console.log('\n2. Testing clean endpoint...');
    const cleanResponse = await fetch('http://localhost:3001/api/congress/members-clean?congress=119&chamber=both');
    
    if (cleanResponse.ok) {
      const cleanData = await cleanResponse.json();
      console.log(`   Clean returned: ${cleanData.members?.length || 0} members`);
      
      if (cleanData.members && cleanData.members.length > 0) {
        console.log('\n   Sample clean members:');
        cleanData.members.slice(0, 5).forEach(member => {
          console.log(`   - ${member.fullName} (${member.partyName}, ${member.state}, ${member.chamber})`);
        });
      }
    } else {
      const errorData = await cleanResponse.json();
      console.log(`   Clean endpoint error: ${errorData.error}`);
    }
    
  } catch (error) {
    console.error('Error testing data quality:', error);
  }
}

function analyzeMembers(members) {
  const analysis = {
    houseCount: 0,
    senateCount: 0,
    democratsCount: 0,
    republicansCount: 0,
    invalidNamesCount: 0,
    missingPartiesCount: 0,
    missingStatesCount: 0
  };
  
  members.forEach(member => {
    // Count by chamber
    if (member.chamber === 'House of Representatives') {
      analysis.houseCount++;
    } else if (member.chamber === 'Senate') {
      analysis.senateCount++;
    }
    
    // Count by party
    if (member.partyName === 'Democratic') {
      analysis.democratsCount++;
    } else if (member.partyName === 'Republican') {
      analysis.republicansCount++;
    }
    
    // Check for issues
    if (!member.name || !member.name.includes(',')) {
      analysis.invalidNamesCount++;
    }
    
    if (!member.partyName) {
      analysis.missingPartiesCount++;
    }
    
    if (!member.state) {
      analysis.missingStatesCount++;
    }
  });
  
  return analysis;
}

testDataQuality(); 