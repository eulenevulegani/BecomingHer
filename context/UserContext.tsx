import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { IntentionItem } from '@/constants/Content';

export interface Herbit {
    id: string;
    text: string;
    status: string | null;
    timestamp: string | null;
}

export interface DailyHerbit {
    id: string;
    text: string;
    completed: boolean;
    completedAt: string | null;
    proofText?: string;
}

export interface PracticeLog {
    id: string;
    practice: string;
    level: 'yes' | 'little' | 'not_today';
    timestamp: string;
}

export interface FocusCycle {
    intention: string | null;
    practices: string[];
    startDate: string;
}

export interface IdentityProgress {
    daysActive: number;
    herbitsCompleted: number;
    streak: number;
    lastActiveDate: string | null;
}

export interface MainHerbit {
    id: string;
    text: string;
    identity: string | null;
    schedule: 'daily' | 'weekdays' | 'weekends' | 'custom' | 'frequency';
    customDays?: number[];
    frequencyCount?: number; // e.g., 3
    frequencyPeriod?: 'week' | 'month'; // e.g., 'week'
    timeOfDay?: 'morning' | 'anytime' | 'evening';
    createdAt: string;
    createdVia: 'voice' | 'text';
}

export interface HerbitLog {
    herbitId: string;
    date: string;
    completed: boolean;
    completedAt: string | null;
}

export interface JourneyTitle {
    name: string;
    description: string;
    unlockedAt: string;
    milestone: string;
}

export interface Goal {
    id: string;
    text: string;
    period: 'day' | 'month' | 'year';
    completed: boolean;
    createdAt: string;
    targetPeriod?: string; // e.g., "2024-W12", "2024-Q1", "2024"
}

export interface Win {
    id: string;
    text: string;
    type: 'text' | 'state' | 'practice';
    imageUri?: string; // Support for Proof Room photos
    timestamp: string;
}

export interface UserState {
    hasCompletedOnboarding: boolean;
    activeIntentions: string[];
    customIdentities: IntentionItem[];
    currentFocusCycle: FocusCycle | null;
    practiceLogs: PracticeLog[];
    wins: Win[];
    lastReflectionDate: string | null;
    isPremium: boolean;
    activePersonality: 'wise-friend' | 'muse' | 'anchor' | 'pioneer';
    dailyHerbits: DailyHerbit[];
    lastMorningSetup: string | null;
    lastEveningClose: string | null;
    // Journey tracking
    identityProgress: Record<string, IdentityProgress>;
    journeyTitle: JourneyTitle;
    totalDaysActive: number;
    // Herbit planner
    herbits: MainHerbit[];
    herbitLogs: HerbitLog[];
    // Hierarchical goals
    goals: Goal[];
    name: string;
}

const DEFAULT_JOURNEY_TITLE: JourneyTitle = {
    name: 'The Seeker',
    description: 'you are beginning to listen to the quiet voice within.',
    unlockedAt: new Date().toISOString(),
    milestone: 'day 1'
};

const INITIAL_STATE: UserState = {
    hasCompletedOnboarding: false,
    activeIntentions: [],
    customIdentities: [],
    currentFocusCycle: null,
    practiceLogs: [],
    wins: [],
    lastReflectionDate: null,
    isPremium: false,
    activePersonality: 'wise-friend',
    dailyHerbits: [],
    lastMorningSetup: null,
    lastEveningClose: null,
    identityProgress: {},
    journeyTitle: DEFAULT_JOURNEY_TITLE,
    totalDaysActive: 0,
    herbits: [],
    herbitLogs: [],
    goals: [],
    name: '',
};

