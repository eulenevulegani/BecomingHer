import { Button } from '@/components/Button';
import { GlassView, SerifText, Text, useThemeColor } from '@/components/Themed';
import { BrandBackground } from '@/components/visuals/BrandBackground';
import { Goal, MainHerbit, useUser } from '@/context/UserContext';
import { AIService } from '@/lib/AIService';
import { Check, Plus, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View as DefaultView, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function PlannerScreen() {
    const {
        state,
        addGoal,
        removeGoal,
        toggleGoal,
        addHerbit,
        removeHerbit,
        getIdentityColor
    } = useUser();
    const primaryColor = useThemeColor({}, 'primary');

    const [isAdding, setIsAdding] = useState<'day' | 'month' | 'year' | 'herbit' | null>(null);
    const [newGoalText, setNewGoalText] = useState('');

    // Herbit creation state
    const [newHerbitText, setNewHerbitText] = useState('');
    const [selectedFrequency, setSelectedFrequency] = useState<MainHerbit['schedule']>('daily');
    const [freqCount, setFreqCount] = useState(3);
    const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<MainHerbit['timeOfDay']>('anytime');
    const [detectedIdentity, setDetectedIdentity] = useState<string | null>(null);
    const [isClassifying, setIsClassifying] = useState(false);

    const handleAddGoal = (period: 'day' | 'month' | 'year') => {
        if (!newGoalText.trim()) return;

        const newGoal: Goal = {
            id: `goal-${Date.now()}`,
            text: newGoalText.trim(),
            period,
            completed: false,
            createdAt: new Date().toISOString(),
        };

        addGoal(newGoal);
        setNewGoalText('');
        setIsAdding(null);
    };

    // Handle herbit add (Complex Modal Logic)
    const handleAddHerbit = async () => {
        if (!newHerbitText.trim()) return;

        let identity = detectedIdentity;

        // If no manual identity or keyword detection worked, try AI classification
        if (!identity) {
            setIsClassifying(true);
            const { detectIdentityFromText } = require('@/constants/Content');
            identity = detectIdentityFromText(newHerbitText);
            if (!identity) {
                identity = await AIService.classifyHerbit(newHerbitText);
            }
            setIsClassifying(false);
        }

        const newHerbit: MainHerbit = {
            id: `herbit-${Date.now()}`,
            text: newHerbitText.trim(),
            identity,
            schedule: selectedFrequency,
            frequencyCount: selectedFrequency === 'frequency' ? freqCount : undefined,
            frequencyPeriod: selectedFrequency === 'frequency' ? 'week' : undefined,
            timeOfDay: selectedTimeOfDay,
            createdAt: new Date().toISOString(),
            createdVia: 'text'
        };

        addHerbit(newHerbit);
        setNewHerbitText('');
        setDetectedIdentity(null);
        setIsAdding(null);
    };

    // Effect to auto-detect identity
    useEffect(() => {
        if (newHerbitText.trim().length > 3) {
            const { detectIdentityFromText } = require('@/constants/Content');
            const identity = detectIdentityFromText(newHerbitText);
            if (identity) {
                setDetectedIdentity(identity);
            }
        }
    }, [newHerbitText]);

    const renderHerbitSection = () => {
        const herbits = state.herbits || [];

        return (
            <DefaultView style={styles.section}>
                <DefaultView style={styles.sectionHeader}>
                    <SerifText style={styles.sectionTitle}>daily rythm</SerifText>
                    <TouchableOpacity onPress={() => setIsAdding('herbit')}>
                        <Plus size={20} color={primaryColor} />
                    </TouchableOpacity>
                </DefaultView>

                <DefaultView style={styles.goalsList}>
                    {herbits.map((herbit, index) => {
                        const identityColor = getIdentityColor(herbit.identity || '');
                        return (
                            <Animated.View
                                key={herbit.id}
                                entering={FadeInDown.delay(index * 100)}
                            >
                                <GlassView intensity={10} style={[
                                    styles.goalCard,
                                    { borderLeftColor: identityColor, borderLeftWidth: 3, borderLeftStartRadius: 20, borderLeftEndRadius: 0 }
                                ]}>
                                    <DefaultView style={styles.goalContent}>
                                        <DefaultView style={styles.herbitInfo}>
                                            <Text style={styles.goalText}>
                                                {herbit.text}
                                            </Text>
                                            <DefaultView style={styles.herbitMeta}>
                                                <Text style={[styles.metaTag, { color: identityColor }]}>{herbit.identity}</Text>
                                                <Text style={styles.metaTag}>•</Text>
                                                <Text style={styles.metaTag}>
                                                    {herbit.schedule === 'frequency' ? `${herbit.frequencyCount}x/week` : herbit.schedule}
                                                </Text>
                                                <Text style={styles.metaTag}>•</Text>
                                                <Text style={styles.metaTag}>{herbit.timeOfDay}</Text>
                                            </DefaultView>
                                        </DefaultView>
                                    </DefaultView>
                                    <TouchableOpacity onPress={() => removeHerbit(herbit.id)} style={styles.deleteButton}>
                                        <Trash2 size={16} color="#6E6E73" />
                                    </TouchableOpacity>
                                </GlassView>
                            </Animated.View>
                        );
                    })}

                    {isAdding === 'herbit' && (
                        <Animated.View entering={FadeInDown.springify()}>
                            <GlassView intensity={20} style={styles.addCard}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="what will you practice?"
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                    value={newHerbitText}
                                    onChangeText={setNewHerbitText}
                                    autoFocus
                                />

                                <DefaultView style={styles.frequencyRow}>
                                    {(['daily', 'frequency', 'weekdays'] as const).map((freq) => (
                                        <TouchableOpacity
                                            key={freq}
                                            onPress={() => setSelectedFrequency(freq)}
                                            style={[
                                                styles.freqButton,
                                                selectedFrequency === freq && { backgroundColor: primaryColor + '30', borderColor: primaryColor }
                                            ]}
                                        >
                                            <Text style={[
                                                styles.freqText,
                                                selectedFrequency === freq && { color: primaryColor }
                                            ]}>
                                                {freq === 'frequency' ? `${freqCount}x / week` : freq}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </DefaultView>

                                {selectedFrequency === 'frequency' && (
                                    <DefaultView style={styles.frequencyAdjustRow}>
                                        {[1, 2, 3, 4, 5].map(n => (
                                            <TouchableOpacity
                                                key={n}
                                                onPress={() => setFreqCount(n)}
                                                style={[
                                                    styles.nButton,
                                                    freqCount === n && { backgroundColor: primaryColor + '40' }
                                                ]}
                                            >
                                                <Text style={styles.nText}>{n}</Text>
                                            </TouchableOpacity>
                                        ))}
                                        <Text style={styles.timesText}>times</Text>
                                    </DefaultView>
                                )}

                                <DefaultView style={styles.timeOfDayRow}>
                                    {(['morning', 'anytime', 'evening'] as const).map((time) => (
                                        <TouchableOpacity
                                            key={time}
                                            onPress={() => setSelectedTimeOfDay(time)}
                                            style={[
                                                styles.timeButton,
                                                selectedTimeOfDay === time && { borderColor: primaryColor }
                                            ]}
                                        >
                                            <Text style={[
                                                styles.timeText,
                                                selectedTimeOfDay === time && { color: primaryColor }
                                            ]}>
                                                {time}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </DefaultView>

                                <DefaultView style={styles.actions}>
                                    <DefaultView style={styles.classifyingInfo}>
                                        {isClassifying && (
                                            <>
                                                <ActivityIndicator size="small" color={primaryColor} />
                                                <Text style={styles.classifyingText}>classifying...</Text>
                                            </>
                                        )}
                                    </DefaultView>
                                    <TouchableOpacity onPress={() => setIsAdding(null)} style={styles.cancelBtn}>
                                        <Text style={styles.cancelText}>cancel</Text>
                                    </TouchableOpacity>
                                    <Button
                                        title="add"
                                        onPress={handleAddHerbit}
                                        size="sm"
                                        color={primaryColor}
                                        disabled={isClassifying}
                                    />
                                </DefaultView>
                            </GlassView>
                        </Animated.View>
                    )}

                    {herbits.length === 0 && isAdding !== 'herbit' && (
                        <Text style={styles.emptyText}>no daily rhythm set</Text>
                    )}
                </DefaultView>
            </DefaultView>
        );
    };

    const renderGoalSection = (title: string, period: 'day' | 'month' | 'year') => {
        const goals = state.goals?.filter(g => g.period === period) || [];

        return (
            <DefaultView style={styles.section}>
                <DefaultView style={styles.sectionHeader}>
                    <SerifText style={styles.sectionTitle}>{title}</SerifText>
                    <TouchableOpacity onPress={() => setIsAdding(period)}>
                        <Plus size={20} color={primaryColor} />
                    </TouchableOpacity>
                </DefaultView>

                <DefaultView style={styles.goalsList}>
                    {goals.map((goal, index) => (
                        <Animated.View
                            key={goal.id}
                            entering={FadeInDown.delay(index * 100)}
                        >
                            <GlassView intensity={10} style={styles.goalCard}>
                                <TouchableOpacity
                                    style={styles.goalContent}
                                    onPress={() => toggleGoal(goal.id)}
                                >
                                    <DefaultView style={[
                                        styles.checkbox,
                                        goal.completed && { backgroundColor: primaryColor, borderColor: primaryColor }
                                    ]}>
                                        {goal.completed && <Check size={14} color="#000" />}
                                    </DefaultView>
                                    <Text style={[styles.goalText, goal.completed && styles.goalTextDone]}>
                                        {goal.text}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => removeGoal(goal.id)} style={styles.deleteButton}>
                                    <Trash2 size={16} color="#6E6E73" />
                                </TouchableOpacity>
                            </GlassView>
                        </Animated.View>
                    ))}

                    {isAdding === period && (
                        <Animated.View entering={FadeInDown.springify()}>
                            <GlassView intensity={20} style={styles.addCard}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={`what is your focus for the ${period === 'day' ? 'today' : period}?`}
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                    value={newGoalText}
                                    onChangeText={setNewGoalText}
                                    autoFocus
                                    onSubmitEditing={() => handleAddGoal(period)}
                                />
                                <DefaultView style={styles.actions}>
                                    <TouchableOpacity onPress={() => setIsAdding(null)} style={styles.cancelBtn}>
                                        <Text style={styles.cancelText}>cancel</Text>
                                    </TouchableOpacity>
                                    <Button
                                        title="add"
                                        onPress={() => handleAddGoal(period)}
                                        size="sm"
                                        color={primaryColor}
                                    />
                                </DefaultView>
                            </GlassView>
                        </Animated.View>
                    )}

                    {goals.length === 0 && isAdding !== period && (
                        <Text style={styles.emptyText}>no goals set for this {period === 'day' ? 'today' : period}</Text>
                    )}
                </DefaultView>
            </DefaultView>
        );
    };

    return (
        <DefaultView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <BrandBackground />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <DefaultView style={styles.header}>
                    <SerifText style={styles.title}>planner</SerifText>
                    <Text style={styles.subtitle}>design your becoming</Text>
                </DefaultView>

                {renderHerbitSection()}
                {renderGoalSection('daily intentions', 'day')}
                {renderGoalSection('monthly focus', 'month')}
                {renderGoalSection('yearly intentions', 'year')}
            </ScrollView>
        </DefaultView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0F',
    },
    scrollContent: {
        paddingTop: 80,
        paddingBottom: 120,
        paddingHorizontal: 24,
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        color: '#FFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#8E8E93',
        letterSpacing: 2,
        textTransform: 'lowercase',
    },
    section: {
        marginBottom: 40,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        color: '#FFF',
        opacity: 0.9,
    },
    goalsList: {
        gap: 12,
    },
    goalCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    goalContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    herbitInfo: {
        flex: 1,
    },
    herbitMeta: {
        flexDirection: 'row',
        gap: 6,
        marginTop: 4,
    },
    metaTag: {
        fontSize: 10,
        color: '#8E8E93',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    goalText: {
        fontSize: 16,
        color: '#FFF',
    },
    goalTextDone: {
        color: '#6E6E73',
        textDecorationLine: 'line-through',
    },
    deleteButton: {
        padding: 8,
    },
    emptyText: {
        fontSize: 13,
        color: '#6E6E73',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 8,
    },
    addCard: {
        padding: 20,
        borderRadius: 24,
        gap: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    input: {
        fontSize: 16,
        color: '#FFF',
        padding: 0,
        marginBottom: 8,
    },
    frequencyRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 4,
    },
    frequencyAdjustRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 8,
        marginBottom: 16,
    },
    nButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    nText: {
        fontSize: 13,
        color: '#FFF',
    },
    timesText: {
        fontSize: 12,
        color: '#8E8E93',
    },
    timeOfDayRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 20,
    },
    timeButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 11,
        color: '#8E8E93',
        textTransform: 'lowercase',
    },
    freqButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    freqText: {
        fontSize: 11,
        color: '#8E8E93',
        textTransform: 'lowercase',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 16,
    },
    cancelBtn: {
        padding: 8,
    },
    cancelText: {
        fontSize: 14,
        color: '#6E6E73',
    },
    classifyingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    classifyingText: {
        fontSize: 11,
        color: '#8E8E93',
        fontStyle: 'italic',
    },
});
