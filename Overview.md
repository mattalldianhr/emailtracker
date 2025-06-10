# Une Femme Wines Email Communication Tracker

## Spreadsheet Structure

### Column Headers with Descriptions:

| Column | Description | Example Entry |
|--------|-------------|---------------|
| **ID** | Unique identifier | UF-001 |
| **Phase** | Project phase | Pre-Engagement / Week 1 / Week 2 / Ongoing |
| **Email Category** | Type of communication | Scheduling / Deliverable / Status Update / Survey / Training |
| **From (HR Team)** | Happy Robots sender | Matt / Danielle / Alex / etc. |
| **To (UF Recipients)** | Une Femme recipients | Zach Pelka (POC) / All Executives / Group 1 / etc. |
| **CC** | Additional recipients | Leadership Team / Project Team |
| **Target Send Date** | When email should be sent | 12/9/24 |
| **Date Flexibility** | Hard deadline or flexible | HARD - Must send / FLEX - Within 2 days / ASAP |
| **Subject Line** | Email subject | [Une Femme] Executive Interview Schedule - Week 1 |
| **Key Content** | Main points to cover | • Interview slots for Dec 16-20<br>• 45 min each<br>• Zoom links<br>• Pre-read attached |
| **Attachments** | Required attachments | Executive Interview Guide / Calendar invites |
| **Dependencies** | What must happen first | Kickoff meeting confirmed / Survey finalized |
| **Template Link** | Link to email template | [Drive link] |
| **Status** | Current status | Draft / Ready / Sent / Confirmed |
| **Date Sent** | Actual send date | 12/9/24 |
| **Response Required?** | Y/N and by when | Y - by 12/11 |
| **Response Received** | Date of response | 12/10/24 |
| **Follow-up Needed** | Y/N and action | Y - Missing 2 confirmations |
| **Notes** | Additional context | Sam prefers morning slots |

## Setup Instructions

### Initial Setup
1. **Clone the Apps Script Project**: Use `clasp clone 1RgJPW7IoP3ILxMpx1-uO0IDFKUZBpKcK_BbstAM3LnqKTz58WBN8WHKx`
2. **Run the Template Initializer**: Execute `initializeTemplate()` function to create all sheets
3. **Review Configuration**: Check the Configuration sheet for project settings
4. **Customize Team Members**: Update team member information in the Configuration sheet

### Sheet Structure Created
The system automatically creates these sheets:
- **Email Tracker**: Main tracking sheet with all communications
- **Dashboard**: Real-time metrics and status overview  
- **Templates Library**: Pre-built email templates
- **Contacts**: Team and client contact information
- **Schedule Overview**: Calendar view of all communications
- **Follow-Up Queue**: Items requiring immediate attention
- **Configuration**: Project settings and dropdowns

## Dashboard Features

### Real-Time Metrics
- **Total Emails**: Count of all tracked communications
- **Sent Rate**: Percentage of emails successfully sent
- **Pending Items**: Communications awaiting action
- **Response Rate**: Percentage of required responses received
- **On-Time Rate**: Percentage sent by target date

### Visual Indicators
- **Progress Bars**: Phase completion status with sparkline charts
- **Color Coding**: 
  - 🔴 Red: Past due items
  - 🟡 Yellow: Due within 2 days  
  - 🟢 Green: Completed items
  - 🟠 Orange: Follow-up needed

### This Week's View
- Filtered view of current week's communications
- Status tracking by day
- Priority and response indicators

## Automation Features

### Custom Menu Options
Access via Extensions > Apps Script > Email Tracker menu:
- **Refresh Dashboard**: Update all metrics and charts
- **Send Daily Digest**: Email summary to project team
- **Generate Weekly Report**: Comprehensive status report
- **Archive Completed**: Move finished items to archive
- **Setup Wizard**: Guided configuration process

### Automatic Calculations
- **Email IDs**: Auto-generated (UF-001, UF-002, etc.)
- **Response Due Dates**: Calculated based on send date + 2 business days
- **Modification Tracking**: Timestamps when entries are updated
- **Dependency Tracking**: Links between related emails

### Conditional Formatting
- **Past Due**: Red highlighting for missed deadlines
- **High Priority**: Bold text and red color
- **Hard Deadlines**: Special formatting for inflexible dates
- **Follow-up Items**: Orange highlighting

## Pre-Populated Email Schedule

Here's a starter set of critical emails based on the journey:

#### Pre-Engagement (Week -1)
| ID | Email Category | To | Target Date | Flexibility | Subject | Key Content |
|----|----------------|-----|-------------|-------------|---------|-------------|
| UF-001 | Contract | Zach Pelka | 12/9/24 | HARD | [Une Femme] Beta Pilot Agreement & Next Steps | SOW, timeline, intake form, AI requirements |
| UF-002 | Scheduling | Zach Pelka | 12/10/24 | HARD | [Une Femme] Week 1 Meeting Schedule | Kickoff + exec interviews |

