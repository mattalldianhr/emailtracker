# Une Femme Wines Email Dependencies & Sequencing Map

## Overview

This document maps all email dependencies to ensure proper sequencing and prevent out-of-order communications. Each email has specific prerequisites that must be completed before sending.

---

## PRE-ENGAGEMENT PHASE DEPENDENCIES

### UF-001: Initial Program Agreement Follow-up
- **Dependencies:** None (Kickoff email)
- **Triggers:** SOW discussion completed
- **Blocks:** All subsequent emails until sent
- **SLA:** Send within 24 hours of SOW discussion

### UF-002: Documentation Package  
- **Dependencies:** 
  - ✅ UF-001 sent and acknowledged
  - ✅ SOW prepared and reviewed internally
- **Triggers:** 24 hours after UF-001 sent
- **Blocks:** UF-003, UF-004, UF-005, UF-006, UF-007
- **SLA:** Send within 48 hours of UF-001

### UF-003: Team Grouping Confirmation
- **Dependencies:**
  - ✅ UF-002 sent
  - ✅ Team member list confirmed internally
- **Triggers:** UF-002 delivery confirmed
- **Blocks:** UF-007 (welcome email), UF-019 (Week 2 prep)
- **SLA:** Send within 24 hours of UF-002

### UF-004: Executive Calendar Hold Request
- **Dependencies:**
  - ✅ UF-002 SOW approved/signed
  - ✅ Calendly setup completed
  - ✅ Interview questions prepared
- **Triggers:** SOW signature confirmed
- **Blocks:** UF-010, UF-011, UF-012, UF-013 (individual interviews)
- **SLA:** Send within 24 hours of SOW signature

### UF-005: IT Requirements and Platform Access
- **Dependencies:**
  - ✅ UF-002 sent and IT requirements approved
  - ✅ Platform security documentation prepared
- **Triggers:** IT approval received from UF-002
- **Blocks:** UF-019 (Week 2 prep), All training emails
- **SLA:** Send within 72 hours of UF-002 approval

### UF-006: Finance and Invoice Processing
- **Dependencies:**
  - ✅ UF-002 SOW signed
  - ✅ Invoice generated in system
  - ✅ Sara's email confirmed for finance
- **Triggers:** SOW signature received
- **Blocks:** Program start (payment must be processed)
- **SLA:** Send within 24 hours of SOW signature

### UF-007: Participant Welcome and Intake Forms
- **Dependencies:**
  - ✅ UF-002 SOW signed
  - ✅ UF-003 team groupings confirmed
  - ✅ Intake forms prepared and tested
  - ✅ Welcome video recorded
- **Triggers:** Team groupings confirmed AND SOW signed
- **Blocks:** UF-008, UF-009, All participant emails
- **SLA:** Send within 48 hours of prerequisites

### UF-008: Slack Channel Setup
- **Dependencies:**
  - ✅ UF-007 welcome email sent
  - ✅ Slack channel created and configured
  - ✅ All participant email addresses confirmed
- **Triggers:** 24 hours after UF-007 sent
- **Blocks:** UF-009 (references Slack in prep)
- **SLA:** Send within 24 hours of UF-007

---

## WEEK 1 PHASE DEPENDENCIES

### UF-009: Monday Morning Kickoff Reminder
- **Dependencies:**
  - ✅ UF-007 welcome sent to all participants
  - ✅ UF-008 Slack channel active
  - ✅ Zoom meeting scheduled and tested
  - ✅ Kickoff deck prepared
- **Triggers:** 2 hours before kickoff meeting
- **Blocks:** UF-014 (survey references "yesterday's kickoff")
- **SLA:** Send exactly 2 hours before meeting

### UF-010-013: Executive Interview Confirmations
- **Dependencies:**
  - ✅ UF-004 calendar holds sent
  - ✅ UF-009 kickoff completed successfully
  - ✅ Individual time slots booked via Calendly
  - ✅ Interview guides prepared per executive
