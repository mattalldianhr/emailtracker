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
  createDependencyDashboard(ss, config);
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
  
  // Headers - Updated to include dependencies and flexibility
  const headers = [
    "ID", "Phase", "Category", "Priority", "From (HR)*", "To (UF)*", "CC*", 
    "Target Date", "Flexibility", "Dependencies", "Subject", "Content", "Attachments", 
    "Body Copy", "Status", "Date Sent", "Response Req?", 
    "Response Due", "Response Rcvd", "Follow-up?", "Notes", "Earliest Send", "Latest Send", "Created", "Modified"
  ];
  
  sheet.getRange("A1:Y1").setValues([headers])
    .setBackground(config.primaryColor)
    .setFontColor("#FFFFFF")
    .setFontWeight("bold");
  
  // Add note about multiple selections
  sheet.getRange("A26").setValue("* Multiple selections supported")
    .setFontStyle("italic")
    .setFontColor("#666666");
  sheet.getRange("A27").setValue("Format: 'Name1, Name2, Name3'")
    .setFontStyle("italic")
    .setFontColor("#666666");
  
  // Set column widths
  sheet.setColumnWidth(1, 80);  // ID
  sheet.setColumnWidth(10, 120); // Dependencies
  sheet.setColumnWidth(11, 300); // Subject
  sheet.setColumnWidth(12, 400); // Content
  sheet.setColumnWidth(14, 500); // Body Copy
  sheet.setColumnWidth(21, 200); // Notes
  
  // Formulas for row 2
  sheet.getRange("A2").setFormula('=IF(B2<>"","UF-"&TEXT(ROW()-1,"000"),"")');
  sheet.getRange("R2").setFormula('=IF(Q2="Y",WORKDAY(P2,2),"")');
  sheet.getRange("V2").setFormula('=IF(B2<>"",calculateEarliestSendDate(J2),"")'); // Dependencies check
  sheet.getRange("W2").setFormula('=IF(I2="HARD",H2,IF(I2="FLEX",H2+2,H2))'); // Flexibility buffer
  sheet.getRange("X2").setFormula('=IF(B2<>"",NOW(),"")');
  sheet.getRange("Y2").setFormula('=IF(OR(B2<>B1,C2<>C1,D2<>D1,E2<>E1,F2<>F1,G2<>G1,H2<>H1,I2<>I1,J2<>J1,K2<>K1,L2<>L1,M2<>M1,N2<>N1,O2<>O1,P2<>P1,Q2<>Q1,S2<>S1,T2<>T1,U2<>U1),NOW(),Y1)');
  
  // Copy formulas down
  sheet.getRange("A2:Y2").copyTo(sheet.getRange("A3:Y100"));
  
  // Pre-populate with critical Week 1 emails FIRST (including dependencies)
  const week1Emails = [
    ["Week 1", "Kickoff", "High", "Matt, Danielle", "All Team", "Zach Pelka", new Date(2024, 11, 16), "HARD", "", "[Une Femme] Welcome & Monday Kickoff Details", "Agenda, Zoom link, AI setup instructions", "Kickoff deck", "Team,\n\nWelcome to the Une Femme Wines AI Transformation program! We're excited to begin this 8-week journey together.\n\nKickoff Meeting Details:\nDate: Monday, December 16th\nTime: 10:00 AM PST\nZoom: [link]\n\nAgenda:\n- Project overview & timeline\n- Team introductions\n- Success metrics\n- Q&A\n\nPlease confirm attendance.\n\nBest,\nMatt & Danielle", "Draft"],
    ["Week 1", "Survey", "High", "Alex", "All 12 Participants", "Leadership Team", new Date(2024, 11, 17), "HARD", "UF-001", "[Une Femme] AI Readiness Survey - Due Thursday", "Survey link, 15 min completion time", "", "Hi Team,\n\nAs part of our AI readiness assessment, please complete this brief survey by Thursday, December 19th.\n\nSurvey Link: [link]\nTime Required: 15 minutes\n\nYour insights will help us tailor the program to Une Femme's specific needs around:\n- Distributor management\n- Demand forecasting  \n- Brand content creation\n\nThank you!\nAlex", "Draft"],
    ["Week 1", "Scheduling", "High", "Danielle", "Jen Pelka, Sam Barnes, Thomas Hartman", "Matt", new Date(2024, 11, 16), "HARD", "UF-001", "[Une Femme] Executive Interview Confirmation", "Individual calendar invites", "Interview guide", "Hi [Name],\n\nI'm scheduling your 45-minute executive interview for our AI readiness assessment.\n\nAvailable times this week:\n- Tuesday 2-3 PM\n- Wednesday 10-11 AM\n- Thursday 3-4 PM\n\nWe'll discuss:\n- Your strategic priorities\n- Current operational challenges\n- AI opportunities in your area\n\nPlease let me know your preferred time.\n\nBest,\nDanielle", "Draft"],
    ["Pre-Engagement", "Contract", "High", "Matt", "Zach Pelka", "Jen Pelka", new Date(2024, 11, 9), "HARD", "", "[Une Femme] Beta Pilot Agreement & Next Steps", "SOW, timeline, intake form, AI requirements", "All documentation", "Hi Zach,\n\nAttached you'll find our Beta Pilot Agreement and next steps documentation:\n\n1. Statement of Work (SOW)\n2. 8-week timeline\n3. Client intake form\n4. AI platform requirements\n\nPlease review and let me know if you have any questions. We're targeting a December 16th kickoff.\n\nLooking forward to transforming Une Femme's operations!\n\nBest,\nMatt", "Ready"],
    ["Pre-Engagement", "Platform Setup", "High", "James", "All 11 Users", "IT Team", new Date(2024, 11, 10), "HARD", "UF-001", "[Une Femme] AI Platform Setup Required by Week 2", "ChatGPT Teams and Claude Teams setup instructions", "Setup guide", "Team,\n\nTo participate in the AI pilot program, please set up these platforms by Week 2:\n\n1. ChatGPT Teams account\n2. Claude Teams account\n\nSetup instructions attached. This should take about 15 minutes.\n\nIf you need assistance, please reach out to James or myself.\n\nThanks,\nJames", "Draft"],
    ["Week 1", "Status Update", "Medium", "Matt", "Zach Pelka", "Project Team", new Date(2024, 11, 20), "FLEX", "UF-002,UF-003", "[Une Femme] Week 1 Status & Preliminary Findings", "Survey response rate, platform status, sprint focus", "Status report", "Hi Zach,\n\nWeek 1 Status Update:\n\nCompleted:\n- Kickoff meeting (100% attendance)\n- Executive interviews (4/4 complete)\n- Survey launch\n\nMetrics:\n- Survey response rate: 83% (10/12)\n- Platform setup: 78% complete\n\nNext Week Focus:\n- Complete platform setup\n- Begin training modules\n- Launch integration sprint\n\nFull report attached.\n\nBest,\nMatt", "Draft"],
    ["Week 2", "Training", "High", "Alex, Danielle", "Group 1 (Evyn, Micha, Sara)", "All Executives", new Date(2024, 11, 23), "HARD", "UF-005", "[Une Femme] Training Module 1 - Operations Group", "Monday 2PM, Module 1 materials, homework", "Training deck", "Hi Operations Team,\n\nYour first AI training session is scheduled:\n\nWhen: Monday, December 23rd at 2:00 PM PST\nDuration: 90 minutes\nZoom: [link]\n\nModule 1 Topics:\n- AI fundamentals for operations\n- Demand forecasting applications\n- Inventory optimization\n\nPre-work: Review attached materials (30 mins)\n\nSee you Monday!\nAlex & Danielle", "Draft"],
    ["Week 2", "Training", "High", "Alex, Danielle", "Group 2 (Whitney, Joe, Kait, Kimberly)", "All Executives", new Date(2024, 11, 23), "HARD", "UF-005", "[Une Femme] Training Module 1 - Sales/Marketing Group", "Monday 3:30PM, Module 1 materials, homework", "Training deck", "Hi Sales & Marketing Team,\n\nYour first AI training session is scheduled:\n\nWhen: Monday, December 23rd at 3:30 PM PST\nDuration: 90 minutes\nZoom: [link]\n\nModule 1 Topics:\n- AI for sales enablement\n- Content creation & personalization\n- Customer insights & analytics\n\nPre-work: Review attached materials (30 mins)\n\nExcited to get started!\nAlex & Danielle", "Draft"],
    ["Week 2", "Sprint", "High", "Matt, James", "Sprint Team", "Zach Pelka, Thomas Hartman", new Date(2024, 11, 23), "HARD", "UF-002", "[Une Femme] Integration Sprint Kickoff - Monday", "3-day sprint agenda, requirements, access needs", "Sprint guide", "Sprint Team,\n\nOur 3-day integration sprint begins Monday, December 23rd.\n\nSchedule:\nDay 1: Requirements gathering & planning\nDay 2: Development & configuration\nDay 3: Testing & deployment\n\nDaily Schedule: 9 AM - 5 PM PST\nLocation: Virtual (Zoom link attached)\n\nPlease ensure you have:\n- System access credentials\n- Development environment setup\n- Sprint requirements doc reviewed\n\nLet's build something amazing!\nMatt & James", "Draft"],
    ["Week 3", "Deliverable", "High", "Matt, Alex", "All Executives", "Board Members", new Date(2024, 11, 30), "HARD", "UF-002,UF-007,UF-008", "[Une Femme] Formal Assessment Presentation", "Comprehensive findings, readiness assessment, recommendations", "Assessment report", "Executive Team,\n\nPlease join us for the formal assessment presentation:\n\nDate: Monday, December 30th\nTime: 10:00 AM PST\nDuration: 60 minutes\nLocation: Conference Room A / Zoom hybrid\n\nAgenda:\n- Comprehensive readiness assessment\n- Key findings & insights\n- Strategic recommendations\n- Implementation roadmap\n- Q&A\n\nFull assessment report will be shared prior to the meeting.\n\nBest regards,\nMatt & Alex", "Draft"]
  ];
  
  sheet.getRange("B2:P11").setValues(week1Emails);
  
  // NOW set up data validations (after data is populated)
  const configSheet = ss.getSheetByName("Configuration");
  
  // Phase dropdown - start from row 12 to avoid overwriting pre-populated data
  sheet.getRange("B12:B100").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .setAllowInvalid(false)
      .requireValueInRange(configSheet.getRange("A8:A12"))
      .build()
  );
  
  // Category dropdown - start from row 12 to avoid overwriting pre-populated data
  sheet.getRange("C12:C100").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .setAllowInvalid(false)
      .requireValueInRange(configSheet.getRange("E8:E16"))
      .build()
  );
  
  // Priority dropdown - start from row 12 to avoid overwriting pre-populated data
  sheet.getRange("D12:D100").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .setAllowInvalid(false)
      .requireValueInList(["High", "Medium", "Low"])
      .build()
  );
  
  // From dropdown - allow multiple selections (comma-separated)
  sheet.getRange("E12:E100").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .setAllowInvalid(true)
      .requireValueInRange(configSheet.getRange("I8:I15"))
      .setHelpText("Select one or multiple team members. For multiple, use format: 'Matt, Danielle, Alex'")
      .build()
  );
  
  // Flexibility dropdown - ADD THIS NEW VALIDATION
  sheet.getRange("I2:I100").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .setAllowInvalid(false)
      .requireValueInList(["HARD", "FLEX", "ASAP"])
      .setHelpText("HARD = Cannot be moved, FLEX = Can adjust ±1-2 days, ASAP = Immediate action required")
      .build()
  );
  
  // Dependencies dropdown - ADD THIS NEW VALIDATION
  sheet.getRange("J2:J100").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .setAllowInvalid(true)
      .setHelpText("Enter comma-separated email IDs that must be completed before this email can be sent (e.g., UF-001, UF-002)")
      .build()
  );
  
  // Status dropdown - start from row 12 to avoid overwriting pre-populated data
  sheet.getRange("O12:O100").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .setAllowInvalid(false)
      .requireValueInList(["Draft", "Ready", "Sent", "Confirmed", "No Response", "Cancelled"])
      .build()
  );
  
  // Y/N dropdowns - start from row 12 to avoid overwriting pre-populated data
  sheet.getRange("Q12:Q100").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .setAllowInvalid(false)
      .requireValueInList(["Y", "N"])
      .build()
  );
  
  sheet.getRange("T12:T100").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .setAllowInvalid(false)
      .requireValueInList(["Y", "N"])
      .build()
  );
  
  // Conditional formatting
  addConditionalFormatting(sheet);
  
  // Add visual enhancements
  enhanceEmailTrackerVisuals(sheet);
}

