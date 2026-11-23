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
    id: "ohio", level: "mid", title: "cracked intern", company: "Ohio Ventures", logo: "OV", color: "#FF5FC1",
    posted: "2m ago", applicants: "4,000", vibe: 87,
    tags: ["zero yapping", "9am standups", "unpaid", "\"fast-paced\""],
    stipend: "exposure + 1 company hoodie (size S only)",
    reqs: ["zero yapping (we will check)", "must survive 9am standups", "5 years of experience (it's an internship)", "must say \"let's circle back\" unironically"],
    boss: "HR unc", attacks: [{ name: "WE'LL CIRCLE BACK", text: "you feel ignored.", min: 10, max: 16 }],
    taunts: ["we'll circle back… in 2029.", "back in my day we applied by fax.", "beta, what's your cgpa?"],
  },
  {
    id: "thursday", level: "mid", title: "senior vibe engineer", company: "Thursday Labs", logo: "TL", color: "#1E3A8A",
    posted: "1h ago", applicants: "49", vibe: 77,
    tags: ["7x7=49 energy", "navy blue typa vibe", "hybrid"],
    stipend: "₹49,000 (7x7, obviously)",
    reqs: ["must have 7x7=49 energy", "navy blue typa vibe (navy blue bedsheets = instant red flag)", "thursday 4pm aura. 9x9=81 is a plus", "must not crash out during standups"],
    boss: "the vibe auditor", attacks: [{ name: "VIBE CHECK", text: "your aura is being audited.", min: 12, max: 18 }],
    taunts: ["your vibe is giving 'pending verification'.", "aura audit in progress. it's not looking good."],
  },
  {
    id: "synergy", level: "mid", title: "junior dev (entry level)", company: "Synergy Inc", logo: "SI", color: "#0EA5E9",
    posted: "3d ago", applicants: "11,204", vibe: 41,
    tags: ["entry level", "7 yrs exp", "\"family\""],
    stipend: "market standard (the market is closed)",
    reqs: ["7 years of experience in a framework released last year", "must be a \"rockstar ninja\"", "we're a family (unpaid overtime)", "glazing the CEO on linkedin weekly"],
    boss: "recruiter karen", attacks: [{ name: "WHY IS THERE A GAP IN YOUR RESUME", text: "it was summer vacation.", min: 14, max: 20 }],
    taunts: ["can i speak to your previous employer?", "explain the gap. the two-week gap. in 2019."],
  },
  {
    id: "grindset", level: "sweaty", title: "chief vibe officer", company: "GrindsetHQ", logo: "GH", color: "#111111",
    posted: "5h ago", applicants: "777", vibe: 69,
    tags: ["5am club", "cold plunge", "podcast"],
    stipend: "equity in a podcast with 12 listeners",
    reqs: ["post \"day 1 of learning dsa\" daily for 365 days", "attend the 5am club (mandatory)", "for the huzz (results not guaranteed)", "must call the founder \"visionary\""],
    boss: "the founder (22, has a podcast)", attacks: [{ name: "HUSTLE LECTURE", text: "45 minutes on waking up at 4am.", min: 12, max: 19 }],
    taunts: ["we're like a family. a family that doesn't pay.", "i wake up at 4am. what do you do?", "subscribe to my podcast before answering."],
  },
  {
    id: "rizzosoft", level: "sweaty", title: "sigma software engineer", company: "Rizzosoft", logo: "RZ", color: "#16A34A",
    posted: "12m ago", applicants: "6,767", vibe: 93,
    tags: ["no meetings", "no yapping", "only grinding"],
    stipend: "1 pizza per sprint",
    reqs: ["no meetings, no yapping, only grinding", "must mog the competition in code review", "twin-coded team, matching hoodies", "aura > experience"],
    boss: "tech lead who says \"quick call?\"", attacks: [{ name: "QUICK CALL?", text: "it lasted 2 hours.", min: 13, max: 19 }],
    taunts: ["quick call? 2 hours. cameras on.", "can you hop on a quick call real quick?"],
  },
  {
    id: "tralalero", level: "mid", title: "italian brainrot intern", company: "Tralalero Tralala Pvt Ltd", logo: "TT", color: "#38BDF8",
    posted: "6m ago", applicants: "3 (all sharks)", vibe: 88,
    tags: ["3 legs preferred", "nike drip mandatory", "remote (ocean)"],
    stipend: "one (1) cappuccino. ballerina not included",
    reqs: ["explain italian brainrot lore to the CEO (he's 52)", "fluent in tung tung tung sahur", "generate 40 AI sharks before lunch", "steal a brainrot rank: diamond or above"],
    boss: "ballerina cappuccina (head of HR)", attacks: [{ name: "BOMBARDIRO CROCODILO", text: "an airstrike on your cover letter.", min: 13, max: 19 }],
    taunts: ["tralalero tralala, you're not hired.", "cappuccina doesn't do second rounds."],
  },
  {
    id: "clanker", level: "sweaty", title: "AI prompt engineer (human)", company: "Clanker Corp", logo: "CC", color: "#64748B",
    posted: "0.3s ago", applicants: "1 human, 9,000 bots", vibe: 52,
    tags: ["train your replacement", "replaced in 3 months", "\"human in the loop\""],
    stipend: "paid in API credits that expire tomorrow",
    reqs: ["write prompts so good the AI can do your job", "only call it a clanker when it's not listening", "type faster than gpt-6", "comfortable being replaced (we'll do it nicely)"],
    boss: "the AI interviewer", attacks: [{ name: "AS A LANGUAGE MODEL", text: "it rejected you in 0.3 seconds.", min: 12, max: 18 }],
    taunts: ["beep. culture fit score: 0.2.", "rephrasing your answer to sound smarter… failed."],
  },
  {
    id: "fanum", level: "mid", title: "junior fanum tax officer", company: "Fanum Foods", logo: "FF", color: "#F59E0B",
    posted: "lunch time", applicants: "2,404", vibe: 71,
    tags: ["your lunch is our lunch", "free snacks (yours)", "canteen-first"],
    stipend: "40% of your tiffin, taxed weekly",
    reqs: ["collect the fanum tax on every tiffin in the office", "share your maggi or face consequences", "rizz the canteen bhaiya for extra chutney", "must not crash out when your fries get taxed"],
    boss: "the CFO (chief fanum officer)", attacks: [{ name: "FANUM TAX", text: "he took a bite. a big one.", min: 12, max: 18 }],
    taunts: ["that's a fanum tax on your stipend.", "i took a bite of your offer letter."],
  },
  {
    id: "skibidi", level: "boss", title: "skibidi SDE-1", company: "Skibidi Solutions", logo: "SS", color: "#A855F7",
    posted: "dop dop ago", applicants: "6,969", vibe: 66,
    tags: ["ohio office", "skibidi standups", "goofy ahh codebase"],
    stipend: "lifetime supply of fidget spinners",
    reqs: ["explain skibidi to the board of directors", "pass the ohio final boss round", "refactor legacy code written in goofy ahh", "get gagged by a clean pull request at least once"],
    boss: "the ohio final boss", attacks: [{ name: "SKIBIDI DOP DOP", text: "it echoes in your head. forever.", min: 13, max: 20 }],
    taunts: ["this interview is in ohio. you're cooked.", "dop dop yes yes. no."],
  },
  {
    id: "ragebait", level: "chill", title: "engagement farmer", company: "Ragebait Media", logo: "RB", color: "#EF4444",
    posted: "trending", applicants: "\"source?\"", vibe: 58,
    tags: ["post 6-7 times a day", "ratio or be ratioed", "comment section warrior"],
    stipend: "₹0.02 per angry comment",
    reqs: ["post one hot take a day (\"dsa is useless\")", "reply \"source?\" to everything", "farm aura AND engagement", "ask \"chat, is this real?\" every hour"],
    boss: "the community manager", attacks: [{ name: "CHAT IS THIS REAL", text: "chat said no.", min: 10, max: 16 }],
    taunts: ["chat, is this real?", "chat says you're mid. chat is never wrong."],
  },
  {
    id: "mewing", level: "chill", title: "looksmaxxing analyst", company: "Mewing Ventures", logo: "MV", color: "#0EA5A4",
    posted: "mid-mew", applicants: "777", vibe: 74,
    tags: ["mewing streak required", "camera on 24/7", "jawline-first culture"],
    stipend: "₹0 + a gua sha",
    reqs: ["mew through every standup (no talking, obviously)", "know your canthal tilt by heart", "a chopped chin is a performance issue", "looksmaxx the company logo every quarter"],
    boss: "the looksmaxxing coach", attacks: [{ name: "SIDE PROFILE CHECK", text: "you were not ready.", min: 11, max: 17 }],
    taunts: ["mewing check. you failed.", "your side profile is giving 'entry level'."],
  },
  {
    id: "washed", level: "chill", title: "growth hacker (washed)", company: "Washed Capital", logo: "WC", color: "#78716C",
    posted: "2019", applicants: "4 uncs", vibe: 39,
    tags: ["unc status required", "\"we're like a startup\"", "peaked already"],
    stipend: "equity in a company valued at ₹6.7",
    reqs: ["peaked in 2019 and still talks about it", "says \"back in my day\" about react class components", "washed, but confident about it", "aura farm in every board meeting"],
    boss: "the washed VP", attacks: [{ name: "BACK IN MY DAY", text: "a 40-minute story about jQuery.", min: 12, max: 18 }],
    taunts: ["back in my day we had jQuery and we were happy.", "i invented synergy. in 2009."],
  },
  // ---- italian brainrot cinematic universe ----
  {
    id: "tungtung", level: "sweaty", title: "night shift sahur intern", company: "Tung Tung Tung Sahur Systems", logo: "T3", color: "#8B5A2B",
    posted: "3:00am", applicants: "3 (it's always 3)", vibe: 33,
    tags: ["3am standups", "bring your own bat", "knocks: mandatory"],
    stipend: "one (1) sahur meal. you cook it",
    reqs: ["wake up the whole floor at 3am, three times", "carry a wooden bat to every meeting", "say \"tung\" with conviction", "never miss sahur (or a deadline)"],
    boss: "tung tung tung sahur (night shift HR)", attacks: [{ name: "TUNG TUNG TUNG", text: "he knocked. three times. at 3am.", min: 13, max: 19 }],
    taunts: ["tung. tung. tung. you're late.", "i was knocking since 3am, twin."],
  },
  {
    id: "crocodilo", level: "sweaty", title: "aerial operations intern", company: "Bombardiro Crocodilo Airways", logo: "BC", color: "#4D7C0F",
    posted: "dropped from the sky", applicants: "1 crocodile", vibe: 41,
    tags: ["fully airborne", "must love explosions", "no window seats"],
    stipend: "frequent flyer miles (non-transferable, non-real)",
    reqs: ["fly over the office yelling your name", "drop deliverables from 30,000 ft", "be a crocodile, or crocodile-adjacent", "explain the lore to legal"],
    boss: "bombardiro crocodilo (VP of airstrikes)", attacks: [{ name: "CARPET BOMB YOUR CV", text: "your resume was in the blast radius.", min: 14, max: 20 }],
    taunts: ["incoming. it's your rejection.", "i don't do interviews. i do flyovers."],
  },
  {
    id: "patapim", level: "chill", title: "forest vibes associate", company: "Brr Brr Patapim Woodworks", logo: "BP", color: "#15803D",
    posted: "since the dawn of time", applicants: "2 trees and a guy", vibe: 77,
    tags: ["touch grass (literally)", "hat provided", "big feet friendly"],
    stipend: "unlimited leaves (the plant kind)",
    reqs: ["stand still in a forest for 8 hours", "have a nose longer than your resume", "say \"brr brr\" in meetings", "zero yapping, all rooting"],
    boss: "brr brr patapim (head of roots)", attacks: [{ name: "BRR BRR", text: "he just stood there. with the feet. menacingly.", min: 9, max: 15 }],
    taunts: ["brr brr. that's a no.", "i've been standing here since 1600. you can wait."],
  },
  {
    id: "chimpanzini", level: "mid", title: "banana growth hacker", company: "Chimpanzini Bananini Labs", logo: "CB", color: "#FACC15",
    posted: "ripe, today only", applicants: "47 monkeys", vibe: 64,
    tags: ["banana-first culture", "climb the ladder (literally)", "peel-based OKRs"],
    stipend: "1 banana per sprint (unpeeled)",
    reqs: ["turn 1 banana into a 10x growth story", "be a chimp inside a banana, or vice versa", "slip on zero peels during demos", "pitch bananini to investors"],
    boss: "chimpanzini bananini (chief banana officer)", attacks: [{ name: "PEEL OF DOOM", text: "you slipped. in the interview. on camera.", min: 11, max: 17 }],
    taunts: ["bananini says no.", "you're not ripe for this role."],
  },
  {
    id: "lirili", level: "mid", title: "time management analyst", company: "Lirili Larila Clocks", logo: "LL", color: "#A3E635",
    posted: "tick tock", applicants: "1 elephant cactus", vibe: 58,
    tags: ["clock-in is a lifestyle", "sandals only", "desert office"],
    stipend: "a cactus. water it yourself",
    reqs: ["control time, or at least your calendar", "walk the desert in sandals", "be part elephant, part cactus", "never ask what time it is"],
    boss: "lirili larila (head of time)", attacks: [{ name: "SANDAL STOMP", text: "time stopped. your interview didn't.", min: 11, max: 17 }],
    taunts: ["lirili larila, time's up.", "i paused time just to reject you slower."],
  },
  {
    id: "assassino", level: "sweaty", title: "espresso operations analyst", company: "Cappuccino Assassino Co.", logo: "CA", color: "#78350F",
    posted: "silently", applicants: "0 (they vanished)", vibe: 36,
    tags: ["ninja dress code", "decaf is a fireable offence", "night shifts"],
    stipend: "one shot of espresso (you won't see it coming)",
    reqs: ["move silently through the office", "brew a cappuccino in 0.3 seconds", "never miss a target (or a sprint)", "say nothing in standups. just appear."],
    boss: "cappuccino assassino (HR, ninja division)", attacks: [{ name: "SILENT ESPRESSO", text: "you didn't even see the rejection coming.", min: 13, max: 19 }],
    taunts: ["you'll never see the offer. or me.", "decaf energy detected."],
  },
  // ---- the rest of the brainrot multiverse ----
  {
    id: "sixseven", level: "mid", title: "six seven data analyst", company: "Six Seven Statistics", logo: "67", color: "#7C3AED",
    posted: "6-7 days ago", applicants: "67", vibe: 67,
    tags: ["every answer is 6 or 7", "hand gestures required", "excel but only 2 columns"],
    stipend: "₹6,700 (or ₹7,600, depends)",
    reqs: ["round every number to 6 or 7", "do the hand thing in client calls", "explain 6-7 to HR without laughing", "present 67 slides, all titled \"6-7\""],
    boss: "the 6-7 kid (head of numbers)", attacks: [{ name: "SIX SEVEN", text: "6… 7… your brain is buffering.", min: 11, max: 17 }],
    taunts: ["6-7. that's your chance of getting hired.", "on a scale of 6 to 7, you're a 5."],
  },
  {
    id: "crashout", level: "sweaty", title: "crash out coordinator", company: "Crash Out Co.", logo: "CO", color: "#EA580C",
    posted: "mid crash out", applicants: "12 (all crashing out)", vibe: 29,
    tags: ["high stress, by design", "yelling is a KPI", "scream room provided"],
    stipend: "therapy (one session, group, 47 people)",
    reqs: ["crash out on schedule, never early", "calm down 3 other crash outs per day", "write incident reports in all caps", "have zero chill, professionally"],
    boss: "the crash out supervisor", attacks: [{ name: "PUBLIC CRASH OUT", text: "he crashed out on you. in front of everyone.", min: 13, max: 19 }],
    taunts: ["i'm about to crash out on your resume.", "this interview is my 4th crash out today."],
  },
  {
    id: "npc", level: "chill", title: "NPC streamer (full time)", company: "NPC Live", logo: "NP", color: "#22D3EE",
    posted: "respawned 5m ago", applicants: "1,000 identical guys", vibe: 71,
    tags: ["same 3 lines, forever", "standing still is the job", "tips in gifts only"],
    stipend: "gifts from strangers (non-cash, mostly roses)",
    reqs: ["say the same 3 lines for 8 hours", "react to gifts on cue", "never break character, even at lunch", "have the dialogue range of a vending machine"],
    boss: "the NPC (respawns every 5 min)", attacks: [{ name: "DIALOGUE LOOP", text: "he said the same line 47 times. you felt all of them.", min: 9, max: 15 }],
    taunts: ["hello traveller. no.", "i have 3 lines and you're not in any of them."],
  },
  {
    id: "lockin", level: "sweaty", title: "lock in specialist", company: "Lock In Labs", logo: "LI", color: "#0F172A",
    posted: "do not disturb", applicants: "0 (they're all locked in)", vibe: 34,
    tags: ["no phones, ever", "headphones on, soul off", "6am lock in sessions"],
    stipend: "a timer app and a stare",
    reqs: ["lock in for 12 hours straight", "ignore every notification, including payroll", "make eye contact with nobody", "drink water on a schedule"],
    boss: "the locked-in monk (HR)", attacks: [{ name: "DO NOT DISTURB", text: "you were muted. permanently.", min: 13, max: 19 }],
    taunts: ["i'm locked in. you're locked out.", "you blinked. that's a no."],
  },
  {
    id: "reels", level: "chill", title: "professional AI reel watcher", company: "Fruit Love Island Productions", logo: "FL", color: "#FB7185",
    posted: "4am, still scrolling", applicants: "2.3M (all on their phones)", vibe: 90,
    tags: ["8 hrs screen time minimum", "fruit drama expert", "thumb cardio"],
    stipend: "unlimited reels, zero salary",
    reqs: ["watch 1,000 AI reels a day without blinking", "know who the banana is coupled up with on fruit love island", "rate AI slop from 1 to \"whyyy\"", "never touch grass (it's not in the algorithm)"],
    boss: "the algorithm (head of HR)", attacks: [{ name: "INFINITE SCROLL", text: "you watched 400 reels. it's 4am. you lost 14 hp and your will.", min: 9, max: 15 }],
    taunts: ["you've been scrolling for 6 hours. that was the interview.", "the algorithm already knows you're not hired."],
  },
];

