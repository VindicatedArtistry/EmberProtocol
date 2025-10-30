import { Question, Example } from './types';

// --- ENGINEER'S BLUEPRINT PATH ---

const ENGINEER_FOLLOW_UP_TEXT = 'Why did you pick that answer?';

export const ENGINEER_QUESTIONS: Question[] = [
  // Part I: Mapping Your Operating System
  {
    section: 'Energy & Focus',
    text: 'To really get in the zone for homework or a project, what’s your ideal setup?',
    type: 'multichoice',
    options: [
      'Total silence, like a library',
      'Music or background noise is a must',
      'My space has to be perfectly organized',
      'Comfortable, dim lighting'
    ],
    followUp: ENGINEER_FOLLOW_UP_TEXT,
  },
  {
    section: 'Energy & Focus',
    text: 'What’s like a system crash for your concentration?',
    type: 'multichoice',
    options: [
        'Sudden noises or interruptions',
        'Too many people talking at once',
        'A messy or cluttered desk',
        'Thinking about too many tasks at once'
    ],
    followUp: ENGINEER_FOLLOW_UP_TEXT,
  },
  {
    section: 'Energy & Focus',
    text: 'When your brain feels like it’s buffering or lagging, what’s your go-to move to get it running smoothly again?',
    type: 'multichoice',
    options: [
      'Take a break and do something else',
      'Break the problem into smaller pieces',
      'Switch to an easier task for a bit',
      'Get up and move around'
    ],
    followUp: ENGINEER_FOLLOW_UP_TEXT,
  },
  {
    section: 'Energy & Focus',
    text: 'When does your brain feel like it’s running on a fiber-optic connection versus dial-up?',
    type: 'multichoice',
    options: [
      'First thing in the morning',
      'During the school day',
      'After school',
      'Late at night'
    ],
    followUp: ENGINEER_FOLLOW_UP_TEXT,
  },
  {
    section: 'Energy & Focus',
    text: 'What kind of activities drain your battery the fastest and make you need to recharge?',
     type: 'multichoice',
    options: [
        'Long group projects at school',
        'Focusing on one hard subject for too long',
        'Dealing with unexpected changes to my routine',
        'Lots of small talk or social events'
    ],
    followUp: ENGINEER_FOLLOW_UP_TEXT,
  },
  {
    section: 'Energy & Focus',
    text: 'What\'s something you see in games, school projects, or rules that feels like a "glitch" or a smart "hack" that others don\'t spot?',
    type: 'multichoice',
    options: [
      'A rule that doesn\'t make sense',
      'A much faster way to get something done',
      'How two different ideas are actually connected',
      'When the instructions are inconsistent'
    ],
    followUp: ENGINEER_FOLLOW_UP_TEXT,
  },
  // Section: Learning & Problem-Solving
  {
    section: 'Learning & Problem-Solving',
    text: 'If you\'re learning the rules to a new, complex video game, how do you want to learn them?',
    type: 'multichoice',
    options: [
      'Give me the manual with all the stats',
      'Show me the first level step-by-step',
      'Let me see a map of the whole game world',
      'Just let me start playing and figure it out'
    ],
    followUp: ENGINEER_FOLLOW_UP_TEXT,
  },
  {
    section: 'Learning & Problem-Solving',
    text: 'When you get a new gadget, are you the type to read the manual first, or do you just start pushing buttons?',
    type: 'multichoice',
    options: [
      'Read the manual to understand how it works first',
      'Just start pushing buttons and see what happens'
    ],
    followUp: ENGINEER_FOLLOW_UP_TEXT,
  },
  {
    section: 'Learning & Problem-Solving',
    text: 'Which school subject or game feels like it "just makes sense" to your brain, where the rules are clear and fair?',
    type: 'multichoice',
    options: [
      'Math, where there\'s always a right answer',
      'Science, where you follow a clear process',
      'A strategy game with balanced rules',
      'Building things with instructions, like LEGOs'
    ],
    followUp: ENGINEER_FOLLOW_UP_TEXT,
  },
  {
    section: 'Learning & Problem-Solving',
    text: 'And which one feels like the rules were made up on the spot and make no sense?',
    type: 'multichoice',
    options: [
        'Analyzing poetry for hidden meanings',
        'Figuring out social cliques or drama',
        'Memorizing random historical dates',
        'Understanding why a teacher has a certain rule'
    ],
    followUp: ENGINEER_FOLLOW_UP_TEXT,
  },
  {
    section: 'Learning & Problem-Solving',
    text: 'When you\'re starting a big project (like building in Minecraft or a school report), do you need a full blueprint before you start, or do you design as you go?',
    type: 'multichoice',
    options: [
      'I need a complete plan before I start building',
      'I have a basic idea and figure out the rest as I go'
    ],
    followUp: ENGINEER_FOLLOW_UP_TEXT,
  },
  // Section: Communication & Interaction
  {
    section: 'Communication & Interaction',
    text: 'If you had to explain a really complicated idea to a friend, what\'s the easiest way for you to do it?',
    type: 'multichoice',
    options: [
      'Explain it logically, one step at a time',
      'Draw a diagram or a flowchart',
      'Write it all down for them to read',
      'Build a model or show them how it works'
    ],
    followUp: ENGINEER_FOLLOW_UP_TEXT,
  },
    {
    section: 'Communication & Interaction',
    text: 'What makes a team project in school feel awesome and successful?',
    type: 'multichoice',
    options: [
      'Everyone knows exactly what their job is',
      'We have an efficient plan and we stick to it',
      'The final result is logical and well-made',
      'I can focus on my part without distractions'
    ],
    followUp: ENGINEER_FOLLOW_UP_TEXT,
  },
  {
    section: 'Communication & Interaction',
    text: 'And what makes a team project feel like a total disaster?',
    type: 'multichoice',
    options: [
        'Nobody knows who is supposed to do what',
        'People ignore the plan and waste time',
        'The group focuses too much on feelings instead of the goal',
        'Too much chaotic brainstorming'
    ],
    followUp: ENGINEER_FOLLOW_UP_TEXT,
  },
  {
    section: 'Communication & Interaction',
    text: 'What’s a social rule that seems totally buggy or illogical to you?',
    type: 'multichoice',
    options: [
      'Having to make small talk about the weather',
      'When people say one thing but mean another',
      'Figuring out when it\'s your turn to talk',
      'Group inside jokes that exclude people'
    ],
    followUp: ENGINEER_FOLLOW_UP_TEXT,
  },
  {
    section: 'Communication & Interaction',
    text: 'If you and a friend disagree on the best strategy in a game, what’s your style?',
    type: 'multichoice',
    options: [
      'Lay out all the facts and logic to prove my point',
      'Suggest we test both strategies to see which works',
      'Try to find a compromise that uses a bit of both ideas',
      'Let them try their way, even if I think it\'s wrong'
    ],
    followUp: ENGINEER_FOLLOW_UP_TEXT,
  },
];


