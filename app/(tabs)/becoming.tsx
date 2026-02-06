import { Button } from '@/components/Button';
import { GlassView, SerifText, Text, View } from '@/components/Themed';
import { CosmicBackground } from '@/components/visuals/CosmicBackground';
import { Planet } from '@/components/visuals/Planet';
import { PremiumModal } from '@/components/visuals/PremiumModal';
import Colors, { PLANET_COLORS } from '@/constants/Colors';
import { IntentionItem, INTENTIONS_MAP } from '@/constants/Content';
import { useUser } from '@/context/UserContext';
import { AIService } from '@/lib/AIService';
import { COPY } from '@/lib/copy';
import { useRouter } from 'expo-router';
import { Plus, Repeat, Sparkles, Star, Wand2, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { View as DefaultView, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, FadeOut, Layout } from 'react-native-reanimated';

export default function BecomingScreen() {
    const { state, updateState, setPremium, addCustomIdentity, removeCustomIdentity, setFocusCycle, resetState, getStreak } = useUser();
    const router = useRouter();
    const [isAdding, setIsAdding] = useState(false);
    const [isCreatingCustom, setIsCreatingCustom] = useState(false);
    const [customDescription, setCustomDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPremiumModalVisible, setIsPremiumModalVisible] = useState(false);

    const activeIntentions = state.activeIntentions || [];
    const identityLimit = state.isPremium ? 7 : 2;

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
        updateState({ lastReflectionDate: null });
    };

    const handleCreateWithAI = async () => {
        if (!customDescription.trim() || isGenerating) return;

        setIsGenerating(true);
        try {
            const result = await AIService.generateCustomIdentity(customDescription, state.activePersonality);

            const newId: IntentionItem = {
                id: `custom-${Date.now()}`,
                pillar: 'Custom',
                intention: result.intention,
                description: `Created from: "${customDescription}"`,
                practices: result.practices,
            };

            addCustomIdentity(newId);
            setIsCreatingCustom(false);
            setCustomDescription('');
        } catch (error) {
            console.error('Failed to generate custom identity:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const getIntentionData = (intention: string) => {
        const predefined = INTENTIONS_MAP.find(item => item.intention === intention);
        if (predefined) return predefined;
        return (state.customIdentities || []).find(item => item.intention === intention);
    };

    const getPillarColor = (pillar: string) => {
        const lowerPillar = pillar.toLowerCase();
        return PLANET_COLORS[lowerPillar as keyof typeof PLANET_COLORS] || Colors.cosmic.stardustGold;
    };

    const getDisplayName = (intention: string) => {
        return intention.replace('becoming a woman who ', '').replace('becoming a woman of ', '');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <CosmicBackground />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <DefaultView style={styles.header}>
                    <DefaultView style={styles.headerRow}>
                        <SerifText weight="bold" style={styles.title}>{COPY.becoming.title}</SerifText>
                        <TouchableOpacity
                            onPress={async () => {
                                await resetState();
                                router.replace('/welcome');
                            }}
                            style={styles.iconButton}
                        >
                            <Repeat size={16} color="#6E6E73" />
                        </TouchableOpacity>
                    </DefaultView>
                    <Text style={styles.subtitle}>{COPY.becoming.header}</Text>
                </DefaultView>

                {/* Stats */}
                <DefaultView style={styles.statsRow}>
                    <GlassView intensity={6} style={styles.statCard}>
                        <Sparkles size={16} color={Colors.cosmic.stardustGold} />
                        <SerifText style={styles.statValue}>{state.wins?.length || 0}</SerifText>
                        <Text style={styles.statLabel}>stars</Text>
                    </GlassView>
                    <GlassView intensity={6} style={styles.statCard}>
                        <Star size={16} color={Colors.cosmic.stardustGold} />
                        <SerifText style={styles.statValue}>{getStreak()}</SerifText>
                        <Text style={styles.statLabel}>streak</Text>
                    </GlassView>
                    <GlassView intensity={6} style={styles.statCard}>
                        <DefaultView style={[styles.worldDot, { backgroundColor: Colors.cosmic.stardustGold }]} />
                        <SerifText style={styles.statValue}>{activeIntentions.length}</SerifText>
                        <Text style={styles.statLabel}>identities</Text>
                    </GlassView>
                </DefaultView>

                {/* Current Focus */}
                {state.currentFocusCycle && (
                    <GlassView intensity={8} style={styles.focusCard}>
                        <Text style={styles.focusLabel}>practicing now</Text>
                        <SerifText style={styles.focusIntention}>
                            "{state.currentFocusCycle.intention}"
                        </SerifText>
                        <DefaultView style={styles.practicesList}>
                            {state.currentFocusCycle.practices.slice(0, 3).map((p, i) => (
                                <Text key={i} style={styles.practiceItem}>• {p}</Text>
                            ))}
                        </DefaultView>
                    </GlassView>
                )}

                {/* Active Identities */}
                <DefaultView style={styles.section}>
                    <DefaultView style={styles.sectionHeader}>
                        <Text style={styles.sectionLabel}>your identities</Text>
                        <Text style={styles.limitText}>{activeIntentions.length}/{identityLimit}</Text>
                    </DefaultView>

                    {activeIntentions.length === 0 ? (
                        <Text style={styles.emptyText}>{COPY.becoming.empty}</Text>
                    ) : (
                        <DefaultView style={styles.identitiesList}>
                            {activeIntentions.map((intention, index) => {
                                const data = getIntentionData(intention);
                                const isFocus = state.currentFocusCycle?.intention === intention;
                                const pillarColor = data?.pillar ? getPillarColor(data.pillar) : Colors.cosmic.stardustGold;

                                return (
                                    <Animated.View
                                        key={intention}
                                        entering={FadeInDown.delay(index * 60)}
                                        exiting={FadeOut}
                                        layout={Layout.springify()}
                                    >
                                        <TouchableOpacity
                                            onPress={() => handleSetFocus(intention)}
                                            activeOpacity={0.8}
                                            style={[styles.identityCard, isFocus && { borderColor: pillarColor }]}
                                        >
                                            <DefaultView style={styles.identityContent}>
                                                <DefaultView style={[styles.identityDot, { backgroundColor: pillarColor }]} />
                                                <DefaultView style={styles.identityInfo}>
                                                    <Text style={[styles.pillarTag, { color: pillarColor }]}>
                                                        {data?.pillar || 'custom'}
                                                    </Text>
                                                    <SerifText style={styles.identityText} numberOfLines={2}>
                                                        {intention}
                                                    </SerifText>
                                                </DefaultView>
                                                <TouchableOpacity
                                                    onPress={() => handleToggleIntention(intention)}
                                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                                >
                                                    <X size={14} color="#5E5E63" />
                                                </TouchableOpacity>
                                            </DefaultView>
                                            {isFocus && (
                                                <Text style={[styles.focusBadge, { color: pillarColor }]}>practicing</Text>
                                            )}
                                        </TouchableOpacity>
                                    </Animated.View>
                                );
                            })}
                        </DefaultView>
                    )}

                    {activeIntentions.length >= identityLimit && !state.isPremium && (
                        <TouchableOpacity onPress={() => setIsPremiumModalVisible(true)} style={styles.expandNudge}>
                            <Text style={styles.expandText}>expand with premium →</Text>
                        </TouchableOpacity>
                    )}
                </DefaultView>

                {/* Explore / Add Identities */}
                <DefaultView style={styles.section}>
                    <TouchableOpacity style={styles.exploreButton} onPress={() => setIsAdding(!isAdding)}>
                        <Text style={styles.exploreButtonText}>
                            {isAdding ? "close" : "explore identities"}
                        </Text>
                        <Plus size={14} color={Colors.cosmic.stardustGold} style={isAdding && { transform: [{ rotate: '45deg' }] }} />
                    </TouchableOpacity>

                    {isAdding && (
                        <Animated.View entering={FadeInDown.duration(300)} style={styles.explorerGrid}>
                            {INTENTIONS_MAP.map((item, index) => {
                                const isActive = activeIntentions.includes(item.intention);
                                const isDisabled = !isActive && activeIntentions.length >= identityLimit;

                                return (
                                    <Animated.View key={item.id} entering={FadeInDown.delay(index * 40)}>
                                        <TouchableOpacity
                                            onPress={() => handleToggleIntention(item.intention)}
                                            disabled={isDisabled}
                                            style={[styles.explorerItem, isDisabled && { opacity: 0.3 }]}
                                        >
                                            <Planet
                                                pillar={item.pillar}
                                                name={getDisplayName(item.intention)}
                                                isSelected={isActive}
                                                onPress={() => handleToggleIntention(item.intention)}
                                                size={45}
                                            />
                                        </TouchableOpacity>
                                    </Animated.View>
                                );
                            })}
                        </Animated.View>
                    )}

                    {/* AI Custom Identity (Premium) */}
                    {state.isPremium && (
                        <TouchableOpacity
                            style={styles.createCustomButton}
                            onPress={() => setIsCreatingCustom(true)}
                        >
                            <Wand2 size={14} color={Colors.cosmic.stardustGold} />
                            <Text style={styles.createCustomText}>create with AI</Text>
                        </TouchableOpacity>
                    )}
                </DefaultView>

                {/* AI Creation Modal */}
                {isCreatingCustom && (
                    <GlassView intensity={20} style={styles.createModal}>
                        <DefaultView style={styles.modalHeader}>
                            <Wand2 size={18} color={Colors.cosmic.stardustGold} />
                            <Text style={styles.modalTitle}>create your identity</Text>
                        </DefaultView>

                        <Text style={styles.modalHint}>
                            describe who you want to become. AI will craft an identity statement and daily practices.
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="e.g., a global connoisseur who travels the world, a woman who speaks multiple languages..."
                            placeholderTextColor="#5E5E63"
                            value={customDescription}
                            onChangeText={setCustomDescription}
                            multiline
                            numberOfLines={3}
                        />

                        <DefaultView style={styles.modalButtons}>
                            <Button
                                variant="outline"
                                title="cancel"
                                onPress={() => {
                                    setIsCreatingCustom(false);
                                    setCustomDescription('');
                                }}
                                style={{ flex: 1 }}
                            />
                            <Button
                                variant="glow"
                                title="create"
                                loading={isGenerating}
                                disabled={!customDescription.trim()}
                                onPress={handleCreateWithAI}
                                color={Colors.cosmic.stardustGold}
                                style={{ flex: 1 }}
                            />
                        </DefaultView>
                    </GlassView>
                )}
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
        backgroundColor: Colors.cosmic.deepSpace,
    },
    scrollContent: {
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 100,
    },
    header: {
        marginBottom: 24,
        backgroundColor: 'transparent',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 26,
        color: '#FFF',
    },
    iconButton: {
        padding: 10,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.04)',
    },
    subtitle: {
        fontSize: 12,
        color: '#6E6E73',
        letterSpacing: 0.5,
    },

    // Stats
    statsRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        padding: 14,
        borderRadius: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.03)',
    },
    statValue: {
        fontSize: 20,
        color: '#FFF',
        marginTop: 4,
    },
    statLabel: {
        fontSize: 8,
        color: '#5E5E63',
        textTransform: 'lowercase',
        letterSpacing: 1,
        marginTop: 2,
    },
    worldDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },

    // Focus Card
    focusCard: {
        padding: 22,
        borderRadius: 18,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.12)',
    },
    focusLabel: {
        fontSize: 9,
        color: Colors.cosmic.stardustGold,
        letterSpacing: 2,
        textTransform: 'lowercase',
        marginBottom: 6,
    },
    focusIntention: {
        fontSize: 16,
        color: '#FFF',
        marginBottom: 10,
        lineHeight: 22,
    },
    practicesList: {
        gap: 3,
    },
    practiceItem: {
        fontSize: 12,
        color: '#8E8E93',
        lineHeight: 18,
    },

    // Section
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionLabel: {
        fontSize: 9,
        color: '#6E6E73',
        letterSpacing: 2,
        textTransform: 'lowercase',
    },
    limitText: {
        fontSize: 10,
        color: '#5E5E63',
    },
    emptyText: {
        fontSize: 12,
        color: '#5E5E63',
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: 20,
    },

    // Identities List
    identitiesList: {
        gap: 8,
    },
    identityCard: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    identityContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    identityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 5,
    },
    identityInfo: {
        flex: 1,
    },
    pillarTag: {
        fontSize: 8,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    identityText: {
        fontSize: 14,
        color: '#FFF',
        lineHeight: 19,
    },
    focusBadge: {
        fontSize: 9,
        letterSpacing: 1,
        textTransform: 'lowercase',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.04)',
    },

    // Expand nudge
    expandNudge: {
        marginTop: 10,
        alignItems: 'center',
    },
    expandText: {
        fontSize: 11,
        color: Colors.cosmic.stardustGold,
        letterSpacing: 0.5,
    },

    // Explore
    exploreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 12,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.15)',
    },
    exploreButtonText: {
        fontSize: 12,
        color: Colors.cosmic.stardustGold,
        letterSpacing: 0.5,
    },
    explorerGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 6,
        marginTop: 16,
        paddingVertical: 8,
    },
    explorerItem: {
        padding: 2,
    },

    // Create custom
    createCustomButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 14,
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'rgba(255, 215, 0, 0.2)',
    },
    createCustomText: {
        fontSize: 12,
        color: Colors.cosmic.stardustGold,
        letterSpacing: 0.5,
    },

    // Modal
    createModal: {
        padding: 22,
        borderRadius: 18,
        marginTop: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.1)',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 13,
        color: Colors.cosmic.stardustGold,
        letterSpacing: 1,
    },
    modalHint: {
        fontSize: 11,
        color: '#6E6E73',
        lineHeight: 16,
        marginBottom: 14,
    },
    input: {
        fontSize: 14,
        color: '#FFF',
        padding: 14,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        minHeight: 80,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
});
