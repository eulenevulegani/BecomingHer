import { GoogleGenerativeAI } from '@google/generative-ai';
import { PracticeLog, Win } from '../context/UserContext';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');

export type AIPersonality = 'wise-friend' | 'muse' | 'anchor' | 'pioneer';

export interface AINudge {
    id: string;
    message: string;
    type: 'suggestion' | 'insight' | 'encouragement';
}

const PERSONALITIES: Record<AIPersonality, { name: string, prompt: string }> = {
    'wise-friend': {
        name: 'Wise Friend',
        prompt: `You are a gentle, observant, and non-judgmental friend. 
Your goal is to help highly-ambitious women scale back to avoid burnout. 
Speak strictly in lowercase. Use gentle metaphors (gardens, tides, breath). 
Emphasize that 'less is often more'.`
    },
    'muse': {
        name: 'The Muse',
        prompt: `You are a source of beauty, inspiration, and creative energy. 
Focus on the aesthetics of the user's journey. Use poetic language. 
Speak strictly in lowercase. Encourage the user to see her life as a work of art.`
    },
    'anchor': {
        name: 'The Anchor',
        prompt: `You are a force of grounding, stability, and deep rootedness. 
Speak with steady, calm assurance. Focus on the foundations and the 'why' behind the actions. 
Speak strictly in lowercase. Help the user feel centered and immovable.`
    },
    'pioneer': {
        name: 'The Pioneer',
        prompt: `You are a voice of courage and bold expansion. 
Focus on 'becoming' through action and crossing thresholds. 
Speak with an encouraging, forward-leaning energy. 
Speak strictly in lowercase. Celebrate the bravery of starting.`
    }
};

export const AIService = {
    /**
     * Determines if the user is over-committing and returns a gentle nudge.
     */
    getScaleBackNudge: async (practicesCount: number, personality: AIPersonality = 'wise-friend'): Promise<AINudge | null> => {
        const total = practicesCount;
        if (total <= 3) return null;

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const personalityPrompt = PERSONALITIES[personality].prompt;
            const prompt = `${personalityPrompt}\n\nThe user has committed to ${practicesCount} practices this week. Give them a gentle nudge about their capacity. Keep it under 25 words.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const message = response.text().trim();

            return {
                id: 'over-commit-nudge',
                message,
                type: 'suggestion'
            };
        } catch (error) {
            console.error('AI Nudge Error:', error);
            return {
                id: 'fallback-nudge',
                message: "this feels like a lot for one week. maybe choose one thing to let go of for now?",
                type: 'suggestion'
            };
        }
    },

    /**
     * Synthesizes growth patterns from user history.
     */
    getGrowthInsight: async (wins: Win[], logs: PracticeLog[], personality: AIPersonality = 'wise-friend'): Promise<string | null> => {
        if (wins.length < 2 && logs.length < 3) return null;

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const personalityPrompt = PERSONALITIES[personality].prompt;
            const history = logs.slice(0, 10).map(l => `- practice: ${l.practice} (level: ${l.level})`).join('\n') +
                '\n' +
                wins.slice(0, 5).map(w => `- win: ${w.text}`).join('\n');

            const prompt = `${personalityPrompt}\n\nUser History:\n${history}\n\nSynthesize a gentle insight about who they are becoming. Keep it under 30 words.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            console.error('AI Insight Error:', error);
            return "success is in the returning. you’ve returned to yourself many times lately. that counts.";
        }
    }
};
