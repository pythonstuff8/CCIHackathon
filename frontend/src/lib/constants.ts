export const PHQ9_QUESTIONS = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself - or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things, such as reading the newspaper or watching television',
  'Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual',
  'Thoughts that you would be better off dead, or of hurting yourself in some way',
] as const;

export const PHQ9_OPTIONS = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
] as const;

export const RISK_COLORS: Record<string, string> = {
  low: 'bg-green-100 text-green-800 border-green-300',
  moderate: 'bg-amber-100 text-amber-800 border-amber-300',
  high: 'bg-orange-100 text-orange-800 border-orange-300',
  critical: 'bg-red-100 text-red-800 border-red-300',
};

export const RISK_DOT_COLORS: Record<string, string> = {
  low: 'bg-green-500',
  moderate: 'bg-amber-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
};

export const MOOD_EMOJIS: Record<number, { emoji: string; label: string }> = {
  1: { emoji: '\uD83D\uDE1E', label: 'Very Sad' },
  2: { emoji: '\uD83D\uDE14', label: 'Sad' },
  3: { emoji: '\uD83D\uDE10', label: 'Okay' },
  4: { emoji: '\uD83D\uDE0A', label: 'Good' },
  5: { emoji: '\uD83D\uDE04', label: 'Great' },
};

export const CRISIS_RESOURCES = [
  {
    name: '988 Suicide & Crisis Lifeline',
    description:
      'Free, confidential, 24/7 support for people in distress. Call or text anytime.',
    contact: '988',
    type: 'phone',
  },
  {
    name: 'Crisis Text Line',
    description:
      'Text with a trained crisis counselor. Free, 24/7 support at your fingertips.',
    contact: 'Text HOME to 741741',
    type: 'text',
  },
  {
    name: 'The Trevor Project',
    description:
      'Crisis intervention and suicide prevention for LGBTQ+ young people.',
    contact: '1-866-488-7386',
    type: 'phone',
  },
  {
    name: 'SAMHSA Helpline',
    description:
      'Free, confidential, 24/7 treatment referral and information service.',
    contact: '1-800-662-4357',
    type: 'phone',
  },
  {
    name: 'Teen Line',
    description:
      'Teens helping teens. Talk to someone who gets it.',
    contact: '310-855-4673',
    type: 'phone',
  },
  {
    name: 'NAMI Helpline',
    description:
      'Free support, education, and guidance for mental health concerns.',
    contact: '1-800-950-6264',
    type: 'phone',
  },
];
