// All the words. Change the jokes here without touching any logic.

import { rand } from "./fx.js";

export const THEMES = [
  { id: "clean", name: "clean clout", desc: "off-white, acid lime, huge type", swatches: ["#F6F5F0", "#C8FF2E", "#CDBEFF"] },
  { id: "wrapped", name: "wrapped mode", desc: "dark, glowing blobs, glass", swatches: ["#0A0A0C", "#D9FF3F", "#B794FF"] },
  { id: "bento", name: "pastel bento", desc: "cream, soft tiles, chunky type", swatches: ["#FFF4E6", "#FFD6C2", "#CFE3FF"] },
  { id: "chrome", name: "ai slop chrome", desc: "dreamy gradients, chrome text", swatches: ["#FFB3E1", "#C7B8FF", "#9DF3FF"] },
  { id: "deadpan", name: "corporate deadpan", desc: "serious app, unhinged copy", swatches: ["#FFFFFF", "#2563EB", "#0F172A"] },
];

export const SLANG = ["aura farming", "6-7", "mogging", "crash out", "glazing", "twin", "unc", "7x7=49", "navy blue", "for the huzz", "womp womp", "chopped", "delulu is the solulu"];

export const DEMO_RESUME = [
  "Won Smart India Hackathon (internal round)",
  "Participated in 14 hackathons",
  "Core member of 6 clubs",
  "Solved 400 LeetCode problems",
  "Proficient in MS Word and PowerPoint",
  "Hello World in 7 languages",
  "Contributed to open source (fixed a typo)",
  "Completed 23 free certificate courses",
  "Summer internship at uncle's startup",
  "Passionate, hardworking team player",
  "Full-stack developer (made a to-do app)",
  "9.1 CGPA",
  "Plays cricket on weekends",
].join("\n");

export const SCAN_STATUS = [
  "consulting the council of seniors…",
  "checking if your internship is real…",
  "calculating rizz…",
  "counting participation certificates…",
  "detecting glazing…",
  "asking HR unc for a second opinion…",
  "measuring 7x7=49 energy…",
];

// Stickers used for ratings, reactions and chat.
export const STICKERS = {
  W: { label: "W", c: "lime" },
  L: { label: "L", c: "pink" },
  MID: { label: "MID", c: "grey" },
  COOKED: { label: "COOKED", c: "orange" },
  RED_FLAG: { label: "RED FLAG", c: "red" },
  GREEN_FLAG: { label: "GREEN FLAG", c: "lime" },
  NPC: { label: "NPC ENERGY", c: "grey" },
  AURA: { label: "AURA +1000", c: "yellow" },
  DELULU: { label: "DELULU", c: "lilac" },
  SIGMA: { label: "SIGMA", c: "black" },
  RATIO: { label: "RATIO", c: "sky" },
  SIX7: { label: "6-7", c: "yellow" },
  TWIN: { label: "TWIN", c: "sky" },
  UNC: { label: "UNC", c: "grey" },
  MOGGED: { label: "MOGGED", c: "lilac" },
  CRASH: { label: "CRASH OUT", c: "orange" },
  GLAZER: { label: "GLAZER", c: "pink" },
  SEVEN: { label: "7x7=49", c: "lime" },
  CHOPPED: { label: "CHOPPED", c: "black" },
  HUZZ: { label: "FOR THE HUZZ", c: "pink" },
  WOMP: { label: "WOMP WOMP", c: "sky" },
};

// Pick 5 that describe you.
export const PERSONALITY = [
  ["NO THANKS I USE AI", "yellow"], ["3AM DEBUGGER", "black"], ["7x7=49 ENERGY", "lime"],
  ["NAVY BLUE TYPA VIBE", "sky"], ["CHAI > COFFEE", "orange"], ["CERTIFIED YAPPER", "pink"],
  ["MAIN CHARACTER", "lilac"], ["HACKATHON TOURIST", "lime"], ["TOUCHES GRASS (RARELY)", "grey"],
  ["RIZZ IN EXCEL", "sky"], ["DELULU BUT DEDICATED", "lilac"], ["GROUP PROJECT CARRIER", "yellow"],
  ["LINKEDIN LUNATIC", "pink"], ["AURA FARMER", "black"], ["CRASHES OUT POLITELY", "orange"], ["UNC AT 19", "grey"],
];

