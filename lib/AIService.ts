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
            return "success is in the returning. you've returned to yourself many times lately. that counts.";
        }
    },

    /**
     * Suggests personalized morning moves based on pillar and past patterns.
     */
    getMorningSuggestions: async (
        pillar: string,
        currentPractices: string[],
        logs: PracticeLog[],
        personality: AIPersonality = 'wise-friend'
    ): Promise<string[]> => {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const personalityPrompt = PERSONALITIES[personality].prompt;

            // Analyze past performance
            const recentLogs = logs.slice(0, 20);
            const completedPractices = recentLogs.filter(l => l.level === 'yes').map(l => l.practice);
            const struggledPractices = recentLogs.filter(l => l.level === 'not_today').map(l => l.practice);

            const prompt = `${personalityPrompt}

The user is focused on "${pillar}". 
Their default practices are: ${currentPractices.join(', ')}.
${completedPractices.length > 0 ? `They've been good at: ${completedPractices.slice(0, 3).join(', ')}.` : ''}
${struggledPractices.length > 0 ? `They've struggled with: ${struggledPractices.slice(0, 3).join(', ')}.` : ''}

Suggest exactly 3 small, achievable moves for today. Each should be specific and take 5-15 minutes.
Return ONLY a JSON array of 3 strings, nothing else. Example: ["move 1", "move 2", "move 3"]`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().trim();

            // Parse JSON response
            const parsed = JSON.parse(text);
            if (Array.isArray(parsed) && parsed.length === 3) {
                return parsed;
            }
            return currentPractices.slice(0, 3);
        } catch (error) {
            console.error('AI Morning Suggestions Error:', error);
            return currentPractices.slice(0, 3);
        }
    },

    /**
     * Returns a contextual evening reflection prompt based on completion rate.
     */
    getEveningReflectionPrompt: async (
        movesCompleted: number,
        movesTotal: number,
        personality: AIPersonality = 'wise-friend'
    ): Promise<string> => {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const personalityPrompt = PERSONALITIES[personality].prompt;
            const completionRate = movesTotal > 0 ? (movesCompleted / movesTotal) : 0;

            let context = '';
            if (completionRate === 1) {
                context = 'The user completed ALL their moves today. Celebrate this gently.';
            } else if (completionRate >= 0.5) {
                context = 'The user completed some moves but not all. Acknowledge effort without guilt.';
            } else if (completionRate > 0) {
                context = 'The user completed very few moves today. Be compassionate, not disappointed.';
            } else {
                context = 'The user completed no moves today. Be gentle and curious, not judgmental.';
            }

            const prompt = `${personalityPrompt}

${context}
Moves completed: ${movesCompleted} out of ${movesTotal}.

Write a single evening reflection prompt (a question) for them. Keep it under 20 words.
Return ONLY the question, nothing else.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim().replace(/^["']|["']$/g, '');
        } catch (error) {
            console.error('AI Evening Prompt Error:', error);
            if (movesCompleted === movesTotal) {
                return "you showed up fully today. what felt different about you?";
            } else if (movesCompleted > 0) {
                return "some days are like this. what got in the way?";
            }
            return "tomorrow is another chance. what do you need tonight?";
        }
    },

    /**
     * Generates an AI-powered journey title based on user's progress and actions.
     */
    generateJourneyTitle: async (
        dominantPillar: string,
        totalProgress: number,
        daysActive: number,
        recentWins: Win[],
        personality: AIPersonality = 'wise-friend'
    ): Promise<{ name: string; description: string }> => {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const personalityPrompt = PERSONALITIES[personality].prompt;

            // Build context from wins
            const winsContext = recentWins.length > 0
                ? `Recent wins: ${recentWins.slice(0, 5).map(w => w.text).join(', ')}.`
                : 'No wins recorded yet.';

            // Determine milestone context
            let milestoneContext = '';
            if (daysActive >= 66) {
                milestoneContext = 'They have reached 66 days - the threshold of automaticity. This is mastery territory.';
            } else if (daysActive >= 21) {
                milestoneContext = 'They have reached 21 days - habits are taking root.';
            } else if (daysActive >= 7) {
                milestoneContext = 'They have completed a full week of practice.';
            } else if (daysActive >= 1) {
                milestoneContext = 'They are just beginning their journey.';
            }

            const prompt = `${personalityPrompt}

You are naming a woman based on her journey of self-transformation.

Context:
- Dominant focus area: "${dominantPillar}"
- Days active: ${daysActive}
- Overall progress: ${totalProgress}%
- ${winsContext}
- ${milestoneContext}

Generate a poetic 2-3 word title for her (like "The Radiant Starter", "Guardian of Stillness", "The Threshold Keeper").
Also generate a one-sentence description (under 15 words) that reflects her journey.

Return ONLY valid JSON in this exact format, nothing else:
{"name": "The Title", "description": "the description in lowercase"}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().trim();

            // Parse JSON response
            const parsed = JSON.parse(text);
            if (parsed.name && parsed.description) {
                return parsed;
            }
            throw new Error('Invalid response format');
        } catch (error) {
            console.error('AI Journey Title Error:', error);
            // Fallback titles based on days active
            if (daysActive >= 66) {
                return { name: 'The Embodied One', description: 'you have become what you practiced.' };
            } else if (daysActive >= 21) {
                return { name: 'The Committed', description: 'you are writing a new story with your actions.' };
            } else if (daysActive >= 7) {
                return { name: 'The Returning', description: 'you keep showing up. that is everything.' };
            }
            return { name: 'The Seeker', description: 'you are beginning to listen to the quiet voice within.' };
        }
    },

    /**
     * Generates a custom identity/planet based on user's description.
     */
    generateCustomIdentity: async (
        description: string,
        personality: AIPersonality = 'wise-friend'
    ): Promise<{ intention: string; practices: string[] }> => {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const personalityPrompt = PERSONALITIES[personality].prompt;

            const prompt = `${personalityPrompt}

A woman wants to create a custom identity for her personal growth journey.
Her description: "${description}"

Generate:
1. An identity statement starting with "becoming a woman who..." (lowercase, under 10 words after "becoming a woman who")
2. Exactly 3 small, daily practices that support this identity (each under 8 words)

Return ONLY valid JSON in this exact format:
{"intention": "becoming a woman who...", "practices": ["practice 1", "practice 2", "practice 3"]}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().trim();

            // Parse JSON response
            const parsed = JSON.parse(text);
            if (parsed.intention && parsed.practices && parsed.practices.length === 3) {
                return parsed;
            }
            throw new Error('Invalid response format');
        } catch (error) {
            console.error('AI Custom Identity Error:', error);
            // Fallback based on description keywords
            const lowerDesc = description.toLowerCase();
            if (lowerDesc.includes('travel') || lowerDesc.includes('world')) {
                return {
                    intention: 'becoming a woman who explores the world',
                    practices: ['research one new destination', 'learn a phrase in another language', 'try a cuisine from another culture']
                };
            } else if (lowerDesc.includes('creative') || lowerDesc.includes('art')) {
                return {
                    intention: 'becoming a woman who creates fearlessly',
                    practices: ['make something with my hands', 'capture beauty around me', 'share my creative voice']
                };
            }
            return {
                intention: 'becoming a woman who trusts herself',
                practices: ['honor a quiet knowing', 'take one bold step', 'celebrate a small win']
            };
        }
    }
};
