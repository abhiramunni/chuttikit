/* ChuttiKit QA — headless jsdom, no external resources. */
/* Ground truth (verified by hand against the DoPT 2027 list, and by running
   the app's own bridge algorithm in jsdom on 27 Nov 2026):
   HOLIDAYS: 36 entries = 18 gazetted (17 in 2027 + Christmas 2026) + 12 restricted + 6 Kerala.
   Bridges (5-day week, gazetted only): 13 distinct windows — 16 gazetted dates
   collapse to 13 because Holi+Good Friday, Ram Navami+Mahavir and
   Id-ul-Zuha+Buddha Purnima share one best window each, and 15 Aug has two entries.
   Ranked by (days - leave), then days:
     1 Holi 23–28 Mar 6d/2L (Wed 24 + Thu 25) free 1, one 4
     2 Ram Navami 15–20 Apr 6d/2L (Fri 16 + Tue 20) free 1, one 5
     3 Id-ul-Zuha 15–20 May 6d/2L (Tue 18 + Wed 19) free 3, one 4
     4 Republic Day 23–27 Jan 5d/2L (Mon 25 + Wed 27) free 1, one 4
     5 Id-ul-Fitr 10–14 Mar 5d/2L (Thu 11 + Fri 12) free 1, one 2
     6 Muharram 16–20 Jun 5d/2L (Thu 17 + Fri 18)
     7 Janmashtami 25–29 Aug 5d/2L (Thu 26 + Fri 27)
     8 Diwali 29 Oct–2 Nov 5d/2L (Mon 1 + Tue 2) free 3, one 4
     9 Independence Day 14–17 Aug 4d/2L (Mon 16 + Tue 17) free 2, one 3
    10 Gandhi Jayanti 2–5 Oct 4d/2L (Mon 4 + Tue 5)
    11 Dussehra 9–12 Oct 4d/2L (Mon 11 + Tue 12)
    12 Guru Nanak 13–16 Nov 4d/2L (Mon 15 + Tue 16)
    13 Christmas 25–28 Dec 4d/2L (Mon 27 + Tue 28)
   Filters: free (free>=3) = 2 (Id-ul-Zuha, Diwali); one (one>=4) = 5
   (Holi, Ram Navami, Id-ul-Zuha, Republic, Diwali); five (best>=5) = 8.
   Seed plan: used 6 leave days, 16 days off, 12 left of 18.
   January 2027: 31 days, 1 Jan is a Friday (5 leading blanks); holidays 1, 14, 15, 26 Jan.
   Countdown: next holiday Christmas Day 2026-12-25.
   Getaways 8, guides 6.
*/
const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom') // npm install jsdom;

const html = fs.readFileSync(__dirname + '/index.html', 'utf8');
const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => {
  const msg = e.detail && e.detail.stack ? e.detail.stack.split('\n')[0] : e.message;
  if (/Could not load|getContext|Not implemented/.test(msg)) return;
  errors.push('jsdomError: ' + msg);
});
vc.on('error', e => errors.push('console.error: ' + (e && e.message ? e.message : e)));

let pass = 0, fail = 0;
function ok(cond, label) {
  if (cond) { pass++; }
  else { fail++; console.log('FAIL: ' + label); }
}
function eq(a, b, label) { ok(a === b, label + ' (got ' + JSON.stringify(a) + ', want ' + JSON.stringify(b) + ')'); }
function has(str, label) { ok(html.indexOf(str) !== -1, label); }

const dom = new JSDOM(html, {
  url: 'https://abhiramunni.github.io/chuttikit/',
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  virtualConsole: vc
});
const { window } = dom;
const { document } = window;
const q = s => document.querySelector(s);
const qa = s => Array.prototype.slice.call(document.querySelectorAll(s));
const K = window.ChuttiKit;

/* --- structure --- */
has('<!DOCTYPE html>', 'doctype present');
has('</html>', 'closes html');
ok(!/@@NEXT@@/.test(html), 'no chunk markers left');
ok(!/{{HERO_IMG}}/.test(html) && !/{{FLATLAY_IMG}}/.test(html), 'no image placeholders left');
ok((html.match(/data:image\/webp;base64/g) || []).length === 2, '2 embedded images');
ok(!/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(html), 'no pictographic emoji');
ok(!/[\u2713\u2714\u2605\u25BE\u2715]/.test(html), 'no dingbat glyphs');
ok(html.indexOf('/[&<>"]/g') !== -1, 'esc() regex intact');
ok(html.indexOf('/[&<>"/]/g') === -1, 'no corrupted esc() regex');
ok(!!K, 'ChuttiKit exposed');
eq(qa('img').length, 2, '2 images (hero + flat-lay)');
eq(q('#intro') && q('#introSkip') ? 1 : 0, 1, 'intro + skip present');

