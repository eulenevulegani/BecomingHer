export const BECOMING_PROMPTS = {
    intention: "Who are you practicing being right now?",
    week: "This week doesn’t need perfection. It needs honesty.",
    win: "What counted today?",
    reflection: [
        "What did you show up for?",
        "What felt heavier than expected?",
        "What are you quietly proud of?"
    ],
    placeholders: [
        "Keeping a promise to myself...",
        "Choosing rest over performance...",
        "A moment of quiet follow-through...",
        "Listening when I wanted to fix..."
    ],
    proof_reflections: {
        'becoming a woman who honors her body': [
            'i felt the rhythm of my breath',
            'i moved with strength and ease',
            'i prioritized rest over performance',
            'i nourished myself with intention'
        ],
        'becoming a woman who masters her abundance': [
            'i made a choice from a place of security',
            'i respected the flow of my resources',
            'i noticed an opportunity for growth',
            'i felt the weight of my future freedom'
        ],
        'becoming a woman who nurtures her community': [
            'i spoke with kindness and clarity',
            'i held a boundary with grace',
            'i felt the strength of belonging',
            'i invested time in a soul-connection'
        ],
        'becoming a woman who leads with vision': [
            'i prioritized my long-term mission',
            'i acted with the authority of a leader',
            'i protected my focus from the trivial',
            'i saw a path where others saw noise'
        ],
        'becoming a woman who evolves daily': [
            'i met a challenge with curiosity',
            'i reflected on a lesson learned',
            'i nurtured a new skill or thought',
            'i felt the richness of my own growth'
        ],
        'becoming a woman who curates her space': [
            'i brought order to my surroundings',
            'i felt the calm of a clear environment',
            'i refined a daily system or routine',
            'i honored the beauty of my home'
        ],
        'becoming a woman of inner peace': [
            'i responded instead of reacting',
            'i felt a deep, unmoved stillness',
            'i listened to my intuition\'s whisper',
            'i stayed centered through the chaos'
        ],
        'default': [
            'i noticed a moment of alignment',
            'i felt proud of a small choice',
            'i stayed present with myself',
            'i honored my own pace'
        ]
    }
};

export interface IntentionItem {
    id: string;
    pillar: string;
    intention: string;
    description: string;
    practices: string[];
    isPremium?: boolean;
}

export const INTENTIONS_MAP: IntentionItem[] = [
    {
        id: 'health',
        pillar: 'Health',
        intention: 'becoming a woman who honors her body',
        description: 'Your energy, strength, sleep, and emotional wellbeing.',
        practices: ['10 minutes of somatic movement', 'choose a nourishing meal', '8 hours of restorative sleep', 'practice a moment of stillness'],
    },
    {
        id: 'finances',
        pillar: 'Finances',
        intention: 'becoming a woman who masters her abundance',
        description: 'How you earn, manage, save, invest, and grow money.',
        practices: ['check net worth with gratitude', 'review my budget for today', 'save or invest a small amount', 'read 10 mins of financial wisdom'],
    },
    {
        id: 'relationships',
        pillar: 'Relationships',
        intention: 'becoming a woman who nurtures her community',
        description: 'Family, friendships, romantic connections, and networks.',
        practices: ['send a note of appreciation', 'practice active listening', 'set or honor a boundary', 'schedule quality time'],
    },
    {
        id: 'purpose',
        pillar: 'Purpose',
        intention: 'becoming a woman who leads with vision',
        description: 'Your work, mission, goals, and the impact you make.',
        practices: ['write 3 long-term vision goals', 'block 1 hour for deep work', 'take one step toward a mission', 'refine my professional presence'],
    },
    {
        id: 'growth',
        pillar: 'Personal Growth',
        intention: 'becoming a woman who evolves daily',
        description: 'How you evolve mentally, emotionally, and intellectually.',
        practices: ['read 10 pages of a book', 'journal my evening reflection', 'learn one new small skill', 'practice self-awareness'],
    },
    {
        id: 'environment',
        pillar: 'Environment',
        intention: 'becoming a woman who curates her space',
        description: 'Your surroundings and daily systems—home and digital.',
        practices: ['declutter one small area', 'refine a daily morning system', 'organize my digital workspace', 'add a touch of beauty to my home'],
    },
    {
        id: 'spirituality',
        pillar: 'Spirituality',
        intention: 'becoming a woman of inner peace',
        description: 'Your beliefs, values, gratitude, and connection.',
        practices: ['sit in silence for 5 minutes', 'practice a prayer or meditation', 'record 3 specific gratitudes', 're-align with a core value'],
    }
];

export const IDENTITY_INTENTIONS = INTENTIONS_MAP.map(item => item.intention);

export const MOVES_EXAMPLES = [
    'open the document',
    'send the message',
    'take a short walk',
    'rest without guilt',
    'breathe through the tension',
    'choose one priority',
];

export const MOVE_STATUSES = [
    { id: 'showed_up', label: 'showed up', icon: 'presence' },
    { id: 'tried', label: 'tried', icon: 'effort' },
    { id: 'finished', label: 'finished', icon: 'completion' },
    { id: 'rested', label: 'rested intentionally', icon: 'rest' },
];

export const WEEK_WORDS = [
    'steady',
    'gentle',
    'brave',
    'quiet',
    'honest',
    'rooted',
];

export const GRATITUDE_PROMPTS = [
    "What carried you this week?",
    "A moment where you felt like yourself...",
    "A small kindness you noticed...",
    "What made your world feel a bit softer today?",
    "A promise you kept to yourself...",
    "What are you quietly grateful for?"
];

export const GRATITUDE_TREE_PROMPT = GRATITUDE_PROMPTS[0];

export const IDENTITY_SHIFT_FACTS = [
    {
        title: "Small wins are proof.",
        fact: "identity is built through 'votes'. every time you practice a habit, you are casting a vote for the person you want to become."
    },
    {
        title: "The 66-day myth.",
        fact: "while common wisdom says 21 days, research suggests it takes an average of 66 days for a new behavior to become automatic. patience is part of the practice."
    },
    {
        title: "Identity-first habits.",
        fact: "the most effective way to change your habits is not to focus on what you want to achieve, but on who you wish to become."
    },
    {
        title: "The power of 1%.",
        fact: "getting 1% better every day for a year makes you 37 times better by the end. small actions have compounding interest."
    },
    {
        title: "Crossing the threshold.",
        fact: "the hardest part of any journey is the beginning. identity shifting is about crossing the threshold from 'trying' to 'being'."
    }
];