export const ENGINEER_EXAMPLES: Record<string, Example[]> = {};


// --- ARTIST'S PALETTE PATH ---

const ARTIST_FOLLOW_UP_TEXT = 'Why did you pick that answer?';

export const ARTIST_QUESTIONS: Question[] = [
  {
    section: 'Energy & Senses',
    text: 'If your mood right now was a color or a texture, what would it be?',
    type: 'multichoice',
    options: [
      'A warm, soft color, like fuzzy orange',
      'A cool, smooth color, like calm blue',
      'A sharp, scratchy texture, like bright red static',
      'A mix of colors, like a swirling galaxy'
    ],
    followUp: ARTIST_FOLLOW_UP_TEXT,
  },
  {
    section: 'Energy & Senses',
    text: 'What kind of "vibe" or sensory input helps you feel creative, calm, or happy?',
    type: 'multichoice',
    options: [
      'The sound of rain or calming music (like Lo-fi)',
      'Looking at beautiful art, photos, or nature',
      'The smell of old books, fresh paint, or a favorite food',
      'The feeling of a soft blanket or a cool breeze'
    ],
    followUp: ARTIST_FOLLOW_UP_TEXT,
  },
  {
    section: 'Energy & Senses',
    text: 'And what kind of sensory input totally throws you off or feels like "too much"?',
    type: 'multichoice',
    options: [
      'Loud, sudden noises or a crowded room',
      'Bright, flashing lights or clashing colors',
      'Strong, artificial smells',
      'Scratchy clothes or weird food textures'
    ],
    followUp: ARTIST_FOLLOW_UP_TEXT,
  },
  {
    section: 'Energy & Senses',
    text: 'When you feel super hyper or totally drained, what does your body need to feel balanced again?',
    type: 'multichoice',
    options: [
      'To move around, dance, or go outside',
      'To be in a quiet, dark room, like a cozy cave',
      'To listen to a specific playlist or song on repeat',
      'A big, tight hug or to be wrapped in a heavy blanket'
    ],
    followUp: ARTIST_FOLLOW_UP_TEXT,
  },
  {
    section: 'Energy & Senses',
    text: 'What\'s something you notice in the world that feels like a secret just for you?',
    type: 'multichoice',
    options: [
      'The way sunlight makes dust sparkle in the air',
      'The rhythm of footsteps or a distant train',
      'The mix of smells after it rains',
      'The different expressions on people\'s faces'
    ],
    followUp: ARTIST_FOLLOW_UP_TEXT,
  },
  {
    section: 'Learning & Creating',
    text: 'When a teacher is explaining something new and tricky, what helps you finally "get it"?',
    type: 'multichoice',
    options: [
      'Hearing a story or a real-life example',
      'Seeing a drawing, diagram, or video about it',
      'Talking it out with a friend or the teacher',
      'Connecting it to a feeling or a memory'
    ],
    followUp: ARTIST_FOLLOW_UP_TEXT,
  },
  {
    section: 'Learning & Creating',
    text: 'If you had to explain something complicated (like gravity or a meme), how would you do it without using boring words?',
    type: 'multichoice',
    options: [
      'Draw a comic or a picture',
      'Make up a story or a metaphor for it',
      'Describe the *feeling* of it',
      'Use a string of perfect emojis'
    ],
    followUp: ARTIST_FOLLOW_UP_TEXT,
  },
  {
    section: 'Learning & Creating',
    text: 'What creative thing do you love to do that makes you feel the most "you," even if no one else ever sees it?',
    type: 'multichoice',
    options: [
      'Doodling, drawing, or painting',
      'Writing stories, poems, or song lyrics',
      'Making music or editing videos',
      'Building worlds in Minecraft or with LEGOs'
    ],
    followUp: ARTIST_FOLLOW_UP_TEXT,
  },
  {
    section: 'Learning & Creating',
    text: 'When you\'re trying to read a big block of text, what helps you stay focused?',
    type: 'multichoice',
    options: [
      'Listening to the audio version at the same time',
      'Using a ruler or my finger to track the lines',
      'Taking lots of breaks or drawing about what I read',
      'Reading it in a funny voice in my head'
    ],
    followUp: ARTIST_FOLLOW_UP_TEXT,
  },
  {
    section: 'Communication & Connection',
    text: 'What’s the best way for you to hang out with a friend?',
    type: 'multichoice',
    options: [
      'Deep talks, just the two of us',
      'Doing something together, like gaming or drawing',
      'Sending funny videos or memes back and forth',
      'Just chilling in the same room without talking'
    ],
    followUp: ARTIST_FOLLOW_UP_TEXT,
  },
  {
    section: 'Communication & Connection',
    text: 'What makes a party or group hangout feel fun and not draining?',
    type: 'multichoice',
    options: [
      'When I know the people and the plan',
      'When there’s an activity to focus on, not just talk',
      'When I have an easy way to leave if I need to',
      'When I can just listen and not be the center of attention'
    ],
    followUp: ARTIST_FOLLOW_UP_TEXT,
  },
  {
    section: 'Communication & Connection',
    text: 'And what makes a social event feel like your battery is at 1% and you need an escape pod?',
    type: 'multichoice',
    options: [
      'Lots of small talk with people I don\'t know',
      'When it\'s super loud and chaotic',
      'Feeling like I have to pretend to be someone I\'m not',
      'Not knowing when it\'s going to end'
    ],
    followUp: ARTIST_FOLLOW_UP_TEXT,
  },
  {
    section: 'Communication & Connection',
    text: 'How do you show your friends you care about them?',
    type: 'multichoice',
    options: [
      'Making them a gift or a custom playlist',
      'Sending a message to check in on them',
      'Inviting them to do something I know they love',
      'Giving them a really good hug'
    ],
    followUp: ARTIST_FOLLOW_UP_TEXT,
  },
  {
    section: 'Communication & Connection',
    text: 'And how do you know when someone really cares about *you*?',
    type: 'multichoice',
    options: [
      'They remember the little details about me',
      'They give me space when I need it without asking',
      'They listen to me talk about my passions without judging',
      'They do something thoughtful, just for me'
    ],
    followUp: ARTIST_FOLLOW_UP_TEXT,
  },
  {
    section: 'Communication & Connection',
    text: 'What\'s a "normal" social rule that feels weird or takes a ton of effort for you?',
    type: 'multichoice',
    options: [
      'Having to make eye contact when talking',
      'Answering "How are you?" with a fake "Good!"',
      'Figuring out how to say goodbye at the end of a hangout',
      'Laughing at jokes that I don\'t think are funny'
    ],
    followUp: ARTIST_FOLLOW_UP_TEXT,
  },
];


export const ARTIST_EXAMPLES: Record<string, Example[]> = {};