/* --- data --- */
eq(K.HOLIDAYS.length, 36, '36 holiday entries');
eq(K.HOLIDAYS.filter(h => h.type === 'gazetted' && h.d >= '2027-01-01').length, 17, '17 gazetted entries in 2027');
eq(K.HOLIDAYS.filter(h => h.type === 'restricted').length, 12, '12 restricted entries');
eq(K.HOLIDAYS.filter(h => h.type === 'kerala').length, 6, '6 Kerala entries');
eq(K.GETAWAYS.length, 8, '8 getaways');
eq(K.GUIDES.length, 6, '6 guides');

/* --- bridges (ground truth) --- */
var br = K.computeBridges();
eq(br.length, 13, '13 distinct bridge windows');
eq(br[0].hol.name, 'Holi', 'top bridge is Holi');
eq(br[0].bridge.days, 6, 'Holi: 6 days off');
eq(br[0].bridge.leave, 2, 'Holi: 2 leave days');
eq(br[0].bridge.start, '2027-03-23', 'Holi window starts Tue 23 Mar');
eq(br[0].bridge.end, '2027-03-28', 'Holi window ends Sun 28 Mar (covers Good Friday)');
eq(br[0].bridge.leaveDates.join(','), '2027-03-24,2027-03-25', 'Holi leave days Wed 24 + Thu 25');
eq(br[0].free.days, 1, 'Holi free window is 1 day');
eq(br[0].one.days, 4, 'Holi with 1 leave day is 4 days off');
function findBridge(name){ for (var i=0;i<br.length;i++) if (br[i].hol.name===name) return br[i]; return null; }
var rn = findBridge('Ram Navami');
eq(rn.bridge.days, 6, 'Ram Navami: 6 days off'); eq(rn.bridge.leave, 2, 'Ram Navami: 2 leave');
eq(rn.bridge.start, '2027-04-15', 'Ram Navami window starts Thu 15 Apr'); eq(rn.bridge.end, '2027-04-20', 'Ram Navami window ends Tue 20 Apr');
eq(rn.one.days, 5, 'Ram Navami with 1 leave day is 5 days off');
var zuha = findBridge('Id-ul-Zuha (Bakrid)');
eq(zuha.bridge.days, 6, 'Id-ul-Zuha: 6 days off'); eq(zuha.bridge.leave, 2, 'Id-ul-Zuha: 2 leave');
eq(zuha.free.days, 3, 'Id-ul-Zuha free window is 3 days');
var rep = findBridge('Republic Day');
eq(rep.bridge.days, 5, 'Republic Day: 5 days off'); eq(rep.bridge.leave, 2, 'Republic Day: 2 leave');
eq(rep.bridge.start, '2027-01-23', 'Republic window starts Sat 23 Jan'); eq(rep.bridge.end, '2027-01-27', 'Republic window ends Wed 27 Jan');
eq(rep.one.days, 4, 'Republic with 1 leave day is 4 days off');
var eid = findBridge('Id-ul-Fitr');
eq(eid.bridge.days, 5, 'Id-ul-Fitr: 5 days off'); eq(eid.bridge.leave, 2, 'Id-ul-Fitr: 2 leave');
eq(eid.bridge.start, '2027-03-10', 'Id-ul-Fitr window starts Wed 10 Mar'); eq(eid.bridge.end, '2027-03-14', 'Id-ul-Fitr window ends Sun 14 Mar');
var diw = findBridge('Diwali (Deepavali)');
eq(diw.bridge.days, 5, 'Diwali: 5 days off'); eq(diw.bridge.leave, 2, 'Diwali: 2 leave');
eq(diw.bridge.start, '2027-10-29', 'Diwali window starts Fri 29 Oct'); eq(diw.bridge.end, '2027-11-02', 'Diwali window ends Tue 2 Nov');
eq(diw.free.days, 3, 'Diwali free window is 3 days');
var indep = findBridge('Independence Day');
eq(indep.bridge.days, 4, 'Independence Day: 4 days off'); eq(indep.bridge.leave, 2, 'Independence Day: 2 leave');
eq(indep.bridge.start, '2027-08-14', 'Independence window starts Sat 14 Aug');
var xmas = findBridge('Christmas Day');
eq(xmas.bridge.days, 4, 'Christmas 2027: 4 days off'); eq(xmas.bridge.leave, 2, 'Christmas 2027: 2 leave');
eq(xmas.bridge.start, '2027-12-25', 'Christmas window starts Sat 25 Dec');
/* Good Friday and Mahavir Jayanti share a window with a neighbour — no separate card */
eq(findBridge('Good Friday'), null, 'Good Friday shares Holi\'s window (no separate card)');
eq(findBridge('Mahavir Jayanti'), null, 'Mahavir Jayanti shares Ram Navami\'s window (no separate card)');
ok(q('#bridgeGrid').textContent.indexOf('Holi + Good Friday') !== -1, 'Holi card is titled "Holi + Good Friday"');
ok(q('#bridgeGrid').textContent.indexOf('Ram Navami + Mahavir Jayanti') !== -1, 'Ram Navami card is titled "Ram Navami + Mahavir Jayanti"');

