/**
 * Enhanced Une Femme Email Tracker with Dependency Management
 * Addresses: Dependencies, Flexibility Indicators, Unique IDs
 */

function initializeEnhancedTemplate() {
  createEnhancedEmailTracker();
}

function createEnhancedEmailTracker() {
  // Clean up existing sheets first
  deleteAllSheets();
  
  // Get active spreadsheet
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Enhanced configuration parameters
  const config = {
    projectName: "Une Femme Wines Beta Pilot - Enhanced",
    startDate: new Date(2024, 11, 9), // December 9, 2024
    phases: ["Pre-Engagement", "Week 1", "Week 2", "Weeks 3-7", "Week 8", "Internal"],
    emailCategories: ["Kickoff", "Scheduling", "Deliverable", "Status Update", "Survey", "Training", "Contract", "Platform Setup", "Sprint", "Follow-up", "Assessment"],
    teamMembers: ["Matt", "Danielle", "Alex", "Aaron", "James", "Jameca"],
    flexibilityLevels: ["HARD", "FLEX", "ASAP", "CRITICAL"],
    stakeholderPriorities: ["Executive", "Team", "Internal"],
    primaryColor: "#6B8E23", // Wine green
    secondaryColor: "#8B4513"  // Wine brown
  };
  
  // Create enhanced sheets
  createConfigSheet(ss, config);
  createEnhancedEmailTracker(ss, config);
  createDependencyDashboard(ss, config);
  createContactsSheet(ss, config);
  createScheduleOverview(ss, config);
  createFollowUpQueue(ss, config);
  createDependencyMap(ss, config);
  
  // Delete temporary sheets
  const tempSheets = ss.getSheets().filter(sheet => sheet.getName().startsWith("TempSheet_"));
  tempSheets.forEach(sheet => ss.deleteSheet(sheet));
  
  // Set up protection and automation
  protectConfigSheets(ss);
  initializeDependencyValidation(ss);
  createEnhancedMenu(ss);
  
  console.log("Enhanced Email Tracker created successfully!");
}

function createEnhancedEmailTracker(ss, config) {
  let sheet = ss.insertSheet("Enhanced Email Tracker");
  
  // Enhanced headers with dependency management
  const headers = [
    "ID", "Phase", "Category", "Priority", "From (HR)*", "To (UF)*", "CC*", 
    "Target Date", "Flexibility", "Stakeholder Priority", "Subject", "Content", 
    "Attachments", "Prerequisites", "Blocks", "Dependency Status", "Sequence Order",
    "Body Copy", "Status", "Date Sent", "Response Req?", "Response Due", 
    "Response Rcvd", "Follow-up?", "Auto-Send", "Notes", "Created", "Modified"
  ];
  
  sheet.getRange("A1:AB1").setValues([headers])
    .setBackground(config.primaryColor)
    .setFontColor("#FFFFFF")
    .setFontWeight("bold");
  
  // Set column widths for better visibility
  sheet.setColumnWidth(1, 80);   // ID
  sheet.setColumnWidth(11, 300); // Subject
  sheet.setColumnWidth(12, 400); // Content
  sheet.setColumnWidth(14, 150); // Prerequisites
  sheet.setColumnWidth(15, 150); // Blocks
  sheet.setColumnWidth(16, 120); // Dependency Status
  sheet.setColumnWidth(18, 500); // Body Copy
  sheet.setColumnWidth(26, 200); // Notes
  
  // Enhanced formulas with dependency checking
  sheet.getRange("A2").setFormula('=IF(B2<>"","UF-"&TEXT(ROW()-1,"000"),"")');
  sheet.getRange("P2").setFormula('=IF(AND(B2<>"",N2<>""),checkDependencies(N2,S:S),"Ready")');
  sheet.getRange("V2").setFormula('=IF(Q2="Y",WORKDAY(T2,2),"")');
  sheet.getRange("AA2").setFormula('=IF(B2<>"",NOW(),"")');
  sheet.getRange("AB2").setFormula('=IF(OR(B2<>B1,C2<>C1,D2<>D1,E2<>E1,F2<>F1,G2<>G1,H2<>H1,I2<>I1,J2<>J1,K2<>K1,L2<>L1,M2<>M1,N2<>N1,O2<>O1,P2<>P1,Q2<>Q1,R2<>R1,S2<>S1,T2<>T1,U2<>U1,V2<>V1,W2<>W1,X2<>X1,Y2<>Y1,Z2<>Z1),NOW(),AB1)');
  
  // Copy formulas down
  sheet.getRange("A2:AB2").copyTo(sheet.getRange("A3:AB150"));
  
  // Pre-populate with Une Femme emails with proper IDs and dependencies
  const uneFemmeEmails = getUneFemmeEmailsWithDependencies();
  
  // Populate data starting from row 2
  if (uneFemmeEmails.length > 0) {
    const emailRange = sheet.getRange(2, 2, uneFemmeEmails.length, uneFemmeEmails[0].length);
    emailRange.setValues(uneFemmeEmails);
  }
  
  // Set up enhanced data validations
  setupEnhancedValidations(sheet, ss, config);
  
  // Add conditional formatting for dependencies
  addDependencyConditionalFormatting(sheet);
  
  // Add instructional notes
  addInstructionalNotes(sheet);
}

