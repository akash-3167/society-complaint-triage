const BASE_URL = 'http://localhost:5000/api';

async function testCommitteeAssignment() {
  console.log('=== VERIFYING COMMITTEE COMPLAINT ASSIGNMENT WORKFLOW ===\n');

  try {
    // 1. Resident Login
    console.log('--- Step 1: Resident submits new OPEN complaint ---');
    const resLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'RESIDENT', name: 'Akash', flat: 'B-402' })
    });
    const residentSession = await resLogin.json();
    const residentToken = residentSession.token;

    // 2. Submit new complaint
    const newComplaintRes = await fetch(`${BASE_URL}/complaints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${residentToken}`
      },
      body: JSON.stringify({
        resident_name: 'Akash',
        flat_number: 'B-402',
        description: 'Kitchen pipe is dripping water continuously under the sink basin.'
      })
    });
    const newComplaintData = await newComplaintRes.json();
    const complaint = newComplaintData.data;
    console.log('Submitted complaint:', {
      id: complaint.id,
      flat: complaint.flat_number,
      category: complaint.category,
      status: complaint.status,
      assigned_to: complaint.assigned_to
    });

    if (complaint.status !== 'OPEN') {
      throw new Error(`Expected status OPEN, got ${complaint.status}`);
    }
    if (complaint.assigned_to) {
      throw new Error(`Expected assigned_to to be null/empty, got ${complaint.assigned_to}`);
    }
    console.log('✅ Complaint created with OPEN status and unassigned staff.\n');

    // 3. Committee Login
    console.log('--- Step 2: Committee views complaint on Dashboard ---');
    const comLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'COMMITTEE', name: 'Sunil Mehta' })
    });
    const committeeSession = await comLogin.json();
    const committeeToken = committeeSession.token;

    // Fetch complaints as committee
    const getRes = await fetch(`${BASE_URL}/complaints`, {
      headers: { 'Authorization': `Bearer ${committeeToken}` }
    });
    const listData = await getRes.json();
    const foundOnDashboard = listData.data.find(c => c.id === complaint.id);
    if (!foundOnDashboard) {
      throw new Error(`Complaint ${complaint.id} not visible on Committee Dashboard!`);
    }
    console.log('Found on Committee Dashboard:', {
      id: foundOnDashboard.id,
      flat: foundOnDashboard.flat_number,
      status: foundOnDashboard.status,
      assigned_to: foundOnDashboard.assigned_to
    });
    console.log('✅ Complaint is visible to Committee with status OPEN.\n');

    // 4. Committee Assigns Staff (e.g. Ramesh (Plumber))
    console.log('--- Step 3: Committee assigns staff -> Ramesh (Plumber) ---');
    const staffToAssign = 'Ramesh (Plumber)';
    const assignRes = await fetch(`${BASE_URL}/complaints/${complaint.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${committeeToken}`
      },
      body: JSON.stringify({
        assigned_to: staffToAssign,
        status: 'ASSIGNED'
      })
    });

    const assignData = await assignRes.json();
    if (!assignData.success) {
      throw new Error(`Assignment PATCH failed: ${JSON.stringify(assignData)}`);
    }

    const updated = assignData.data;
    console.log('Assignment response:', {
      id: updated.id,
      status: updated.status,
      assigned_to: updated.assigned_to,
      updated_at: updated.updated_at
    });

    if (updated.status !== 'ASSIGNED') {
      throw new Error(`Expected status to change to ASSIGNED, got ${updated.status}`);
    }
    if (updated.assigned_to !== staffToAssign) {
      throw new Error(`Expected assigned_to to be ${staffToAssign}, got ${updated.assigned_to}`);
    }
    console.log('✅ Status transitioned: OPEN → ASSIGNED');
    console.log(`✅ Assigned staff recorded: ${updated.assigned_to}\n`);

    // 5. Verify updated complaint on Committee Dashboard list
    console.log('--- Step 4: Verify Committee Dashboard displays updated assignment ---');
    const verifyListRes = await fetch(`${BASE_URL}/complaints`, {
      headers: { 'Authorization': `Bearer ${committeeToken}` }
    });
    const verifyList = await verifyListRes.json();
    const verifiedComplaint = verifyList.data.find(c => c.id === complaint.id);
    
    console.log('Refetched complaint from Committee Dashboard:', {
      id: verifiedComplaint.id,
      status: verifiedComplaint.status,
      assigned_to: verifiedComplaint.assigned_to
    });

    if (verifiedComplaint.status !== 'ASSIGNED' || verifiedComplaint.assigned_to !== staffToAssign) {
      throw new Error('Refetched dashboard data does not reflect ASSIGNED status or staff assignment!');
    }
    console.log(`✅ Complaint successfully displays "Assigned to: ${verifiedComplaint.assigned_to}" with status ASSIGNED.\n`);

    console.log('====================================================');
    console.log('🎉 COMMITTEE COMPLAINT ASSIGNMENT WORKFLOW VERIFIED!');
    console.log('====================================================');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

testCommitteeAssignment();