- **Triggers:** Kickoff meeting completed + individual scheduling confirmed
- **Blocks:** UF-017 (thank you emails), UF-018 (progress update)
- **SLA:** Send 24 hours before each interview

### UF-014: Survey Launch
- **Dependencies:**
  - ✅ UF-009 kickoff meeting completed
  - ✅ Survey deployed and tested in TypeForm
  - ✅ Survey questions customized for Une Femme
- **Triggers:** Day after kickoff (Tuesday)
- **Blocks:** UF-015, UF-016 (reminder emails)
- **SLA:** Send Tuesday morning after Monday kickoff

### UF-015: Survey Reminder (24 Hours)
- **Dependencies:**
  - ✅ UF-014 survey launched
  - ✅ Response tracking configured
  - ✅ Non-responder list identified
- **Triggers:** 24 hours before survey deadline + <100% response rate
- **Blocks:** UF-016 (final reminder)
- **SLA:** Send exactly 24 hours before deadline

### UF-016: Survey Final Push
- **Dependencies:**
  - ✅ UF-015 reminders sent
  - ✅ Survey deadline approaching (same day)
  - ✅ Final non-responder list confirmed
- **Triggers:** Survey deadline day + outstanding responses
- **Blocks:** UF-018 (progress update needs completion status)
- **SLA:** Send morning of deadline day

### UF-017: Executive Interview Thank You Series
- **Dependencies:**
  - ✅ Individual executive interviews completed (UF-010-013)
  - ✅ Interview notes compiled
  - ✅ Key takeaways documented per executive
- **Triggers:** Within 24 hours of each interview completion
- **Blocks:** None (follow-up email)
- **SLA:** Send within 24 hours of interview

### UF-018: Week 1 Progress Update to Zach
- **Dependencies:**
  - ✅ All executive interviews completed (UF-010-013)
  - ✅ Survey responses collected (goal: 100%)
  - ✅ Platform requirements processed (UF-005)
  - ✅ Week 2 schedule confirmed
- **Triggers:** Thursday of Week 1 (before Friday prep)
- **Blocks:** UF-019 (references this update)
- **SLA:** Send Thursday afternoon Week 1

### UF-019: Friday Week 1 Prep for Week 2
- **Dependencies:**
  - ✅ UF-005 platform access confirmed for all users
  - ✅ UF-018 progress update sent
  - ✅ Week 2 schedule finalized
  - ✅ Pre-work materials prepared
- **Triggers:** Friday of Week 1
- **Blocks:** All Week 2 activities
- **SLA:** Send Friday afternoon Week 1

---

## WEEK 2 PHASE DEPENDENCIES

### UF-020: Monday Morning Launch Day
- **Dependencies:**
  - ✅ UF-019 prep email sent
  - ✅ All Week 1 deliverables completed
  - ✅ Platform access verified for all 11 users
  - ✅ Sprint targets identified
- **Triggers:** Monday morning Week 2
- **Blocks:** All Week 2 session reminders
- **SLA:** Send Monday 8am Week 2

### UF-021: Executive AI Findings Session Reminder
- **Dependencies:**
  - ✅ UF-020 launch day email sent
  - ✅ Findings presentation prepared
  - ✅ Executive survey analysis completed
- **Triggers:** 30 minutes before executive session
- **Blocks:** UF-022 (sprint planning - needs findings input)
- **SLA:** Send exactly 30 minutes before session

### UF-022: Sprint Planning Session Reminder
- **Dependencies:**
  - ✅ UF-021 executive findings session completed
  - ✅ Sprint focus areas identified
  - ✅ Miro board prepared
- **Triggers:** 30 minutes before sprint session
- **Blocks:** UF-026 (sprint updates)
- **SLA:** Send exactly 30 minutes before session

### UF-023: All-Team Launch Session Reminder
- **Dependencies:**
  - ✅ UF-020 launch email sent
  - ✅ All participants confirmed platform access
  - ✅ Session materials prepared