function getUneFemmeEmailsWithDependencies() {
  // Pre-Engagement emails (UF-001 to UF-008)
  const preEngagement = [
    ["Pre-Engagement", "Contract", "High", "Matt", "Zach Pelka", "Jameca", new Date(2024, 11, 9), "HARD", "Executive", "Une Femme AI Program: Confirming Thursday's Discussion + Next Steps", "SOW confirmation, timeline, next steps", "SOW, timeline, requirements", "", "", "Ready", 1, "Hi Zach,\n\nThank you for making time Thursday to finalize our program approach...", "Ready"],
    ["Pre-Engagement", "Documentation", "High", "Jameca", "Zach Pelka", "Matt, Sara", new Date(2024, 11, 10), "HARD", "Executive", "[Action Required] Une Femme AI Program: Complete Documentation Package", "Complete documentation package", "All project docs", "UF-001", "UF-003,UF-004,UF-005", "Blocked", 2, "Hi Zach,\n\nAs promised, here's the complete documentation package...", "Draft"],
    ["Pre-Engagement", "Logistics", "Medium", "Jameca", "Zach Pelka", "", new Date(2024, 11, 11), "FLEX", "Executive", "Quick Confirmation: Training Group Assignments for Une Femme Team", "Team grouping confirmation", "Group assignments", "UF-002", "UF-007", "Blocked", 3, "Hi Zach,\n\nBased on our discussion, I've organized the training participants...", "Draft"],
    ["Pre-Engagement", "Calendar", "High", "Jameca", "Jen, Zach, Sam, Thomas", "Matt", new Date(2024, 11, 11), "HARD", "Executive", "[Executive Team] Please Block: AI Strategy Sessions Week of December 16", "Executive calendar holds", "Calendly links", "UF-002", "UF-010,UF-011,UF-012,UF-013", "Blocked", 4, "Executive Team,\n\nAs we prepare for the AI program launch...", "Draft"],
    ["Pre-Engagement", "Platform Setup", "High", "Alex", "Zach Pelka", "Matt, Jameca", new Date(2024, 11, 12), "HARD", "Executive", "IT Setup Required: AI Platforms for 11 Une Femme Users", "Platform requirements", "Security docs", "UF-002", "UF-025", "Blocked", 5, "Hi Zach,\n\nTo ensure smooth platform access for all participants...", "Draft"],
    ["Pre-Engagement", "Financial", "Medium", "Sheera", "Sara Soares", "Zach, Matt", new Date(2024, 11, 12), "FLEX", "Team", "Une Femme AI Program: Invoice #1247 for Initial Payment", "Invoice processing", "Invoice", "UF-002", "", "Blocked", 6, "Hi Sara,\n\nPer Zach's approval, please find attached Invoice #1247...", "Draft"],
    ["Pre-Engagement", "Program Welcome", "Medium", "Jameca", "All Team", "Matt", new Date(2024, 11, 13), "FLEX", "Team", "Welcome to Une Femme's AI Transformation Journey!", "Welcome & intake forms", "Intake forms", "UF-001,UF-003", "UF-014", "Blocked", 7, "Team Une Femme,\n\nCongratulations on being selected for this groundbreaking AI program...", "Draft"],
    ["Pre-Engagement", "Technical Setup", "Low", "Alex", "All Team", "", new Date(2024, 11, 13), "ASAP", "Team", "[Slack Invite] Join #unefemme-ai-program Channel", "Slack setup", "Slack invite", "UF-007", "", "Blocked", 8, "Hi everyone,\n\nYour dedicated Slack channel is ready...", "Draft"]
  ];

  // Week 1 emails (UF-009 to UF-019)
  const week1 = [
    ["Week 1", "Kickoff", "High", "Jameca", "All Team", "", new Date(2024, 11, 16), "HARD", "Team", "[Starting in 2 Hours] Une Femme AI Kickoff - Ready to Transform?", "Kickoff reminder", "Kickoff deck", "UF-007", "UF-014", "Ready", 1, "Good morning, Team!\n\nOur AI transformation journey begins in 2 hours...", "Ready"],
    ["Week 1", "Scheduling", "High", "Jameca", "Jen Pelka", "Aaron", new Date(2024, 11, 17), "HARD", "Executive", "[Calendar] Your AI Strategy Session - Tuesday at 1pm EST", "Executive interview", "Interview guide", "UF-004,UF-009", "UF-017", "Ready", 2, "Hi Jen,\n\nConfirming your AI strategy session with Jameca...", "Ready"],
    ["Week 1", "Scheduling", "High", "Jameca", "Zach Pelka", "Aaron", new Date(2024, 11, 18), "HARD", "Executive", "[Calendar] Your AI Strategy Session - Wednesday at 2pm EST", "Executive interview", "Interview guide", "UF-004,UF-009", "UF-017", "Ready", 3, "Hi Zach,\n\nConfirming your AI strategy session with Jameca...", "Ready"],
    ["Week 1", "Scheduling", "High", "Jameca", "Sam Barnes", "Aaron", new Date(2024, 11, 19), "HARD", "Executive", "[Calendar] Your AI Strategy Session - Thursday at 11am EST", "Executive interview", "Interview guide", "UF-004,UF-009", "UF-017", "Ready", 4, "Hi Sam,\n\nConfirming your AI strategy session with Jameca...", "Ready"],
    ["Week 1", "Scheduling", "High", "Jameca", "Thomas Hartman", "Aaron", new Date(2024, 11, 20), "HARD", "Executive", "[Calendar] Your AI Strategy Session - Friday at 3pm EST", "Executive interview", "Interview guide", "UF-004,UF-009", "UF-017", "Ready", 5, "Hi Thomas,\n\nConfirming your AI strategy session with Jameca...", "Ready"],
    ["Week 1", "Survey", "High", "Jameca", "All Team", "", new Date(2024, 11, 17), "HARD", "Team", "🍷 Your Input Shapes Une Femme's AI Future (10 min survey)", "Survey launch", "Survey link", "UF-009", "UF-015,UF-016", "Ready", 6, "Hi Team,\n\nYesterday's kickoff energy was fantastic...", "Ready"],
    ["Week 1", "Survey", "Medium", "Jameca", "Non-responders", "", new Date(2024, 11, 18), "FLEX", "Team", "⏰ 24 Hours Left: Une Femme AI Survey Closes Tomorrow", "Survey reminder", "", "UF-014", "UF-016", "Ready", 7, "Hi [Name],\n\nQuick reminder - we need your insights...", "Ready"],
    ["Week 1", "Survey", "High", "Matt", "Final non-responders", "", new Date(2024, 11, 19), "CRITICAL", "Team", "[FINAL HOURS] Your voice matters - Une Femme AI Survey", "Final survey push", "", "UF-015", "", "Ready", 8, "Hi [Name],\n\nI know you're busy, but your input is critical...", "Ready"],
    ["Week 1", "Follow-up", "Low", "Jameca", "Individual Executives", "Matt/Aaron", new Date(2024, 11, 17), "ASAP", "Executive", "Thank You + Key Takeaways from Our AI Strategy Session", "Interview follow-up", "Takeaways", "UF-010,UF-011,UF-012,UF-013", "", "Ready", 9, "Hi [Executive],\n\nThank you for the candid conversation yesterday...", "Ready"],
    ["Week 1", "Status Update", "Medium", "Matt", "Zach Pelka", "Project Team", new Date(2024, 11, 20), "FLEX", "Executive", "[Week 1 Update] Une Femme AI Program: On Track", "Progress update", "Status report", "UF-010,UF-011,UF-012,UF-013,UF-014", "UF-019", "Ready", 10, "Hi Zach,\n\nQuick Thursday update on our Week 1 discovery...", "Ready"],
    ["Week 1", "Preparation", "High", "Jameca", "All Team", "", new Date(2024, 11, 20), "HARD", "Team", "[Action Required] Prepare for Monday's AI Launch - 3 Quick Steps", "Week 2 prep", "Instructions", "UF-018", "UF-020", "Ready", 11, "Team,\n\nIncredible Week 1! Your insights are shaping an exciting Week 2...", "Ready"]
  ];

  // Week 2 emails (UF-020 to UF-029)
  const week2 = [
    ["Week 2", "Launch", "High", "Matt", "All Team", "", new Date(2024, 11, 23), "HARD", "Team", "🚀 LAUNCH DAY: Your AI Transformation Begins Now!", "Launch announcement", "", "UF-019", "UF-021,UF-022,UF-023", "Ready", 1, "Good morning, Une Femme AI Pioneers...", "Ready"],
    ["Week 2", "Session Reminder", "High", "Jameca", "Executives", "", new Date(2024, 11, 23), "HARD", "Executive", "[Starting in 30 min] Executive AI Findings - Link Inside", "Session reminder", "Presentation", "UF-020", "", "Ready", 2, "Hi Executives,\n\nYour session starts in 30 minutes...", "Ready"],
    ["Week 2", "Session Reminder", "High", "Jameca", "Sprint Team", "", new Date(2024, 11, 23), "HARD", "Team", "[Starting in 30 min] AI Sprint Planning - Link Inside", "Session reminder", "Miro board", "UF-020", "UF-026", "Ready", 3, "Hi Sprint Team,\n\nYour session starts in 30 minutes...", "Ready"],
    ["Week 2", "Session Reminder", "High", "Jameca", "All Team", "", new Date(2024, 11, 23), "HARD", "Team", "[Starting in 30 min] All-Team AI Launch - Link Inside", "Session reminder", "", "UF-020", "UF-024", "Ready", 4, "Hi Team,\n\nOur big launch session starts in 30 minutes...", "Ready"],
    ["Week 2", "Session Reminder", "High", "Jameca", "Group 1", "", new Date(2024, 11, 23), "HARD", "Team", "[Starting in 30 min] AI Training - Group 1 - Link Inside", "Training reminder", "", "UF-023,UF-005", "", "Ready", 5, "Hi Group 1,\n\nYour first AI training session starts in 30 minutes...", "Ready"],
    ["Week 2", "Technical Support", "High", "Alex", "Individual user", "", new Date(2024, 11, 23), "CRITICAL", "Team", "⚡ Quick Fix: AI Platform Access Issues", "Platform troubleshooting", "Setup guide", "UF-005", "", "Ready", 6, "Hi [Name],\n\nI noticed you haven't confirmed platform access yet...", "Ready"],
    ["Week 2", "Sprint Update", "Medium", "Matt", "Sprint Team", "Jameca", new Date(2024, 11, 24), "FLEX", "Team", "[Sprint Update] Day 2: RNDC Scorecard Taking Shape!", "Daily progress", "", "UF-022", "UF-028", "Ready", 7, "Sprint Team,\n\nExcellent progress on Day 2...", "Ready"],
    ["Week 2", "Training Prep", "High", "Jameca", "Group participants", "", new Date(2024, 11, 25), "HARD", "Team", "[Group 1] Your First AI Training Starts Tomorrow - Setup Instructions", "Training preparation", "Setup guide", "UF-024", "", "Ready", 8, "Hi Operations Team,\n\nExcited for your first AI training tomorrow...", "Ready"],
    ["Week 2", "Demo", "High", "Matt", "All Team", "", new Date(2024, 11, 25), "HARD", "Team", "🎉 SEE IT LIVE: Your RNDC Automation Demo Today at 2pm", "Demo announcement", "", "UF-026", "", "Ready", 9, "Team Une Femme,\n\nIn just 3 days, we've built something remarkable...", "Ready"],
    ["Week 2", "Weekly Summary", "Medium", "Matt", "All Team", "Jameca", new Date(2024, 11, 27), "FLEX", "Team", "Week 2 Complete: You've Launched an AI Transformation! 🚀", "Week wrap-up", "Summary report", "UF-028", "", "Ready", 10, "Une Femme Team,\n\nWhat a week! Let's celebrate what you've accomplished...", "Ready"]
  ];

  // Combine all arrays and return
  return [...preEngagement, ...week1, ...week2];
}