// NEW HELPER FUNCTIONS for dependency checking
function calculateEarliestSendDate(dependenciesText) {
  if (!dependenciesText || dependenciesText.trim() === "") {
    return new Date(); // No dependencies, can send anytime
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tracker = ss.getSheetByName("Email Tracker");
  const data = tracker.getDataRange().getValues();
  
  const dependencies = dependenciesText.split(',').map(dep => dep.trim());
  let latestDate = new Date();
  
  dependencies.forEach(depId => {
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === depId && data[i][14] === "Sent") { // Column A (ID) and O (Status)
        const sentDate = data[i][15]; // Column P (Date Sent)
        if (sentDate instanceof Date && sentDate > latestDate) {
          latestDate = sentDate;
        }
      }
    }
  });
  
  return latestDate;
}

function checkDependencies(dependenciesText, currentStatus) {
  if (!dependenciesText || dependenciesText.trim() === "" || currentStatus === "Sent") {
    return true; // No dependencies or already sent
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tracker = ss.getSheetByName("Email Tracker");
  const data = tracker.getDataRange().getValues();
  
  const dependencies = dependenciesText.split(',').map(dep => dep.trim());
  
  for (let depId of dependencies) {
    let depCompleted = false;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === depId && data[i][14] === "Sent") { // Column A (ID) and O (Status)
        depCompleted = true;
        break;
      }
    }
    if (!depCompleted) {
      return false; // At least one dependency not completed
    }
  }
  
  return true; // All dependencies completed
}

