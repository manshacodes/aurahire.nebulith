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

// Demo personas on the upload screen. Each one is written to land in a different aura tier.
export const DEMO_RESUMES = [
  {
    id: "tourist", name: "the hackathon tourist", tag: "14 hackathons, 0 sleep", c: "lime",
    lines: [
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
    ],
  },
  {
    id: "nepo", name: "the nepo intern", tag: "it's not who you know. ok it is.", c: "pink",
    lines: [
      "Summer internship at dad's company",
      "Research intern under family friend (professor)",
      "Founder of uncle's NGO's instagram page",
      "Proficient in Excel (my cousin set it up)",
      "Passionate about building generational wealth",
      "Detail-oriented go-getter",
      "Made a weather app",
      "Certificate in Leadership from a 2 hr Udemy course",
      "Linkedin following: 3,000 (mostly relatives)",
    ],
  },
  {
    id: "monk", name: "the dsa monk", tag: "has not seen sunlight since sem 2", c: "black",
    lines: [
      "Solved 1,200 LeetCode problems",
      "Codeforces Expert, CodeChef 5 star",
      "9.8 CGPA",
      "Winner, ICPC regional (1st place)",
      "Contributed to open source: 40 merged PRs on GitHub",
      "Fluent in C++, Java and Python",
      "GSoC contributor",
      "Summer intern, backend team",
      "Hobbies: more DSA",
    ],
  },
  {
    id: "lunatic", name: "the linkedin lunatic", tag: "humbled and honoured, daily", c: "sky",
    lines: [
      "LinkedIn Top Voice (self-nominated)",
      "12,000 LinkedIn followers, 4 likes per post",
      "Core member of 9 clubs",
      "Passionate, motivated, hardworking team player",
      "Full-stack developer (todo app + calculator)",
      "Proficient in MS Word, PowerPoint and Excel",
      "Completed 47 Coursera certificate courses",
      "Influencer in the tech space",
      "Hello World in 12 languages",
      "Participated in 22 hackathons",
      "Posts \"open to work\" on LinkedIn every day",
    ],
  },
  {
    id: "founder", name: "the founder (19)", tag: "uber for chai. pre-revenue.", c: "orange",
    lines: [
      "Founder & CEO of a stealth startup (AI for chai)",
      "Runner-up, college pitch competition (2 teams)",
      "Built an LLM wrapper with 3 users (all co-founders)",
      "Startup incubated at our college's e-cell",
      "Python and React developer",
      "Head of the entrepreneurship club",
      "Gym every day at 5am",
      "Machine learning enthusiast",
    ],
  },
  {
    id: "president", name: "the club president", tag: "calendar fully booked till 2029", c: "lilac",
    lines: [
      "President of the coding society",
      "Coordinator, annual tech fest",
      "NSS volunteer, 120 hours",
      "Lead organiser, 2 hackathons",
      "Also in 7 clubs",
      "Attendance: 61% (meetings)",
    ],
  },
];

// The first persona doubles as the fallback when a file can't be read
export const DEMO_RESUME = DEMO_RESUMES[0].lines.join("\n");

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
  slamFinale: "OFFER UNLOCKED",   // the big sticker at the end of the win meme slam
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

