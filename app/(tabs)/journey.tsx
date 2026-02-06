import { Button } from '@/components/Button';
import { GlassView, SerifText, Text, View } from '@/components/Themed';
import { CosmicBackground } from '@/components/visuals/CosmicBackground';
import Colors, { PLANET_COLORS } from '@/constants/Colors';
import { INTENTIONS_MAP } from '@/constants/Content';
import { useUser } from '@/context/UserContext';
import { AIService } from '@/lib/AIService';
import { useRouter } from 'expo-router';
import { Plus, Share2, Sparkles, Star } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { View as DefaultView, ScrollView, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function JourneyScreen() {
    const { state, getPillarProgressPercent, getTotalProgress, setJourneyTitle } = useUser();
    const router = useRouter();

    const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);

    useEffect(() => {
        checkTitleMilestone();
    }, [state.totalDaysActive]);

    const checkTitleMilestone = async () => {
        const { totalDaysActive, journeyTitle, pillarProgress, wins, activePersonality } = state;

        const shouldUpdate =
            (totalDaysActive === 7 && journeyTitle.milestone !== '7 days') ||
            (totalDaysActive === 21 && journeyTitle.milestone !== '21 days') ||
            (totalDaysActive === 66 && journeyTitle.milestone !== '66 days') ||
            (getTotalProgress() >= 25 && !journeyTitle.milestone.includes('25%'));

        if (shouldUpdate && !isGeneratingTitle) {
            setIsGeneratingTitle(true);

            const pillarEntries = Object.entries(pillarProgress);
            let dominantPillar = 'personal growth';
            if (pillarEntries.length > 0) {
                const sorted = pillarEntries.sort((a, b) => b[1].movesCompleted - a[1].movesCompleted);
                const pillarData = INTENTIONS_MAP.find(p => p.id === sorted[0][0]);
                dominantPillar = pillarData?.pillar || 'personal growth';
            }

            try {
                const newTitle = await AIService.generateJourneyTitle(
                    dominantPillar,
                    getTotalProgress(),
                    totalDaysActive,
                    wins.slice(0, 5),
                    activePersonality
                );

                const milestone = totalDaysActive >= 66 ? '66 days' :
                    totalDaysActive >= 21 ? '21 days' :
                        totalDaysActive >= 7 ? '7 days' :
                            getTotalProgress() >= 25 ? '25% progress' : 'day 1';

                setJourneyTitle({
                    name: newTitle.name,
                    description: newTitle.description,
                    unlockedAt: new Date().toISOString(),
                    milestone
                });
            } catch (error) {
                console.error('Failed to generate title:', error);
            } finally {
                setIsGeneratingTitle(false);
            }
        }
    };

    const handleShare = () => {
        console.log('Share constellation card');
    };

    const stars = state.wins || [];

    const getPillarColor = (pillarId: string) => {
        const pillar = INTENTIONS_MAP.find(p => p.id === pillarId);
        if (!pillar) return Colors.cosmic.stardustGold;
        return PLANET_COLORS[pillar.pillar.toLowerCase() as keyof typeof PLANET_COLORS] || Colors.cosmic.stardustGold;
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <CosmicBackground />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
                    <Text style={styles.label}>your constellation</Text>
                    <SerifText weight="bold" style={styles.title}>who you're becoming</SerifText>
                </Animated.View>

                {/* Constellation Card - Shareable */}
                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <GlassView intensity={10} style={styles.constellationCard}>
                        <DefaultView style={styles.cardHeader}>
                            <Sparkles size={18} color={Colors.cosmic.stardustGold} />
                            <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
                                <Share2 size={14} color="#8E8E93" />
                            </TouchableOpacity>
                        </DefaultView>

                        <SerifText weight="bold" style={styles.constellationTitle}>
                            {state.journeyTitle.name}
                        </SerifText>
                        <Text style={styles.constellationDescription}>
                            "{state.journeyTitle.description}"
                        </Text>

                        <DefaultView style={styles.statsRow}>
                            <DefaultView style={styles.statItem}>
                                <Text style={styles.statValue}>{state.totalDaysActive}</Text>
                                <Text style={styles.statLabel}>days</Text>
                            </DefaultView>
                            <DefaultView style={styles.statDivider} />
                            <DefaultView style={styles.statItem}>
                                <Text style={styles.statValue}>{getTotalProgress()}%</Text>
                                <Text style={styles.statLabel}>growth</Text>
                            </DefaultView>
                            <DefaultView style={styles.statDivider} />
                            <DefaultView style={styles.statItem}>
                                <Text style={styles.statValue}>{stars.length}</Text>
                                <Text style={styles.statLabel}>stars</Text>
                            </DefaultView>
                        </DefaultView>
                    </GlassView>
                </Animated.View>

                {/* Galaxy Progress */}
                <DefaultView style={styles.section}>
                    <Text style={styles.sectionLabel}>your galaxy</Text>
                    <DefaultView style={styles.galaxyGrid}>
                        {INTENTIONS_MAP.map((pillar, index) => {
                            const progress = getPillarProgressPercent(pillar.id);
                            const pillarColor = getPillarColor(pillar.id);

                            return (
                                <Animated.View
                                    key={pillar.id}
                                    entering={FadeInUp.delay(300 + index * 50).springify()}
                                    style={styles.galaxyCard}
                                >
                                    <DefaultView style={styles.galaxyHeader}>
                                        <DefaultView style={[styles.planetDot, { backgroundColor: pillarColor }]} />
                                        <Text style={styles.galaxyName}>{pillar.pillar}</Text>
                                        <Text style={[styles.galaxyPercent, { color: pillarColor }]}>{progress}%</Text>
                                    </DefaultView>
                                    <DefaultView style={styles.progressBarBg}>
                                        <DefaultView
                                            style={[
                                                styles.progressBarFill,
                                                { width: `${progress}%`, backgroundColor: pillarColor }
                                            ]}
                                        />
                                    </DefaultView>
                                </Animated.View>
                            );
                        })}
                    </DefaultView>
                </DefaultView>

                {/* Stars (Wins) Section */}
                <DefaultView style={styles.section}>
                    <DefaultView style={styles.sectionHeader}>
                        <Text style={styles.sectionLabel}>collected stars</Text>
                        <TouchableOpacity
                            onPress={() => router.push({ pathname: '/modal', params: { type: 'win' } })}
                            style={styles.addButton}
                        >
                            <Plus size={14} color={Colors.cosmic.stardustGold} />
                        </TouchableOpacity>
                    </DefaultView>

                    {stars.length > 0 ? (
                        <DefaultView style={styles.starsGrid}>
                            {stars.slice(0, 6).map((win, index) => (
                                <Animated.View
                                    key={win.id}
                                    entering={FadeInUp.delay(500 + index * 80).springify()}
                                    style={styles.starCard}
                                >
                                    <DefaultView style={styles.starHeader}>
                                        <Star size={10} color={Colors.cosmic.stardustGold} fill={Colors.cosmic.stardustGold} />
                                        <Text style={styles.starDate}>
                                            {new Date(win.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </Text>
                                    </DefaultView>
                                    <SerifText style={styles.starText} numberOfLines={3}>
                                        {win.text}
                                    </SerifText>
                                </Animated.View>
                            ))}
                        </DefaultView>
                    ) : (
                        <Animated.View entering={FadeInUp.delay(500)} style={styles.emptyStars}>
                            <Sparkles size={20} color={Colors.cosmic.stardustGold} opacity={0.3} />
                            <Text style={styles.emptyText}>your stars will gather here</Text>
                        </Animated.View>
                    )}

                    {stars.length > 6 && (
                        <DefaultView style={styles.viewAllContainer}>
                            <Button
                                variant="outline"
                                title={`view all ${stars.length} stars`}
                                onPress={() => { }}
                                size="sm"
                            />
                        </DefaultView>
                    )}
                </DefaultView>
            </ScrollView>
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
        marginBottom: 28,
        backgroundColor: 'transparent',
    },
    label: {
        fontSize: 10,
        color: Colors.cosmic.stardustGold,
        letterSpacing: 2,
        marginBottom: 8,
        textTransform: 'lowercase',
    },
    title: {
        fontSize: 26,
        color: '#FFF',
    },

    // Constellation Card
    constellationCard: {
        padding: 28,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.1)',
        marginBottom: 32,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    shareButton: {
        padding: 10,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    constellationTitle: {
        fontSize: 28,
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 6,
    },
    constellationDescription: {
        fontSize: 14,
        color: '#D4CDC3',
        textAlign: 'center',
        fontStyle: 'italic',
        opacity: 0.7,
        marginBottom: 24,
        lineHeight: 22,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        color: '#FFF',
        fontWeight: '600',
    },
    statLabel: {
        fontSize: 9,
        color: '#8E8E93',
        textTransform: 'lowercase',
        letterSpacing: 1,
        marginTop: 3,
    },
    statDivider: {
        width: 1,
        height: 28,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },

    // Sections
    section: {
        marginBottom: 32,
        backgroundColor: 'transparent',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    sectionLabel: {
        fontSize: 10,
        color: '#8E8E93',
        letterSpacing: 2,
        textTransform: 'lowercase',
    },
    addButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
    },

    // Galaxy Grid
    galaxyGrid: {
        gap: 10,
    },
    galaxyCard: {
        padding: 14,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    galaxyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 10,
    },
    planetDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    galaxyName: {
        flex: 1,
        fontSize: 13,
        color: '#FFF',
    },
    galaxyPercent: {
        fontSize: 12,
        fontWeight: '500',
    },
    progressBarBg: {
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 2,
    },

    // Stars Grid
    starsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    starCard: {
        width: '48%',
        padding: 14,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.03)',
        minHeight: 90,
    },
    starHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 8,
    },
    starDate: {
        fontSize: 8,
        color: '#6E6E73',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    starText: {
        fontSize: 13,
        color: '#D4CDC3',
        lineHeight: 18,
        fontStyle: 'italic',
    },

    // Empty State
    emptyStars: {
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'rgba(255,255,255,0.06)',
        gap: 10,
    },
    emptyText: {
        fontSize: 12,
        color: '#6E6E73',
        fontStyle: 'italic',
    },

    // View All
    viewAllContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
});
