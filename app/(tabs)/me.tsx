import { FriendList } from '@/components/community/FriendList';
import { GlassView, SerifText, Text, View } from '@/components/Themed';
import { BrandBackground } from '@/components/visuals/BrandBackground';
import { IdentityScoreCard } from '@/components/visuals/IdentityScoreCard';
import Colors from '@/constants/Colors';
import { IntentionItem, INTENTIONS_MAP } from '@/constants/Content';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'expo-router';
import { ArrowRight, Repeat, Sparkles } from 'lucide-react-native';
import React from 'react';
import { Alert, View as DefaultView, Dimensions, Platform, ScrollView, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MeScreen() {
    const {
        state,
        updateState,
        resetState,
        getCuratedIdentity,
        getBecomingXP,
        getBecomingLevel,
        getNextLevelXP,
        getIdentityColor
    } = useUser();

    const router = useRouter();
    const identityLimit = state.isPremium ? 7 : 2;
    const activeIdentities = Object.entries(state.identityProgress || {})
        .filter(([_, progress]) => progress.herbitsCompleted > 0)
        .sort((a, b) => b[1].herbitsCompleted - a[1].herbitsCompleted)
        .slice(0, 5);

    const getIntentionForIdentity = (identityId: string): string => {
        return INTENTIONS_MAP.find(i => i.id.toLowerCase() === identityId.toLowerCase())?.intention || identityId;
    };

    const xp = getBecomingXP();
    const level = getBecomingLevel();
    const nextLevelXP = getNextLevelXP();
    const prevLevelXP = level === 1 ? 0 : [0, 100, 300, 600, 1000, 1500, 2100][level - 1] || 2100;
    const progress = (xp - prevLevelXP) / (nextLevelXP - prevLevelXP);

    const getIntentionData = (intention: string): IntentionItem | undefined => {
        return INTENTIONS_MAP.find((i) => i.intention === intention);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <BrandBackground />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header with Level information */}
                <DefaultView style={styles.header}>
                    <DefaultView style={styles.headerRow}>
                        <DefaultView>
                            <Text style={styles.levelLabel}>level</Text>
                            <SerifText weight="bold" style={styles.levelValue}>{level}</SerifText>
                        </DefaultView>
                        <TouchableOpacity
                            onPress={async () => {
                                const performReset = async () => {
                                    await resetState();
                                    router.replace('/welcome');
                                };

                                if (Platform.OS === 'web') {
                                    if (window.confirm('Start Over?\nThis will erase all your progress and levels.')) {
                                        await performReset();
                                    }
                                } else {
                                    Alert.alert('Start Over?', 'This will erase all your progress and levels.', [
                                        { text: 'Cancel', style: 'cancel' },
                                        { text: 'Reset', style: 'destructive', onPress: performReset }
                                    ]);
                                }
                            }}
                            style={styles.iconButton}
                        >
                            <Repeat size={20} color="#8E8E93" />
                        </TouchableOpacity>
                    </DefaultView>

                    {/* XP Progress Bar */}
                    <DefaultView style={styles.xpContainer}>
                        <DefaultView style={styles.xpMeta}>
                            <Text style={styles.xpText}>{xp} XP</Text>
                            <Text style={styles.xpNext}>next level at {nextLevelXP} XP</Text>
                        </DefaultView>
                        <DefaultView style={styles.progressBarBg}>
                            <DefaultView
                                style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
                            />
                        </DefaultView>
                    </DefaultView>
                </DefaultView>

                {/* Identity Mantra Section */}
                <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.mantraSection}>
                    <Sparkles size={24} color={Colors.brand.primary} style={styles.mantraIcon} />
                    <SerifText weight="bold" style={styles.mantraText}>
                        {getCuratedIdentity().name}
                    </SerifText>
                    <Text style={styles.mantraSubtext}>
                        {getCuratedIdentity().description}
                    </Text>
                </Animated.View>

                {/* Friends / Community Section */}
                <FriendList />

                {/* Community Teaser */}
                <TouchableOpacity onPress={() => router.push('/community')} style={{ marginBottom: 40 }}>
                    <GlassView intensity={10} style={{ padding: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                        <DefaultView style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,215,0,0.1)', alignItems: 'center', justifyContent: 'center' }}>
                            <Sparkles size={24} color={Colors.brand.primary} />
                        </DefaultView>
                        <DefaultView style={{ flex: 1 }}>
                            <SerifText weight="bold" style={{ fontSize: 18, color: '#FFF', marginBottom: 4 }}>the sisterhood</SerifText>
                            <Text style={{ fontSize: 13, color: '#8E8E93' }}>join 12,400+ sisters who are rising.</Text>
                        </DefaultView>
                        <DefaultView style={{ padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20 }}>
                            <ArrowRight size={16} color="#FFF" />
                        </DefaultView>
                    </GlassView>
                </TouchableOpacity>

                {/* Identities & Scores */}
                <DefaultView style={styles.section}>
                    <DefaultView style={styles.sectionHeader}>
                        <Text style={styles.sectionLabel}>identities & scores</Text>
                    </DefaultView>

                    <DefaultView style={styles.identitiesList}>
                        {INTENTIONS_MAP.map((intentionItem, index) => {
                            const identityId = intentionItem.id;
                            const progress = state.identityProgress[identityId] || { daysActive: 0, herbitsCompleted: 0, streak: 0 };
                            const score = Math.min(100, (progress.daysActive * 5) + (progress.herbitsCompleted * 2) + (progress.streak * 3));
                            const level = Math.floor(score / 20) + 1;
                            const color = getIdentityColor(identityId);

                            return (
                                <Animated.View key={identityId} entering={FadeInDown.delay(index * 60)}>
                                    <IdentityScoreCard
                                        identity={intentionItem.label} // Use label for display name
                                        score={score}
                                        color={color}
                                        level={level}
                                        description={intentionItem.description}
                                    />
                                </Animated.View>
                            );
                        })}
                    </DefaultView>
                </DefaultView>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.brand.background,
    },
    scrollContent: {
        paddingTop: 80,
        paddingHorizontal: 24,
        paddingBottom: 100,
    },
    header: {
        marginBottom: 40,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    levelLabel: {
        fontSize: 10,
        color: '#8E8E93',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 4,
    },
    levelValue: {
        fontSize: 48,
        color: '#FFF',
        lineHeight: 56,
    },
    iconButton: {
        padding: 12,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    xpContainer: {
        gap: 8,
    },
    xpMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    xpText: {
        fontSize: 14,
        color: '#FFF',
        fontWeight: '600',
    },
    xpNext: {
        fontSize: 11,
        color: '#6E6E73',
    },
    progressBarBg: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.brand.primary,
        borderRadius: 3,
    },

    // Mantra Section
    mantraSection: {
        padding: 32,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.03)',
        alignItems: 'center',
        marginBottom: 40,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    mantraIcon: {
        marginBottom: 20,
        opacity: 0.8,
    },
    mantraText: {
        fontSize: 28,
        color: '#FFF',
        textAlign: 'center',
        lineHeight: 36,
        marginBottom: 12,
    },
    mantraSubtext: {
        fontSize: 13,
        color: '#8E8E93',
        textAlign: 'center',
        lineHeight: 20,
    },

    // Blossom Section
    blossomSection: {
        alignItems: 'center',
        marginBottom: 60,
    },

    // Sections
    section: {
        marginBottom: 40,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionLabel: {
        fontSize: 10,
        color: '#8E8E93',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    limitText: {
        fontSize: 11,
        color: '#6E6E73',
    },

    // Identities
    identitiesList: {
        gap: 12,
    },
    identityCard: {
        padding: 20,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    identityInfo: {
        flex: 1,
        gap: 8,
    },
    identityText: {
        fontSize: 18,
        color: '#FFF',
    },
    identityTag: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    identityTagText: {
        fontSize: 9,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    identityActivity: {
        alignItems: 'center',
        paddingLeft: 12,
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(255,255,255,0.05)',
    },
    activityValue: {
        fontSize: 18,
        color: '#FFF',
        fontWeight: 'bold',
    },
    activityLabel: {
        fontSize: 9,
        color: '#6E6E73',
        textTransform: 'lowercase',
    },
    emptyText: {
        fontSize: 13,
        color: '#6E6E73',
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic',
    },
});