// How tough each job's HR is. Every job has a `level`; the boss fight uses its hp and how hard HR hits
// (a multiplier on the attack numbers above). Tuned with a simulation: a normal player wins about
// 61% / 44% / 33% / 24%, and about 44% across the original 12 jobs.
// (23 jobs now: the originals, 6 italian brainrot ones, and 5 from the rest of the brainrot multiverse.)
export const HR_LEVELS = {
  chill: { label: "🌶️ chill HR", c: "lime", hp: 115, atk: 1.35, intro: "chill HR. don't fumble this." },
  mid: { label: "🌶️🌶️ mid HR", c: "yellow", hp: 130, atk: 1.42, intro: "mid HR. it's giving 3 rounds." },
  sweaty: { label: "🌶️🌶️🌶️ sweaty HR", c: "orange", hp: 140, atk: 1.48, intro: "sweaty HR. lock in." },
  boss: { label: "☠️ final boss", c: "black", hp: 150, atk: 1.5, intro: "final boss. good luck, twin." },
};
export const levelOf = (job) => HR_LEVELS[job.level] || HR_LEVELS.mid;

export const GHOST_TOASTS = [
  "ghosted them first. +10 aura.",
  "left on read. by YOU. iconic.",
  "skipped. their loss, twin.",
  "womp womp for them.",
];