function validateDependencies() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tracker = ss.getSheetByName("Email Tracker");
  const data = tracker.getDataRange().getValues();
  
  const violations = [];
  
  for (let i = 1; i < data.length; i++) {
    const id = data[i][0];
    const dependencies = data[i][9]; // Column J
    const status = data[i][14]; // Column O
    
    if (dependencies && dependencies.trim() !== "" && status !== "Sent") {
      if (!checkDependencies(dependencies, status)) {
        violations.push({
          id: id,
          subject: data[i][10], // Column K
          dependencies: dependencies,
          status: status
        });
      }
    }
  }
  
  return violations;
}

// NEW FUNCTION: Create Dependency Dashboard
function createDependencyDashboard(ss, config) {
  let sheet = ss.insertSheet("Dependency Dashboard");
  
  // Title
  sheet.getRange("A1:J1").merge()
    .setValue("Email Dependencies & Critical Path Dashboard")
    .setBackground("#FF5722")
    .setFontColor("#FFFFFF")
    .setFontSize(16)
    .setFontWeight("bold")
    .setHorizontalAlignment("center");
  
  // Critical Path Status
  sheet.getRange("A3").setValue("CRITICAL PATH STATUS").setFontWeight("bold").setFontSize(12);
  
  // Dependency Violations Alert
  sheet.getRange("A5").setValue("⚠️ DEPENDENCY VIOLATIONS");
  sheet.getRange("A6").setFormula('=IFERROR(QUERY(\'Email Tracker\'!A:Y,"SELECT A,K,J WHERE O<>\'Sent\' AND J<>\'\' ORDER BY H",0),"✅ No dependency violations found")');
  
  // Hard Deadlines This Week
  sheet.getRange("A10").setValue("🔴 HARD DEADLINES - NEXT 7 DAYS").setFontWeight("bold");
  sheet.getRange("A11:F11").setValues([["ID", "Subject", "Target Date", "Status", "Dependencies", "Risk Level"]]).setBackground("#FFCDD2");
  sheet.getRange("A12").setFormula('=IFERROR(QUERY(\'Email Tracker\'!A:Y,"SELECT A,K,H,O,J WHERE I=\'HARD\' AND H>=date \'"&TEXT(TODAY(),"yyyy-mm-dd")&"\' AND H<=date \'"&TEXT(TODAY()+7,"yyyy-mm-dd")&"\' ORDER BY H",0),"No hard deadlines in next 7 days")');
  
  // ASAP Items
  sheet.getRange("A18").setValue("🔥 URGENT ITEMS (ASAP)").setFontWeight("bold");
  sheet.getRange("A19:E19").setValues([["ID", "Subject", "Status", "Created", "Hours Old"]]).setBackground("#FF9800");
  sheet.getRange("A20").setFormula('=IFERROR(QUERY(\'Email Tracker\'!A:Y,"SELECT A,K,O,X WHERE I=\'ASAP\' AND O<>\'Sent\' ORDER BY X",0),"No urgent items")');
  
  // Flexibility Buffer Analysis
  sheet.getRange("A25").setValue("📊 FLEXIBILITY BUFFER ANALYSIS").setFontWeight("bold");
  
  const flexMetrics = [
    ["Total HARD deadlines:", '=COUNTIF(\'Email Tracker\'!I:I,"HARD")'],
    ["HARD items at risk (past due):", '=COUNTIFS(\'Email Tracker\'!I:I,"HARD",\'Email Tracker\'!H:H,"<"&TODAY(),\'Email Tracker\'!O:O,"<>Sent")'],
    ["Total FLEX items:", '=COUNTIF(\'Email Tracker\'!I:I,"FLEX")'],
    ["FLEX items in buffer zone:", '=COUNTIFS(\'Email Tracker\'!I:I,"FLEX",\'Email Tracker\'!H:H,">="&TODAY(),\'Email Tracker\'!H:H,"<="&TODAY()+2)'],
    ["Average buffer utilization:", '=IFERROR(AVERAGE(IF(\'Email Tracker\'!I:I="FLEX",\'Email Tracker\'!H:H-\'Email Tracker\'!V:V,"")),0)&" days"']
  ];
  
  let metricRow = 26;
  flexMetrics.forEach(metric => {
    sheet.getRange(metricRow, 1).setValue(metric[0]);
    sheet.getRange(metricRow, 3).setFormula(metric[1]);
    metricRow++;
  });
  
  // Visual Timeline
  sheet.getRange("F3").setValue("CRITICAL PATH TIMELINE").setFontWeight("bold");
  sheet.getRange("F4").setValue("Next 14 Days - HARD Deadlines Only");
  
  // Create a simple timeline view
  for (let day = 0; day < 14; day++) {
    let dayRow = 5 + day;
    let dateFormula = `=TODAY()+${day}`;
    sheet.getRange(dayRow, 6).setFormula(dateFormula).setNumberFormat("MM/dd EEE");
    
    // Count HARD items for this date
    let countFormula = `=COUNTIFS('Email Tracker'!I:I,"HARD",'Email Tracker'!H:H,F${dayRow},'Email Tracker'!O:O,"<>Sent")`;
    sheet.getRange(dayRow, 7).setFormula(countFormula);
    
    // Show email subjects for this date
    let emailsFormula = `=IFERROR(JOIN(", ",QUERY('Email Tracker'!A:Y,"SELECT K WHERE I='HARD' AND H=date '"&TEXT(F${dayRow},"yyyy-mm-dd")&"' AND O<>'Sent'",0)),"")`;
    sheet.getRange(dayRow, 8, 1, 2).merge();
    sheet.getRange(dayRow, 8).setFormula(emailsFormula).setWrap(true);
  }
  
  // Add conditional formatting for risk levels
  const riskRules = [
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=G5>3')
      .setBackground("#FF5722")
      .setFontColor("#FFFFFF")
      .setRanges([sheet.getRange("F5:I18")])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND(G5>1,G5<=3)')
      .setBackground("#FF9800")
      .setRanges([sheet.getRange("F5:I18")])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=G5=1')
      .setBackground("#FFC107")
      .setRanges([sheet.getRange("F5:I18")])
      .build()
  ];
  
  sheet.setConditionalFormatRules(riskRules);
  
  // Auto-refresh timestamp
  sheet.getRange("I1").setValue("Last Updated:");
  sheet.getRange("J1").setFormula("=NOW()").setNumberFormat("MM/dd/yyyy HH:mm");
}