- **Triggers:** 30 minutes before all-team session
- **Blocks:** UF-024 (Group 1 training)
- **SLA:** Send exactly 30 minutes before session

### UF-024: Group 1 Training Session Reminder
- **Dependencies:**
  - ✅ UF-023 all-team launch completed
  - ✅ Group 1 participants confirmed
  - ✅ Module 1 materials prepared
  - ✅ Platform access verified for group
- **Triggers:** 30 minutes before Group 1 session
- **Blocks:** UF-030a (future Group 1 sessions)
- **SLA:** Send exactly 30 minutes before session

### UF-025: Platform Troubleshooting Support
- **Dependencies:**
  - ✅ Platform access issues identified
  - ✅ Troubleshooting resources prepared
  - ✅ Support channels available
- **Triggers:** User reports access issues OR proactive detection
- **Blocks:** Training participation for affected user
- **SLA:** Send within 1 hour of issue detection

### UF-026: Daily Sprint Update
- **Dependencies:**
  - ✅ UF-022 sprint planning completed
  - ✅ Sprint work in progress
  - ✅ Daily standup completed
- **Triggers:** End of each sprint day
- **Blocks:** UF-028 (demo announcement)
- **SLA:** Send each evening during sprint

### UF-027: Training Group Pre-Session Setup
- **Dependencies:**
  - ✅ Previous training session completed
  - ✅ Next session materials prepared
  - ✅ Pre-work assignments ready
- **Triggers:** 24 hours before next training session
- **Blocks:** Next training session effectiveness
- **SLA:** Send 24 hours before session

### UF-028: Demo Day Announcement
- **Dependencies:**
  - ✅ Sprint development completed
  - ✅ Demo prototype working
  - ✅ Demo script prepared
- **Triggers:** Demo day morning
- **Blocks:** None (announcement email)
- **SLA:** Send morning of demo day

### UF-029: Week 2 Wrap-Up and Celebration
- **Dependencies:**
  - ✅ All Week 2 sessions completed
  - ✅ Demo successfully delivered
  - ✅ Sprint results documented
  - ✅ Week 3 planning completed
- **Triggers:** Friday end of Week 2
- **Blocks:** UF-030a/030b (Week 3 training)
- **SLA:** Send Friday afternoon Week 2

---

## WEEKS 3-7 ONGOING DEPENDENCIES

### UF-030a/030b: Weekly Training Reminders
- **Dependencies:**
  - ✅ Previous module completed
  - ✅ Homework reviewed and feedback prepared
  - ✅ Next module materials ready
- **Triggers:** 24 hours before each training session
- **Blocks:** Module effectiveness and homework submission
- **SLA:** Send 24 hours before session

### UF-031: Homework Feedback
- **Dependencies:**
  - ✅ Homework submitted by participant
  - ✅ Review completed by instructor
  - ✅ Feedback documented
- **Triggers:** Homework review completion
- **Blocks:** Next module preparation
- **SLA:** Send within 48 hours of homework submission

### UF-032: Executive Coaching Session Scheduling
- **Dependencies:**
  - ✅ Week 1 strategy sessions completed
  - ✅ Coaching curriculum developed
  - ✅ Calendar availability confirmed
- **Triggers:** Week 3 start
- **Blocks:** Individual coaching effectiveness
- **SLA:** Send Monday of Week 3

### UF-033: Mid-Point Check-In Survey
- **Dependencies:**
  - ✅ Week 4 completion
  - ✅ Survey questions prepared
  - ✅ Mid-point assessment criteria defined
- **Triggers:** Start of Week 5
- **Blocks:** Program adjustments for Weeks 6-8
- **SLA:** Send Monday of Week 5

### UF-034: Calabrai Platform Launch
- **Dependencies:**
  - ✅ Platform configured for Une Femme
  - ✅ Initial prompts loaded
  - ✅ User accounts created
  - ✅ Training sessions scheduled
- **Triggers:** Week 4 (after basic training completed)
- **Blocks:** Advanced prompt sharing and collaboration
- **SLA:** Send when platform ready + training scheduled

