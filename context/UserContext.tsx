import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { IntentionItem } from '@/constants/Content';

export interface Move {
    id: string;
    text: string;
    status: string | null;
    timestamp: string | null;
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

export interface Win {
    id: string;
    text: string;
    type: 'text' | 'state' | 'practice';
    timestamp: string;
}

export interface UserState {
    hasCompletedOnboarding: boolean;
    activeIntentions: string[]; // Quarterly/Seasonal
    customIdentities: IntentionItem[];
    currentFocusCycle: FocusCycle | null;
    practiceLogs: PracticeLog[];
    wins: Win[];
    lastReflectionDate: string | null;
    isPremium: boolean;
    activePersonality: 'wise-friend' | 'muse' | 'anchor' | 'pioneer';
}

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
            isLoading
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