/* --- seed plan totals --- */
var t = K.planTotals();
eq(t.used, 6, 'seed plan: 6 leave days used');
eq(t.off, 16, 'seed plan: 16 days off');
eq(t.left, 12, 'seed plan: 12 days left of 18');
eq(q('#balUsed').textContent, '6', 'balance tile shows 6 used');
eq(q('#ringLeft').textContent, '12', 'ring shows 12 left');

/* --- rendered DOM --- */
eq(qa('.ymini').length, 12, '12 mini-month cards');
eq(q('#statBridges').textContent, '13', 'stat strip shows 13 breaks');
eq(qa('#bridgeGrid .bridge').length, 13, '13 bridge cards rendered');
eq(qa('#planList .planc').length, 3, '3 seeded plan cards');
eq(qa('#getawayRail .gcard').length, 8, '8 getaway cards');
eq(qa('#guideGrid .guide').length, 6, '6 guide cards');
eq(q('#nextHolName').textContent, 'Christmas Day', 'countdown names Christmas Day');
var daysLeft = Math.floor((new Date(2026, 11, 25) - Date.now()) / 86400000);
eq(q('#cdD').textContent, String(daysLeft), 'countdown days to Christmas 2026');
/* January 2027 grid: 1 Jan is Friday -> 5 leading blanks; 31 day cells */
eq(qa('#calGrid .day').length, 36, 'Jan grid: 5 blanks + 31 days');
eq(qa('#calGrid .day:not(.empty)').length, 31, 'Jan grid: 31 day cells');
eq(q('#monthTitle').textContent, 'January 2027', 'month title January 2027');
ok(q('#calGrid').textContent.indexOf('Republic Day') !== -1, 'Jan grid shows Republic Day');
ok(q('#calGrid').textContent.indexOf("New Year's Day") !== -1, 'Jan grid shows New Year\'s Day');

/* --- filters --- */
function clickChip(f){
  var btn = q('#bridgeFilters [data-f="' + f + '"]');
  btn.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
}
clickChip('free'); eq(qa('#bridgeGrid .bridge').length, 2, 'free filter: 2 bridges');
clickChip('five'); eq(qa('#bridgeGrid .bridge').length, 8, 'five filter: 8 bridges');
clickChip('one'); eq(qa('#bridgeGrid .bridge').length, 5, 'one filter: 5 bridges');
clickChip('all'); eq(qa('#bridgeGrid .bridge').length, 13, 'all filter back to 13');

/* --- month nav --- */
q('#nextMonth').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
eq(q('#monthTitle').textContent, 'February 2027', 'next month -> February 2027');
q('#prevMonth').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
eq(q('#monthTitle').textContent, 'January 2027', 'prev month -> January 2027');

/* --- day sheet --- */
var jan26 = q('#calGrid [data-d="2027-01-26"]');
jan26.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
ok(q('#daySheet').classList.contains('open'), 'day sheet opens on day click');
ok(q('#daySheetBox').textContent.indexOf('Republic Day') !== -1, 'day sheet names Republic Day');
ok(q('#daySheetBox').textContent.indexOf('Add this break to my plan') !== -1, 'day sheet offers the bridge');
q('#daySheetBox [data-close-sheet]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
ok(!q('#daySheet').classList.contains('open'), 'day sheet closes');

/* --- plan actions: add the Diwali bridge (5 days off, 2 leave) --- */
var before = K.planTotals();
var diwKey = null;
br.forEach(function(b){ if (b.hol.name === 'Diwali (Deepavali)') diwKey = b.key; });
var diwBtn = document.querySelector('[data-add-bridge="' + diwKey + '"]');
ok(!!diwBtn, 'Diwali add-to-plan button exists');
diwBtn.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
var t2 = K.planTotals();
eq(t2.used, before.used + 2, 'adding Diwali uses 2 extra leave days');
eq(t2.off, before.off + 5, 'adding Diwali adds 5 days off');
eq(qa('#planList .planc').length, 4, 'plan list now has 4 cards');
/* remove a plan */
var delBtn = q('#planList [data-del-plan]');
delBtn.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
eq(qa('#planList .planc').length, 3, 'deleting a plan removes its card');
/* remove samples — the user-added Diwali plan stays (2 leave days) */
q('#removeSamplesBtn').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
eq(qa('#planList .planc').length, 1, 'remove samples leaves only the user-added Diwali plan');
eq(K.planTotals().used, 2, '2 leave days used after removing samples');

/* --- letter --- */
ok(q('#ltText').value.indexOf('Subject: Leave application') !== -1, 'letter renders from the remaining plan');

/* --- errors --- */
eq(errors.length, 0, 'zero uncaught JS errors' + (errors.length ? ' — ' + errors.join(' | ') : ''));

console.log('\nQA: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