export const JOBS = [
  {
    id: "ohio", title: "cracked intern", company: "Ohio Ventures", logo: "OV", color: "#FF5FC1",
    posted: "2m ago", applicants: "4,000", vibe: 87,
    tags: ["zero yapping", "9am standups", "unpaid", "\"fast-paced\""],
    stipend: "exposure + 1 company hoodie (size S only)",
    reqs: ["zero yapping (we will check)", "must survive 9am standups", "5 years of experience (it's an internship)", "must say \"let's circle back\" unironically"],
    boss: "HR unc", attacks: [{ name: "WE'LL CIRCLE BACK", text: "you feel ignored.", min: 10, max: 16 }],
  },
  {
    id: "thursday", title: "senior vibe engineer", company: "Thursday Labs", logo: "TL", color: "#1E3A8A",
    posted: "1h ago", applicants: "49", vibe: 77,
    tags: ["7x7=49 energy", "navy blue typa vibe", "hybrid"],
    stipend: "₹49,000 (7x7, obviously)",
    reqs: ["must have 7x7=49 energy", "navy blue typa vibe (navy blue bedsheets = instant red flag)", "thursday 4pm aura. 9x9=81 is a plus", "must not crash out during standups"],
    boss: "the vibe auditor", attacks: [{ name: "VIBE CHECK", text: "your aura is being audited.", min: 12, max: 18 }],
  },
  {
    id: "synergy", title: "junior dev (entry level)", company: "Synergy Inc", logo: "SI", color: "#0EA5E9",
    posted: "3d ago", applicants: "11,204", vibe: 41,
    tags: ["entry level", "7 yrs exp", "\"family\""],
    stipend: "market standard (the market is closed)",
    reqs: ["7 years of experience in a framework released last year", "must be a \"rockstar ninja\"", "we're a family (unpaid overtime)", "glazing the CEO on linkedin weekly"],
    boss: "recruiter karen", attacks: [{ name: "WHY IS THERE A GAP IN YOUR RESUME", text: "it was summer vacation.", min: 14, max: 20 }],
  },
  {
    id: "grindset", title: "chief vibe officer", company: "GrindsetHQ", logo: "GH", color: "#111111",
    posted: "5h ago", applicants: "777", vibe: 69,
    tags: ["5am club", "cold plunge", "podcast"],
    stipend: "equity in a podcast with 12 listeners",
    reqs: ["post \"day 1 of learning dsa\" daily for 365 days", "attend the 5am club (mandatory)", "for the huzz (results not guaranteed)", "must call the founder \"visionary\""],
    boss: "the founder (22, has a podcast)", attacks: [{ name: "HUSTLE LECTURE", text: "45 minutes on waking up at 4am.", min: 12, max: 19 }],
  },
  {
    id: "rizzosoft", title: "sigma software engineer", company: "Rizzosoft", logo: "RZ", color: "#16A34A",
    posted: "12m ago", applicants: "6,767", vibe: 93,
    tags: ["no meetings", "no yapping", "only grinding"],
    stipend: "1 pizza per sprint",
    reqs: ["no meetings, no yapping, only grinding", "must mog the competition in code review", "twin-coded team, matching hoodies", "aura > experience"],
    boss: "tech lead who says \"quick call?\"", attacks: [{ name: "QUICK CALL?", text: "it lasted 2 hours.", min: 13, max: 19 }],
  },
];

export const GHOST_TOASTS = [
  "ghosted them first. +10 aura.",
  "left on read. by YOU. iconic.",
  "skipped. their loss, twin.",
  "womp womp for them.",
];

// ---------- boss fight ----------
export const YOUR_HP = 120;
export const BOSS_HP = 100;

