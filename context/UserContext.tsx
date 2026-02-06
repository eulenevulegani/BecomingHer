import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { IntentionItem } from '@/constants/Content';

export interface Move {
    id: string;
    text: string;
    status: string | null;
    timestamp: string | null;
}

export interface DailyMove {
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
    weekStartDate: string;
}

export interface PillarProgress {
    daysActive: number;
    movesCompleted: number;
    streak: number;
    lastActiveDate: string | null;
}

export interface JourneyTitle {
    name: string;
    description: string;
    unlockedAt: string;
    milestone: string;
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
    dailyMoves: DailyMove[];
    lastMorningSetup: string | null;
    lastEveningClose: string | null;
    // Journey tracking
    pillarProgress: Record<string, PillarProgress>;
    journeyTitle: JourneyTitle;
    totalDaysActive: number;
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
    dailyMoves: [],
    lastMorningSetup: null,
    lastEveningClose: null,
    pillarProgress: {},
    journeyTitle: DEFAULT_JOURNEY_TITLE,
    totalDaysActive: 0,
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
    setDailyMoves: (moves: DailyMove[]) => void;
    toggleMoveComplete: (moveId: string) => void;
    startMorning: () => void;
    closeEvening: () => void;
    getTimeOfDay: () => 'morning' | 'afternoon' | 'evening';
    // Journey helpers
    updatePillarProgress: (pillarId: string) => void;
    setJourneyTitle: (title: JourneyTitle) => void;
    getPillarProgressPercent: (pillarId: string) => number;
    getTotalProgress: () => number;
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
            const savedState = await AsyncStorage.getItem('proofa_user_state');
            if (savedState) {
                const parsed = JSON.parse(savedState);
                // Merge with INITIAL_STATE to ensure new fields (like practiceLogs) exist
                // even for users with old data.
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
            await AsyncStorage.setItem('proofa_user_state', JSON.stringify(newState));
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
        try {
            await AsyncStorage.removeItem('proofa_user_state');
            setState(INITIAL_STATE);
        } catch (e) {
            console.error('Failed to reset state', e);
        }
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
    const setDailyMoves = (moves: DailyMove[]) => {
        setState((prev) => {
            const newState = { ...prev, dailyMoves: moves };
            saveState(newState);
            return newState;
        });
    };

    const toggleMoveComplete = (moveId: string) => {
        setState((prev) => {
            const newMoves = prev.dailyMoves.map(m =>
                m.id === moveId
                    ? { ...m, completed: !m.completed, completedAt: !m.completed ? new Date().toISOString() : null }
                    : m
            );
            const newState = { ...prev, dailyMoves: newMoves };
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
    const updatePillarProgress = (pillarId: string) => {
        setState((prev) => {
            const today = new Date().toISOString().split('T')[0];
            const currentProgress = prev.pillarProgress[pillarId] || {
                daysActive: 0,
                movesCompleted: 0,
                streak: 0,
                lastActiveDate: null
            };

            // Check if already updated today
            const isNewDay = currentProgress.lastActiveDate !== today;
            const wasYesterday = currentProgress.lastActiveDate ===
                new Date(Date.now() - 86400000).toISOString().split('T')[0];

            const newProgress = {
                daysActive: isNewDay ? currentProgress.daysActive + 1 : currentProgress.daysActive,
                movesCompleted: currentProgress.movesCompleted + 1,
                streak: isNewDay ? (wasYesterday ? currentProgress.streak + 1 : 1) : currentProgress.streak,
                lastActiveDate: today
            };

            // Update total days active if new day
            const newTotalDays = isNewDay ? prev.totalDaysActive + 1 : prev.totalDaysActive;

            const newState = {
                ...prev,
                pillarProgress: { ...prev.pillarProgress, [pillarId]: newProgress },
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

    const getPillarProgressPercent = (pillarId: string): number => {
        const progress = state.pillarProgress[pillarId];
        if (!progress) return 0;
        // Formula: (daysActive * 5) + (movesCompleted * 2) + (streak * 3), max 100
        return Math.min(100, (progress.daysActive * 5) + (progress.movesCompleted * 2) + (progress.streak * 3));
    };

    const getTotalProgress = (): number => {
        const pillarIds = Object.keys(state.pillarProgress);
        if (pillarIds.length === 0) return 0;
        const total = pillarIds.reduce((sum, id) => sum + getPillarProgressPercent(id), 0);
        return Math.round(total / 7); // Average across all 7 pillars
    };

    return (
        <UserContext.Provider value={{
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
            setDailyMoves,
            toggleMoveComplete,
            startMorning,
            closeEvening,
            getTimeOfDay,
            updatePillarProgress,
            setJourneyTitle,
            getPillarProgressPercent,
            getTotalProgress
        }}>
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
