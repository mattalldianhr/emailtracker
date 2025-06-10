function initializeTemplate() {
  createEmailTrackerTemplate();
}

function deleteAllSheets() {
  // Get active spreadsheet
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  
  // Keep track of the first sheet (can't delete all sheets)
  const firstSheet = sheets[0];
  
  // Delete all sheets except the first one
  for (let i = sheets.length - 1; i >= 1; i--) {
    ss.deleteSheet(sheets[i]);
  }
  
  // Rename the first sheet to a temporary name to avoid conflicts
  firstSheet.setName("TempSheet_" + Date.now());
}

function createEmailTrackerTemplate() {
  // Clean up existing sheets first
  deleteAllSheets();
  
  // Get active spreadsheet
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Configuration parameters
  const config = {
    projectName: "Une Femme Wines Beta Pilot",
    startDate: new Date(),
    phases: ["Pre-Engagement", "Week 1", "Week 2", "Weeks 3-7", "Week 8"],
    emailCategories: ["Kickoff", "Scheduling", "Deliverable", "Status Update", "Survey", "Training", "Contract", "Platform Setup", "Sprint"],
    teamMembers: ["Matt", "Danielle", "Alex", "Aaron", "James", "Jameca"],
    primaryColor: "#6B8E23", // Wine green
    secondaryColor: "#8B4513"  // Wine brown
  };
  
  // Create sheets
  createConfigSheet(ss, config);
  createEmailTracker(ss, config);
  createDashboard(ss, config);
  createContactsSheet(ss, config);
  createScheduleOverview(ss, config);
  createFollowUpQueue(ss, config);
  
  // Delete the temporary sheet after all new sheets are created
  const tempSheets = ss.getSheets().filter(sheet => sheet.getName().startsWith("TempSheet_"));
  tempSheets.forEach(sheet => ss.deleteSheet(sheet));
  
  // Set up protection
  protectConfigSheets(ss);
  
  // Initialize dashboard
  refreshDashboard(ss);
  
  // Create custom menu
  createCustomMenu(ss);
  
  console.log("Email Tracker template created successfully!");
}

function createConfigSheet(ss, config) {
  let sheet = ss.insertSheet("Configuration");
  
  // Header styling
  sheet.getRange("A1:K1").merge()
    .setValue("Email Tracker Configuration")
    .setBackground(config.primaryColor)
    .setFontColor("#FFFFFF")
    .setFontSize(14)
    .setFontWeight("bold");
  
  // Project info section
  sheet.getRange("A3").setValue("Project Name:");
  sheet.getRange("B3").setValue(config.projectName);
  sheet.getRange("A4").setValue("Start Date:");
  sheet.getRange("B4").setValue(config.startDate).setNumberFormat("MM/dd/yyyy");
  
  // Phases section
  sheet.getRange("A6").setValue("PROJECT PHASES").setFontWeight("bold");
  sheet.getRange("A7:C7").setValues([["Phase Name", "Start Date", "End Date"]]).setBackground("#E8E8E8");
  
  // Add phases
  let phaseRow = 8;
  config.phases.forEach((phase, index) => {
    sheet.getRange(phaseRow, 1).setValue(phase);
    sheet.getRange(phaseRow, 2).setFormula(`=B4+${index * 7}`).setNumberFormat("MM/dd/yyyy");
    sheet.getRange(phaseRow, 3).setFormula(`=B${phaseRow}+6`).setNumberFormat("MM/dd/yyyy");
    phaseRow++;
  });
  
  // Email categories section
  sheet.getRange("E6").setValue("EMAIL CATEGORIES").setFontWeight("bold");
  sheet.getRange("E7:G7").setValues([["Category", "Default Priority", "SLA (days)"]]).setBackground("#E8E8E8");
  
  let catRow = 8;
  config.emailCategories.forEach(category => {
    sheet.getRange(catRow, 5).setValue(category);
    sheet.getRange(catRow, 6).setValue(category === "Contract" ? "High" : "Medium");
    sheet.getRange(catRow, 7).setValue(category === "Platform Setup" ? 1 : 2);
    catRow++;
  });
  
  // Team members section
  sheet.getRange("I6").setValue("TEAM MEMBERS").setFontWeight("bold");
  sheet.getRange("I7:K7").setValues([["Name", "Email", "Role"]]).setBackground("#E8E8E8");
  
  let teamRow = 8;
  config.teamMembers.forEach(member => {
    sheet.getRange(teamRow, 9).setValue(member);
    sheet.getRange(teamRow, 10).setValue(`${member.toLowerCase()}@happyrobots.ai`);
    sheet.getRange(teamRow, 11).setValue("Team Member");
    teamRow++;
  });
  
  // Add data validation for dropdowns
  createDataValidations(sheet);
  
  // Protect configuration
  const protection = sheet.protect().setDescription('Configuration Sheet');
  protection.setWarningOnly(true);
}