function createDashboard(ss, config) {
  let sheet = ss.insertSheet("Dashboard");
  
  // Title
  sheet.getRange("A1:J1").merge()
    .setValue("Une Femme Wines Email Communication Dashboard")
    .setBackground(config.primaryColor)
    .setFontColor("#FFFFFF")
    .setFontSize(16)
    .setFontWeight("bold")
    .setHorizontalAlignment("center");
  
  // Summary metrics
  sheet.getRange("A3").setValue("SUMMARY METRICS").setFontWeight("bold");
  
  const metrics = [
    ["Total Emails:", '=COUNTA(\'Email Tracker\'!A:A)-1'],
    ["Sent:", '=COUNTIF(\'Email Tracker\'!O:O,"Sent")'],
    ["Pending:", '=COUNTIFS(\'Email Tracker\'!O:O,"<>Sent",\'Email Tracker\'!O:O,"<>Cancelled")'],
    ["Response Rate:", '=IFERROR(COUNTIFS(\'Email Tracker\'!S:S,"<>""")/COUNTIF(\'Email Tracker\'!Q:Q,"Y"),0)'],
    ["On-Time Rate:", '=IFERROR(COUNTIFS(\'Email Tracker\'!O:O,"Sent",\'Email Tracker\'!P:P,"<=",\'Email Tracker\'!H:H)/COUNTIF(\'Email Tracker\'!O:O,"Sent"),0)']
  ];
  
  let metricRow = 4;
  metrics.forEach(metric => {
    sheet.getRange(metricRow, 1).setValue(metric[0]);
    sheet.getRange(metricRow, 3).setFormula(metric[1]);
    if (metric[0].includes("Rate")) {
      sheet.getRange(metricRow, 3).setNumberFormat("0%");
    }
    metricRow++;
  });
  
  // Outstanding items
  sheet.getRange("F3").setValue("ITEMS REQUIRING ACTION").setFontWeight("bold");
  sheet.getRange("F4:I4").setValues([["ID", "To", "Subject", "Due Date"]]).setBackground("#E8E8E8");
  
  sheet.getRange("F5").setFormula('=IFERROR(QUERY(\'Email Tracker\'!A:U,"SELECT A,F,J,H WHERE T=\'Y\' AND O<>\'Sent\' ORDER BY H LIMIT 10",0),"No action items")');
  
  // Phase progress
  sheet.getRange("A11").setValue("PHASE PROGRESS").setFontWeight("bold");
  sheet.getRange("A12:D12").setValues([["Phase", "Total", "Sent", "Progress"]]).setBackground("#E8E8E8");
  
  // Add phase progress formulas
  const phases = ["Pre-Engagement", "Week 1", "Week 2", "Weeks 3-7", "Week 8"];
  let phaseRow = 13;
  phases.forEach(phase => {
    sheet.getRange(phaseRow, 1).setValue(phase);
    sheet.getRange(phaseRow, 2).setFormula(`=COUNTIF('Email Tracker'!B:B,"${phase}")`);
    sheet.getRange(phaseRow, 3).setFormula(`=COUNTIFS('Email Tracker'!B:B,"${phase}",'Email Tracker'!O:O,"Sent")`);
    sheet.getRange(phaseRow, 4).setFormula(`=IFERROR(C${phaseRow}/B${phaseRow},0)`);
    sheet.getRange(phaseRow, 4).setNumberFormat("0%");
    
    // Add progress bar
    sheet.getRange(phaseRow, 5).setFormula(`=SPARKLINE(C${phaseRow}/B${phaseRow},{"charttype","bar";"max",1;"color1","${config.primaryColor}"})`);
    phaseRow++;
  });
  
  // This week's communications
  sheet.getRange("A20").setValue("THIS WEEK'S COMMUNICATIONS").setFontWeight("bold");
  sheet.getRange("A21:J21").setValues([["Day", "ID", "Category", "From", "To", "Subject", "Status", "Priority", "Response?", "Notes"]]).setBackground("#E8E8E8");
  
  sheet.getRange("A22").setFormula('=IFERROR(QUERY(\'Email Tracker\'!A:U,"SELECT H,A,C,E,F,J,O,D,Q,U WHERE H >= date \'"&TEXT(TODAY(),"yyyy-mm-dd")&"\' AND H <= date \'"&TEXT(TODAY()+7,"yyyy-mm-dd")&"\' ORDER BY H",0),"No communications this week")');
  
  // Auto-refresh
  sheet.getRange("J3").setValue("Last Updated:");
  sheet.getRange("J4").setFormula("=NOW()").setNumberFormat("MM/dd/yyyy HH:mm");
}