interface UserContextType {
    state: UserState;
    updateState: (data: Partial<UserState>) => void;
    addWin: (win: Win) => void;
    logPractice: (log: PracticeLog) => void;
    setFocusCycle: (cycle: FocusCycle) => void;
    addCustomIdentity: (identity: IntentionItem) => void;
    removeCustomIdentity: (id: string) => void;
    completeOnboarding: () => void;
    setPremium: (value: boolean) => void;
    setActivePersonality: (personality: 'wise-friend' | 'muse' | 'anchor' | 'pioneer') => void;
    resetState: () => void;
    isLoading: boolean;
    getStreak: () => number;
    // Daily loop helpers
    setDailyHerbits: (herbits: DailyHerbit[]) => void;
    toggleHerbitComplete: (herbitId: string) => void;
    startMorning: () => void;
    closeEvening: () => void;
    getTimeOfDay: () => 'morning' | 'afternoon' | 'evening';
    // Journey helpers
    updateIdentityProgress: (identityId: string) => void;
    setJourneyTitle: (title: JourneyTitle) => void;
    getIdentityProgressPercent: (identityId: string) => number;
    // ...
    // Herbit helpers
    addHerbit: (herbit: MainHerbit) => void;
    removeHerbit: (herbitId: string) => void;
    logHerbitCompletion: (herbitId: string, completed: boolean, date?: string) => void;
    getTodaysHerbits: (date?: string) => MainHerbit[];
    getHerbitStreak: (herbitId: string) => number;
    getIdentityActivity: (identityId: string, days: number) => number;
    getTotalProgress: () => number;
    getCuratedIdentity: () => { name: string; description: string };
    // Goal helpers
    addGoal: (goal: Goal) => void;
    removeGoal: (goalId: string) => void;
    toggleGoal: (goalId: string) => void;
    getBecomingXP: () => number;
    getBecomingLevel: () => number;
    getNextLevelXP: () => number;
    getIdentityColor: (identity: string) => string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<UserState>(INITIAL_STATE);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadState();
    }, []);

    const loadState = async () => {
        try {
            const savedState = await AsyncStorage.getItem('herbit_user_state');
            if (savedState) {
                const parsed = JSON.parse(savedState);
                // Merge with INITIAL_STATE
                setState({ ...INITIAL_STATE, ...parsed });
            }
        } catch (e) {
            console.error('Failed to load state', e);
        } finally {
            setIsLoading(false);
        }
    };

    const saveState = async (newState: UserState) => {
        try {
            await AsyncStorage.setItem('herbit_user_state', JSON.stringify(newState));
        } catch (e) {
            console.error('Failed to save state', e);
        }
    };

    const updateState = (data: Partial<UserState>) => {
        setState((prev) => {
            const newState = { ...prev, ...data };
            saveState(newState);
            return newState;
        });
    };

    const addWin = (win: Win) => {
        setState((prev) => {
            const newState = { ...prev, wins: [win, ...prev.wins] };
            saveState(newState);
            return newState;
        });
    };

    const logPractice = (log: PracticeLog) => {
        setState((prev) => {
            const newState = { ...prev, practiceLogs: [log, ...prev.practiceLogs] };
            saveState(newState);
            return newState;
        });
    };

    const setFocusCycle = (cycle: FocusCycle) => {
        setState((prev) => {
            const newState = { ...prev, currentFocusCycle: cycle };
            saveState(newState);
            return newState;
        });
    };
    const addCustomIdentity = (identity: IntentionItem) => {
        setState((prev) => {
            const newState = { ...prev, customIdentities: [...(prev.customIdentities || []), identity] };
            saveState(newState);
            return newState;
        });
    };

    const removeCustomIdentity = (id: string) => {
        setState((prev) => {
            const newState = {
                ...prev,
                customIdentities: (prev.customIdentities || []).filter(i => i.id !== id),
                activeIntentions: prev.activeIntentions.filter(i => {
                    const custom = (prev.customIdentities || []).find(ci => ci.id === id);
                    return i !== custom?.intention;
                })
            };
            saveState(newState);
            return newState;
        });
    };



    const completeOnboarding = () => {
        setState((prev) => {
            const newState = { ...prev, hasCompletedOnboarding: true };
            saveState(newState);
            return newState;
        });
    };

    const setPremium = (value: boolean) => {
        setState((prev) => {
            const newState = { ...prev, isPremium: value };
            saveState(newState);
            return newState;
        });
    };

    const setActivePersonality = (personality: 'wise-friend' | 'muse' | 'anchor' | 'pioneer') => {
        setState((prev) => {
            const newState = { ...prev, activePersonality: personality };
            saveState(newState);
            return newState;
        });
    };

    const resetState = async () => {
        console.log('[UserContext] Resetting state...');
        try {
            await AsyncStorage.removeItem('herbit_user_state');
            await AsyncStorage.removeItem('becoming_user_state'); // Also clear old key
            await AsyncStorage.removeItem('proofa_user_state');  // And the really old one
        } catch (e) {
            console.error('[UserContext] Failed to clear AsyncStorage', e);
        }
        setState({ ...INITIAL_STATE });
    };

    const getStreak = () => {
        if (!state.practiceLogs.length && !state.wins.length) return 0;

        const allDates = new Set([
            ...state.practiceLogs.map(l => new Date(l.timestamp).toDateString()),
            ...state.wins.map(w => new Date(w.timestamp).toDateString())
        ]);

        const sortedDates = Array.from(allDates)
            .map(d => new Date(d))
            .sort((a, b) => b.getTime() - a.getTime());

        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const mostRecent = sortedDates[0];
        if (!mostRecent) return 0;

        const diffDays = Math.floor((currentDate.getTime() - mostRecent.getTime()) / (1000 * 3600 * 24));
        if (diffDays > 1) return 0;

        for (let i = 0; i < sortedDates.length; i++) {
            const date = sortedDates[i];
            const expectedDate = new Date(mostRecent);
            expectedDate.setDate(mostRecent.getDate() - i);

            if (date.toDateString() === expectedDate.toDateString()) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    };

    // Daily loop helpers
    const setDailyHerbits = (herbits: DailyHerbit[]) => {
        setState((prev) => {
            const newState = { ...prev, dailyHerbits: herbits };
            saveState(newState);
            return newState;
        });
    };

    const toggleHerbitComplete = (herbitId: string) => {
        setState((prev) => {
            const newHerbits = prev.dailyHerbits.map(h =>
                h.id === herbitId
                    ? { ...h, completed: !h.completed, completedAt: !h.completed ? new Date().toISOString() : null }
                    : h
            );
            const newState = { ...prev, dailyHerbits: newHerbits };
            saveState(newState);
            return newState;
        });
    };

    const startMorning = () => {
        setState((prev) => {
            const today = new Date().toISOString().split('T')[0];
            const newState = { ...prev, lastMorningSetup: today };
            saveState(newState);
            return newState;
        });
    };

    const closeEvening = () => {
        setState((prev) => {
            const today = new Date().toISOString().split('T')[0];
            const newState = { ...prev, lastEveningClose: today };
            saveState(newState);
            return newState;
        });
    };

    const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' => {
        const hour = new Date().getHours();
        if (hour < 12) return 'morning';
        if (hour < 18) return 'afternoon';
        return 'evening';
    };

    // Journey helpers
    const updateIdentityProgress = (identityId: string) => {
        setState((prev) => {
            const today = new Date().toISOString().split('T')[0];
            const currentProgress = prev.identityProgress[identityId] || {
                daysActive: 0,
                herbitsCompleted: 0,
                streak: 0,
                lastActiveDate: null
            };

            // Check if already updated today
            const isNewDay = currentProgress.lastActiveDate !== today;
            const wasYesterday = currentProgress.lastActiveDate ===
                new Date(Date.now() - 86400000).toISOString().split('T')[0];

            const newProgress = {
                daysActive: isNewDay ? currentProgress.daysActive + 1 : currentProgress.daysActive,
                herbitsCompleted: currentProgress.herbitsCompleted + 1,
                streak: isNewDay ? (wasYesterday ? currentProgress.streak + 1 : 1) : currentProgress.streak,
                lastActiveDate: today
            };

            // Update total days active if new day
            const newTotalDays = isNewDay ? prev.totalDaysActive + 1 : prev.totalDaysActive;

            const newState = {
                ...prev,
                identityProgress: { ...prev.identityProgress, [identityId]: newProgress },
                totalDaysActive: newTotalDays
            };
            saveState(newState);
            return newState;
        });
    };

    const setJourneyTitle = (title: JourneyTitle) => {
        setState((prev) => {
            const newState = { ...prev, journeyTitle: title };
            saveState(newState);
            return newState;
        });
    };

    const getIdentityProgressPercent = (identityId: string): number => {
        const progress = state.identityProgress[identityId];
        if (!progress) return 0;
        // Formula: (daysActive * 5) + (herbitsCompleted * 2) + (streak * 3), max 100
        return Math.min(100, (progress.daysActive * 5) + (progress.herbitsCompleted * 2) + (progress.streak * 3));
    };

    const getTotalProgress = (): number => {
        const identityIds = Object.keys(state.identityProgress);
        if (identityIds.length === 0) return 0;
        const total = identityIds.reduce((sum, id) => sum + getIdentityProgressPercent(id), 0);
        return Math.round(total / 7); // Average across all 7 identities
    };

    // Herbit helpers
    const addHerbit = (herbit: MainHerbit) => {
        setState((prev) => {
            let identity = herbit.identity;
            if (!identity) {
                const { detectIdentityFromText } = require('@/constants/Content');
                identity = detectIdentityFromText(herbit.text);
            }
            const newHerbit = { ...herbit, identity };
            const newState = { ...prev, herbits: [...prev.herbits, newHerbit] };
            saveState(newState);
            return newState;
        });
    };

    const removeHerbit = (herbitId: string) => {
        setState((prev) => {
            const newState = {
                ...prev,
                herbits: prev.herbits.filter(h => h.id !== herbitId),
                herbitLogs: prev.herbitLogs.filter(l => l.herbitId !== herbitId)
            };
            saveState(newState);
            return newState;
        });
    };

    const logHerbitCompletion = (herbitId: string, completed: boolean, date?: string) => {
        const targetDate = date || new Date().toISOString().split('T')[0];
        setState((prev) => {
            // Remove existing log for this date if any
            const filteredLogs = prev.herbitLogs.filter(
                l => !(l.herbitId === herbitId && l.date === targetDate)
            );
            const newLog: HerbitLog = {
                herbitId,
                date: targetDate,
                completed,
                completedAt: completed ? new Date().toISOString() : null
            };
            const newState = { ...prev, herbitLogs: [...filteredLogs, newLog] };
            saveState(newState);

            // Also update identity progress if completed
            if (completed) {
                const herbit = prev.herbits.find(h => h.id === herbitId);
                if (herbit?.identity) {
                    updateIdentityProgress(herbit.identity);
                }
            }

            return newState;
        });
    };

    const getTodaysHerbits = (date?: string): MainHerbit[] => {
        const targetDate = date ? new Date(date) : new Date();
        const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const todayStr = targetDate.toISOString().split('T')[0];

        return state.herbits.filter(herbit => {
            // 1. Basic schedules
            if (herbit.schedule === 'daily') return true;
            if (herbit.schedule === 'weekdays') return dayOfWeek >= 1 && dayOfWeek <= 5;
            if (herbit.schedule === 'weekends') return dayOfWeek === 0 || dayOfWeek === 6;
            if (herbit.schedule === 'custom' && herbit.customDays) {
                return herbit.customDays.includes(dayOfWeek);
            }

            // 2. Frequency-based habits (e.g., 3x a week)
            if (herbit.schedule === 'frequency' && herbit.frequencyCount && herbit.frequencyPeriod) {
                // If it's already completed today, show it (as done)
                const completedToday = state.herbitLogs.some(
                    l => l.herbitId === herbit.id && l.date === todayStr && l.completed
                );
                if (completedToday) return true;

                // Calculate completions in current period
                const completions = state.herbitLogs.filter(l => {
                    if (l.herbitId !== herbit.id || !l.completed) return false;
                    const logDate = new Date(l.date);

                    if (herbit.frequencyPeriod === 'week') {
                        // Rough week check (within last 7 days)
                        const diff = (targetDate.getTime() - logDate.getTime()) / (1000 * 3600 * 24);
                        return diff >= 0 && diff < 7;
                    } else {
                        // Month check
                        return logDate.getMonth() === targetDate.getMonth() &&
                            logDate.getFullYear() === targetDate.getFullYear();
                    }
                }).length;

                return completions < herbit.frequencyCount;
            }

            return true;
        });
    };

    const getHerbitStreak = (herbitId: string): number => {
        const logs = state.herbitLogs
            .filter(l => l.herbitId === herbitId && l.completed)
            .map(l => l.date)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        if (logs.length === 0) return 0;

        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        for (let i = 0; i < logs.length; i++) {
            const logDate = new Date(logs[i]);
            const expectedDate = new Date(currentDate);
            expectedDate.setDate(currentDate.getDate() - i);

            if (logDate.toDateString() === expectedDate.toDateString()) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    };

    const getIdentityActivity = (identityId: string, days: number): number => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);

        const herbitIds = state.herbits
            .filter(h => h.identity?.toLowerCase() === identityId.toLowerCase())
            .map(h => h.id);

        const completions = state.herbitLogs.filter(
            l => herbitIds.includes(l.herbitId) &&
                l.completed &&
                new Date(l.date) >= cutoff
        );

        return completions.length;
    };

    const getCuratedIdentity = () => {
        // Calculate activity in each identity over the last 7 days
        const identityIds = ['health', 'finances', 'relationships', 'purpose', 'growth', 'environment', 'spirituality'];
        const activity = identityIds.map(id => ({
            id,
            count: getIdentityActivity(id, 7)
        }));

        const topIdentity = activity.sort((a, b) => b.count - a.count)[0];

        if (!topIdentity || topIdentity.count === 0) {
            return {
                name: "The Seeker",
                description: "you are beginning to listen to the quiet voice within."
            };
        }

        const descriptors: Record<string, string> = {
            health: "a woman who honors herself",
            finances: "a woman who masters abundance",
            relationships: "a woman who nurtures community",
            purpose: "a woman who leads with vision",
            growth: "a woman who evolves daily",
            environment: "a woman who curates her space",
            spirituality: "a woman of inner peace"
        };

        return {
            name: `I am becoming ${descriptors[topIdentity.id] || "a woman of intention"}`,
            description: `Based on your recent commitment to ${topIdentity.id}.`
        };
    };

    const getBecomingXP = () => {
        const herbitXP = state.herbitLogs.filter(l => l.completed).length * 10;
        const winXP = (state.wins?.length || 0) * 50;
        return herbitXP + winXP;
    };

    const getBecomingLevel = () => {
        const xp = getBecomingXP();
        if (xp < 100) return 1;
        if (xp < 300) return 2;
        if (xp < 600) return 3;
        if (xp < 1000) return 4;
        if (xp < 1500) return 5;
        if (xp < 2100) return 6;
        return Math.floor(6 + (xp - 2100) / 1000) + 1;
    };

    const getNextLevelXP = () => {
        const xp = getBecomingXP();
        if (xp < 100) return 100;
        if (xp < 300) return 300;
        if (xp < 600) return 600;
        if (xp < 1000) return 1000;
        if (xp < 1500) return 1500;
        if (xp < 2100) return 2100;
        const currentLevelBasis = 2100 + (getBecomingLevel() - 7) * 1000;
        return currentLevelBasis + 1000;
    };

    const getIdentityColor = (identity: string) => {
        const { IDENTITY_COLORS } = require('@/constants/Colors');
        return IDENTITY_COLORS[identity?.toLowerCase() as keyof typeof IDENTITY_COLORS] || '#FFF';
    };

    const addGoal = (goal: Goal) => {
        setState((prev) => {
            const newState = { ...prev, goals: [...(prev.goals || []), goal] };
            saveState(newState);
            return newState;
        });
    };

    const removeGoal = (goalId: string) => {
        setState((prev) => {
            const newState = { ...prev, goals: (prev.goals || []).filter(g => g.id !== goalId) };
            saveState(newState);
            return newState;
        });
    };

    const toggleGoal = (goalId: string) => {
        setState((prev) => {
            const newState = {
                ...prev,
                goals: (prev.goals || []).map(g =>
                    g.id === goalId ? { ...g, completed: !g.completed } : g
                )
            };
            saveState(newState);
            return newState;
        });
    };

    const contextValue = React.useMemo(() => ({
        state,
        updateState,
        addWin,
        logPractice,
        setFocusCycle,
        addCustomIdentity,
        removeCustomIdentity,
        completeOnboarding,
        setPremium,
        setActivePersonality,
        resetState,
        isLoading,
        getStreak,
        setDailyHerbits,
        toggleHerbitComplete,
        startMorning,
        closeEvening,
        getTimeOfDay,
        updateIdentityProgress,
        setJourneyTitle,
        getIdentityProgressPercent,
        getTotalProgress,
        addHerbit,
        removeHerbit,
        logHerbitCompletion,
        getTodaysHerbits,
        getHerbitStreak,
        getIdentityActivity,
        getCuratedIdentity,
        addGoal,
        removeGoal,
        toggleGoal,
        getBecomingXP,
        getBecomingLevel,
        getNextLevelXP,
        getIdentityColor
    }), [state, isLoading]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