function createEmailTracker(ss, config) {
  let sheet = ss.insertSheet("Email Tracker");
  
  // Headers
  const headers = [
    "ID", "Phase", "Category", "Priority", "From (HR)*", "To (UF)*", "CC*", 
    "Target Date", "Flexibility", "Subject", "Content", "Attachments", 
    "Dependencies", "Body Copy", "Status", "Date Sent", "Response Req?", 
    "Response Due", "Response Rcvd", "Follow-up?", "Notes", "Created", "Modified"
  ];
  
  sheet.getRange("A1:W1").setValues([headers])
    .setBackground(config.primaryColor)
    .setFontColor("#FFFFFF")
    .setFontWeight("bold");
  
  // Add note about multiple selections
  sheet.getRange("A24").setValue("* Multiple selections supported")
    .setFontStyle("italic")
    .setFontColor("#666666");
  sheet.getRange("A25").setValue("Format: 'Name1, Name2, Name3'")
    .setFontStyle("italic")
    .setFontColor("#666666");
  
  // Set column widths
  sheet.setColumnWidth(1, 80);  // ID
  sheet.setColumnWidth(10, 300); // Subject
  sheet.setColumnWidth(11, 400); // Content
  sheet.setColumnWidth(14, 500); // Body Copy
  sheet.setColumnWidth(21, 200); // Notes
  
  // Formulas for row 2
  sheet.getRange("A2").setFormula('=IF(B2<>"","UF-"&TEXT(ROW()-1,"000"),"")');
  sheet.getRange("R2").setFormula('=IF(Q2="Y",WORKDAY(P2,2),"")');
  sheet.getRange("V2").setFormula('=IF(B2<>"",NOW(),"")');
  sheet.getRange("W2").setFormula('=IF(OR(B2<>B1,C2<>C1,D2<>D1,E2<>E1,F2<>F1,G2<>G1,H2<>H1,I2<>I1,J2<>J1,K2<>K1,L2<>L1,M2<>M1,N2<>N1,O2<>O1,P2<>P1,Q2<>Q1,S2<>S1,T2<>T1,U2<>U1),NOW(),W1)');
  
  // Copy formulas down
  sheet.getRange("A2:W2").copyTo(sheet.getRange("A3:W100"));
  
    // Pre-populate with ALL Une Femme emails from comprehensive plan
  const uneFemmeEmails = [
    ["Pre-Engagement", "Kickoff", "High", "Matt", "Zach Pelka", "jameca", new Date(2025, 5, 9), "HARD", "Une Femme AI Program: Confirming Thursday's Discussion + Next Steps", "Subject: Une Femme AI Program: Confirming Thursday's Discussion + Next Steps\n\nHi Zach,\n\nThank you for making time Thursday to finalize our program approach. Your commitment to maintaining operational excellence while scaling to 600k+ cases is exactly where AI can make an immediate impact.\n\nTo confirm our discussion:\n✓ 8-week accelerated timeline (June 16 - August 8, 2025)\n✓ 4-phase approach with Week 2 intensive sprint\n✓ 11 participants across executive and team training\n✓ Focus areas: RNDC execution, demand forecasting, brand evolution\n✓ Investment: $[X] + platform costs ($220-550/month)\n\nImmediate actions needed by Friday, June 13, 2025:\n1. Review attached SOW and confirm via ZohoSign\n2. Verify team groupings (attached spreadsheet)\n3. Confirm Sam's performance metrics for at-risk component\n4. Approve IT security requirements for AI platforms\n\nI'll send calendar holds for all Week 1-2 sessions within 24 hours of SOW signature.\n\nLooking forward to partnering with Une Femme on this transformation.\n\nBest,\nMatt", "", "", "Subject: Une Femme AI Program: Confirming Thursday's Discussion + Next Steps\n\nHi Zach,\n\nThank you for making time Thursday to finalize our program approach. Your commitment to maintaining operational excellence while scaling to 600k+ cases is exactly where AI can make an immediate impact.\n\nTo confirm our discussion:\n✓ 8-week accelerated timeline (June 16 - August 8, 2025)\n✓ 4-phase approach with Week 2 intensive sprint\n✓ 11 participants across executive and team training\n✓ Focus areas: RNDC execution, demand forecasting, brand evolution\n✓ Investment: $[X] + platform costs ($220-550/month)\n\nImmediate actions needed by Friday, June 13, 2025:\n1. Review attached SOW and confirm via ZohoSign\n2. Verify team groupings (attached spreadsheet)\n3. Confirm Sam's performance metrics for at-risk component\n4. Approve IT security requirements for AI platforms\n\nI'll send calendar holds for all Week 1-2 sessions within 24 hours of SOW signature.\n\nLooking forward to partnering with Une Femme on this transformation.\n\nBest,\nMatt", "Ready"],
    ["Pre-Engagement", "Deliverable", "High", "Jameca", "Zach Pelka", "matt sara", new Date(2025, 5, 9), "HARD", "[Action Required] Une Femme AI Program: Complete Documentation Package", "Subject: [Action Required] Une Femme AI Program: Complete Documentation Package\n\nHi Zach,\n\nAs promised, here's the complete documentation package for your AI transformation program:\n\n📎 Attached Documents:\n1. Modified SOW with 4-phase approach (DocuSign ready)\n2. Detailed Week 1-2 Schedule (please verify executive availability)\n3. Team Groupings Spreadsheet (confirm or suggest changes)\n4. AI Platform Requirements & Security Overview\n5. Invoice for initial payment\n6. Intake forms for all 12 participants\n\n🎯 Actions needed by EOD Friday, June 13, 2025:\n□ Sign SOW via ZohoSign\n□ Confirm team groupings or request changes\n□ Forward platform requirements to IT for approval\n□ Distribute intake forms to all participants\n□ Approve invoice for finance processing\n\n📅 Once confirmed, you'll receive:\n- Calendar invitations for all sessions\n- Platform setup instructions for 11 users\n- Welcome packet for participants\n- Slack channel invitation\n\nQuestions on any documents? Happy to jump on a quick call.\n\nBest,\nJameca\n\nP.S. - I've included Sara's email for invoice processing. Let me know if finance needs any additional documentation.", "", "", "Subject: [Action Required] Une Femme AI Program: Complete Documentation Package\n\nHi Zach,\n\nAs promised, here's the complete documentation package for your AI transformation program:\n\n📎 Attached Documents:\n1. Modified SOW with 4-phase approach (DocuSign ready)\n2. Detailed Week 1-2 Schedule (please verify executive availability)\n3. Team Groupings Spreadsheet (confirm or suggest changes)\n4. AI Platform Requirements & Security Overview\n5. Invoice for initial payment\n6. Intake forms for all 12 participants\n\n🎯 Actions needed by EOD Friday, June 13, 2025:\n□ Sign SOW via ZohoSign\n□ Confirm team groupings or request changes\n□ Forward platform requirements to IT for approval\n□ Distribute intake forms to all participants\n□ Approve invoice for finance processing\n\n📅 Once confirmed, you'll receive:\n- Calendar invitations for all sessions\n- Platform setup instructions for 11 users\n- Welcome packet for participants\n- Slack channel invitation\n\nQuestions on any documents? Happy to jump on a quick call.\n\nBest,\nJameca\n\nP.S. - I've included Sara's email for invoice processing. Let me know if finance needs any additional documentation.", "Ready"],
    ["Pre-Engagement", "Scheduling", "Medium", "Jameca", "Zach Pelka", "", new Date(2025, 5, 9), "FLEX", "Quick Confirmation: Training Group Assignments for Une Femme Team", "Subject: Quick Confirmation: Training Group Assignments for Une Femme Team\n\nHi Zach,\n\nBased on our discussion, I've organized the training participants into two functional groups. Please confirm these work with team schedules and dynamics:\n\n**Group 1: Operations/Compliance Focus** (Thursdays 5-6:30pm EST)\n• Evyn Cameron - Winemaking\n• Micha Carter - Compliance  \n• Sara Soares - Finance\n• [New VA - name needed]\n\n**Group 2: Sales/Marketing Focus** (Fridays 1-2:30pm EST)\n• Whitney Wright - Communications\n• Joe Taverrite - National Accounts\n• Kait Skye - Trade Marketing\n• Kimberly Pettit - TX Sales\n\nConsiderations:\n- Groups are intentionally cross-functional for knowledge sharing\n- Times selected to avoid typical wine industry conflicts\n- Can shuffle if someone has a standing conflict\n\nPlease confirm by responding with:\n1. ✓ Groups look good, or\n2. Requested changes\n\nThanks!\nJameca", "", "", "Subject: Quick Confirmation: Training Group Assignments for Une Femme Team\n\nHi Zach,\n\nBased on our discussion, I've organized the training participants into two functional groups. Please confirm these work with team schedules and dynamics:\n\n**Group 1: Operations/Compliance Focus** (Thursdays 5-6:30pm EST)\n• Evyn Cameron - Winemaking\n• Micha Carter - Compliance  \n• Sara Soares - Finance\n• [New VA - name needed]\n\n**Group 2: Sales/Marketing Focus** (Fridays 1-2:30pm EST)\n• Whitney Wright - Communications\n• Joe Taverrite - National Accounts\n• Kait Skye - Trade Marketing\n• Kimberly Pettit - TX Sales\n\nConsiderations:\n- Groups are intentionally cross-functional for knowledge sharing\n- Times selected to avoid typical wine industry conflicts\n- Can shuffle if someone has a standing conflict\n\nPlease confirm by responding with:\n1. ✓ Groups look good, or\n2. Requested changes\n\nThanks!\nJameca", "Ready"],
    ["Pre-Engagement", "Scheduling", "High", "Jameca", "Jen Pelka", "matt", new Date(2025, 5, 9), "HARD", "[Executive Team] Please Block: AI Strategy Sessions Week of June 16", "Subject: [Executive Team] Please Block: AI Strategy Sessions Week of June 16\n\nExecutive Team,\n\nAs we prepare for the AI program launch, Jameca will conduct 45-minute strategy sessions with each of you during Week 1, with Matt or Aaron joining along.\n\n**Book Your Strategy Session:**\n\n🗓️ Click here to schedule: [Calendly Link]\n\nAvailable times (EST):\n• Tuesday-Friday, June 17-20, 2025\n• Morning slots: 10:00am-12:00pm EST\n• Afternoon slots: 2:00pm-5:00pm EST\n\nSession duration: 45 minutes\n\nThese sessions will explore:\n- Your biggest scaling challenges\n- Where AI can deliver immediate ROI\n- Building your personal AI assistant\n\nPlease book your preferred time by EOD tomorrow. You'll receive an automatic calendar invitation upon booking.\n\nBest,\nJameca\n\nP.S. - Sam, we'll specifically focus on how AI can accelerate key account expansion using the Delta model.", "", "", "Subject: [Executive Team] Please Block: AI Strategy Sessions Week of June 16\n\nExecutive Team,\n\nAs we prepare for the AI program launch, Jameca will conduct 45-minute strategy sessions with each of you during Week 1, with Matt or Aaron joining along.\n\n**Book Your Strategy Session:**\n\n🗓️ Click here to schedule: [Calendly Link]\n\nAvailable times (EST):\n• Tuesday-Friday, June 17-20, 2025\n• Morning slots: 10:00am-12:00pm EST\n• Afternoon slots: 2:00pm-5:00pm EST\n\nSession duration: 45 minutes\n\nThese sessions will explore:\n- Your biggest scaling challenges\n- Where AI can deliver immediate ROI\n- Building your personal AI assistant\n\nPlease book your preferred time by EOD tomorrow. You'll receive an automatic calendar invitation upon booking.\n\nBest,\nJameca\n\nP.S. - Sam, we'll specifically focus on how AI can accelerate key account expansion using the Delta model.", "Ready"],
    ["Pre-Engagement", "Platform Setup", "High", "Alex", "Zach Pelka", "matt jameca", new Date(2025, 5, 9), "HARD", "IT Setup Required: AI Platforms for 11 Une Femme Users", "Subject: IT Setup Required: AI Platforms for 11 Une Femme Users\n\nHi Zach,\n\nTo ensure smooth platform access for all participants, we need IT approval for the following:\n\n**Required Platforms:**\n1. ChatGPT Teams ($25/user/month x 11 users = $275/month)\n   - Uses SSO with Une Femme email addresses\n   - Requires domain verification\n   \n2. Claude Teams ($25/user/month x 11 users = $275/month)\n   - Separate login per user\n   - No domain verification needed\n\n**IT Actions Needed by Friday, June 20, 2025:**\n1. Approve domain for ChatGPT Teams\n2. Whitelist both platforms in firewall/security tools\n3. Confirm no VPN conflicts for access\n4. Authorize recurring payment setup\n\n**Timeline:** Users need access by Monday, June 23, 2025 (Week 2 start)\n\nAttached: Platform security documentation\n\n**Need help? Book a quick call:**\n🗓️ Schedule IT consultation: [Calendly Link]\nAvailable times: Mon-Fri 9am-5pm EST (15-minute slots)\n\nThanks,\nAlex", "", "", "Subject: IT Setup Required: AI Platforms for 11 Une Femme Users\n\nHi Zach,\n\nTo ensure smooth platform access for all participants, we need IT approval for the following:\n\n**Required Platforms:**\n1. ChatGPT Teams ($25/user/month x 11 users = $275/month)\n   - Uses SSO with Une Femme email addresses\n   - Requires domain verification\n   \n2. Claude Teams ($25/user/month x 11 users = $275/month)\n   - Separate login per user\n   - No domain verification needed\n\n**IT Actions Needed by Friday, June 20, 2025:**\n1. Approve domain for ChatGPT Teams\n2. Whitelist both platforms in firewall/security tools\n3. Confirm no VPN conflicts for access\n4. Authorize recurring payment setup\n\n**Timeline:** Users need access by Monday, June 23, 2025 (Week 2 start)\n\nAttached: Platform security documentation\n\n**Need help? Book a quick call:**\n🗓️ Schedule IT consultation: [Calendly Link]\nAvailable times: Mon-Fri 9am-5pm EST (15-minute slots)\n\nThanks,\nAlex", "Ready"]
  ];
}