function createContactsSheet(ss, config) {
  let sheet = ss.insertSheet("Contacts");
  
  // Headers
  const headers = ["Name", "Role", "Email", "Phone", "Preferred Contact", "Time Zone", "Availability", "Special Notes", "Group", "Level"];
  sheet.getRange("A1:J1").setValues([headers])
    .setBackground(config.primaryColor)
    .setFontColor("#FFFFFF")
    .setFontWeight("bold");
  
  // Pre-populate Une Femme team
  const contacts = [
    ["Jen Pelka", "Co-Founder & CEO", "jen@unefemme.com", "", "Email", "PST", "Flexible", "Brand vision lead", "", "Executive"],
    ["Zach Pelka", "Co-Founder & COO", "zach@unefemme.com", "", "Email", "PST", "Flexible", "PRIMARY POC - All major decisions", "", "Executive"],
    ["Sam Barnes", "CRO", "sam@unefemme.com", "", "Email", "PST", "Mornings preferred", "Skeptical - fee at risk", "", "Executive"],
    ["Thomas Hartman", "VP Operations", "thomas@unefemme.com", "", "Email", "PST", "Flexible", "Production focus", "", "Executive"],
    ["Evyn Cameron", "Director of Winemaking", "evyn@unefemme.com", "", "Email", "PST", "Flexible", "Award-winning winemaker", "Group 1", "Participant"],
    ["Micha Carter", "Compliance Lead", "micha@unefemme.com", "", "Email", "PST", "Flexible", "Multi-state compliance", "Group 1", "Participant"],
    ["Sara Soares", "Head of Finance", "sara@unefemme.com", "", "Email", "PST", "Flexible", "99.8% forecast accuracy", "Group 1", "Participant"],
    ["Whitney Wright", "Head of Communications", "whitney@unefemme.com", "", "Email", "PST", "Flexible", "Brand repositioning", "Group 2", "Participant"],
    ["Joe Taverrite", "Head of National Accounts", "joe@unefemme.com", "", "Email", "PST", "Flexible", "Delta, Marriott partnerships", "Group 2", "Participant"],
    ["Kait Skye", "Trade Marketing Manager", "kait@unefemme.com", "", "Email", "PST", "Flexible", "RNDC management", "Group 2", "Participant"],
    ["Kimberly Pettit", "Agency: TX Sales", "kimberly@unefemme.com", "", "Email", "CST", "Flexible", "Key growth market", "Group 2", "Participant"]
  ];
  
  sheet.getRange("A2:J12").setValues(contacts);
  
  // Conditional formatting for special notes
  const rule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains("PRIMARY POC")
    .setBackground("#FFFF00")
    .setRanges([sheet.getRange("H:H")])
    .build();
  
  sheet.setConditionalFormatRules([rule]);
}