// Every move returns what happened. Optional fields:
//   dmg (to the boss), self (to you), heal (to you), effect: "dodge" | "stun" | "charge"
// You get a hand of 3 random moves each turn, plus "ask about salary" (always there, never a good idea).
export const MOVES = [
  { id: "excel", name: "mention excel", hint: "10–18 dmg", run: () => ({ dmg: rand(10, 18), text: "you mentioned excel. the boss is mildly impressed." }) },
  {
    id: "cert", name: "show hackathon cert", hint: "risky crit",
    run: () => (Math.random() < 0.35
      ? { dmg: 5, text: "it was a participation cert. 5 dmg. womp womp." }
      : { dmg: rand(28, 40), text: "CRITICAL HIT. it actually says \"winner\"." }),
  },
  { id: "glaze", name: "glaze the manager", hint: "30 dmg · costs dignity", run: () => ({ dmg: 30, self: 10, text: "\"sir, your podcast changed my life.\" 30 dmg. −10 dignity." }) },
  {
    id: "github", name: "drop your github link", hint: "depends on your commits",
    run: () => (Math.random() < 0.5
      ? { dmg: 24, text: "green squares everywhere. HR squints. 24 dmg." }
      : { dmg: 6, text: "3 forks and a todo app. 6 dmg. HR is unimpressed." }),
  },
  { id: "learner", name: "\"i'm a quick learner\"", hint: "+22 hp", run: () => ({ heal: 22, text: "you said it with your whole chest. you believed it. +22 hp." }) },
  { id: "lag", name: "pretend your wifi died", hint: "dodge next attack", run: () => ({ effect: "dodge", text: "\"sorry, you're breaking up…\" HR's next attack will hit a frozen frame." }) },
  { id: "reverse", name: "\"any questions for me?\"", hint: "8 dmg · HR skips a turn", run: () => ({ dmg: 8, effect: "stun", text: "you flipped the interview. HR is buffering. 8 dmg." }) },
  { id: "farm", name: "aura farm", hint: "next hit does 2×", run: () => ({ effect: "charge", text: "you stared into the middle distance in silence. aura charging…" }) },
  {
    id: "six7", name: "say 6-7", hint: "6 or 7 dmg (or…?)",
    run: () => (Math.random() < 0.12
      ? { dmg: 67, text: "HR laughed so hard they lost 67 hp. the meme still works." }
      : { dmg: rand(6, 7), text: "6-7. HR is unc, they didn't get it." }),
  },
  {
    id: "startup", name: "pitch your startup idea", hint: "40 dmg or backfire",
    run: () => (Math.random() < 0.5
      ? { dmg: 40, text: "\"uber for chai.\" HR is quietly investing. 40 dmg." }
      : { self: 15, text: "\"tinder but for class notes.\" HR blocked you on linkedin. 15 dmg to you." }),
  },
  {
    id: "gpt", name: "use chatgpt live", hint: "20 dmg · might get caught",
    run: () => (Math.random() < 0.3
      ? { self: 20, text: "you said \"as an AI language model\" out loud. 20 dmg to you." }
      : { dmg: 20, text: "the answer was perfect. suspiciously perfect. 20 dmg." }),
  },
  { id: "salary", name: "ask about salary", hint: "trust me bro", run: () => ({ self: 35, text: "HR used \"it's a learning opportunity\". it bounced back. 35 dmg to you." }) },
];

// Fight copy that isn't a move or an attack
export const FIGHT_TEXT = {
  opener: (boss) => `${boss} wants to know your expected stipend. choose wisely.`,
  charged: (dmg) => `aura farm doubled it: ${dmg} dmg total.`,
  dodged: "…but your wifi \"died\". it missed.",
  stunned: (boss) => `${boss} is still buffering. they skipped their turn.`,
  rage: (boss) => `${boss} entered unpaid-overtime mode. attacks hit harder now.`,
  fx: { dodge: "wifi \"down\"", charge: "2× charged", stun: "buffering", rage: "rage mode" },
};

export const BOSS_ATTACKS = [
  { name: "AWKWARD SILENCE", text: "it's super effective.", min: 8, max: 14 },
  { name: "WHERE DO YOU SEE YOURSELF IN 5 YEARS", text: "you said \"here\". wrong.", min: 12, max: 18 },
  { name: "IS THIS YOUR FINAL CGPA?", text: "emotional damage.", min: 10, max: 16 },
  { name: "PER MY LAST EMAIL", text: "passive aggression lands.", min: 9, max: 15 },
];

// ---------- post generator ----------
export const POST_TEMPLATES = [
  (j) => `Humbled and honoured to announce that I have accepted an unpaid role as ${j.title} at ${j.company}. 🙏\n\nThis journey taught me 7 lessons about leadership:\n1. Mention Excel.\n2. Never ask about salary.\n3. Glaze responsibly.\nThe other 4 are in my course (₹4,999).\n\n#grateful #aurafarming #opentowork`,
  (j) => `After 47 rejections, 3 boss fights and 1 crash out, I'm thrilled to share that ${j.company} has finally noticed my aura.\n\nStarting as ${j.title} on Monday (yesterday).\n\nAgree? 👇`,
  (j) => `I didn't get this offer. I manifested it. Delulu is the solulu. ✨\n\n${j.title} @ ${j.company}\nStipend: ${j.stipend}\nVibes: 7x7=49\n\nThank you to my mentors, my chai, and the huzz for believing in me.`,
];

// ---------- HR chat bot ----------
export const HR_OPENERS = [
  "Hi! Quick q: can you solve a DSA problem live, with no help?",
];

// Reply to a sticker you send. stk = sticker HR sends back, text = message.
export const HR_STICKER_REPLIES = {
  MEME: [{ stk: "L" }, { text: "we'll get back to you." }],
  SIX7: [{ text: "what does that mean. is that your expected CTC?" }],
  W: [{ text: "love the energy. it's unpaid though." }],
  L: [{ stk: "RATIO" }],
  COOKED: [{ text: "we prefer \"high-growth environment\"." }],
  TWIN: [{ text: "we are not twins. I am your manager." }],
  UNC: [{ stk: "MOGGED" }, { text: "respect your elders." }],
  HUZZ: [{ text: "this is a professional platform." }, { text: "(seen)" }],
  WOMP: [{ stk: "WOMP" }],
  SEVEN: [{ text: "7x7=49? we only hire 9x9=81 energy." }],
  DELULU: [{ text: "delulu is not the solulu. the solulu is unpaid overtime." }],
  CRASH: [{ stk: "NPC" }, { text: "please keep crash outs to the designated crash out room." }],
  GLAZER: [{ text: "thank you, I know. still no stipend." }],
};

