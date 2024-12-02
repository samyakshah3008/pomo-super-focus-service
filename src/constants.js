import nodemailer from "nodemailer";

export const DB_NAME = "POMO_SUPER_FOCUS_DB";

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.NODEMAILER_APPLICATION_SPECIFIC_EMAIL,
    pass: process.env.NODEMAILER_APPLICATION_SPECIFIC_PASSCODE,
  },
});

export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

export const cookieOptions = {
  httpOnly: true,
  secure: true,
};

export const guestUserDetails = {
  firstName: "Jethalal",
  lastName: "Gada",
  isGuestUser: true,
};

export const workingFrameworkTemplates = [
  {
    title: "Early Riser",
    rules: [
      "I'll wake up before 6am to start my day early.",
      "I'll use the Pomodoro technique for focused work sessions.",
      "I'll complete my top 3 tasks before noon.",
      "I'll take short stretching breaks between Pomodoro sessions.",
      "I'll avoid social media during work blocks.",
      "I'll plan my tasks the night before to ensure a productive start.",
      "I'll not eat until I've finished 2 hours of deep work.",
      "I'll keep my desk clean to stay organized and focused.",
      "I'll drink water regularly to stay hydrated and energized.",
      "I'll reflect on my achievements at the end of the day.",
      "I'll review my goals before wrapping up for the day.",
      "I'll ensure a proper work-life balance with quality time for loved ones.",
      "I'll limit distractions by turning off notifications during Pomodoro sessions.",
      "I'll prioritize deep focus time over multitasking.",
    ],
    description:
      "Kickstart your day with structured focus sessions using the Pomodoro technique, ensuring consistent morning productivity.",
    createdBy: "PomoSuperFocus Team",
  },
  {
    title: "Night Owl",
    rules: [
      "I'll start my workday in the evening, embracing my night energy.",
      "I'll use Pomodoro sessions to track my focus time.",
      "I'll take breaks to recharge without losing momentum.",
      "I'll minimize distractions like phone and social media.",
      "I'll review the leaderboard to track my progress and set goals.",
      "I'll ensure my workspace is well-lit and organized.",
      "I'll set clear focus goals for the night and review them in the morning.",
      "I'll work in uninterrupted blocks of time, especially during peak hours.",
      "I'll reward myself after each focus session with a short, refreshing break.",
      "I'll avoid working in bed to maintain focus.",
      "I'll challenge myself to move up in the leaderboard rankings.",
      "I'll ensure I spend time reflecting on my productivity before bed.",
      "I'll finish my tasks by limiting my social media usage.",
      "I'll track my focus time and aim to improve each week.",
    ],
    description:
      "Stay productive during late hours and climb the leaderboard by maximizing your focus time.",
    createdBy: "PomoSuperFocus Team",
  },
  {
    title: "Developer's Special",
    rules: [
      "I'll start my day by reviewing my coding goals for the year.",
      "I'll break tasks into smaller goals to achieve daily success.",
      "I'll avoid distractions like social media while coding.",
      "I'll track and review my yearly goals weekly to stay on course.",
      "I'll use the Pomodoro technique for uninterrupted focus.",
      "I'll ensure my coding workspace is organized and distraction-free.",
      "I'll dedicate time to learning a new tech skill daily.",
      "I'll review my progress at the end of each week to align with my goals.",
      "I'll plan out my learning goals before every new coding session.",
      "I'll take mindful breaks to avoid burnout during deep work.",
      "I'll post my coding progress on social media to help others.",
      "I'll focus on goal tracking to ensure consistent learning.",
      "I'll celebrate every small coding milestone.",
      "I'll end my day by writing down my top coding accomplishments.",
    ],
    description: "A framework, specially designed for engineers.",
    createdBy: "PomoSuperFocus Team",
  },
  {
    title: "PomoSuperFocus's Signature",
    rules: [
      "I'll start my day with a task list for maximum focus.",
      "I'll dedicate time to organizing my tasks before diving into work.",
      "I'll use the Pomodoro technique to tackle my to-do list efficiently.",
      "I'll limit my task list to avoid feeling overwhelmed.",
      "I'll break tasks into smaller, manageable steps.",
      "I'll organize my workspace at the end of every workday.",
      "I'll prioritize my most important tasks at the start of the day.",
      "I'll use short breaks for stretching or meditation.",
      "I'll avoid distractions like phone calls during work blocks.",
      "I'll ensure my task list is updated daily for accuracy.",
      "I'll delegate tasks if necessary to maintain focus.",
      "I'll stay flexible, adjusting my task list based on progress.",
      "I'll reflect on my task completion and celebrate daily wins.",
      "I'll use tools to track and visualize my daily progress.",
    ],
    description: "A signature framework from PomoSuperFocus Team!",
    createdBy: "PomoSuperFocus Team",
  },
  {
    title: "Planning for Job Switch",
    rules: [
      "I'll create a personal framework to streamline my workflow.",
      "I'll focus on high-impact tasks to maximize productivity.",
      "I'll limit distractions by turning off notifications during work hours.",
      "I'll reflect on my workday to ensure continuous improvement.",
      "I'll prioritize deep work sessions using the Pomodoro technique.",
      "I'll plan my daily tasks in advance to stay on track.",
      "I'll analyze my focus metrics weekly to boost my performance.",
      "I'll organize my workspace to maintain productivity.",
      "I'll keep a distraction journal to identify improvement areas.",
      "I'll ensure I take meaningful breaks to avoid burnout.",
      "I'll dedicate time to professional growth and learning new skills.",
      "I'll use tools to measure and improve my daily productivity.",
      "I'll build a strong routine that aligns with my personal framework.",
      "I'll reward myself after achieving significant daily milestones.",
    ],
    description:
      "It's really difficult for someone who is planning for a job switch along doing existing job. Use this special framework!",
    createdBy: "PomoSuperFocus Team",
  },
  {
    title: "Anti-procrastination",
    rules: [
      "I'll track my daily habits to build consistency.",
      "I'll avoid procrastination by focusing on small, actionable tasks.",
      "I'll set a strict work schedule and stick to it.",
      "I'll use habit-tracking tools to monitor my progress.",
      "I'll take short breaks to reset and stay focused.",
      "I'll reflect on my habits daily to adjust for better results.",
      "I'll avoid distractions like social media during work hours.",
      "I'll reward myself for completing my tasks on time.",
      "I'll dedicate time to improving one habit each week.",
      "I'll plan my habits and tasks the night before to avoid procrastination.",
      "I'll use accountability tools to stay motivated.",
      "I'll ensure I start my workday with the hardest task first.",
      "I'll build small, consistent habits to prevent burnout.",
      "I'll review my habit progress weekly and make necessary adjustments.",
    ],
    description:
      "Build lasting positive habits with daily tracking to eliminate procrastination and improve consistency.",
    createdBy: "PomoSuperFocus Team",
  },
];