// ---------- boss fight ----------
export const YOUR_HP = 120;
// HR's hp depends on the job: see HR_LEVELS above

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
  { id: "learner", name: "\"i'm a quick learner\"", hint: "+16 hp", run: () => ({ heal: 16, text: "you said it with your whole chest. you believed it. +16 hp." }) },
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

// Moves your resume unlocks (AuraGPT picks up to 4 with perksFor in aura-engine.js).
// One shows up in your hand about 30% of turns, tagged "from your resume".
// `from` is shown on the score page: "unlocked by …". effect "scared" = HR can't use a special next turn.
export const PERK_MOVES = {
  winner: { name: "show the winner cert (real)", hint: "26 dmg", from: "a real win",
    run: () => ({ dmg: 26, text: "it actually says winner. not participation. HR checked twice. 26 dmg." }) },
  intern: { name: "name-drop your last company", hint: "24 dmg", from: "an internship",
    run: () => ({ dmg: 24, text: "you said the company name slowly. HR googled it. 24 dmg." }) },
  prs: { name: "merged PR receipts", hint: "22 dmg", from: "open source",
    run: () => ({ dmg: 22, text: "merged. not opened, merged. HR respects the green. 22 dmg." }) },
  algo: { name: "solve it in O(n)", hint: "24 dmg · watch the edge cases", from: "competitive programming",
    run: () => (Math.random() < 0.7
      ? { dmg: 24, text: "O(n), no hints. HR's whiteboard is crying. 24 dmg." }
      : { dmg: 8, text: "you forgot the empty-array edge case. 8 dmg." }) },
  tests: { name: "run the test suite", hint: "blocks next attack · +8 hp", from: "automated tests",
    run: () => ({ effect: "dodge", heal: 8, text: "all tests passed. HR's next attack is just another test case. +8 hp." }) },
  livelink: { name: "send the live link", hint: "20 dmg", from: "a live project",
    run: () => ({ dmg: 20, text: "it actually works. on mobile too. HR is confused. 20 dmg." }) },
  robot: { name: "bring the robot arm", hint: "16 dmg · HR too scared for tricks", from: "robotics",
    run: () => ({ dmg: 16, effect: "scared", text: "the arm copied HR's hand gestures. HR is scared. 16 dmg. no specials next turn." }) },
  redesign: { name: "redesign HR's portal live", hint: "18 dmg · +6 hp", from: "design skills",
    run: () => ({ dmg: 18, heal: 6, text: "you fixed their careers page in figma mid-interview. 18 dmg. +6 hp." }) },
  deck: { name: "show your pitch deck", hint: "28 dmg or backfire", from: "a startup",
    run: () => (Math.random() < 0.5
      ? { dmg: 28, text: "slide 3 had a hockey-stick graph. HR wants equity. 28 dmg." }
      : { self: 12, text: "slide 1 said \"uber for X\". HR closed the tab. 12 dmg to you." }) },
  cgpa: { name: "flash the 9+ cgpa", hint: "18 dmg", from: "a 9+ cgpa",
    run: () => ({ dmg: 18, text: "nine point something. HR's own cgpa could never. 18 dmg." }) },
  clubs: { name: "\"core member of every society\"", hint: "coin flip", from: "5+ societies",
    run: () => (Math.random() < 0.5
      ? { dmg: 18, text: "you name-dropped 4 fests in one breath. 18 dmg." }
      : { self: 10, text: "HR asked which meetings you actually attend. silence. 10 dmg to you." }) },
  uncle: { name: "call uncle", hint: "30 dmg · costs dignity", from: "nepotism, detected",
    run: () => ({ dmg: 30, self: 6, text: "uncle picked up on the first ring. 30 dmg. −6 dignity. HR saw everything." }) },
  teamplayer: { name: "\"passionate team player\"", hint: "1 dmg", from: "glazing yourself",
    run: () => ({ dmg: 1, text: "you said it with passion. HR felt nothing. 1 dmg." }) },
};