function setupEnhancedValidations(sheet, ss, config) {
  const configSheet = ss.getSheetByName("Configuration");
  
  // Phase dropdown
  const phaseRange = sheet.getRange("B30:B150");
  phaseRange.setDataValidation(
    SpreadsheetApp.newDataValidation()
      .setAllowInvalid(false)
      .requireValueInList(config.phases)
      .build()
  );
  
  // Category dropdown  
  const categoryRange = sheet.getRange("C30:C150");
  categoryRange.setDataValidation(
    SpreadsheetApp.newDataValidation()
      .setAllowInvalid(false)
      .requireValueInList(config.emailCategories)
      .build()
  );
  
  // Priority dropdown
  const priorityRange = sheet.getRange("D30:D150");
  priorityRange.setDataValidation(
    SpreadsheetApp.newDataValidation()
      .setAllowInvalid(false)
      .requireValueInList(["High", "Medium", "Low"])
      .build()
  );
  
  // Enhanced Flexibility dropdown
  const flexibilityRange = sheet.getRange("I30:I150");
  flexibilityRange.setDataValidation(
    SpreadsheetApp.newDataValidation()
      .setAllowInvalid(false)
      .requireValueInList(config.flexibilityLevels)
      .setHelpText("HARD=Immovable, FLEX=±2 days, ASAP=Send immediately, CRITICAL=Emergency")
      .build()
  );
  
  // Stakeholder Priority dropdown
  const stakeholderRange = sheet.getRange("J30:J150");
  stakeholderRange.setDataValidation(
    SpreadsheetApp.newDataValidation()
      .setAllowInvalid(false)
      .requireValueInList(config.stakeholderPriorities)
      .setHelpText("Executive=4h SLA, Team=8h SLA, Internal=Weekly")
      .build()
  );
  
  // Status dropdown
  const statusRange = sheet.getRange("S30:S150");
  statusRange.setDataValidation(
    SpreadsheetApp.newDataValidation()
      .setAllowInvalid(false)
      .requireValueInList(["Draft", "Ready", "Sent", "Confirmed", "No Response", "Cancelled"])
      .build()
  );
  
  // Dependency Status dropdown
  const depStatusRange = sheet.getRange("P30:P150");
  depStatusRange.setDataValidation(
    SpreadsheetApp.newDataValidation()
      .setAllowInvalid(false)
      .requireValueInList(["Ready", "Blocked", "Waiting", "Complete"])
      .setHelpText("Ready=Can send, Blocked=Missing prerequisites, Waiting=Scheduled, Complete=Sent")
      .build()
  );
  
  // Y/N dropdowns
  ["U", "X", "Z"].forEach(col => {
    const range = sheet.getRange(`${col}30:${col}150`);
    range.setDataValidation(
      SpreadsheetApp.newDataValidation()
        .setAllowInvalid(false)
        .requireValueInList(["Y", "N"])
        .build()
    );
  });
}

