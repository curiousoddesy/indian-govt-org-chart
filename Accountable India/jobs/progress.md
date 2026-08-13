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
- [x] Rajasthan (21) - [x] Gujarat (24) - [x] Karnataka (13-member Shivakumar ministry, Jun 2026)
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

### PHASE 5 — District level  ✅ DM + SP LAYERS COMPLETE
- [x] All 785 districts added as jurisdictions
- [x] DM/Collector office created for every district
- [x] **DM NAMES resolved for all 785** — 784 named + 1 vacant by design (Kolkata has no DM). Bengaluru North/South filled (renamed Rural/Ramanagara districts).
- [x] Superintendent of Police office created for every district
- [x] **SP NAMES resolved for all 785** — 781 named + 4 vacant by design (Telangana commissionerate districts: Jangaon, Hanumakonda, Medchal-Malkajgiri, Ranga Reddy — CP/DCP, not district SP)
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
> PRIORITY: Weekly verification of Union ministry Secretaries and state Chief
> Secretaries (names change on IAS transfer). Then Phase 6 — fill Municipal
> Commissioner names for remaining empty commissioner seats (official corp sites
> + recent IAS transfer news; mark Administrator-only corps carefully). Then add
> public corporation contacts. Also re-verify Mizoram Lawngtlai/Saitual SP
> successors after mid-July 2026 AGMUT transfer reports.
>
> Official .gov.in sources only; public contacts only. Never fabricate names.
> NOTE: many official portals are JavaScript-rendered — use browser tools when a
> plain fetch returns an empty/JS shell.

## Last updated
2026-08-13 (Weekly high-office re-verification. Karnataka: Siddaramaiah resigned 2026-05-29; D.K. Shivakumar sworn CM 2026-06-03 with G. Parameshwara as DCM and a 13-member cabinet; leftover Siddaramaiah-ministry portfolios marked vacant. Union MoS: George Kurian resigned 2026-06-23; Ravneet Singh Bittu resigned 2026-07-24. March 2026 governor/LG reshuffle applied (Bihar Hasnain; Maharashtra Jishnu Dev Varma; Telangana Shiv Pratap Shukla; HP Kavinder Gupta; WB R.N. Ravi; TN additional charge Arlekar; Nagaland Nand Kishore Yadav; Delhi LG Taranjit Singh Sandhu; Ladakh LG V.K. Saxena). Remaining Union cabinet/MoS, CMs, DCMs, governors, and constitutional heads re-verified unchanged. Education Minister Pralhad Joshi already updated 2026-07-25. District DM/SP/mayor names not rewritten this run.)
2026-07-25 (Union Education Minister updated: Dharmendra Pradhan resigned from the Union Council of Ministers; Pralhad Joshi assigned additional charge of Ministry of Education while retaining Consumer Affairs / Food & PD and New & Renewable Energy. Source: The Hindu / Rashtrapati Bhavan.)  
2026-07-18 (DM+SP gap fill complete: all 785 DM and 785 SP seats resolved. Named Bengaluru North/South DM+SP, Keyi Panyor SP, Niwari/Panna SP, Mizoram 4 SPs, Meluri SP, Ladakh 5 new-district SPs. Vacant by design: Kolkata DM; Telangana commissionerate SP stubs. Earlier same day: all 250 mayor seats resolved.)