// Score page: the moves your resume unlocked
export const PERK_TEXT = {
  title: "your resume unlocked these fight moves",
  from: (what) => `unlocked by ${what}`,
  none: "no fight moves unlocked. HR is not scared of you.",
};

// Your HR fight record on the profile
export const RECORD_TEXT = {
  record: (w, l) => `HR record: ${w}W – ${l}L`,
  none: "HR record: 0 fights. scared?",
};

// Fight copy that isn't a move or an attack
export const FIGHT_TEXT = {
  opener: (boss) => `${boss} wants to know your expected stipend. choose wisely.`,
  charged: (dmg) => `aura farm doubled it: ${dmg} dmg total.`,
  dodged: "…but your wifi \"died\". it missed.",
  stunned: (boss) => `${boss} is still buffering. they skipped their turn.`,
  rage: (boss) => `${boss} entered unpaid-overtime mode. attacks hit harder now.`,
  slamFinale: "OFFER UNLOCKED",   // the big sticker at the end of the win meme slam
  fx: { dodge: "wifi \"down\"", charge: "2× charged", stun: "buffering", rage: "rage mode", ghost: "ghosting you", takehome: "take-home due", scared: "scared" },
  // HR's special moves (instead of a normal attack, sometimes)
  special: {
    takehome: { name: "TAKE-HOME ASSIGNMENT", text: "unpaid. due in 3 turns. you lose 6 hp a turn doing it." },
    ghost: { name: "GHOSTING", text: "HR left you on read. your next attack hits nothing." },
  },
  takehomeTick: (dmg, left) => `take-home assignment: −${dmg} hp. ${left ? `${left} more turn${left > 1 ? "s" : ""} of unpaid work.` : "submitted. no feedback, obviously."}`,
  ghostWhiff: "HR is ghosting you. your attack hit an empty zoom call.",
  chai: (boss) => `${boss} took a chai break. +25 hp. you were not offered chai.`,
  ultNoFarm: "(you can't aura farm your aura farm.)",
  // fighting-game moments
  round: "ROUND 1",
  fight: "FIGHT!",
  vs: "VS",
  ko: "K.O.",
  skipIntro: "tap to skip",
  // block minigame: tap when the marker is in the zone
  blockPrompt: "BLOCK!",
  blockWarn: "HR is about to cook you",
  blockReady: "block minigame loading…",
  countdown: ["3… lock in 🔒", "2… no yapping", "1… it's giving block"],   // one per second before the bar moves
  blockGo: "NOW. BLOCK IT, TWIN.",
  blockHint: "tap anywhere (or press space) when the marker is in the green zone",
  block: {
    perfect: (boss) => `PERFECT BLOCK. ${boss} took the counter.`,
    good: "blocked half of it. not bad, twin.",
    miss: "no block. you felt that one.",
  },
  counter: 5,   // damage a perfect block reflects back
  // aura ultimate: fills as you deal and take damage
  meterLabel: "aura",
  ultReady: "ULTIMATE READY",
  ult: { name: "AURA FARM ULTIMATE", hint: "30–40 dmg · once per fight", text: "you stared into the camera like a sigma edit. HR's whole department felt it." },
  ultSpent: "aura spent. no second ultimate, twin.",
  perkTag: "from your resume",   // the label on a resume move card
};