function addDependencyConditionalFormatting(sheet) {
  const rules = [];
  
  // Dependency status color coding
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Blocked")
      .setBackground("#FFCDD2")
      .setFontColor("#C62828")
      .setRanges([sheet.getRange("P:P")])
      .build()
  );
  
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Ready")
      .setBackground("#C8E6C9")
      .setFontColor("#2E7D32")
      .setRanges([sheet.getRange("P:P")])
      .build()
  );
  
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Waiting")
      .setBackground("#FFF9C4")
      .setFontColor("#F57F17")
      .setRanges([sheet.getRange("P:P")])
      .build()
  );
  
  // Flexibility level formatting
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("CRITICAL")
      .setBackground("#B71C1C")
      .setFontColor("#FFFFFF")
      .setRanges([sheet.getRange("I:I")])
      .build()
  );
  
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("HARD")
      .setBackground("#FFCDD2")
      .setFontColor("#C62828")
      .setRanges([sheet.getRange("I:I")])
      .build()
  );
  
  // Stakeholder priority formatting
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Executive")
      .setBackground("#E1F5FE")
      .setFontColor("#0277BD")
      .setRanges([sheet.getRange("J:J")])
      .build()
  );
  
  sheet.setConditionalFormatRules(rules);
}

function createDependencyDashboard(ss, config) {
  let sheet = ss.insertSheet("Dependency Dashboard");
  
  // Title
  sheet.getRange("A1:L1").merge()
    .setValue("Email Dependency & Flow Management Dashboard")
    .setBackground(config.primaryColor)
    .setFontColor("#FFFFFF")
    .setFontSize(16)
    .setFontWeight("bold")
    .setHorizontalAlignment("center");
  
  // Dependency Status Summary
  sheet.getRange("A3").setValue("DEPENDENCY STATUS OVERVIEW").setFontWeight("bold");
  
  const dependencyMetrics = [
    ["Ready to Send:", '=COUNTIF(\'Enhanced Email Tracker\'!P:P,"Ready")'],
    ["Blocked (Missing Prerequisites):", '=COUNTIF(\'Enhanced Email Tracker\'!P:P,"Blocked")'],
    ["Waiting (Scheduled):", '=COUNTIF(\'Enhanced Email Tracker\'!P:P,"Waiting")'],
    ["Dependency Compliance Rate:", '=IFERROR(COUNTIF(\'Enhanced Email Tracker\'!P:P,"Ready")/COUNTA(\'Enhanced Email Tracker\'!P:P),0)']
  ];
  
  let metricRow = 4;
  dependencyMetrics.forEach(metric => {
    sheet.getRange(metricRow, 1).setValue(metric[0]);
    sheet.getRange(metricRow, 3).setFormula(metric[1]);
    if (metric[0].includes("Rate")) {
      sheet.getRange(metricRow, 3).setNumberFormat("0%");
    }
    metricRow++;
  });
  
  // Critical Path Analysis
  sheet.getRange("A9").setValue("CRITICAL PATH ANALYSIS").setFontWeight("bold");
  sheet.getRange("A10:F10").setValues([["Email ID", "Subject", "Target Date", "Status", "Flexibility", "Risk Level"]]).setBackground("#E8E8E8");
  
  sheet.getRange("A11").setFormula('=IFERROR(QUERY(\'Enhanced Email Tracker\'!A:AB,"SELECT A,K,H,S,I WHERE I=\'HARD\' OR I=\'CRITICAL\' ORDER BY H",0),"No critical path items")');
  
  // Blocked Items Alert
  sheet.getRange("H3").setValue("🚨 BLOCKED ITEMS REQUIRING ATTENTION").setFontWeight("bold").setFontColor("#C62828");
  sheet.getRange("H4:L4").setValues([["Email ID", "Subject", "Missing Prerequisites", "Target Date", "Days Overdue"]]).setBackground("#FFCDD2");
  
  sheet.getRange("H5").setFormula('=IFERROR(QUERY(\'Enhanced Email Tracker\'!A:AB,"SELECT A,K,N,H WHERE P=\'Blocked\' ORDER BY H",0),"No blocked items")');
  
  // Flexibility Distribution
  sheet.getRange("A18").setValue("FLEXIBILITY DISTRIBUTION").setFontWeight("bold");
  
  const flexibilityChart = [
    ["Flexibility Level", "Count", "Percentage"],
    ["CRITICAL", '=COUNTIF(\'Enhanced Email Tracker\'!I:I,"CRITICAL")', '=B19/SUM(B19:B22)'],
    ["HARD", '=COUNTIF(\'Enhanced Email Tracker\'!I:I,"HARD")', '=B20/SUM(B19:B22)'],
    ["FLEX", '=COUNTIF(\'Enhanced Email Tracker\'!I:I,"FLEX")', '=B21/SUM(B19:B22)'],
    ["ASAP", '=COUNTIF(\'Enhanced Email Tracker\'!I:I,"ASAP")', '=B22/SUM(B19:B22)']
  ];
  
  sheet.getRange("A19:C22").setValues(flexibilityChart);
  sheet.getRange("C20:C22").setNumberFormat("0%");
  
  // Next 7 Days Schedule
  sheet.getRange("H18").setValue("NEXT 7 DAYS SCHEDULE").setFontWeight("bold");
  sheet.getRange("H19:L19").setValues([["Date", "Email ID", "Subject", "Flexibility", "Prerequisites Met?"]]).setBackground("#E8E8E8");
  
  sheet.getRange("H20").setFormula('=IFERROR(QUERY(\'Enhanced Email Tracker\'!A:AB,"SELECT H,A,K,I,P WHERE H >= date \'"&TEXT(TODAY(),"yyyy-mm-dd")&"\' AND H <= date \'"&TEXT(TODAY()+7,"yyyy-mm-dd")&"\' ORDER BY H",0),"No emails scheduled in next 7 days")');
}