#### Week 1 Critical Emails
| ID | Email Category | To | Target Date | Flexibility | Subject | Key Content |
|----|----------------|-----|-------------|-------------|---------|-------------|
| UF-003 | Kickoff | All Team | 12/13/24 | HARD | [Une Femme] Welcome & Monday Kickoff Details | Agenda, Zoom link, AI setup |
| UF-004 | Survey | All 12 Participants | 12/17/24 | HARD | [Une Femme] AI Readiness Survey - Please Complete by Thursday | Survey link, 15 min time |
| UF-005 | Scheduling | 4 Executives | 12/16/24 | ASAP | [Une Femme] Executive Interview Confirmation | Individual calendar invites |
| UF-006 | Status Update | Zach Pelka | 12/19/24 | HARD | [Une Femme] Week 1 Status & Preliminary Findings | Survey response rate, platform status |
| UF-007 | Deliverable | All Executives | 12/20/24 | HARD | [Une Femme] Preliminary Findings & Week 2 Sprint Focus | Briefing deck, sprint recommendations |

#### Week 2 Launch Emails
| ID | Email Category | To | Target Date | Flexibility | Subject | Key Content |
|----|----------------|-----|-------------|-------------|---------|-------------|
| UF-008 | Training | Group 1 & 2 | 12/20/24 | HARD | [Une Femme] Week 2 Schedule - All Programs Launch Monday | Training times, pre-work |
| UF-009 | Platform | All 11 Users | 12/20/24 | HARD | [Une Femme] URGENT: AI Platform Setup Required | Setup instructions, credentials |
| UF-010 | Sprint | Sprint Team | 12/23/24 | HARD | [Une Femme] Integration Sprint Kickoff - Monday 2PM | Requirements, access needs |

## Template Library

### Available Templates
1. **Kickoff Invitation** (POC and All-Team versions)
2. **Executive Interview Scheduler**
3. **Survey Launch** 
4. **Weekly Status Update**
5. **Training Session Reminder**
6. **Platform Setup Instructions**
7. **Sprint Workshop Agenda**
8. **Post-Module Survey**
9. **Findings Presentation Invite**

### Template Variables
Templates support dynamic variables:
- `{{RECIPIENT}}`: Personalized recipient name
- `{{DATE}}`: Dynamic date insertion
- `{{TIME}}`: Meeting time
- `{{ZOOM_LINK}}`: Video conference link
- `{{SENDER}}`: Happy Robots team member name
- `{{WEEK_NUMBER}}`: Current project week

## Contact Management

### Contact Categories
- **Executives**: Decision makers (Jen, Zach, Sam, Thomas)
- **Group 1**: Operations team (Evyn, Micha, Sara)
- **Group 2**: Sales/Marketing team (Whitney, Joe, Kait, Kimberly)
- **Happy Robots**: Project team members

### Special Contact Notes
- **Zach Pelka**: PRIMARY POC - All major decisions
- **Sam Barnes**: Skeptical - fee at risk, handle carefully
- **Time Zones**: Mostly PST, Kimberly in CST
- **Preferences**: Individual availability and communication styles

## Tracking Dashboard Metrics

Create a summary sheet with:
- **Total Emails by Phase**: Quick count of communications per phase
- **Response Rate**: % of emails requiring response that received one
- **On-Time Rate**: % sent by target date
- **Outstanding Items**: Filter for "Follow-up Needed = Y"

## Usage Best Practices

### Daily Operations
1. **Morning Check**: Review Dashboard for today's items
2. **Update Status**: Mark emails as sent when completed
3. **Log Responses**: Record when replies are received
4. **Check Follow-ups**: Review Follow-Up Queue for overdue items

### Weekly Reviews
1. **Run Weekly Report**: Generate comprehensive status update
2. **Update Timeline**: Adjust future dates based on progress
3. **Review Response Rates**: Follow up on non-responsive recipients
4. **Archive Completed**: Move finished items to maintain clean view

### Data Entry Guidelines
- **Consistent Naming**: Use dropdown values consistently
- **Complete Information**: Fill all relevant fields
- **Regular Updates**: Update status as work progresses
- **Clear Notes**: Document important context or changes

## Special Tracking Considerations

Given Une Femme's characteristics:
- **Flag Sam Barnes emails** - She's skeptical with fee at risk
- **Note Zach as PRIMARY** - All major decisions go through him
- **Track GROUP assignments** - Group 1 (Ops) vs Group 2 (Sales/Marketing)
- **Wine/CPG customization** - Note which templates need industry examples
- **Lean team flexibility** - Track scheduling preferences/constraints

## Troubleshooting

### Common Issues
- **Formulas Not Working**: Check that all sheets are properly named
- **Dropdowns Empty**: Verify Configuration sheet data ranges
- **Dashboard Not Updating**: Run "Refresh Dashboard" from custom menu
- **Permissions Errors**: Ensure proper Google Sheets sharing settings

### Data Recovery
- **Accidental Deletion**: Check version history (File > Version history)
- **Formula Errors**: Reset formulas using the initialization function
- **Sheet Corruption**: Re-run `initializeTemplate()` function

Would you like me to create specific email templates for any of these critical communications, or add additional tracking fields to the spreadsheet?