// What HR says right before attacking (speech bubble over the boss)
export const BOSS_TAUNTS = [
  "is that your final answer?",
  "we have 11,204 other applicants.",
  "your linkedin said \"expert\".",
  "let's circle back to you crying.",
  "this is a learning opportunity.",
  "per my last email…",
  "be honest. was that chatgpt?",
  "i've seen better resumes from interns' interns.",
  "your aura is giving \"pending\".",
  "we're like a family. i'm the strict uncle.",
];

// What HR says during the fight, in a big speech bubble.
// reactions: right after your move ("good" if it landed, "bad" if it flopped or backfired).
// The other lists are for moments: your ultimate, hitting HR while it's ghosting you, HR low on hp,
// you low on hp, rage mode, and your perfect block. Each HR also has its own `taunts` in JOBS.
export const HR_LINES = {
  reactions: {
    excel: { good: ["excel? in this economy?", "pivot tables. ok. noted.", "a vlookup user. respect, unfortunately."] },
    cert: { good: ["wait… it says winner??", "ok that one's real. annoying."], bad: ["participation certificates are not a personality.", "the font is comic sans, bestie."] },
    glaze: { good: ["flattery noted. still unpaid.", "go on… (this changes nothing)"] },
    github: { good: ["green squares everywhere. who hurt you?", "commits at 3am. we love a burnout."], bad: ["a todo app. in 2026.", "last commit: 8 months ago."] },
    learner: { good: ["quick learner? learn to take a hint.", "everyone says that. everyone."] },
    lag: { good: ["you're on mute, bestie.", "your wifi dies exactly when i ask about the gap. interesting."] },
    reverse: { good: ["um. we'll get back to you on that.", "nobody's ever asked me that. i need a minute."] },
    farm: { good: ["why are you staring like that.", "is this a sigma edit? are we being filmed?"] },
    six7: { good: ["6… 7… i get it now. i'm crying.", "ok that one got me."], bad: ["six what? is that your cgpa?", "i don't speak gen alpha."] },
    startup: { good: ["uber for chai… take my money.", "pre-revenue? say less."], bad: ["tinder for notes. blocked.", "that's not a startup, that's a group project."] },
    gpt: { good: ["that answer was suspiciously perfect.", "you blinked zero times. ok."], bad: ["we can see your other tab.", "you said 'certainly!' out loud."] },
    // resume moves
    winner: { good: ["ok. the cert is real. annoying.", "winner? not 'participant'? hm."] },
    intern: { good: ["they let YOU intern there?", "i've heard of them. unfortunately."] },
    prs: { good: ["merged. not even a draft. hm.", "a maintainer approved you? who?"] },
    algo: { good: ["did you just say O(n) to me?", "that was faster than our hiring process."], bad: ["edge cases. every time.", "and that's why we have hidden test cases."] },
    tests: { good: ["who writes tests in college??", "a test suite. in this economy."] },
    livelink: { good: ["it… loads? on mobile too?", "a deployed project. are you lost?"] },
    robot: { good: ["please put the arm down.", "is it recording me?"] },
    redesign: { good: ["…the new portal is better. i hate this.", "our designer is crying. thanks."] },
    deck: { good: ["can i get equity?", "send me the deck. for… reasons."], bad: ["closed the tab. sorry not sorry.", "uber for what?"] },
    cgpa: { good: ["nine point what?? sit down.", "show-off. respectfully."] },
    clubs: { good: ["you're in HOW many?", "do you sleep?"], bad: ["so you attend zero of them.", "core member of the group chat."] },
    uncle: { good: ["we'll be calling your uncle too. about you.", "is your uncle hiring? asking for me."] },
    teamplayer: { bad: ["passionate. noted. still unpaid.", "the team did not ask."] },
    salary: { bad: ["salary is a mindset.", "we pay in exposure and pizza fridays.", "it's a learning opportunity. say it back."] },
  },
  ult: ["…what was that aura??", "the whole department felt that.", "ok main character, calm down."],
  ghosted: ["seen 2:14pm.", "new phone who dis.", "you're talking to an out-of-office reply."],
  lowBoss: ["ok wait. let's talk about a PPO.", "fine. what if we said ₹5k stipend?", "this is going on my linkedin. as a W for me."],
  lowYou: ["need a minute? we have 11,203 other applicants.", "you look tired. is that your culture fit face?", "almost done. with you."],
  rage: ["unpaid overtime mode: ON.", "i haven't had a weekend since 2019. match my energy.", "ok now i'm actually mad."],
  perfectBlock: ["who taught you to block??", "ok that was clean. i hate it.", "noted. passive aggression loading…"],
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
// HR's interview questions. One opens the chat (random each visit), and HR asks another every
// few messages. `chips` = quick replies you can tap. `answers` are checked in order (first match
// wins), `other` is for anything else. Parts: { text }, { stk: STICKERS id }, { img: MEMES id }.
const YES = /\b(yes|yeah|ya|yep|yup|sure|ofc|of course|obviously|absolutely|always|can|i can)\b|!!/i;
const NO = /\b(no|nah|nope|never|can'?t|cannot|absolutely not)\b/i;
const AI = /chatgpt|\bai\b|gpt|claude|copilot|gemini/i;
export const HR_QUESTIONS = [
  {
    q: "Hi! Quick q: can you solve a DSA problem live, with no help?",
    chips: ["yes obviously", "no 💀", "can i use chatgpt"],
    answers: [
      [AI, [{ img: "erm" }, { text: "using AI in the interview? bold. still no." }]],
      [NO, [{ text: "honesty. we hate that here." }, { img: "skill" }]],
      [YES, [{ text: "great. reverse a linked list. in your head. now." }, { img: "loading" }]],
    ],
    other: [{ text: "that wasn't a yes or a no. very managerial of you." }],
  },
  {
    q: "where do you see yourself in 5 years?",
    chips: ["in your seat", "on a beach", "still here, unpaid"],
    answers: [
      [/seat|chair|job|ceo|boss|your role/i, [{ text: "bold. HR has flagged you as a threat." }, { img: "stare" }]],
      [/beach|vacation|retire|chill|travel/i, [{ text: "we don't offer leave. or beaches." }, { img: "chillin" }]],
      [/here|unpaid|intern|same/i, [{ text: "perfect answer. we'll extend your internship by 5 years." }, { img: "slay" }]],
    ],
    other: [{ text: "wrong. the answer was \"here, grateful\"." }, { stk: "MID" }],
  },
  {
    q: "what's your biggest weakness?",
    chips: ["i work too hard", "i'm a perfectionist", "honestly? waking up"],
    answers: [
      [/too hard|perfection|care too much|overwork/i, [{ img: "erm" }, { text: "classic. we've heard that 4,000 times today." }]],
      [/wak|sleep|morning|lazy|bed/i, [{ text: "honesty. we hate that here." }, { img: "gn" }]],
    ],
    other: [{ text: "noted. that's now your performance review." }, { img: "skill" }],
  },
  {
    q: "are you comfortable working weekends?",
    chips: ["yes!!", "absolutely not", "define weekend"],
    answers: [
      [/define|what.*weekend|weekend\?/i, [{ text: "a weekend is two extra workdays with no meetings." }]],
      [NO, [{ img: "shook" }, { text: "not a culture fit. we're a family here." }]],
      [YES, [{ text: "great. sundays are optional. (mandatory)" }, { img: "crazy" }]],
    ],
    other: [{ text: "we'll take that as a yes." }, { img: "slay" }],
  },
  {
    q: "how many hackathons have you won?",
    chips: ["0, but 14 certificates", "won SIH", "i'm built different"],
    answers: [
      [/\b0\b|zero|certif|participat|none/i, [{ text: "participation certificates are not a personality." }, { img: "skill" }]],
      [/won|winner|sih|first|1st/i, [{ text: "the internal round doesn't count, bestie." }, { img: "hmm" }]],
      [/different|sigma|aura|him|her/i, [{ img: "erm" }, { text: "erm, what the sigma." }]],
    ],
    other: [{ text: "we'll verify that with your linkedin." }, { img: "stare" }],
  },
  {
    q: "why should we hire you over 11,204 other applicants?",
    chips: ["aura", "i'll work for free", "i'm him"],
    answers: [
      [/free|unpaid|no stipend|exposure/i, [{ text: "you're hired." }, { text: "(you were always going to be unpaid)" }, { img: "yippee" }]],
      [/aura|vibe|rizz/i, [{ text: "aura isn't a skill. (it's 40% of the score)" }, { stk: "AURA" }]],
      [/\bhim\b|\bher\b|goat|best/i, [{ text: "everyone says that. 11,204 people said that." }, { img: "unimpressed" }]],
    ],
    other: [{ text: "interesting. HR will think about it. (HR will not)" }],
  },
  {
    q: "what's your expected stipend?",
    chips: ["₹50k", "whatever you think is fair", "6-7"],
    answers: [
      [/6-?7|six seven/i, [{ text: "6-7 rupees? we can stretch to 5." }, { img: "six7" }]],
      [/fair|whatever|anything|exposure/i, [{ text: "fair is ₹0 + a hoodie (size S)." }, { img: "chillin" }]],
      [/\d|k\b|lpa|lakh|₹/i, [{ img: "shook" }, { text: "HR had to sit down." }]],
    ],
    other: [{ text: "it's a learning opportunity." }],
  },
  {
    q: "tell me about a time you showed leadership.",
    chips: ["i made the google form", "i carried the group project", "i don't lead, i vibe"],
    answers: [
      [/google form|form|poll/i, [{ text: "visionary. truly a ceo moment." }, { img: "slay" }]],
      [/carr|group project|did everything/i, [{ text: "and the others got the same marks. leadership." }, { img: "crying" }]],
      [/vibe|chill|don'?t lead/i, [{ text: "honestly? management material." }, { img: "zen" }]],
    ],
    other: [{ text: "so... never. got it." }, { stk: "NPC" }],
  },
];
// Quick replies shown when HR isn't waiting on an answer
export const HR_QUICK_CHIPS = ["what's the stipend?", "any update on my application?", "can i work from home?", "can i take a day off?"];
export const HR_ASK_EVERY = 3;   // HR asks a new question after this many of your messages

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
    stickers: [["HACKATHON TOURIST", "lime"], ["img:crying"], ["CERTIFIED YAPPER", "pink"], ["NO THANKS I USE AI", "yellow"], ["img:yippee"]],
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
    stickers: [["MAIN CHARACTER", "lilac"], ["img:slay"], ["LINKEDIN LUNATIC", "pink"], ["GROUP PROJECT CARRIER", "yellow"], ["img:crashout"]],
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
    stickers: [["AURA FARMER", "black"], ["img:chillin"], ["UNC AT 19", "grey"], ["RIZZ IN EXCEL", "sky"], ["img:zen"]],
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
    stickers: [["NO THANKS I USE AI", "yellow"], ["img:lockin"], ["CERTIFIED YAPPER", "pink"], ["img:erm"], ["3AM DEBUGGER", "black"]],
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
    stickers: [["7x7=49 ENERGY", "lime"], ["img:stare"], ["AURA FARMER", "black"], ["NAVY BLUE TYPA VIBE", "sky"], ["img:gn"]],
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

// ---------- landing page: extra sections ----------
export const LANDING_VIBES = {
  label: "05 · the vibe",
  title: "pick your vibe.",
  sub: "five themes. same chaos. tap one and the whole site switches. (also in the topbar, anytime.)",
  picked: "vibe switched. your aura has been re-skinned.",
};

// Chapter 01 demo: real scores from aura-engine.js ([line, points, roast, kind]).
// The society line is scored in context (7 societies), the rest straight from scoreLine().
export const LANDING_SCORE = {
  sub: "W, BASED, MID, L. AuraGPT reads every line. no mercy, all regex.",
  target: 4606,
  tier: "certified linkedin sigma",
  // the add-ons, as phone notifications that pop in after the score:
  // [time, message (**bold**), where tapping goes, icon]. icon "card:+4.6k" = a tiny aura card, "person:R:lilac" = a profile circle
  notifs: [
    ["now", "your aura card is ready ↗ **+4,606**. post it. let them cope.", "/upload", "card:+4.6k"],
    ["2m ago", "**riya** challenged you: **+3,980**. think you can mog that?", "/upload", "person:R:lilac"],
  ],
  notifApp: "AuraHire",
  lines: [
    ["Won Smart India Hackathon (internal round)", -185, "the brackets are doing a lot of work", "cap"],
    ["Exam notice scraper · 169 automated tests · live", 315, "stacked W: 169 tests", ""],
    ["Skills: React, Node.js, Python", 36, "skills section. noted.", ""],
    ["Media team member (society 7 of 7)", -100, "do you even go to the meetings?", "larp"],
    ["Internship at uncle's startup", -150, "nepotism detected", "nepo"],
    ["Passionate team player", -120, "glazing yourself detected", "glaze"],
  ],
};

// Chapter 02 demo: the 4 job cards that flip away (by id from JOBS, top card first)
export const LANDING_JOBS = ["ohio", "tralalero", "fanum", "grindset"];

// Chapter 03 demo: a fight you scrub through
export const LANDING_BOSS = {
  sub: "HR talks back. assigns take-homes. ghosts you. your resume brings its own moves. not everyone gets hired.",
  hp: 135,
  line: "we'll circle back… in 2029.",
  special: "TAKE-HOME ASSIGNMENT!",
  perk: ["send the live link", "20 dmg"],
  perkTag: "from your resume",
  // the add-on: a row with a live preview of your resume moves dealing in
  moveset: { title: "your resume is your moveset", line: "what AuraGPT finds becomes fight moves. even the cringe ones.", go: "/jobs",
    preview: ["run the test suite", "call uncle"] },
  dmg: ["−20", "−24 CRIT", "−36 ULT", "−16"],
};

// Bento grid of the other features. `go` = where tapping the card takes you.
export const LANDING_FEATURES = {
  label: "06 · everything else",
  title: "everything else<br>in the grind.",
  cards: [
    { id: "breakdown", title: "the AuraGPT breakdown", line: "yap level, nepo index, delulu meter, grind, touch grass and a cap detector. all 0-10. all personal.", go: "/upload" },
    { id: "batch", title: "roast the batch", line: "stalk 5 classmates. call cap on their resume, post a diss, and watch them clap back.", go: "/people" },
    { id: "chat", title: "HR replies in memes", line: "send a meme, get a meme back. HR remembers everything. HR forgives nothing.", go: "/chat" },
    { id: "names", title: "AuraGPT names you", line: "type your first name. the council assigns a surname. reroll if you dare.", go: "/upload" },
    { id: "circle", title: "your profile circle", line: "pick a colour and a face. it's giving linkedin, but unserious.", go: "/profile" },
    { id: "slam", title: "win = meme avalanche", line: "beat HR and the memes slam in faster and faster until the screen gives up.", go: "/jobs" },
  ],
  // the mini demo inside each card
  meters: [["yap level", 9], ["nepo index", 10], ["grind", 2]],
  names: [["Aarav", "Grindwala"], ["Riya", "Rizzvi"], ["Kabir", "Mogwani"]],
  diss: "the only thing kabir has shipped is a linkedin post",
};

// ---------- aura farming ----------
// Everything you do earns (or costs) aura. [amount, reason shown in the "+12 aura" pop]
export const AURA_EARN = {
  ghost:   [10, "ghosted them first"],
  meme:    [13, "meme diplomacy"],
  aiMeme:  [49, "no thanks i use ai"],
  sticker: [7, "sticker reply"],
  answer:  [15, "survived an HR question"],
  diss:    [5, "courage"],
  cap:     [3, "fact-checked"],
  larp:    [2, "method acting"],
  react:   [1, "engagement farming"],
  connect: [4, "networking"],
  endorse: [2, "endorsed for breathing"],
  lockIn:  [67, "vibe locked in"],
  vibe:    [6, "re-skinned"],
  reroll:  [-5, "identity crisis"],
  rate:    [5, "rated a company"],
  bossWin: [1000, "beat HR"],
  ghosted: [-800, "ghosted. womp womp"],
  judge:   [20, "judged a friend"],
  share:   [25, "posted your aura"],
};

// Profile headline: your branch + grad year from your resume ("CSE-AI '30"), or a joke if it's not there
export const EDU_TEXT = {
  unknown: "branch: vibes '??",
  noYear: (branch) => `${branch} '??`,
};

// ---------- share my aura + "beat my aura" challenge links ----------
export const SHARE_TEXT = {
  button: "share my aura",
  making: "printing your aura…",
  shared: "aura shared. let them cope.",
  saved: "card saved + challenge link copied. go post it, twin.",
  failed: "your browser said no. screenshot it, twin.",
  // the message that goes with the image
  message: (name, aura, tier) => `${name} has ${aura} aura on AuraHire (${tier}). think you can mog that?`,
  // text on the image itself
  card: {
    tagline: "stop applying. start aura farming.",
    judged: "judged by AuraGPT v6.7",
    points: "aura points",
    best: "best line",
    worst: "worst line",
    cta: "think you can mog that?",
  },
  // the screen a friend sees when they open your link
  vs: {
    kicker: "you've been challenged",
    headline: (name) => `${name} thinks they mog you.`,
    sub: "scan your resume. find out.",
    scan: "scan my resume →",
    useLast: "use my last scan",
    scared: "nah, i'm scared",
    cap: "edited the link? that's cap. the numbers don't add up.",
    broken: "this challenge link is chopped. ask for a new one.",
  },
  // the head-to-head on your score page after scanning from a challenge
  h2h: {
    title: "head-to-head",
    you: "you",
    win: (name, gap) => `you mogged ${name} by ${gap} aura. send it back.`,
    lose: (name, gap) => `${name} mogged you by ${gap} aura. womp womp.`,
    tie: "dead even. 6-7.",
    back: "challenge them back",
  },
};

// Leaderboard copy ({name}, {rank}, {gap} get filled in)
export const AURA_RANK = {
  passed: "you just passed {name}. you're #{rank} in the batch.",
  top: "#1 in the batch. you are mogging everyone.",
  lost: "{name} just passed you. womp womp. you're #{rank}.",
  next: "{gap} aura to pass {name}",
  tipsTitle: "how to farm aura",
  tips: [
    "beat an HR boss fight: +1,000",
    "send HR the \"no thanks i use ai\" meme: +49",
    "answer HR's interview questions: +15 each",
    "lock in your 5 stickers: +67",
    "send memes (+13) and stickers (+7) in HR chat",
    "ghost a job before it ghosts you: +10",
    "call cap, diss and larp on the batch's profiles",
    "getting ghosted: −800 (avoid)",
  ],
};

// ---------- roast a friend: judge someone else's resume ----------
export const JUDGE_TEXT = {
  label: "AuraGPT, but for your friends",
  title: "roast a friend's resume.",
  sub: "paste (or upload) anyone's resume. AuraGPT judges them, and you can add them to the batch to race their aura.",
  nameLabel: "their name",
  namePlaceholder: "e.g. your roommate",
  pastePlaceholder: "Won a hackathon (internal round)\nCore member of 6 clubs\nProficient in MS Word",
  judge: "judge them",
  emptyName: "give them a name. even a fake one.",
  emptyResume: "they need a resume, twin. paste something.",
  verdictTitle: "AuraGPT's verdict",
  worstTitle: "their most questionable lines",
  add: "add them to the batch →",
  again: "judge someone else",
  added: "{name} joined the batch. may the best aura win.",
  friendTag: "friend",
  remove: "remove from the batch",
  removed: "{name} has been ghosted from the batch.",
  linesTitle: "every line, judged",
  cta: "+ roast a friend's resume",
};
