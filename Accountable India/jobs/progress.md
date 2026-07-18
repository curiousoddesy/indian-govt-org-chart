# Collection Progress Tracker

The daily job reads this file to know **where to resume**, updates it at the end
of each run, and appends a row to `data/collection_log.csv`. This is what makes
"run daily until the dataset is complete" work across fresh sessions.

## Collection order (top-down, breadth before depth)

### PHASE 1 — Union top leadership  ⏳ IN PROGRESS
- [x] President, Vice President, Prime Minister
- [x] All 31 Cabinet Ministers (full Modi 3.0 cabinet) + ministries linked
- [x] Ministers of State (Independent Charge) — all 5
- [x] Finance Minister re-verified (Nirmala Sitharaman, confirmed)
- [x] Ministers of State (36 regular MoS) — each wired to report to their Cabinet Minister
- [ ] Ministry official contacts (office email/phone/grievance portal per ministry)

**PHASE 1 POLITICAL LAYER COMPLETE** — full Union Council of Ministers (73 ministers + President/VP) mapped.

### CONSTITUTIONAL / JUDICIAL / LEGISLATIVE HEADS  ✅ (added)
- [x] Chief Justice of India (Supreme Court) ; Attorney General
- [x] Comptroller and Auditor General (CAG) ; Chief Election Commissioner (ECI)
- [x] Lok Sabha Speaker (pending re-verify) ; Rajya Sabha (VP is ex-officio Chairman)

### DEPUTY CHIEF MINISTERS  ✅ (added)
- [x] All 28 incumbent Deputy CMs (17 states + J&K), each reporting to their CM
- [x] Bihar resolved: Samrat Choudhary sworn in as CM 15 Apr 2026 (Nitish Kumar resigned);
      Deputy CMs confirmed. Old CM appointment closed with end_date, history preserved.

### ALL PENDING/STALE CLEARED  ✅ (2026-06-26)
- [x] 36 Chief Secretaries named (all states + UTs) WITH official email + phone contacts
- [x] Union Home Secretary (Govind Mohan), A&N Lt. Governor (D.K. Joshi)
- [x] Lok Sabha Speaker (Om Birla) confirmed
- [x] 0 records remain flagged pending/stale

### PHASE 2 — Union bureaucratic layer  ✅ COMPLETE (35/36)
- [x] All 36 Union ministries have Secretary positions created
- [x] 35 of 36 have named Secretaries (source: Wikipedia list of Secretaries to GoI)
- [x] Key: Home, Finance, Defence, Foreign, MoRTH, Health, Railways, Education, Power, Agriculture, Civil Aviation, Labour, Environment, Coal, Petroleum, Food Processing, Commerce, Communications, Heavy Industries, MSME, Panchayati Raj, Ports/Shipping, Social Justice, Consumer Affairs, Tribal Affairs, Textiles, Culture, Women & Child Dev, Parliamentary Affairs, Jal Shakti, Statistics, Law & Justice, AYUSH, Skill Development, Cabinet Secretariat, PMO
- [ ] Science & Technology Secretary (position created, name not listed on Wikipedia)
- [ ] Additional / Joint / Deputy Secretaries (key ones)
- [ ] Official contact details (office email, office phone, grievance portal) per ministry

### PHASE 3 — States & UTs top leadership  ⏳ IN PROGRESS
- [x] Governors (all 28 states) + Lt. Governors stubbed for 3 legislative UTs
- [x] Chief Ministers (all 31 — 28 states + Delhi, J&K, Puducherry)
- [x] Chief Secretary offices created for all 31 (names pending verification)
- [ ] State Cabinet Ministers + portfolios (per state)
- [ ] Lt. Governors/Administrators for remaining UTs (A&N, Chandigarh, DNH&DD, Ladakh, Lakshadweep)
- [ ] Fill Chief Secretary names + state govt official contacts

### PHASE 3B — State Cabinet Ministers (per state)  ⏳ IN PROGRESS
Add each state's current Council of Ministers as positions reporting to that
state's Chief Minister (title format: "Minister of <State> (<portfolio>)").
Source = the current "[CM] ministry" Wikipedia article (current incumbents only).
- [x] Uttar Pradesh (51) - [x] Maharashtra (38) - [x] Madhya Pradesh (24)
- [x] Rajasthan (21) - [x] Gujarat (24) - [x] Karnataka (30)
- [x] Bihar (32, new Choudhary govt) - [x] West Bengal (40, new Adhikari govt)
- [x] Andhra Pradesh (23) - [x] Telangana (14)
- [x] Odisha (13) - [x] Jharkhand (10) - [x] Punjab (15)
- [x] Chhattisgarh (11) - [x] Haryana (14) - [x] Assam (18)
- [!] Tamil Nadu - DMK cabinet marked HISTORICAL (TVK/Vijay won 2026); new cabinet pending
- [!] Kerala - CM updated to V.D. Satheesan (UDF won 2026); new cabinet pending
- [x] Himachal (9) - [x] Uttarakhand (11) - [x] Delhi (6) - [x] J&K (4) - [x] Goa (10) - [x] Puducherry (5)
- [x] Tripura (11) - [x] Meghalaya (9) - [x] Manipur (2) - [x] Nagaland (9)
- [x] Arunachal (10) - [x] Mizoram (10) - [x] Sikkim (11)

