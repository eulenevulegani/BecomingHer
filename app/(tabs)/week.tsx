import { GlassView, SerifText, Text, useThemeColor, View } from '@/components/Themed';
import { AuraBackground } from '@/components/visuals/AuraBackground';
import { PremiumModal } from '@/components/visuals/PremiumModal';
import { useUser } from '@/context/UserContext';
import { AIPersonality, AIService } from '@/lib/AIService';
import { useRouter } from 'expo-router';
import { Crown, Share2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { View as DefaultView, ScrollView, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function WeekScreen() {
    const { state, setPremium, setActivePersonality } = useUser();
    const router = useRouter(); // Added router
    const primaryColor = useThemeColor({}, 'primary');

    const activeIntentions = state.activeIntentions || [];
    const currentFocusCycle = state.currentFocusCycle;

    const [insight, setInsight] = useState<string | null>(null);
    const [isPremiumModalVisible, setIsPremiumModalVisible] = useState(false);

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

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <AuraBackground />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.header}>
                    <DefaultView style={styles.headerRow}>
                        <DefaultView>
                            <Text style={styles.label}>your rhythm</Text>
                            <SerifText weight="bold" style={styles.title}>The Weekly Flow</SerifText>
                        </DefaultView>
                        {currentFocusCycle && (
                            <TouchableOpacity style={styles.shareButton}>
                                <Share2 size={16} color="#8E8E93" />
                            </TouchableOpacity>
                        )}
                    </DefaultView>
                    <Text style={styles.subtitle}>“Growth is quiet, personal, and cumulative.”</Text>
                </Animated.View>

                {insight && (
                    <Animated.View entering={FadeInDown} style={styles.nudgeContainer}>
                        <GlassView intensity={10} style={styles.nudgeCard}>
                            <Text style={styles.label}>ai pattern check</Text>
                            <SerifText style={styles.nudgeText}>
                                “{insight}”
                            </SerifText>
                        </GlassView>
                    </Animated.View>
                )}

                {state.isPremium ? (
                    <DefaultView style={styles.section}>
                        <Text style={styles.sectionLabel}>ai companion voice</Text>
                        <DefaultView style={styles.personalityGrid}>
                            {(['wise-friend', 'muse', 'anchor', 'pioneer'] as AIPersonality[]).map((p) => (
                                <TouchableOpacity
                                    key={p}
                                    onPress={() => state.activePersonality !== p && setActivePersonality(p)}
                                    style={[
                                        styles.personalityPill,
                                        state.activePersonality === p && { backgroundColor: primaryColor }
                                    ]}
                                >
                                    <Text style={[styles.personalityText, state.activePersonality === p && { color: '#000' }]}>{p}</Text>
                                </TouchableOpacity>
                            ))}
                        </DefaultView>
                    </DefaultView>
                ) : (
                    <TouchableOpacity onPress={() => setIsPremiumModalVisible(true)} style={styles.premiumNudgeSection}>
                        <GlassView intensity={10} style={styles.premiumFlowCard}>
                            <Crown size={16} color={primaryColor} />
                            <Text style={styles.premiumFlowText}>Unlock deeper insights & AI voices with Expansion</Text>
                        </GlassView>
                    </TouchableOpacity>
                )}

                {/* Active Focus */}
                <DefaultView style={styles.section}>
                    <Text style={styles.sectionLabel}>active weekly focus</Text>
                    {currentFocusCycle ? (
                        <GlassView intensity={15} style={styles.focusOverviewCard}>
                            <SerifText style={styles.focusIntention}>“{currentFocusCycle.intention}”</SerifText>
                            <DefaultView style={styles.progressSection}>
                                <Text style={styles.progressLabel}>focus moves:</Text>
                                {currentFocusCycle.practices.map((p, i) => (
                                    <DefaultView key={i} style={styles.practiceRow}>
                                        <DefaultView style={[styles.practiceDot, { backgroundColor: primaryColor }]} />
                                        <Text style={styles.practiceText}>{p}</Text>
                                    </DefaultView>
                                ))}
                            </DefaultView>
                        </GlassView>
                    ) : (
                        <TouchableOpacity
                            onPress={() => router.push('/(tabs)/becoming')}
                            style={styles.emptyFocusCard}
                        >
                            <Text style={styles.emptyFocusText}>No active focus set for this week. Visit 'Becoming' to choose one.</Text>
                        </TouchableOpacity>
                    )}
                </DefaultView>

                {/* Identity Pattern */}
                <DefaultView style={styles.section}>
                    <Text style={styles.sectionLabel}>your becoming library</Text>
                    <DefaultView style={styles.identityPatternGrid}>
                        {activeIntentions.map((intention, i) => (
                            <DefaultView key={i} style={styles.patternItem}>
                                <SerifText style={styles.patternText}>“{intention}”</SerifText>
                            </DefaultView>
                        ))}
                        {activeIntentions.length === 0 && (
                            <Text style={styles.emptyNote}>Choose who you're becoming to see your patterns here.</Text>
                        )}
                    </DefaultView>
                </DefaultView>

                <PremiumModal
                    isVisible={isPremiumModalVisible}
                    onClose={() => setIsPremiumModalVisible(false)}
                    onUpgrade={() => {
                        setPremium(true);
                        setIsPremiumModalVisible(false);
                    }}
                />
            </ScrollView>
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
        paddingBottom: 100,
    },
    header: {
        marginBottom: 40,
        backgroundColor: 'transparent',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    shareButton: {
        padding: 12,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    label: {
        fontSize: 10,
        color: '#8E8E93',
        letterSpacing: 2,
        marginBottom: 8,
        textTransform: 'lowercase',
    },
    title: {
        fontSize: 24,
        color: '#FFF',
        lineHeight: 34,
        fontStyle: 'italic',
    },
    subtitle: {
        fontSize: 16,
        color: '#D4CDC3',
        fontStyle: 'italic',
        opacity: 0.8,
        marginTop: 8,
    },
    section: {
        marginBottom: 32,
        backgroundColor: 'transparent',
    },
    sectionLabel: {
        fontSize: 12,
        color: '#8E8E93',
        marginBottom: 16,
        textTransform: 'lowercase',
    },
    emptyNote: {
        fontSize: 14,
        color: '#8E8E93',
        fontStyle: 'italic',
    },
    nudgeContainer: {
        marginBottom: 24,
        backgroundColor: 'transparent',
    },
    nudgeCard: {
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,180,180,0.1)', // Subtle warning tint
    },
    nudgeText: {
        fontSize: 16,
        color: '#D4CDC3',
        lineHeight: 24,
        fontStyle: 'italic',
        textAlign: 'center',
    },

    premiumNudge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 16,
        padding: 8,
    },
    premiumNudgeText: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    personalityGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        backgroundColor: 'transparent',
    },
    personalityPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    personalityText: {
        fontSize: 13,
        color: '#8E8E93',
    },
    premiumNudgeSection: {
        marginBottom: 32,
    },
    premiumFlowCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    premiumFlowText: {
        fontSize: 13,
        color: '#D4CDC3',
        flex: 1,
    },
    focusOverviewCard: {
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    focusIntention: {
        fontSize: 20,
        color: '#FFF',
        fontStyle: 'italic',
        lineHeight: 28,
        marginBottom: 20,
    },
    progressSection: {
        gap: 8,
    },
    progressLabel: {
        fontSize: 10,
        color: '#8E8E93',
        textTransform: 'lowercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    practiceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    practiceDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
    },
    practiceText: {
        fontSize: 14,
        color: '#D4CDC3',
    },
    emptyFocusCard: {
        padding: 32,
        borderRadius: 24,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
    },
    emptyFocusText: {
        fontSize: 14,
        color: '#8E8E93',
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 22,
    },
    identityPatternGrid: {
        gap: 12,
    },
    patternItem: {
        padding: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    patternText: {
        fontSize: 15,
        color: '#FFF',
        fontStyle: 'italic',
    }
});