function createDependencyMap(ss, config) {
  let sheet = ss.insertSheet("Dependency Flow Map");
  
  // Title
  sheet.getRange("A1:P1").merge()
    .setValue("Email Flow Dependencies - Visual Map")
    .setBackground(config.secondaryColor)
    .setFontColor("#FFFFFF")
    .setFontSize(16)
    .setFontWeight("bold")
    .setHorizontalAlignment("center");
  
  // Instructions
  sheet.getRange("A3").setValue("DEPENDENCY MAP LEGEND").setFontWeight("bold");
  sheet.getRange("A4").setValue("→ Indicates dependency flow (A → B means A must complete before B can start)");
  sheet.getRange("A5").setValue("🔴 Critical path items (HARD/CRITICAL deadlines)");
  sheet.getRange("A6").setValue("🟡 Flexible items (FLEX deadlines)");
  sheet.getRange("A7").setValue("🟢 Ready to proceed (ASAP items)");
  
  // Pre-Engagement Flow
  sheet.getRange("A9").setValue("PRE-ENGAGEMENT FLOW").setFontWeight("bold").setBackground("#E8E8E8");
  const preEngagementFlow = [
    "UF-001 (SOW Agreement) → UF-002 (Documentation)",
    "UF-002 (Documentation) → UF-003 (Team Groupings)",
    "UF-002 (Documentation) → UF-004 (Executive Calendars)",
    "UF-002 (Documentation) → UF-005 (Platform Setup)",
    "UF-001 + UF-003 → UF-007 (Welcome Email)",
    "UF-007 (Welcome) → UF-008 (Slack Setup)"
  ];
  
  preEngagementFlow.forEach((flow, index) => {
    sheet.getRange(10 + index, 1).setValue(flow);
  });
  
  // Week 1 Flow
  sheet.getRange("A17").setValue("WEEK 1 FLOW").setFontWeight("bold").setBackground("#E8E8E8");
  const week1Flow = [
    "UF-007 (Welcome) → UF-009 (Kickoff)",
    "UF-004 + UF-009 → UF-010-013 (Executive Interviews)",
    "UF-009 (Kickoff) → UF-014 (Survey Launch)",
    "UF-014 (Survey) → UF-015 (Survey Reminders)",
    "UF-015 (Reminders) → UF-016 (Final Push)",
    "UF-010-013 (Interviews) → UF-017 (Thank You)",
    "UF-010-013 + UF-014 → UF-018 (Status Update)",
    "UF-018 (Update) → UF-019 (Week 2 Prep)"
  ];
  
  week1Flow.forEach((flow, index) => {
    sheet.getRange(18 + index, 1).setValue(flow);
  });
  
  // Week 2 Flow
  sheet.getRange("A27").setValue("WEEK 2 LAUNCH FLOW").setFontWeight("bold").setBackground("#E8E8E8");
  const week2Flow = [
    "UF-019 (Prep) → UF-020 (Launch Day)",
    "UF-020 (Launch) → UF-021-023 (Session Reminders)",
    "UF-005 + UF-023 → UF-024 (Group Training)",
    "UF-005 (Platform) → UF-025 (Troubleshooting)",
    "UF-022 (Sprint Planning) → UF-026 (Sprint Updates)",
    "UF-026 (Updates) → UF-028 (Demo)",
    "UF-028 (Demo) → UF-029 (Week Wrap-up)"
  ];
  
  week2Flow.forEach((flow, index) => {
    sheet.getRange(28 + index, 1).setValue(flow);
  });
  
  // Critical Path Highlight
  sheet.getRange("H9").setValue("⚠️ CRITICAL PATH ITEMS").setFontWeight("bold").setFontColor("#C62828");
  const criticalPath = [
    "UF-001: Contract signature blocks everything",
    "UF-005: Platform setup blocks all training",
    "UF-009: Kickoff enables all Week 1 activities",
    "UF-019: Week 2 prep enables launch sequence",
    "UF-020: Launch day starts intensive week"
  ];
  
  criticalPath.forEach((item, index) => {
    sheet.getRange(10 + index, 8).setValue(item).setFontColor("#C62828");
  });
}