**PHASE 3B COMPLETE: ALL 31 assembly states/UTs have a current cabinet.**
Tamil Nadu (TVK/Vijay, 34) and Kerala (UDF/Satheesan, 20) new-govt cabinets now added.
(The 5 administrator-run UTs have no cabinet by design.)

### 2026 ELECTION CHANGES APPLIED (results 4 May 2026)
- West Bengal: TMC out -> Suvendu Adhikari (BJP) CM + new cabinet [DONE]
- Bihar: Nitish out -> Samrat Choudhary (BJP) CM + new cabinet [DONE]
- Tamil Nadu: DMK out -> Joseph Vijay (TVK) CM [CM done; cabinet pending]
- Kerala: LDF out -> V.D. Satheesan (UDF/INC) CM [CM done; cabinet pending]
- Assam: BJP retained (Sarma) [cabinet added]
- Puducherry: AINRC retained (Rangaswamy) [unchanged]
- [ ] Jharkhand  - [ ] Assam  - [ ] Punjab  - [ ] Chhattisgarh
- [ ] Haryana  - [ ] Delhi (NCT)  - [ ] Jammu and Kashmir
- [ ] Uttarakhand  - [ ] Himachal Pradesh  - [ ] Tripura  - [ ] Meghalaya
- [ ] Manipur  - [ ] Nagaland  - [ ] Goa  - [ ] Arunachal Pradesh
- [ ] Mizoram  - [ ] Sikkim  - [ ] Puducherry

### PHASE 4 — State departments
- [ ] Each state department + its Secretary/Director
- [ ] Department official contacts

### PHASE 5 — District level  ✅ DM LAYER COMPLETE / SP LAYER ⏳
- [x] All 785 districts added as jurisdictions
- [x] DM/Collector office created for every district
- [x] **DM NAMES filled for 782/785 (99.6%)** — only 3 unfilled: Bengaluru North/South (proposed sub-districts, not separate admin units) + Kolkata (no DM by design)
- [x] Superintendent of Police office created for every district
- [x] **SP NAMES filled for 766/785 (97.6%)** — 19 blanks remain across the remaining district/commissionerate gaps
- [ ] District-level department officers

### PHASE 6 — Local bodies  ⏳ MUNICIPAL CORPORATIONS DONE
- [x] 250 Municipal Corporations added as local bodies, including the 12 Karnataka corporations
- [x] Mayor office + Municipal Commissioner office for each (Commissioner reports to district DM/state CS)
- [x] **Mayor NAMES resolved for all 250** — 194 named incumbents + 56 marked vacant (Administrator/Special Officer / pending mayoral poll; no fabricated names)
- [ ] Fill Municipal Commissioner NAMES + corporation contacts (verify via corp official sites / Chrome)
- [ ] Municipalities / Nagar Panchayats (smaller towns)
- [ ] Zila Parishad / Panchayat Samiti / Gram Panchayat heads (rural)
- [ ] Ward-level officers + contacts

## NEXT TARGET (read by next run)
> PRIORITY: Phase 6 — fill Municipal Commissioner names for the remaining empty
> commissioner seats (mirror the mayor fill approach: official corp sites + recent
> IAS transfer news; mark Administrator-only corps carefully). Then add public
> corporation contacts. After that, resume district SP gaps (19) and any remaining
> Union Secretary contact details.
>
> Official .gov.in sources only; public contacts only. NOTE: many official portals
> are JavaScript-rendered — use the Claude-in-Chrome browser tools to read them
> when a plain fetch returns an empty/JS shell.

## Last updated
2026-07-18 (Mayor fill wave: 101 new mayor names + 56 vacant flags; all 250 mayor seats resolved. Sources: Gujarat/Punjab/Haryana/HP/Kerala/MH/JH/UK 2025–26 civic polls + official MC sites. Vacant by design: AP Special Officers, WB board dissolutions, RJ pending ULB polls, TG/JK SO, several KA corps without elected council, Odisha Rourkela/Sambalpur/Puri, Silchar/Imphal, Pathankot hung house, Hoshiarpur post-poll mayoral election pending.)