---

## WEEK 8 COMPLETION DEPENDENCIES

### UF-038: Final Week Kickoff
- **Dependencies:**
  - ✅ Weeks 3-7 successfully completed
  - ✅ Week 8 schedule finalized
  - ✅ Assessment materials prepared
- **Triggers:** Monday of Week 8
- **Blocks:** UF-039, UF-040, UF-041
- **SLA:** Send Monday morning Week 8

### UF-039: Final Assessment Instructions
- **Dependencies:**
  - ✅ UF-038 final week kickoff sent
  - ✅ Assessment platform ready
  - ✅ Certification criteria defined
- **Triggers:** Assessment availability
- **Blocks:** UF-042 (completion package)
- **SLA:** Send when assessment is live

### UF-040: Executive Final Presentation
- **Dependencies:**
  - ✅ All program data collected
  - ✅ ROI analysis completed
  - ✅ Presentation materials prepared
  - ✅ Phase 2 proposal ready
- **Triggers:** Thursday Week 8
- **Blocks:** UF-043 (Phase 2 teaser)
- **SLA:** Send 24 hours before presentation

### UF-041: Final Celebration Invitation
- **Dependencies:**
  - ✅ UF-039 assessments completed
  - ✅ Certificates generated
  - ✅ Success stories compiled
- **Triggers:** Assessments completed
- **Blocks:** None (celebration email)
- **SLA:** Send when assessments complete

### UF-042: Program Completion Package
- **Dependencies:**
  - ✅ All participants completed assessment
  - ✅ Certificates generated
  - ✅ Resource portal populated
  - ✅ Access permissions configured
- **Triggers:** Final celebration completed
- **Blocks:** UF-043 (Phase 2 discussion)
- **SLA:** Send day after celebration

### UF-043: Phase 2 Teaser
- **Dependencies:**
  - ✅ UF-040 executive presentation completed
  - ✅ Program success metrics confirmed
  - ✅ Phase 2 proposal prepared
- **Triggers:** Executive presentation success
- **Blocks:** None (business development)
- **SLA:** Send Monday after completion

---

## CRITICAL PATH ANALYSIS

### Blocking Emails (High Priority)
These emails block multiple subsequent emails:

1. **UF-001**: Blocks ALL subsequent emails
2. **UF-002**: Blocks SOW-dependent activities
3. **UF-007**: Blocks all participant communications
4. **UF-009**: Blocks survey and Week 1 activities
5. **UF-019**: Blocks ALL Week 2 activities

### Non-Blocking Emails (Lower Priority)
These can be delayed without cascading effects:

- UF-017 (Thank you emails)
- UF-025 (Troubleshooting - reactive)
- UF-031 (Homework feedback)
- UF-035+ (Success stories)
- UF-036+ (Office hours)

### Parallel Processing Opportunities
These emails can be sent simultaneously:

- UF-003, UF-004, UF-005, UF-006 (all depend on UF-002 only)
- UF-015a, UF-015b (individual survey reminders)
- UF-030a, UF-030b (different group training reminders)

## AUTOMATION LOGIC REQUIREMENTS

### Trigger Conditions
1. **Time-based**: Send X hours/days after previous email
2. **Action-based**: Send when specific action completed
3. **Response-based**: Send based on email open/response
4. **Data-based**: Send when system status changes

### Fallback Procedures
1. **Manual Override**: Ability to send any email manually
2. **Dependency Skip**: Option to bypass dependencies if needed
3. **Batch Processing**: Send multiple dependent emails together
4. **Error Recovery**: Re-queue failed sends

### Monitoring Requirements
1. **Dependency Tracking**: Dashboard showing blocked emails
2. **Critical Path Alerts**: Warnings for blocking email delays
3. **Sequence Validation**: Prevent out-of-order sends
4. **Completion Tracking**: Progress through dependency chain

This dependency mapping ensures emails are sent in the correct order, prerequisites are met, and the program flows smoothly without confusion or missed dependencies.