function initializeDependencyValidation(ss) {
  // Create custom functions for dependency checking
  const sheet = ss.getSheetByName("Enhanced Email Tracker");
  
  // Set up triggers for automatic dependency validation
  const trigger = ScriptApp.newTrigger('validateDependenciesOnEdit')
    .onEdit()
    .create();
}

function validateDependenciesOnEdit(e) {
  const sheet = e.source.getActiveSheet();
  if (sheet.getName() !== "Enhanced Email Tracker") return;
  
  const editedRange = e.range;
  const editedColumn = editedRange.getColumn();
  
  // If Prerequisites (column 14) or Status (column 19) was edited, validate dependencies
  if (editedColumn === 14 || editedColumn === 19) {
    updateDependencyStatus(sheet);
  }
}

function updateDependencyStatus(sheet) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Find column indices
  const idCol = headers.indexOf("ID");
  const prerequisitesCol = headers.indexOf("Prerequisites");
  const statusCol = headers.indexOf("Status");
  const dependencyStatusCol = headers.indexOf("Dependency Status");
  
  // Update dependency status for each row
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const emailId = row[idCol];
    const prerequisites = row[prerequisitesCol];
    const currentStatus = row[statusCol];
    
    if (!emailId || !prerequisites) {
      sheet.getRange(i + 1, dependencyStatusCol + 1).setValue("Ready");
      continue;
    }
    
    // Check if all prerequisites are met
    const prereqIds = prerequisites.split(',').map(id => id.trim());
    const allPrereqsMet = prereqIds.every(prereqId => {
      const prereqRow = data.find(row => row[idCol] === prereqId);
      return prereqRow && prereqRow[statusCol] === "Sent";
    });
    
    let newDependencyStatus;
    if (currentStatus === "Sent") {
      newDependencyStatus = "Complete";
    } else if (allPrereqsMet) {
      newDependencyStatus = "Ready";
    } else {
      newDependencyStatus = "Blocked";
    }
    
    sheet.getRange(i + 1, dependencyStatusCol + 1).setValue(newDependencyStatus);
  }
}