function createScheduleOverview(ss, config) {
  let sheet = ss.insertSheet("Schedule Overview");
  
  // Create calendar view
  sheet.getRange("A1:H1").merge()
    .setValue("Communication Schedule - Calendar View")
    .setBackground(config.primaryColor)
    .setFontColor("#FFFFFF")
    .setFontSize(14)
    .setFontWeight("bold")
    .setHorizontalAlignment("center");
  
  // Week headers
  const weekDays = ["Week", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Key Milestones", "Notes"];
  sheet.getRange("A3:H3").setValues([weekDays]).setBackground("#E8E8E8").setFontWeight("bold");
  
  // Create 8-week grid
  for (let week = 1; week <= 8; week++) {
    let rowStart = 3 + (week * 3);
    sheet.getRange(rowStart, 1).setValue(`Week ${week}`).setFontWeight("bold");
    
    // Merge cells for each day
    for (let day = 2; day <= 6; day++) {
      sheet.getRange(rowStart, day, 3, 1).merge().setVerticalAlignment("top");
    }
    
    // Milestones column
    sheet.getRange(rowStart, 7, 3, 1).merge().setVerticalAlignment("top");
    sheet.getRange(rowStart, 8, 3, 1).merge().setVerticalAlignment("top");
  }
  
  // Add formulas to pull from Email Tracker
  for (let week = 1; week <= 8; week++) {
    for (let day = 2; day <= 6; day++) {
      let rowStart = 3 + (week * 3);
      let dayName = weekDays[day - 1];
      let formula = `=IFERROR(JOIN(CHAR(10),QUERY('Email Tracker'!A:Y,"SELECT J WHERE H = date '"&TEXT(DATE(2024,12,9+(${week-1}*7)+(${day-2})),"yyyy-mm-dd")&"' AND O <> 'Cancelled'",0)),"")`;
      sheet.getRange(rowStart, day).setFormula(formula);
    }
  }
  
  // Add key milestones
  const milestones = [
    [6, "Kickoff Meeting, Executive Interviews Begin, Survey Launch"],
    [9, "All Programs Launch, Integration Sprint, First Training"],
    [12, "Formal Assessment Presentation"],
    [15, "Mid-point Check-in"],
    [18, ""],
    [21, ""],
    [24, ""],
    [27, "Final Presentation, Knowledge Transfer"]
  ];
  
  milestones.forEach(milestone => {
    sheet.getRange(milestone[0], 7).setValue(milestone[1]);
  });
  
  // Format grid
  sheet.getRange("A3:H27").setBorder(true, true, true, true, true, true);
  sheet.getRange("A3:H27").setWrap(true);
  sheet.setRowHeights(4, 24, 60);
}

function createFollowUpQueue(ss, config) {
  let sheet = ss.insertSheet("Follow-Up Queue");
  
  // Title
  sheet.getRange("A1:J1").merge()
    .setValue("Active Follow-Up Items")
    .setBackground("#FF6B6B")
    .setFontColor("#FFFFFF")
    .setFontSize(14)
    .setFontWeight("bold")
    .setHorizontalAlignment("center");
  
  // Create filtered view of items needing follow-up
  sheet.getRange("A3").setFormula('=IFERROR(QUERY(\'Email Tracker\'!A:U,"SELECT A,E,F,J,H,P,Q,R,S,U WHERE T=\'Y\' OR (Q=\'Y\' AND S=\'\') ORDER BY H",1),"No follow-up items")');
  
  // Add action buttons area
  sheet.getRange("A20").setValue("QUICK ACTIONS").setFontWeight("bold");
  sheet.getRange("A21").setValue("Use these formulas to update the main tracker:");
  sheet.getRange("A22").setValue("Mark as complete: Update Email Tracker Column T to 'N'");
  sheet.getRange("A23").setValue("Add response date: Update Email Tracker Column S with date");
  sheet.getRange("A24").setValue("Change status: Update Email Tracker Column O");
}

function addConditionalFormatting(sheet) {
  const rules = [];
  
  // Past due items (red background) - only for rows with data
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND($B2<>"",$H2<TODAY(),$O2<>"Sent",$O2<>"Cancelled")')
      .setBackground("#FFCDD2")
      .setRanges([sheet.getRange("A2:Y100")])
      .build()
  );
  
  // Due within 2 days (yellow background) - only for rows with data
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND($B2<>"",$H2<=TODAY()+2,$H2>=TODAY(),$O2<>"Sent")')
      .setBackground("#FFF9C4")
      .setRanges([sheet.getRange("A2:Y100")])
      .build()
  );
  
  // Completed items (green background) - only for rows with data
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND($B2<>"",$O2="Sent")')
      .setBackground("#C8E6C9")
      .setRanges([sheet.getRange("A2:Y100")])
      .build()
  );
  
  // High priority (red text instead of bold)
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("High")
      .setFontColor("#B71C1C")
      .setRanges([sheet.getRange("D2:D100")])
      .build()
  );
  
  // HARD deadline (dark red text)
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("HARD")
      .setFontColor("#D32F2F")
      .setBackground("#FFEBEE")
      .setRanges([sheet.getRange("I2:I100")])
      .build()
  );
  
  // Follow-up needed (orange background)
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Y")
      .setBackground("#FFE0B2")
      .setRanges([sheet.getRange("T2:T100")])
      .build()
  );
  
  sheet.setConditionalFormatRules(rules);
}

function createCustomMenu(ss) {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Email Tracker')
    .addItem('Refresh Dashboard', 'refreshDashboard')
    .addItem('Send Daily Digest', 'sendDailyDigest')
    .addItem('Validate Dependencies', 'runDependencyValidation')
    .addItem('Archive Completed', 'archiveCompleted')
    .addItem('Generate Weekly Report', 'generateWeeklyReport')
    .addSeparator()
    .addItem('Setup Wizard', 'runSetupWizard')
    .addSeparator()
    .addItem('🔧 Debug: Reset & Rebuild All Sheets', 'resetAndRebuild')
    .addToUi();
}

// NEW FUNCTION: Run dependency validation
function runDependencyValidation() {
  const violations = validateDependencies();
  const ui = SpreadsheetApp.getUi();
  
  if (violations.length === 0) {
    ui.alert('Dependency Check ✅', 'All dependencies are properly satisfied. No violations found.', ui.ButtonSet.OK);
  } else {
    let message = `Found ${violations.length} dependency violation(s):\n\n`;
    violations.forEach(violation => {
      message += `• ${violation.id}: ${violation.subject}\n  Missing: ${violation.dependencies}\n\n`;
    });
    
    ui.alert('Dependency Violations ⚠️', message, ui.ButtonSet.OK);
  }
}

function resetAndRebuild() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Debug: Reset & Rebuild',
    'This will DELETE ALL existing sheets and recreate them from scratch.\n\nThis action cannot be undone. Are you sure?',
    ui.ButtonSet.YES_NO
  );
  
  if (response === ui.Button.YES) {
    try {
      createEmailTrackerTemplate();
      ui.alert('Success', 'All sheets have been reset and rebuilt successfully!', ui.ButtonSet.OK);
    } catch (error) {
      ui.alert('Error', 'An error occurred during reset: ' + error.message, ui.ButtonSet.OK);
      console.error('Reset error:', error);
    }
  }
}

function refreshDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dashboard = ss.getSheetByName("Dashboard");
  const depDashboard = ss.getSheetByName("Dependency Dashboard");
  
  // Update timestamps
  if (dashboard) {
    dashboard.getRange("J4").setValue(new Date());
  }
  if (depDashboard) {
    depDashboard.getRange("J1").setValue(new Date());
  }
  
  // Force recalculation
  SpreadsheetApp.flush();
  
  // Run dependency validation
  const violations = validateDependencies();
  if (violations.length > 0) {
    const ui = SpreadsheetApp.getUi();
    ui.alert('⚠️ Dependencies Alert', `Found ${violations.length} dependency violations. Check the Dependency Dashboard for details.`, ui.ButtonSet.OK);
  }
}

function sendDailyDigest() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tracker = ss.getSheetByName("Email Tracker");
  
  // Get today's items
  const today = new Date();
  const todayItems = tracker.getDataRange().getValues().filter(row => {
    const targetDate = row[7]; // Column H
    return targetDate instanceof Date && 
           targetDate.toDateString() === today.toDateString() &&
           row[14] !== "Sent"; // Column O
  });
  
  // Get ASAP items
  const asapItems = tracker.getDataRange().getValues().filter(row => {
    return row[8] === "ASAP" && row[14] !== "Sent"; // Column I and O
  });
  
  // Get dependency violations
  const violations = validateDependencies();
  
  let digest = "Daily Email Communications Digest:\n\n";
  
  // Today's items
  if (todayItems.length > 0) {
    digest += `📅 DUE TODAY (${todayItems.length} items):\n`;
    todayItems.forEach(item => {
      digest += `• ${item[10]} (To: ${item[5]}) - ${item[8]} priority\n`; // Subject, To, Flexibility
    });
    digest += "\n";
  }
  
  // ASAP items
  if (asapItems.length > 0) {
    digest += `🔥 URGENT ITEMS (${asapItems.length} items):\n`;
    asapItems.forEach(item => {
      digest += `• ${item[10]} (To: ${item[5]})\n`; // Subject and To
    });
    digest += "\n";
  }
  
  // Dependency violations
  if (violations.length > 0) {
    digest += `⚠️ DEPENDENCY VIOLATIONS (${violations.length} items):\n`;
    violations.forEach(violation => {
      digest += `• ${violation.id}: ${violation.subject}\n`;
    });
    digest += "\n";
  }
  
  if (todayItems.length === 0 && asapItems.length === 0 && violations.length === 0) {
    digest += "✅ No items requiring immediate attention.\n";
  }
  
  // Log digest (would send email in production)
  console.log(digest);
  SpreadsheetApp.getUi().alert('Daily Digest', digest, SpreadsheetApp.getUi().ButtonSet.OK);
}

function archiveCompleted() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tracker = ss.getSheetByName("Email Tracker");
  let archive = ss.getSheetByName("Archive");
  
  // Create archive sheet if it doesn't exist
  if (!archive) {
    archive = ss.insertSheet("Archive");
    // Copy headers
    tracker.getRange("A1:Y1").copyTo(archive.getRange("A1:Y1"));
  }
  
  // Find completed items older than 7 days
  const data = tracker.getDataRange().getValues();
  const rowsToArchive = [];
  
  for (let i = data.length - 1; i > 0; i--) {
    if (data[i][14] === "Sent" && // Status column
        data[i][15] instanceof Date && // Date sent column
        (new Date() - data[i][15]) / (1000 * 60 * 60 * 24) > 7) {
      rowsToArchive.push(i + 1);
    }
  }
  
  // Move to archive
  rowsToArchive.forEach(rowNum => {
    const rowData = tracker.getRange(rowNum, 1, 1, 25).getValues(); // Updated for new column count
    archive.appendRow(rowData[0]);
    tracker.deleteRow(rowNum);
  });
  
  SpreadsheetApp.getUi().alert(`Archived ${rowsToArchive.length} completed items.`);
}

// Utility functions
function protectConfigSheets(ss) {
  const sheetsToProtect = ["Configuration"];
  
  sheetsToProtect.forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (sheet) {
      const protection = sheet.protect().setDescription(`${sheetName} - Edit with caution`);
      protection.setWarningOnly(true);
    }
  });
}

function createDataValidations(configSheet) {
  // Create named ranges for dropdowns
  const ss = configSheet.getParent();
  
  // Phases range (5 phases: A8:A12)
  const phaseRange = configSheet.getRange("A8:A12");
  ss.setNamedRange("Phases", phaseRange);
  
  // Categories range (updated for expanded list)
  const categoryRange = configSheet.getRange("E8:E16");
  ss.setNamedRange("Categories", categoryRange);
  
  // Team members range
  const teamRange = configSheet.getRange("I8:I15");
  ss.setNamedRange("TeamMembers", teamRange);
  
  // Priority options
  const priorityRange = configSheet.getRange("A25:A27");
  priorityRange.setValues([["High"], ["Medium"], ["Low"]]);
  ss.setNamedRange("Priorities", priorityRange);
  
  // Status options
  const statusRange = configSheet.getRange("A29:A34");
  statusRange.setValues([["Draft"], ["Ready"], ["Sent"], ["Confirmed"], ["No Response"], ["Cancelled"]]);
  ss.setNamedRange("StatusOptions", statusRange);
  
  // Flexibility options
  const flexRange = configSheet.getRange("A36:A38");
  flexRange.setValues([["HARD"], ["FLEX"], ["ASAP"]]);
  ss.setNamedRange("FlexibilityOptions", flexRange);
  
  // Y/N options
  const ynRange = configSheet.getRange("A40:A41");
  ynRange.setValues([["Y"], ["N"]]);
  ss.setNamedRange("YesNo", ynRange);
  
  // Hide the helper ranges
  configSheet.hideRows(25, 17);
}

