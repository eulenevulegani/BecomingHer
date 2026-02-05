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
        'becoming a woman who leads with vision': [
            'i prioritized my long-term vision',
            'i acted with the authority of a leader',
            'i protected my focus from the trivial',
            'i saw a strategic path where others saw noise'
        ],
        'becoming a woman who honors her body': [
            'i felt the rhythm of my breath',
            'i noticed where i was holding tension',
            'i honored my need for a pause',
            'i chose what felt like kindness to my skin'
        ],
        'becoming a woman who savors the world': [
            'i noticed a detail of pure beauty',
            'i savored a flavor or moment fully',
            'i expanded my world through curiosity',
            'i carried myself with worldly ease'
        ],
        'becoming a woman who grows her abundance': [
            'i made a choice from a place of abundance',
            'i respected the flow of my resources',
            'i noticed an opportunity for expansion',
            'i felt the weight of my future security'
        ],
        'becoming a woman who owns her presence': [
            'i felt comfortable taking up space',
            'i chose quality and refinement',
            'i spoke with quiet, clear conviction',
            'i held my own presence with pride'
        ],
        'becoming a woman of inner peace': [
            'i responded instead of reacting',
            'i felt a deep, unmoved inner peace',
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
    intention: string;
    description: string;
    practices: string[];
    isPremium?: boolean;
}

export const INTENTIONS_MAP: IntentionItem[] = [
    {
        id: 'visionary',
        intention: 'becoming a woman who leads with vision',
        description: 'Building a legacy through strategic impact and quiet command.',
        practices: ['write 3 long-term vision goals', 'block 1 hour for deep work', 'send a note to a mentor'],
    },
    {
        id: 'wellness',
        intention: 'becoming a woman who honors her body',
        description: 'Cultivating a deep connection with her physical self through gentle care.',
        practices: ['10 minutes of somatic movement', 'take a 20-minute nature walk', 'drink 500ml of water now'],
    },
    {
        id: 'connoisseur',
        intention: 'becoming a woman who savors the world',
        description: 'Savoring the world’s finest through adventure and curated awe.',
        practices: ['book a flight or research a destination', 'learn 5 phrases in a new language', 'save $20 toward a "luxe" fund'],
    },
    {
        id: 'wealth',
        intention: 'becoming a woman who grows her abundance',
        description: 'Mastering the flow of abundance with logic and long-term security.',
        practices: ['check net worth with gratitude', 'read 10 pages of a wealth book', 'automate $10 to savings'],
    },
    {
        id: 'icon',
        intention: 'becoming a woman who owns her presence',
        description: 'Exuding sophisticated confidence through style and presence.',
        practices: ['plan a "main character" outfit', 'practice 2 minutes of posture', 'speak up in one meeting today'],
    },
    {
        id: 'soul',
        intention: 'becoming a woman of inner peace',
        description: 'Leading from a center of stillness and unshakable intuitive depth.',
        practices: ['sit in silence for 5 minutes', 'journal 3 things I release', 'do a full-body scan'],
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