function addInstructionalNotes(sheet) {
  // Add helpful notes at the bottom
  const noteStartRow = 160;
  
  sheet.getRange(noteStartRow, 1).setValue("📋 USAGE INSTRUCTIONS").setFontWeight("bold").setBackground("#E3F2FD");
  
  const instructions = [
    "",
    "Dependencies & Sequencing:",
    "• Prerequisites: List email IDs that must be sent first (comma-separated)",
    "• Blocks: List email IDs that this email blocks from sending",
    "• Dependency Status: Automatically calculated based on prerequisite completion",
    "",
    "Flexibility Levels:",
    "• CRITICAL: Emergency override, send immediately",
    "• HARD: Immovable deadline, no flexibility",
    "• FLEX: Adjustable within ±2 business days",
    "• ASAP: Send as soon as trigger conditions are met",
    "",
    "Stakeholder Priorities:",
    "• Executive: 4-hour response SLA, highest priority",
    "• Team: 8-hour response SLA, standard priority",
    "• Internal: Weekly updates, lowest priority",
    "",
    "Auto-Send Options:",
    "• Y: Email can be automatically sent when dependencies are met",
    "• N: Requires manual review before sending"
  ];
  
  instructions.forEach((instruction, index) => {
    sheet.getRange(noteStartRow + 1 + index, 1).setValue(instruction);
  });
}

function createEnhancedMenu(ss) {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Enhanced Email Tracker')
    .addItem('🔄 Update All Dependencies', 'updateAllDependencies')
    .addItem('📊 Refresh Dependency Dashboard', 'refreshDependencyDashboard')
    .addItem('⚠️ Check Critical Path', 'analyzeCriticalPath')
    .addItem('🚨 Alert on Blocked Items', 'alertBlockedItems')
    .addSeparator()
    .addItem('📈 Generate Dependency Report', 'generateDependencyReport')
    .addItem('🔍 Validate All Prerequisites', 'validateAllPrerequisites')
    .addItem('📅 Smart Schedule Optimizer', 'optimizeSchedule')
    .addSeparator()
    .addItem('🔧 Debug: Fix Duplicate IDs', 'fixDuplicateIds')
    .addItem('🔧 Debug: Reset Dependencies', 'resetAllDependencies')
    .addToUi();
}