export const defaultSettings = {
  time: {
    studyTime: 25,
    shortBreak: 5,
    longBreak: 15,
  },
  studyOptions: {
    autoStartStudyTimer: false,
    autoPlayStudyMusic: false,
    studyMusicSource: "spotify",
    studyMusicPlaylistId: "0vvXsWCC9xrXsKd4FyS8kM",
  },
  breakOptions: {
    autoStartBreakTimer: false,
    autoPlayBreakTimer: false,
    breakMusicSource: "youtube",
    breakMusicPlaylistId: "qRTVg8HHzUo",
    longBreakInterval: 4,
  },
  uiOptions: {
    theme: "tmkoc",
  },
};

export const checklistsConstants = [
  {
    key: "onboarding",
    title:
      "Complete onboarding and accept our request to feed a stray animal. ",
    content: "Welcome onboard!!! Witch is super happy to have you;)",
    completed: true,
  },
  {
    key: "pomodoro",
    title: "Complete your first pomodoro session!",
    content:
      "Time to bring the focus momentum and kick off with your first pomodoro session!",
    completed: false,
  },
  {
    key: "habit",
    title:
      "Create your habit - either breaking bad habit or building good habit!",
    content:
      "Time to bring out your best potential! Let's create habits and achieve the best!",
    completed: false,
  },

  {
    key: "workingFramework",
    title: "Create your working framework!",
    content:
      "It's crucial to create a working framework so you can follow it and make the most of each day!",
    completed: false,
  },
  {
    key: "goal",
    title: "Create your first goal",
    content:
      "You can't achieve success without clarity. So, create your first goal today!",
    completed: false,
  },
  {
    key: "task",
    title: "Create your first task",
    content:
      "Dividing your work in chunks helps to achieve faster. So, create your first task today!",
    completed: false,
  },
  {
    key: "selfReview",
    title: "Document your first life event in You vs You!",
    content:
      "Time flies, see how far you have reached by making habit of documenting ups and downs!",
    completed: false,
  },
  {
    key: "gratitude",
    title: "Add your first gratitude!",
    content: "Be grateful! Add your first gratitude today!",
    completed: false,
  },
  {
    key: "bucketItem",
    title: "Add your first bucket list item!",
    content:
      "Maintain a bucket list by adding your manifested bucket list items;)",
    completed: false,
  },
  {
    key: "lifeOnboarding",
    title:
      "Set your estimated life span today to see how much time you have left!",
    content:
      "Track your life, be aware you have limited life span and take a pause to review are you really moving towards your end goal?",
    completed: false,
  },
];
