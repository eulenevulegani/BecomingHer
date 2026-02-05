import { GlassView, SerifText, Text, useThemeColor, View } from '@/components/Themed';
import { AuraBackground } from '@/components/visuals/AuraBackground';
import { PremiumModal } from '@/components/visuals/PremiumModal';
import { IntentionItem, INTENTIONS_MAP } from '@/constants/Content';
import { useUser } from '@/context/UserContext';
import { AIService } from '@/lib/AIService';
import { COPY } from '@/lib/copy';
import { useRouter } from 'expo-router';
import { Crown, Plus, Repeat, Trash2, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { View as DefaultView, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, FadeOut, Layout } from 'react-native-reanimated';

export default function BecomingScreen() {
    const { state, updateState, setPremium, addCustomIdentity, removeCustomIdentity, setFocusCycle, resetState } = useUser();
    const router = useRouter();
    const primaryColor = useThemeColor({}, 'primary');
    const [isAdding, setIsAdding] = useState(false);
    const [isCreatingCustom, setIsCreatingCustom] = useState(false);
    const [newIdentityName, setNewIdentityName] = useState('');
    const [newPractices, setNewPractices] = useState(['', '']);
    const [expandedIntention, setExpandedIntention] = useState<string | null>(null);
    const [isPremiumModalVisible, setIsPremiumModalVisible] = useState(false);
    const [insight, setInsight] = useState<string | null>(null);

    const activeIntentions = state.activeIntentions || [];
    const identityLimit = state.isPremium ? 7 : 2; // Increased limit

    useEffect(() => {
        const fetchInsight = async () => {
            const result = await AIService.getGrowthInsight(
                state.wins || [],
                state.practiceLogs || [],
                state.activePersonality
            );
            setInsight(result);
        };
        fetchInsight();
    }, [state.wins?.length, state.practiceLogs?.length, state.activePersonality]);

    const handleToggleIntention = (intention: string) => {
        if (activeIntentions.includes(intention)) {
            updateState({ activeIntentions: activeIntentions.filter(i => i !== intention) });
        } else if (activeIntentions.length < identityLimit) {
            updateState({ activeIntentions: [...activeIntentions, intention] });
        } else {
            setIsPremiumModalVisible(true);
        }
    };

    const handleSetFocus = (intention: string) => {
        const data = getIntentionData(intention);
        if (!data) return;

        setFocusCycle({
            intention,
            practices: data.practices,
            weekStartDate: new Date().toISOString()
        });
        updateState({ lastReflectionDate: null }); // Reset reflection for new cycle
    };

    const handleAddPractice = () => {
        if (newPractices.length < 4) {
            setNewPractices([...newPractices, '']);
        }
    };

    const handleUpdatePractice = (text: string, index: number) => {
        const updated = [...newPractices];
        updated[index] = text;
        setNewPractices(updated);
    };

    const handleCreateIdentity = () => {
        if (!newIdentityName.trim() || newPractices.filter(p => p.trim()).length === 0) return;

        const newId: IntentionItem = {
            id: `custom-${Date.now()}`,
            intention: newIdentityName.trim().toLowerCase(),
            practices: newPractices.filter(p => p.trim()),
        };

        addCustomIdentity(newId);
        setIsCreatingCustom(false);
        setNewIdentityName('');
        setNewPractices(['', '']);
    };

    // Calculate Journey Stats
    const uniqueCheckInDays = new Set([
        ...state.practiceLogs.map(log => new Date(log.timestamp).toDateString()),
        ...state.wins.map(win => new Date(win.timestamp).toDateString())
    ]).size;

    const gratitudeCount = state.wins.length;

    const totalPractices = (state.practiceLogs || []).filter(log => log.level !== 'not_today').length;

    const getWeekNumber = (date: Date) => {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    };

    const returningWeeks = new Set([
        ...(state.practiceLogs || []).map(log => `${new Date(log.timestamp).getFullYear()}-W${getWeekNumber(new Date(log.timestamp))}`),
        ...(state.wins || []).map(win => `${new Date(win.timestamp).getFullYear()}-W${getWeekNumber(new Date(win.timestamp))}`)
    ]).size;

    const getIntentionData = (intention: string) => {
        const predefined = INTENTIONS_MAP.find(item => item.intention === intention);
        if (predefined) return predefined;
        return (state.customIdentities || []).find(item => item.intention === intention);
    };

    const availablePredefined = INTENTIONS_MAP; // All 12 now available for everyone

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <AuraBackground />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <DefaultView style={styles.header}>
                    <DefaultView style={styles.headerRow}>
                        <DefaultView>
                            <Text style={styles.label}>identity vision</Text>
                            <SerifText weight="bold" style={styles.title}>{COPY.becoming.title}</SerifText>
                        </DefaultView>
                        <TouchableOpacity
                            onPress={async () => {
                                await resetState();
                                router.replace('/welcome');
                            }}
                            style={[styles.resetButton, { backgroundColor: primaryColor + '20' }]}
                        >
                            <Repeat size={16} color={primaryColor} />
                            <Text style={[styles.resetButtonText, { color: primaryColor, fontWeight: 'bold' }]}>Reset Experience</Text>
                        </TouchableOpacity>
                    </DefaultView>
                    <Text style={styles.subtitle}>“Your library of future selves.”</Text>
                </DefaultView>

                {insight && (
                    <GlassView intensity={20} style={styles.insightCard} lightColor="rgba(30, 30, 30, 0.7)">
                        <Text style={styles.label}>a pattern of growth</Text>
                        <SerifText style={styles.insightText}>“{insight}”</SerifText>
                    </GlassView>
                )}

                <DefaultView style={styles.overviewSection}>
                    <Text style={styles.sectionLabel}>Your Journey so far</Text>

                    <DefaultView style={styles.statsGrid}>
                        <GlassView intensity={15} style={styles.statCard} lightColor="rgba(30, 30, 30, 0.7)">
                            <SerifText style={styles.statValue}>{uniqueCheckInDays}</SerifText>
                            <Text style={styles.statLabel}>days checked in</Text>
                        </GlassView>
                        <GlassView intensity={15} style={styles.statCard} lightColor="rgba(30, 30, 30, 0.7)">
                            <SerifText style={styles.statValue}>{gratitudeCount}</SerifText>
                            <Text style={styles.statLabel}>total proof</Text>
                        </GlassView>
                        <GlassView intensity={15} style={styles.statCard} lightColor="rgba(30, 30, 30, 0.7)">
                            <SerifText style={styles.statValue}>{totalPractices}</SerifText>
                            <Text style={styles.statLabel}>times practiced</Text>
                        </GlassView>
                        <GlassView intensity={15} style={styles.statCard} lightColor="rgba(30, 30, 30, 0.7)">
                            <SerifText style={styles.statValue}>{returningWeeks}</SerifText>
                            <Text style={styles.statLabel}>weeks returned</Text>
                        </GlassView>
                    </DefaultView>
                </DefaultView>

                <DefaultView style={styles.divider} />

                <DefaultView style={styles.section}>
                    <DefaultView style={styles.limitHeader}>
                        <Text style={styles.sectionLabel}>your active identities</Text>
                        <Text style={styles.limitText}>{activeIntentions.length} / {identityLimit}</Text>
                    </DefaultView>
                    <DefaultView style={styles.progressBarBg}>
                        <Animated.View
                            style={[
                                styles.progressBarFill,
                                {
                                    width: `${(activeIntentions.length / identityLimit) * 100}%`,
                                    backgroundColor: primaryColor
                                }
                            ]}
                        />
                    </DefaultView>

                    {activeIntentions.length >= identityLimit && !state.isPremium && (
                        <TouchableOpacity onPress={() => setIsPremiumModalVisible(true)} style={styles.limitNudge}>
                            <Crown size={12} color={primaryColor} />
                            <Text style={[styles.limitNudgeText, { color: primaryColor }]}>Expand your library with Expansion</Text>
                        </TouchableOpacity>
                    )}

                    <DefaultView style={styles.intentionsList}>
                        {activeIntentions.map((intention, index) => {
                            const data = getIntentionData(intention);
                            const isFocus = state.currentFocusCycle?.intention === intention;

                            return (
                                <Animated.View
                                    key={intention}
                                    entering={FadeInDown.delay(index * 100)}
                                    exiting={FadeOut}
                                    layout={Layout.springify()}
                                >
                                    <GlassView intensity={20} style={[styles.intentionCard, isFocus && { borderColor: primaryColor }]} lightColor="rgba(30, 30, 30, 0.7)">
                                        <DefaultView style={styles.cardMain}>
                                            <DefaultView style={styles.cardHeaderRow}>
                                                <SerifText style={styles.intentionText}>“{intention}”</SerifText>
                                                <TouchableOpacity onPress={() => handleToggleIntention(intention)} style={styles.removeButton}>
                                                    <X size={18} color="#8E8E93" />
                                                </TouchableOpacity>
                                            </DefaultView>

                                            <DefaultView style={styles.practicesList}>
                                                {data?.practices.map((practice, pIndex) => (
                                                    <DefaultView key={pIndex} style={styles.practiceItem}>
                                                        <DefaultView style={[styles.practiceDot, { backgroundColor: primaryColor }]} />
                                                        <Text style={styles.practiceText}>{practice}</Text>
                                                    </DefaultView>
                                                ))}
                                            </DefaultView>

                                            <DefaultView style={styles.cardFooter}>
                                                {isFocus ? (
                                                    <DefaultView style={styles.focusLabel}>
                                                        <Plus size={12} color={primaryColor} />
                                                        <Text style={[styles.focusText, { color: primaryColor }]}>Currently Practicing</Text>
                                                    </DefaultView>
                                                ) : (
                                                    <TouchableOpacity
                                                        onPress={() => handleSetFocus(intention)}
                                                        style={[styles.setFocusButton, { backgroundColor: 'rgba(255,255,255,0.05)' }]}
                                                    >
                                                        <Text style={styles.setFocusText}>Set as Focus</Text>
                                                    </TouchableOpacity>
                                                )}
                                            </DefaultView>
                                        </DefaultView>
                                    </GlassView>
                                </Animated.View>
                            );
                        })}
                        {activeIntentions.length === 0 && (
                            <Text style={styles.emptyText}>{COPY.becoming.empty}</Text>
                        )}
                    </DefaultView>
                </DefaultView>

                <DefaultView style={[styles.section, { marginBottom: 100 }]}>
                    <DefaultView style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.addButton, { flex: 1 }]}
                            onPress={() => setIsAdding(!isAdding)}
                        >
                            <Text style={styles.addButtonText}>
                                {isAdding ? "Close List" : "Explore Intentions"}
                            </Text>
                            <Plus size={16} color={primaryColor} />
                        </TouchableOpacity>

                        {state.isPremium && (
                            <TouchableOpacity
                                style={[styles.addButton, { marginLeft: 12 }]}
                                onPress={() => setIsCreatingCustom(true)}
                            >
                                <Plus size={16} color={primaryColor} />
                            </TouchableOpacity>
                        )}
                    </DefaultView>

                    {isAdding && (
                        <DefaultView style={styles.optionsList}>
                            {/* Predefined List */}
                            {availablePredefined.map((item) => {
                                const isActive = activeIntentions.includes(item.intention);
                                const isDisabled = !isActive && activeIntentions.length >= identityLimit;

                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => handleToggleIntention(item.intention)}
                                        disabled={isDisabled}
                                        style={[
                                            styles.optionItem,
                                            isActive && { borderColor: primaryColor, backgroundColor: 'rgba(255,255,255,0.05)' },
                                            isDisabled && { opacity: 0.3 }
                                        ]}
                                    >
                                        <SerifText style={[styles.optionText, isActive && { color: primaryColor }]}>
                                            {item.intention}
                                        </SerifText>
                                        <DefaultView style={styles.optionPractices}>
                                            {item.practices.slice(0, 3).map((p, i) => (
                                                <Text key={i} style={styles.optionPracticeTag}>{p}</Text>
                                            ))}
                                            {item.practices.length > 3 && <Text style={styles.optionPracticeTag}>+ {item.practices.length - 3} more</Text>}
                                        </DefaultView>
                                    </TouchableOpacity>
                                );
                            })}

                            {/* Custom Identities Section */}
                            {(state.customIdentities || []).length > 0 && (
                                <DefaultView style={styles.customSection}>
                                    <Text style={styles.sectionLabel}>your custom identities</Text>
                                    {state.customIdentities.map((item) => {
                                        const isActive = activeIntentions.includes(item.intention);
                                        const isDisabled = !isActive && activeIntentions.length >= identityLimit;

                                        return (
                                            <TouchableOpacity
                                                key={item.id}
                                                onPress={() => handleToggleIntention(item.intention)}
                                                disabled={isDisabled}
                                                style={[
                                                    styles.optionItem,
                                                    isActive && { borderColor: primaryColor, backgroundColor: 'rgba(255,255,255,0.05)' },
                                                    isDisabled && { opacity: 0.3 }
                                                ]}
                                            >
                                                <DefaultView style={styles.cardHeaderRow}>
                                                    <SerifText style={[styles.optionText, isActive && { color: primaryColor }]}>
                                                        {item.intention}
                                                    </SerifText>
                                                    <TouchableOpacity onPress={() => removeCustomIdentity(item.id)}>
                                                        <Trash2 size={16} color="#FF453A" />
                                                    </TouchableOpacity>
                                                </DefaultView>
                                                <DefaultView style={styles.optionPractices}>
                                                    {item.practices.map((p, i) => (
                                                        <Text key={i} style={styles.optionPracticeTag}>{p}</Text>
                                                    ))}
                                                </DefaultView>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </DefaultView>
                            )}
                        </DefaultView>
                    )}

                    {isCreatingCustom && (
                        <GlassView intensity={30} style={styles.createModal} lightColor="rgba(30, 30, 30, 0.95)">
                            <Text style={styles.label}>create custom identity</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="becoming someone who..."
                                placeholderTextColor="#8E8E93"
                                value={newIdentityName}
                                onChangeText={setNewIdentityName}
                            />

                            <Text style={[styles.label, { marginTop: 20 }]}>habits / practices (max 4)</Text>
                            {newPractices.map((p, idx) => (
                                <TextInput
                                    key={idx}
                                    style={styles.smallInput}
                                    placeholder={`practice ${idx + 1}`}
                                    placeholderTextColor="#8E8E93"
                                    value={p}
                                    onChangeText={(text) => handleUpdatePractice(text, idx)}
                                />
                            ))}

                            {newPractices.length < 4 && (
                                <TouchableOpacity onPress={handleAddPractice} style={styles.addPracticeButton}>
                                    <Plus size={14} color="#8E8E93" />
                                    <Text style={styles.addPracticeText}>add habit</Text>
                                </TouchableOpacity>
                            )}

                            <DefaultView style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setIsCreatingCustom(false)}
                                >
                                    <Text style={styles.cancelText}>cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.saveButton, { backgroundColor: primaryColor }]}
                                    onPress={handleCreateIdentity}
                                >
                                    <Text style={styles.saveText}>create</Text>
                                </TouchableOpacity>
                            </DefaultView>
                        </GlassView>
                    )}
                </DefaultView>
            </ScrollView>

            <PremiumModal
                isVisible={isPremiumModalVisible}
                onClose={() => setIsPremiumModalVisible(false)}
                onUpgrade={() => {
                    setPremium(true);
                    setIsPremiumModalVisible(false);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollContent: {
        paddingTop: 80,
        paddingHorizontal: 32,
        paddingBottom: 60,
    },
    header: {
        marginBottom: 40,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    resetButtonText: {
        fontSize: 11,
        color: '#8E8E93',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    label: {
        fontSize: 10,
        color: '#8E8E93',
        letterSpacing: 2,
        marginBottom: 8,
        textTransform: 'lowercase',
    },
    title: {
        fontSize: 40,
        color: '#FFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#D4CDC3',
        fontStyle: 'italic',
        opacity: 0.8,
    },
    section: {
        marginBottom: 40,
    },
    sectionLabel: {
        fontSize: 12,
        color: '#8E8E93',
        marginBottom: 16,
        textTransform: 'lowercase',
    },
    limitHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    limitText: {
        fontSize: 12,
        color: '#FFF',
        fontWeight: '600',
    },
    progressBarBg: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 3,
        marginBottom: 12,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    limitNudge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 20,
    },
    limitNudgeText: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'lowercase',
    },
    intentionsList: {
        gap: 16,
    },
    intentionCard: {
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },
    cardMain: {
        padding: 24,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    removeButton: {
        padding: 4,
    },
    intentionText: {
        fontSize: 18,
        color: '#FFF',
        flex: 1,
        marginRight: 12,
        lineHeight: 24,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    practicesList: {
        gap: 12,
        marginTop: 16,
        marginBottom: 16,
    },
    practiceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    practiceDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        opacity: 0.5,
    },
    practiceText: {
        fontSize: 14,
        color: '#D4CDC3',
    },
    emptyText: {
        fontSize: 14,
        color: '#8E8E93',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 20,
    },
    focusLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    focusText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'lowercase',
    },
    setFocusButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    setFocusText: {
        fontSize: 12,
        color: '#FFF',
        textTransform: 'lowercase',
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    addButtonText: {
        fontSize: 14,
        color: '#FFF',
        letterSpacing: 1,
    },
    optionsList: {
        marginTop: 20,
        gap: 12,
    },
    optionItem: {
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    optionText: {
        fontSize: 16,
        color: '#FFF',
        marginBottom: 12,
        lineHeight: 24,
    },
    optionPractices: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    optionPracticeTag: {
        fontSize: 10,
        color: '#8E8E93',
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        textTransform: 'lowercase',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 40,
    },
    overviewSection: {
        marginBottom: 40,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 32,
    },
    statCard: {
        width: '48%',
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    statValue: {
        fontSize: 24,
        color: '#FFF',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 9,
        color: '#8E8E93',
        textTransform: 'lowercase',
        letterSpacing: 1,
    },
    insightCard: {
        padding: 20,
        borderRadius: 24,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    insightText: {
        fontSize: 16,
        color: '#D4CDC3',
        lineHeight: 24,
        fontStyle: 'italic',
        marginTop: 8,
    },
    becomingNow: {
    },
    becomingTitle: {
        fontSize: 14,
        color: '#D4CDC3',
        fontStyle: 'italic',
        marginBottom: 16,
        opacity: 0.8,
    },
    activeIdentitiesList: {
        gap: 12,
    },
    identityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    identityDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        opacity: 0.8,
    },
    identityText: {
        fontSize: 16,
        color: '#FFF',
        fontStyle: 'italic',
    },
    emptyIdentityText: {
        fontSize: 14,
        color: '#8E8E93',
        fontStyle: 'italic',
        opacity: 0.6,
    },
    winsList: {
        gap: 12,
    },
    proofCard: {
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    proofDate: {
        fontSize: 9,
        color: '#8E8E93',
        letterSpacing: 1,
        textTransform: 'lowercase',
        marginBottom: 8,
    },
    proofText: {
        fontSize: 16,
        color: '#FFF',
        lineHeight: 22,
    },
    emptyProofText: {
        fontSize: 14,
        color: '#8E8E93',
        fontStyle: 'italic',
        opacity: 0.6,
        textAlign: 'center',
        marginTop: 20,
    },
    moreText: {
        fontSize: 12,
        color: '#8E8E93',
        textAlign: 'center',
        marginTop: 8,
        fontStyle: 'italic',
    },
    customSection: {
        marginTop: 20,
        gap: 12,
    },
    createModal: {
        marginTop: 20,
        padding: 24,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    input: {
        fontSize: 18,
        color: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 12,
        fontFamily: 'System',
    },
    smallInput: {
        fontSize: 14,
        color: '#D4CDC3',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 12,
        marginTop: 8,
    },
    addPracticeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 12,
        padding: 8,
    },
    addPracticeText: {
        fontSize: 12,
        color: '#8E8E93',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 32,
    },
    cancelButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    cancelText: {
        fontSize: 14,
        color: '#8E8E93',
    },
    saveButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 16,
    },
    saveText: {
        fontSize: 14,
        color: '#000',
        fontWeight: 'bold',
    },
});
