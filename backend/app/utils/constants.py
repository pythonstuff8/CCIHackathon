"""Application constants: PHQ-9 questions, risk levels, and crisis resources."""

PHQ9_QUESTIONS = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
    "Trouble concentrating on things, such as reading or watching TV",
    "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
    "Thoughts that you would be better off dead, or of hurting yourself in some way",
]

RISK_LEVELS = {
    "low": {
        "label": "Low",
        "description": "No significant risk indicators detected.",
        "score_range": (0.0, 0.3),
    },
    "moderate": {
        "label": "Moderate",
        "description": "Some emotional distress indicators present. Monitoring recommended.",
        "score_range": (0.3, 0.6),
    },
    "high": {
        "label": "High",
        "description": "Significant distress indicators. Outreach to trusted adults recommended.",
        "score_range": (0.6, 0.8),
    },
    "critical": {
        "label": "Critical",
        "description": "Immediate safety concern. Crisis resources and guardian notification required.",
        "score_range": (0.8, 1.0),
    },
}

CRISIS_RESOURCES = [
    {
        "name": "988 Suicide & Crisis Lifeline",
        "contact": "Call or text 988",
        "description": "Free, confidential support 24/7 for people in distress.",
        "url": "https://988lifeline.org",
    },
    {
        "name": "Crisis Text Line",
        "contact": "Text HOME to 741741",
        "description": "Free crisis counseling via text message, 24/7.",
        "url": "https://www.crisistextline.org",
    },
    {
        "name": "The Trevor Project",
        "contact": "Call 1-866-488-7386 or text START to 678-678",
        "description": "Crisis intervention and suicide prevention for LGBTQ+ youth.",
        "url": "https://www.thetrevorproject.org",
    },
    {
        "name": "Teen Line",
        "contact": "Call 1-800-852-8336 or text TEEN to 839863",
        "description": "Teens helping teens with a hotline staffed by trained teen counselors.",
        "url": "https://teenlineonline.org",
    },
    {
        "name": "SAMHSA National Helpline",
        "contact": "Call 1-800-662-4357",
        "description": "Free referral and information service for mental health and substance use disorders.",
        "url": "https://www.samhsa.gov/find-help/national-helpline",
    },
]

PHQ9_SEVERITY = {
    "minimal": (0, 4),
    "mild": (5, 9),
    "moderate": (10, 14),
    "moderately_severe": (15, 19),
    "severe": (20, 27),
}