function updateAllDependencies() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Enhanced Email Tracker");
  updateDependencyStatus(sheet);
  
  SpreadsheetApp.getUi().alert('Dependencies Updated', 'All dependency statuses have been recalculated.', SpreadsheetApp.getUi().ButtonSet.OK);
}

function alertBlockedItems() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Enhanced Email Tracker");
  const data = sheet.getDataRange().getValues();
  
  const blockedItems = data.filter(row => row[15] === "Blocked" && row[0] !== "ID"); // Column P (Dependency Status)
  
  if (blockedItems.length === 0) {
    SpreadsheetApp.getUi().alert('No Blocked Items', 'All emails are ready to proceed!', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }
  
  let alertMessage = `🚨 ${blockedItems.length} emails are currently blocked:\n\n`;
  blockedItems.forEach(item => {
    alertMessage += `• ${item[0]}: ${item[10]} (Missing: ${item[13]})\n`;
  });
  
  SpreadsheetApp.getUi().alert('Blocked Items Alert', alertMessage, SpreadsheetApp.getUi().ButtonSet.OK);
}

function analyzeCriticalPath() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Enhanced Email Tracker");
  const data = sheet.getDataRange().getValues();
  
  const criticalItems = data.filter(row => 
    (row[8] === "HARD" || row[8] === "CRITICAL") && // Flexibility column
    row[18] !== "Sent" && // Status column
    row[0] !== "ID"
  );
  
  let message = `🎯 Critical Path Analysis:\n\n`;
  message += `Critical items requiring attention: ${criticalItems.length}\n\n`;
  
  criticalItems.forEach(item => {
    const targetDate = new Date(item[7]);
    const today = new Date();
    const daysUntil = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
    
    let urgency = "🟢";
    if (daysUntil < 0) urgency = "🔴 OVERDUE";
    else if (daysUntil <= 1) urgency = "🟡 DUE SOON";
    
    message += `${urgency} ${item[0]}: ${item[10]} (${daysUntil} days)\n`;
  });
  
  SpreadsheetApp.getUi().alert('Critical Path Analysis', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

function fixDuplicateIds() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Enhanced Email Tracker");
  
  // This function would reassign all IDs to be sequential
  // Implementation would depend on specific requirements
  
  SpreadsheetApp.getUi().alert('Fix Duplicate IDs', 'This function would reassign all email IDs to be unique and sequential. Implementation depends on your specific requirements.', SpreadsheetApp.getUi().ButtonSet.OK);
}

// Additional utility functions for the enhanced system
function validateAllPrerequisites() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  updateAllDependencies();
  alertBlockedItems();
}

function refreshDependencyDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dashboard = ss.getSheetByName("Dependency Dashboard");
  
  // Force recalculation
  SpreadsheetApp.flush();
  
  SpreadsheetApp.getUi().alert('Dashboard Refreshed', 'Dependency dashboard has been updated with latest data.', SpreadsheetApp.getUi().ButtonSet.OK);
}

function optimizeSchedule() {
  SpreadsheetApp.getUi().alert('Smart Schedule Optimizer', 'This feature would analyze dependencies and suggest optimal send times based on business rules and stakeholder priorities.', SpreadsheetApp.getUi().ButtonSet.OK);
}

function generateDependencyReport() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Enhanced Email Tracker");
  const data = sheet.getDataRange().getValues();
  
  // Create a new sheet for the report
  const reportSheet = ss.insertSheet(`Dependency_Report_${new Date().toISOString().split('T')[0]}`);
  
  // Generate comprehensive dependency report
  reportSheet.getRange("A1").setValue("Une Femme Email Dependencies Report");
  reportSheet.getRange("A2").setValue(`Generated: ${new Date()}`);
  
  // Add summary statistics
  const totalEmails = data.length - 1; // Exclude header
  const blockedCount = data.filter(row => row[15] === "Blocked").length;
  const readyCount = data.filter(row => row[15] === "Ready").length;
  
  reportSheet.getRange("A4").setValue("Summary Statistics:");
  reportSheet.getRange("A5").setValue(`Total Emails: ${totalEmails}`);
  reportSheet.getRange("A6").setValue(`Ready to Send: ${readyCount}`);
  reportSheet.getRange("A7").setValue(`Blocked: ${blockedCount}`);
  reportSheet.getRange("A8").setValue(`Dependency Compliance Rate: ${((readyCount / totalEmails) * 100).toFixed(1)}%`);
  
  SpreadsheetApp.getUi().alert('Dependency Report Generated', `Report created in sheet: ${reportSheet.getName()}`, SpreadsheetApp.getUi().ButtonSet.OK);
}