export const HR_DEFAULT_REPLIES = [[{ stk: "NPC" }], [{ text: "per my last email…" }], [{ stk: "MID" }], [{ text: "noted. (it was not noted)" }]];

// Reply to text you type (words are "banned", but HR answers anyway).
export const HR_TEXT_REPLIES = [
  [/salary|stipend|pay|ctc|money|paid/i, "it's a learning opportunity."],
  [/leave|holiday|vacation|off/i, "leave? we're a family here."],
  [/wfh|remote|work from home/i, "remote means office 6 days a week."],
  [/when|update|status|result|selected/i, "we'll circle back. (we won't)"],
  [/\b(hi|hello|hey|sir|ma'?am)\b/i, "hello. are you comfortable working weekends?"],
  [/thank/i, "👍"],
  [/.*/, "words are banned here. reply in stickers, bestie."],
];

// ---------- the ghosted hand ----------
// Path to your own hand image/GIF (e.g. "assets/hand.png"). Leave null to use the built-in cartoon hand.
export const HAND_IMAGE = null;

// ---------- mock profiles (the "batch leaderboard") ----------
// Fictional classmates. Sticker colours use the fixed sticker palette.
export const MOCK_PROFILES = [
  {
    id: "kabir", name: "kabir.exe", color: "#C8FF2E", ink: "#10200A", aura: 2140,
    headline: "hackathon tourist | 14 participation certs | ex-intern at a startup that pivoted 6 times",
    stickers: [["HACKATHON TOURIST", "lime"], ["CERTIFIED YAPPER", "pink"], ["3AM DEBUGGER", "black"], ["NO THANKS I USE AI", "yellow"], ["DELULU BUT DEDICATED", "lilac"]],
    stats: [["certificates", "14"], ["hackathons won", "0"], ["energy drinks", "∞"]],
    endorsed: "endorsed for \"fixing the projector\" by 12 people",
    post: "humbled and honoured to share that i participated in my 14th hackathon 🙏\n\nwe did not win. we did not finish. the wifi did not work.\n\nbut the real prize was the free t-shirt we made along the way.\n\n#grateful #hackathon #nosleep",
    reactions: { W: 14, DELULU: 22, WOMP: 9 },
  },
  {
    id: "tanvi", name: "tanvi | core ×6", color: "#CDBEFF", ink: "#1E1340", aura: 3780,
    headline: "president of 3 clubs | vp of 2 | core member of the 6th | networking is my love language",
    stickers: [["MAIN CHARACTER", "lilac"], ["LINKEDIN LUNATIC", "pink"], ["GROUP PROJECT CARRIER", "yellow"], ["7x7=49 ENERGY", "lime"], ["CRASHES OUT POLITELY", "orange"]],
    stats: [["clubs", "6"], ["meetings / week", "23"], ["sleep", "4h"]],
    endorsed: "endorsed for \"making a google form for everything\" by 67 people",
    post: "what being core member of 6 societies taught me about leadership 🧵\n\n1. calendars are a social construct\n2. every meeting could have been a whatsapp poll\n3. i have not attended a class since august\n\nagree?",
    reactions: { AURA: 49, GLAZER: 31, CRASH: 7 },
  },
  {
    id: "rohan", name: "rohan (day 412)", color: "#FF8A3D", ink: "#2A1200", aura: 940,
    headline: "day 412 of learning dsa | 5am club | building in public (nobody asked)",
    stickers: [["AURA FARMER", "black"], ["UNC AT 19", "grey"], ["CHAI > COFFEE", "orange"], ["TOUCHES GRASS (RARELY)", "grey"], ["RIZZ IN EXCEL", "sky"]],
    stats: [["streak", "412d"], ["problems solved", "9"], ["cold plunges", "87"]],
    endorsed: "endorsed for \"waking up early\" by 5 people (all at 5am)",
    post: "day 412 of learning dsa.\n\ntoday i solved two sum.\nagain.\n\nconsistency > talent. see you tomorrow at 5am.\n\n#100daysofcode (it has been 412)",
    reactions: { UNC: 41, WOMP: 19, SIGMA: 6 },
  },
];

// Mog check: compare your aura with theirs
export const MOG_VERDICTS = {
  win: "you mog them. respectfully.",
  tie: "dead even. it's giving twin.",
  lose: "you got mogged. it's ok, unc.",
  none: "scan your resume first. you can't mog with 0 aura.",
};

export const CONNECT_TOASTS = [
  "request sent. they'll accept in 6-7 business days.",
  "they viewed your profile and left. classic.",
  "pending. like your internship applications.",
];
