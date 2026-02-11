interface FeedbackContext {
    identity: string | null;
    streak: number;
    timeOfDay: string;
    text: string;
}

const GENERIC_PRAISE = [
    "Beautifully done.",
    "Small steps, massive shifts.",
    "That's the spirit.",
    "You are becoming.",
    "Another step forward.",
    "Consistency is your superpower.",
];

const IDENTITY_PRAISE: Record<string, string[]> = {
    health: [
        "Your body thanks you.",
        "Radiant energy unlocked.",
        "Fueling your vessel.",
        "Stronger than yesterday."
    ],
    finances: [
        "Abundance flows to you.",
        "Future you is wealthy.",
        "Smart move.",
        "Building your empire."
    ],
    relationships: [
        "Connection is key.",
        "Love grows here.",
        "Community starts with you.",
    ],
    growth: [
        "Leveling up.",
        "Mind expansion in progress.",
        "Wisdom gained.",
    ],
    environment: [
        "Order creates peace.",
        "Your space reflects your mind.",
        "Sanctuary restored.",
    ],
    spirituality: [
        "Inner peace deepening.",
        "Aligned with the universe.",
        "Soul nourishment.",
    ],
    purpose: [
        "Walking your path.",
        "Impact created.",
        "Vision becoming reality.",
    ]
};

const STREAK_PRAISE = [
    "3 days! You're on fire.",
    "5 days strong. Unstoppable.",
    "7 days! A week of power.",
    "10 days! This is who you are now.",
    "21 days! A habit is born.",
    "30 days! Incredible dedication."
];

export const FeedbackService = {
    generateFeedback: (context: FeedbackContext): string => {
        const { identity, streak, timeOfDay } = context;

        // 1. Check for significant streaks first (highest dopamine)
        if (streak > 2 && [3, 5, 7, 10, 14, 21, 30, 50, 100].includes(streak)) {
            const streakMsg = STREAK_PRAISE.find(s => s.startsWith(`${streak} days`));
            if (streakMsg) return streakMsg;
            return `${streak} days in a row! Incredible.`;
        }

        // 2. Identity specific feedback (feels personal)
        if (identity) {
            const key = identity.toLowerCase();
            const specificPraise = IDENTITY_PRAISE[key];
            if (specificPraise && Math.random() > 0.4) { // 60% chance to use identity praise
                return specificPraise[Math.floor(Math.random() * specificPraise.length)];
            }
        }

        // 3. Time of day context
        const currentHour = new Date().getHours();
        if (currentHour < 10 && timeOfDay === 'morning') {
            return "Winning the morning.";
        }
        if (currentHour > 20 && timeOfDay === 'evening') {
            return "Ending the day beautifully.";
        }

        // 4. Fallback to high-quality generic praise
        return GENERIC_PRAISE[Math.floor(Math.random() * GENERIC_PRAISE.length)];
    }
};