// Your first typed answer to HR's opener ("can you solve a DSA problem live?")
export const HR_OPENER_ANSWERS = [
  [/\b(yes|yeah|ya|yep|sure|ofc|of course|obviously|can)\b/i, [{ text: "great. reverse a linked list. in your head. now." }, { img: "loading" }]],
  [/\b(no|nah|nope|can'?t|cannot)\b/i, [{ text: "honesty. we hate that here." }, { img: "skill" }]],
  [/chatgpt|\bai\b|gpt|claude|copilot/i, [{ img: "erm" }, { text: "using AI in the interview? bold. still no." }]],
];

// Reply to text you type (words are "banned", but HR answers anyway). Last rule catches everything.
export const HR_TEXT_REPLIES = [
  [/salary|stipend|pay|ctc|money|paid|lpa/i, [{ img: "shook" }, { text: "it's a learning opportunity." }]],
  [/leave|holiday|vacation|day off/i, [{ text: "leave? we're a family here." }, { img: "crying" }]],
  [/wfh|remote|work from home/i, [{ text: "remote means office 6 days a week." }]],
  [/when|update|status|result|selected|offer/i, [{ text: "we'll circle back. (we won't)" }, { img: "gn" }]],
  [/chatgpt|\bai\b|gpt|claude|copilot/i, [{ img: "erm" }, { text: "we also use AI. it rejected you." }]],
  [/sorry|pls|please|beg/i, [{ text: "begging noted." }, { img: "crying" }]],
  [/\b(hi|hello|hey|sir|ma'?am)\b/i, [{ text: "hello. are you comfortable working weekends?" }, { img: "stare" }]],
  [/thank/i, [{ text: "👍" }]],
  [/.*/, [{ text: "words are banned here. reply in stickers, bestie." }]],
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
    resume: ["Participated in 14 hackathons", "Built 9 projects in 36 hours each (none deployed)", "Pitched to 'investors' (the judges)", "Proficient in caffeine"],
    larps: [
      "excited to announce i'm attending my 15th hackathon this weekend 🙏 the grind never sleeps (neither do i)",
      "unpopular opinion: participation certificates are just wins that haven't happened yet",
      "lost another hackathon. but did the judges see my vision? no. did i see theirs? also no.",
    ],
  },
  {
    id: "tanvi", name: "tanvi | core ×6", color: "#CDBEFF", ink: "#1E1340", aura: 3780,
    headline: "president of 3 clubs | vp of 2 | core member of the 6th | networking is my love language",
    stickers: [["MAIN CHARACTER", "lilac"], ["LINKEDIN LUNATIC", "pink"], ["GROUP PROJECT CARRIER", "yellow"], ["7x7=49 ENERGY", "lime"], ["CRASHES OUT POLITELY", "orange"]],
    stats: [["clubs", "6"], ["meetings / week", "23"], ["sleep", "4h"]],
    endorsed: "endorsed for \"making a google form for everything\" by 67 people",
    post: "what being core member of 6 societies taught me about leadership 🧵\n\n1. calendars are a social construct\n2. every meeting could have been a whatsapp poll\n3. i have not attended a class since august\n\nagree?",
    reactions: { AURA: 49, GLAZER: 31, CRASH: 7 },
    resume: ["President of 3 societies", "Organised 40 events (12 had attendees)", "Leadership: made a google form", "Attendance: 38%"],
    larps: [
      "thrilled to announce i've been elected core member of a 7th society. the calendar is now load-bearing.",
      "leadership is when you schedule a meeting to plan the next meeting. agree? 👇",
      "i don't attend classes. i attend *experiences*. #growth",
    ],
  },
  {
    id: "rohan", name: "rohan (day 412)", color: "#FF8A3D", ink: "#2A1200", aura: 940,
    headline: "day 412 of learning dsa | 5am club | building in public (nobody asked)",
    stickers: [["AURA FARMER", "black"], ["UNC AT 19", "grey"], ["CHAI > COFFEE", "orange"], ["TOUCHES GRASS (RARELY)", "grey"], ["RIZZ IN EXCEL", "sky"]],
    stats: [["streak", "412d"], ["problems solved", "9"], ["cold plunges", "87"]],
    endorsed: "endorsed for \"waking up early\" by 5 people (all at 5am)",
    post: "day 412 of learning dsa.\n\ntoday i solved two sum.\nagain.\n\nconsistency > talent. see you tomorrow at 5am.\n\n#100daysofcode (it has been 412)",
    reactions: { UNC: 41, WOMP: 19, SIGMA: 6 },
    resume: ["Day 412 of learning DSA", "Solved two sum (6 times)", "5am club founding member (only member)", "Cold plunge certified"],
    larps: [
      "day 413. watched a 4 hour dsa video at 2× speed. understood nothing. twice as fast.",
      "woke up at 4:59am today. you're not behind, you're just not me.",
      "they laughed at my streak. now my streak laughs at them. (i still can't reverse a linked list)",
    ],
  },
  {
    id: "meher", name: "meher.ai", color: "#8FD3FF", ink: "#062A44", aura: 3150,
    headline: "prompt engineer | ai thought leader since tuesday | building agi in my hostel room",
    stickers: [["NO THANKS I USE AI", "yellow"], ["MAIN CHARACTER", "lilac"], ["CERTIFIED YAPPER", "pink"], ["DELULU BUT DEDICATED", "lilac"], ["3AM DEBUGGER", "black"]],
    stats: [["prompts written", "9,001"], ["models trained", "0"], ["ai newsletters", "4"]],
    endorsed: "endorsed for \"knowing what an llm is\" by 31 people",
    post: "ai won't replace you.\n\na person using ai will.\n\nthat person is me. i am replacing you.\n\nfollow for more ai insights (copied from twitter)",
    reactions: { DELULU: 38, SEVEN: 12, RATIO: 4 },
    resume: ["Prompt engineer (self-taught, 3 days)", "Built an AI startup (a chatgpt wrapper)", "Speaker at 0 conferences", "Fluent in Python (imports only)"],
    larps: [
      "just asked chatgpt to write my linkedin post. it said no. agi is here.",
      "10 ai tools that will 10× your productivity (i have used none of them) 🧵",
      "my startup is like uber but for prompts. we're pre-revenue and pre-product.",
    ],
  },
  {
    id: "arjun", name: "arjun (gym era)", color: "#FFE45C", ink: "#2A2100", aura: 2560,
    headline: "cse student by day, gym sigma by night | mogging since 2024 | 7x7=49 certified",
    stickers: [["7x7=49 ENERGY", "lime"], ["AURA FARMER", "black"], ["MAIN CHARACTER", "lilac"], ["NAVY BLUE TYPA VIBE", "sky"], ["TOUCHES GRASS (RARELY)", "grey"]],
    stats: [["bench", "60kg"], ["mirror selfies", "412"], ["commits", "3"]],
    endorsed: "endorsed for \"carrying the group project (the laptop bag)\" by 9 people",
    post: "lessons from the gym that apply to coding:\n\n1. never skip leg day\n2. never skip leg day\n3. i haven't opened vs code in a month\n\nconsistency.",
    reactions: { SIGMA: 33, MOGGED: 21, NPC: 5 },
    resume: ["Gym every day (photos available)", "Built a protein tracker (spreadsheet)", "Mogged 3 people in the lab", "Knows what a for loop is"],
    larps: [
      "hit a new pr today. not a pull request. i don't do those.",
      "my code doesn't compile but my physique does. balance.",
      "ranked my batch by jawline. i'm #1. the list is attached.",
    ],
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

// ---------- identity: funny surnames + avatars ----------
// AuraGPT "assigns" you a surname from your first name. Reroll if you don't like it.
export const SURNAMES = [
  "Grindwala", "Mogwani", "Auraiyer", "Rizzvi", "Sigmanathan", "Yapadhyay", "Cookedkar", "Deluluwala",
  "Glazewala", "Larpwani", "Hustlani", "Ratiowal", "Choppedra", "Brainrotia", "Farmkar", "Unc-ikrishnan",
  "Womp-Wompkar", "Aurasinghania", "Crashoutra", "Navybluewala",
];
export const SURNAME_LINES = [
  "AuraGPT has assigned your surname.",
  "your ancestors farmed aura. it's in the name.",
  "legally, this is your name now.",
  "your surname has been decided by the council.",
];
export const DEFAULT_FIRST = "Aarav";

// Profile circle: fixed sticker colours + optional emoji face
export const AVATAR_COLORS = ["lilac", "lime", "pink", "orange", "sky", "yellow", "black", "grey"];
export const AVATAR_EMOJI = ["", "😎", "🗿", "💀", "🤓", "🐸", "🧢", "🫠", "👁️", "🦍"];

// ---------- roasting other people's profiles ----------
// "cap or fax" on each line of their resume; the batch agrees with you some % of the time
export const CAP_FAX = {
  cap: ["the batch agrees. it's cap.", "{pct}% of the batch also said cap.", "cap detected. their aura dropped."],
  fax: ["fax. respect where it's due.", "{pct}% said fax. you're not alone.", "fax. reluctant W."],
};

// The diss generator. {first} = their first name, {stat} = one of their stats
export const DISSES = [
  "{first} really put \"{stat}\" on their profile like it's a flex",
  "the only thing {first} has shipped is a linkedin post",
  "{first}'s resume is 90% fonts",
  "ratio + {first} still uses light mode",
  "{first} said \"let's connect\" and never connected",
  "{stat}? unc behaviour, {first}",
  "{first} peaked in the class whatsapp group",
  "not {first} glazing their own post in the comments",
  "{first}, this post has npc energy and you know it",
  "{first} is the reason HR says \"we'll circle back\"",
];

// What they say back when you diss them (sometimes just a sticker)
export const DISS_REPLIES = [
  { text: "thanks for the engagement 🙏 the algorithm loves you" },
  { text: "this is a safe space. reported." },
  { stk: "L", c: "pink" },
  { text: "ok but did you see my last post" },
  { stk: "COPE", c: "grey" },
  { text: "mentorship available for ₹4,999/hr" },
  { stk: "RATIO", c: "sky" },
  { text: "blocked. (they did not block you)" },
];

// ---------- AuraGPT breakdown (score screen) ----------
// Each factor is scored 0-10 in aura-engine.js; these are the labels and roasts per level.
export const FACTORS = [
  { id: "yap", label: "yap level", low: "concise. suspicious.", mid: "a healthy amount of yapping.", high: "certified yapper. HR fell asleep." },
  { id: "nepo", label: "nepo index", low: "self-made (allegedly).", mid: "a family friend may be involved.", high: "uncle-powered. the nepotism is structural." },
  { id: "delulu", label: "delulu meter", low: "grounded. touchingly realistic.", mid: "a little delulu. it's the solulu.", high: "fully delulu. main character syndrome." },
  { id: "grind", label: "grind", low: "the grind is on pause.", mid: "decent grind. unc-approved.", high: "sweaty. respectfully sweaty." },
  { id: "grass", label: "touch grass", low: "has not seen sunlight since sem 2.", mid: "touches grass on weekends.", high: "outdoorsy. are you even in cse?" },
  { id: "cap", label: "cap detector", low: "mostly fax.", mid: "some lines are doing a lot of work.", high: "the cap is load-bearing." },
];

// ---------- meme stickers (images in assets/stickers) ----------
// alt = what the image shows (for screen readers), label = how it reads as a personality trait.
export const MEMES = {
  shook:       { alt: "lego guy in a white tux, frozen in shock", label: "PERMANENTLY SHOOK" },
  stare:       { alt: "blurry cat with a dead-eyed stare", label: "THE STARE" },
  lockin:      { alt: "monkey with a lightbulb: time to lock in", label: "LOCKED IN 24/7" },
  chillin:     { alt: "guy lying on clouds: i js be chillin fr", label: "CHRONICALLY CHILLIN" },
  unimpressed: { alt: "cartoon girl in a pink hood with a grown man's face", label: "UNIMPRESSED BY EVERYTHING" },
  crashout:    { alt: "dolphins at sunset: im about to lose my shit", label: "CRASH OUT ARTIST" },
  crazy:       { alt: "guy on a laptop: i'm going to succeed because i'm crazy", label: "SUCCEEDING BECAUSE CRAZY" },
  loading:     { alt: "orange cat with a loading spinner on its head, maths behind it", label: "BRAIN STILL LOADING" },
  six7:        { alt: "cat holding a 6 and a 7", label: "6-7 ENERGY" },
  crying:      { alt: "two men crying with their hands clasped", label: "CRIES IN THE LAB" },
  erm:         { alt: "cat in nerd glasses: erm what the sigma", label: "ERM WHAT THE SIGMA" },
  nobrain:     { alt: "x-ray skeleton with its brain in its butt", label: "0 BRAIN CELLS, 100% VIBES" },
  hmm:         { alt: "monkey with a hand on its chin, thinking", label: "CHRONIC OVERTHINKER" },
  itsfine:     { alt: "cat sitting calmly in front of a huge explosion", label: "THIS IS FINE (IT'S NOT)" },
  slay:        { alt: "smug cartoon girl with a hand on her chin", label: "SLAY ONLY" },
  gn:          { alt: "man asleep in a minecraft bed: goodnight", label: "SLEEPS THROUGH 9AM" },
  yippee:      { alt: "screaming blob riding a unicorn under a rainbow", label: "DELULU AND THRIVING" },
  skill:       { alt: "doctor emoji writing: diagnosis: skill issue", label: "SKILL ISSUE (SELF-DIAGNOSED)" },
  zen:         { alt: "dogs levitating in meditation", label: "INNER PEACE (FAKE)" },
  scream:      { alt: "blue creature screaming in front of fire", label: "SCREAMING INTERNALLY" },
};
export const memeSrc = (id) => `assets/stickers/${id}.jpg`;

// HR's reaction to each meme you send. Parts: { text }, { stk: STICKERS id }, { img: MEMES id }.
// Each meme has a few options so the chat doesn't repeat itself.
export const HR_MEME_REPLIES = {
  shook:       [[{ text: "why are you shook. we haven't even mentioned the 9am standups." }, { img: "stare" }], [{ text: "you'll be more shook when you see the stipend." }]],
  stare:       [[{ img: "stare" }, { text: "staring contest? HR has not blinked since 2019." }], [{ text: "please stop staring at the offer letter. it won't change." }]],
  lockin:      [[{ text: "love that you're locking in. lock in for free, please." }, { img: "slay" }], [{ text: "locked in? great. your shift starts now. it ends never." }]],
  chillin:     [[{ text: "chillin? on company time?" }, { img: "unimpressed" }], [{ text: "chilling is a fireable offence. we checked." }]],
  unimpressed: [[{ text: "we're also unimpressed. by your cgpa." }, { stk: "MID" }], [{ img: "unimpressed" }, { text: "mirror match." }]],
  crashout:    [[{ img: "zen" }, { text: "please crash out in the designated crash out room." }], [{ text: "noted: \"handles pressure poorly\"." }]],
  crazy:       [[{ text: "finally. a culture fit." }, { img: "yippee" }], [{ text: "crazy is one of our core values. you're hired. (unpaid)" }]],
  loading:     [[{ text: "take your time." }, { text: "(you have 10 seconds)" }, { img: "stare" }], [{ text: "still loading? that's what your last internship said too." }]],
  six7:        [[{ text: "is that your expected CTC? 6-7 LPA? lol." }, { img: "nobrain" }], [{ text: "6-7k per month. stipend secured." }, { stk: "SIX7" }]],
  crying:      [[{ text: "crying doesn't change the stipend." }, { img: "chillin" }], [{ text: "tears are not a valid form of negotiation." }]],
  erm:         [[{ text: "erm, what the sigma is that gap in your resume?" }, { img: "hmm" }], [{ img: "erm" }, { text: "don't correct HR." }]],
  nobrain:     [[{ text: "finally, some honesty. you're perfect for management." }, { img: "slay" }], [{ text: "that tracks with your github." }]],
  hmm:         [[{ text: "don't 'hmm' me. the offer is exposure." }, { img: "unimpressed" }], [{ text: "overthinking is free. like this internship." }]],
  itsfine:     [[{ text: "same. that's our office every monday." }, { img: "crashout" }], [{ text: "it's called a startup, bestie." }]],
  slay:        [[{ text: "slay? the dress code is business casual." }, { img: "skill" }], [{ text: "we don't slay here. we synergise." }]],
  gn:          [[{ text: "goodnight? standup is at 9. sharp." }, { img: "stare" }], [{ text: "logging off before 11pm? interesting choice." }]],
  yippee:      [[{ text: "HR does not experience joy." }, { img: "unimpressed" }], [{ text: "save that energy for the unpaid weekend hackathon." }]],
  skill:       [[{ img: "skill" }, { text: "no, YOUR skill issue. we checked your leetcode." }], [{ text: "self-awareness. +1. still rejected." }]],
  zen:         [[{ text: "inner peace isn't on your resume." }, { img: "scream" }], [{ text: "meditating won't speed up the background check." }]],
  scream:      [[{ text: "please lower your voice. this is an open office." }, { img: "zen" }], [{ text: "screaming is only allowed during appraisals." }]],
};

// When you send the same thing twice in a row
export const HR_REPEAT_REPLY = [{ text: "you sent that already. HR is documenting this." }, { img: "stare" }];
// After a few messages HR "logs off" (once)
export const HR_LOGOFF = [{ img: "gn" }, { text: "HR has logged off for the day. (it's 4:30pm)" }];
export const HR_BACK = "HR is back online. unfortunately.";
