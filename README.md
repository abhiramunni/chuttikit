# ChuttiKit — Plan Your 2027 Leave Like a Pro

Every 2027 Indian holiday, the long weekends hiding inside them, and a leave
planner that turns 18 days off into a year of real trips.

**Live:** https://abhiramunni.github.io/chuttikit/

## What it does

- **2027 calendar** — all 17 gazetted holidays (DoPT list, 16 July 2026), plus
  the 12 restricted holidays and 6 Kerala state holidays. Tap any month, then
  any day, for the full story.
- **Bridge finder** — for each holiday, the best unbroken break you can get
  with at most 2 leave days. Ranked by value: Holi + Good Friday is 6 days
  off for 2 leave days; Ram Navami + Mahavir Jayanti is 6 days off for 2.
  Each card also shows the no-leave and 1-leave versions, so you can decide
  how much leave a break is worth.
- **My 2027 plan** — leave-balance ring (default 18 days), add any bridge or
  your own dates, with a running total of leave used vs days off. Seeded with
  three sample breaks (Republic Day–Ooty, Ram Navami–Coorg, Diwali–Kerala).
- **Getaways** — 8 drives from Bengaluru matched to the best windows
  (Ooty, Coorg, Wayanad, Pondicherry, Hampi, Gokarna, Munnar, Kodaikanal),
  with rough budgets for two.
- **Leave letter** — pick a break from your plan and get a copy-ready email
  in formal or short style.
- **Guides** — earned vs casual vs sick leave, carry-forward & encashment,
  how to ask, central vs state vs company lists, moon-sighted dates, and the
  2-restricted-holiday rule.
- **Settings** — Monday–Friday or Monday–Saturday work week (recomputes every
  bridge), Kerala/restricted holidays as days off, remove samples, erase all.

## Facts, verified 27 Nov 2026

- Gazetted holidays 2027: Department of Personnel & Training O.M.
  No. 12/2/2023-JCA, 16 July 2026 (17 holidays; 11 fall on weekdays, 5 dates
  are lost to weekends for a Monday–Friday week).
- Kerala state dates: Government of Kerala holiday list, 1 October 2026 —
  Onam week 11–15 September 2027 (Thiruvonam Sunday 12 September), Vishu
  15 April 2027, Deepavali 28 October 2027.
- Moon-sighted dates (Id-ul-Fitr, Id-ul-Zuha, Muharram, Milad-un-Nabi) are
  tentative and can move by a day.
- State and company holiday lists differ — always check your employer's
  calendar before booking non-refundable travel.

## Tech

Single self-contained HTML file (plus two photos). No backend, no signup;
everything is stored in `localStorage` on the device. Warm editorial theme
(ivory paper, espresso ink, bronze/amber/terracotta), Fraunces + Inter,
cinematic intro with tap-to-skip, Ken Burns photography, 3-step onboarding
tour, fully responsive.

## QA

96/96 headless jsdom assertions pass, `node --check` clean, zero uncaught
JS errors. Bridge maths hand-verified: Holi 23–28 Mar 6d/2L, Ram Navami
15–20 Apr 6d/2L, Id-ul-Zuha 15–20 May 6d/2L, Republic Day 23–27 Jan 5d/2L,
Diwali 29 Oct–2 Nov 5d/2L, Independence Day 14–17 Aug 4d/2L.

## License

MIT

## Top bridges of 2027

| Break | Dates | Days off | Leave needed |
|---|---|---|---|
| Holi + Good Friday | 23–28 Mar | 6 | 2 |
| Ram Navami + Mahavir Jayanti | 15–20 Apr | 6 | 2 |
| Id-ul-Zuha + Buddha Purnima | 15–20 May | 6 | 2 |
| Republic Day | 23–27 Jan | 5 | 2 |
| Id-ul-Fitr | 10–14 Mar | 5 | 2 |
| Diwali | 29 Oct–2 Nov | 5 | 2 |