// Also add this helper function for generating the weekly report
function generateWeeklyReport() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tracker = ss.getSheetByName("Email Tracker");
  const dashboard = ss.getSheetByName("Dashboard");
  
  // Get this week's data
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)
  
  const data = tracker.getDataRange().getValues();
  const headers = data[0];
  
  // Filter for this week's items
  const weekItems = data.slice(1).filter(row => {
    const targetDate = row[7]; // Column H - Target Date
    return targetDate instanceof Date && 
           targetDate >= weekStart && 
           targetDate <= weekEnd;
  });
  
  // Generate report
  let report = `Weekly Email Communication Report\n`;
  report += `Week of ${weekStart.toDateString()} to ${weekEnd.toDateString()}\n\n`;
  
  // Summary stats
  const sent = weekItems.filter(row => row[14] === "Sent").length;
  const pending = weekItems.filter(row => row[14] !== "Sent" && row[14] !== "Cancelled").length;
  const highPriority = weekItems.filter(row => row[3] === "High").length;
  const hardDeadlines = weekItems.filter(row => row[8] === "HARD").length;
  const flexDeadlines = weekItems.filter(row => row[8] === "FLEX").length;
  const asapItems = weekItems.filter(row => row[8] === "ASAP").length;
  
  report += `Summary:\n`;
  report += `- Total Communications: ${weekItems.length}\n`;
  report += `- Sent: ${sent}\n`;
  report += `- Pending: ${pending}\n`;
  report += `- High Priority: ${highPriority}\n`;
  report += `- HARD Deadlines: ${hardDeadlines}\n`;
  report += `- FLEX Deadlines: ${flexDeadlines}\n`;
  report += `- ASAP Items: ${asapItems}\n\n`;
  
  // Dependency status
  const violations = validateDependencies();
  report += `Dependency Status:\n`;
  if (violations.length === 0) {
    report += `- ✅ No dependency violations\n\n`;
  } else {
    report += `- ⚠️ ${violations.length} dependency violations found\n\n`;
  }
  
  // Group by phase
  report += `By Phase:\n`;
  const phases = ["Pre-Engagement", "Week 1", "Week 2", "Weeks 3-7", "Week 8"];
  phases.forEach(phase => {
    const phaseItems = weekItems.filter(row => row[1] === phase);
    if (phaseItems.length > 0) {
      report += `\n${phase}: ${phaseItems.length} items\n`;
      phaseItems.forEach(item => {
        report += `  - ${item[10]} (${item[14]}) [${item[8]}]\n`; // Subject, Status, Flexibility
      });
    }
  });
  
  // Items needing attention
  const needsAttention = weekItems.filter(row => 
    (row[14] !== "Sent" && row[14] !== "Cancelled") || 
    (row[16] === "Y" && !row[18]) || // Response required but not received
    row[8] === "ASAP" // ASAP items
  );
  
  if (needsAttention.length > 0) {
    report += `\n\nItems Needing Attention:\n`;
    needsAttention.forEach(item => {
      report += `- ${item[0]}: ${item[10]} (To: ${item[5]}) [${item[8]}]\n`;
    });
  }
  
  // Display report
  const ui = SpreadsheetApp.getUi();
  const result = ui.alert(
    'Weekly Report Generated',
    report,
    ui.ButtonSet.OK
  );
  
  // Optionally, create a new sheet with the report
  if (result == ui.Button.OK) {
    const reportSheet = ss.insertSheet(`Report_${weekStart.toISOString().split('T')[0]}`);
    reportSheet.getRange("A1").setValue("Weekly Email Communication Report");
    reportSheet.getRange("A2").setValue(`Week of ${weekStart.toDateString()} to ${weekEnd.toDateString()}`);
    reportSheet.getRange("A4").setValue(report);
    reportSheet.getRange("A:A").setWrap(true);
    reportSheet.setColumnWidth(1, 600);
  }
}

// Add this setup wizard function for easier configuration
function runSetupWizard() {
  const ui = SpreadsheetApp.getUi();
  
  // Step 1: Project Name
  const projectResponse = ui.prompt(
    'Setup Wizard - Step 1',
    'Enter the project name:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (projectResponse.getSelectedButton() !== ui.Button.OK) return;
  
  // Step 2: Start Date
  const dateResponse = ui.prompt(
    'Setup Wizard - Step 2',
    'Enter the project start date (MM/DD/YYYY):',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (dateResponse.getSelectedButton() !== ui.Button.OK) return;
  
  // Step 3: Primary Contact
  const contactResponse = ui.prompt(
    'Setup Wizard - Step 3',
    'Enter the primary client contact name:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (contactResponse.getSelectedButton() !== ui.Button.OK) return;
  
  // Update Configuration
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const config = ss.getSheetByName("Configuration");
  
  config.getRange("B3").setValue(projectResponse.getResponseText());
  config.getRange("B4").setValue(new Date(dateResponse.getResponseText()));
  
  // Add primary contact to notes
  const notes = config.getRange("A15").getValue() || "Notes:";
  config.getRange("A15").setValue(notes + "\nPrimary Contact: " + contactResponse.getResponseText());
  
  ui.alert('Setup Complete', 'The email tracker has been configured for your project.', ui.ButtonSet.OK);
}

// Helper functions for multiple selections
function validateTeamMembers(inputText, validMembers) {
  if (!inputText || inputText.trim() === "") return { isValid: true, message: "" };
  
  const selectedMembers = inputText.split(',').map(name => name.trim());
  const invalidMembers = selectedMembers.filter(member => !validMembers.includes(member));
  
  if (invalidMembers.length > 0) {
    return {
      isValid: false,
      message: `Invalid team members: ${invalidMembers.join(', ')}. Valid options: ${validMembers.join(', ')}`
    };
  }
  
  return { isValid: true, message: "All team members are valid" };
}

function splitMultipleSelections(cellValue) {
  if (!cellValue || cellValue.trim() === "") return [];
  return cellValue.split(',').map(item => item.trim()).filter(item => item !== "");
}

function countMultipleSelections(cellValue) {
  return splitMultipleSelections(cellValue).length;
}

function hasTeamMember(cellValue, memberName) {
  const members = splitMultipleSelections(cellValue);
  return members.includes(memberName);
}