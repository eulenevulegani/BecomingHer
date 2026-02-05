
import { GlassView, SerifText, Text, useThemeColor, View } from '@/components/Themed';
import { AuraBackground } from '@/components/visuals/AuraBackground';
import { PremiumModal } from '@/components/visuals/PremiumModal';
import { useUser } from '@/context/UserContext';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { Crown, Leaf, Plus, Sparkles } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { View as DefaultView, Dimensions, ScrollView, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const FloatingLeaf = ({ delay = 0, startPos = { x: 0, y: 0 } }) => {
    const translateY = useSharedValue(0);
    const translateX = useSharedValue(0);
    const rotate = useSharedValue(0);
    const opacity = useSharedValue(0);
    const primaryColor = useThemeColor({}, 'primary');

    useEffect(() => {
        opacity.value = withDelay(delay, withTiming(0.4, { duration: 2000 }));
        translateY.value = withDelay(delay, withRepeat(
            withSequence(
                withTiming(-20, { duration: 3000 }),
                withTiming(20, { duration: 3000 })
            ),
            -1,
            true
        ));
        translateX.value = withDelay(delay, withRepeat(
            withSequence(
                withTiming(-10, { duration: 4000 }),
                withTiming(10, { duration: 4000 })
            ),
            -1,
            true
        ));
        rotate.value = withDelay(delay, withRepeat(
            withSequence(
                withTiming(-15, { duration: 5000 }),
                withTiming(15, { duration: 5000 })
            ),
            -1,
            true
        ));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { translateX: translateX.value },
            { rotate: `${rotate.value}deg` }
        ],
        opacity: opacity.value,
        position: 'absolute',
        left: startPos.x,
        top: startPos.y,
    }));

    return (
        <Animated.View style={animatedStyle}>
            <Leaf size={24} color={primaryColor} />
        </Animated.View>
    );
};

export default function CommunityScreen() {
    const { state, setPremium } = useUser();
    const primaryColor = useThemeColor({}, 'primary');
    const backgroundColor = useThemeColor({}, 'background');
    const router = useRouter();
    const [isPremiumModalVisible, setIsPremiumModalVisible] = useState(false);

    // Calculate vitality: % of days with at least one proof in the last 7 days
    const calculateVitality = () => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toDateString();
        });

        const activeDays = last7Days.filter(day =>
            state.wins?.some(w => new Date(w.timestamp).toDateString() === day)
        ).length;

        return Math.round((activeDays / 7) * 100);
    };

    const vitality = calculateVitality();
    const leaves = state.wins || [];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <AuraBackground />

            {/* Ambient Garden Elements */}
            <FloatingLeaf delay={0} startPos={{ x: width * 0.1, y: 150 }} />
            <FloatingLeaf delay={1500} startPos={{ x: width * 0.8, y: 300 }} />
            <FloatingLeaf delay={3000} startPos={{ x: width * 0.5, y: 500 }} />
            <FloatingLeaf delay={4500} startPos={{ x: width * 0.2, y: 700 }} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[0]}
            >
                {/* Header Section */}
                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.header}>
                    <DefaultView style={styles.headerBlur}>
                        <Text style={styles.label}>sacred garden</Text>
                        <SerifText weight="bold" style={styles.title}>The Garden of Proof</SerifText>
                        <DefaultView style={styles.vitalityRow}>
                            <Text style={styles.subtitle}>“Every leaf is a promise kept to yourself.”</Text>
                            <DefaultView style={styles.vitalityContainer}>
                                <Text style={styles.vitalityLabel}>Vitality</Text>
                                <DefaultView style={styles.vitalityBarBackground}>
                                    <DefaultView
                                        style={[
                                            styles.vitalityBarForeground,
                                            { width: `${vitality}%`, backgroundColor: primaryColor }
                                        ]}
                                    />
                                </DefaultView>
                                <Text style={styles.vitalityValue}>{vitality}%</Text>
                            </DefaultView>
                        </DefaultView>
                    </DefaultView>
                </Animated.View>

                {/* Addition Prompt - More Boutique */}
                <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.addSection}>
                    <TouchableOpacity
                        onPress={() => router.push({ pathname: '/modal', params: { type: 'win' } })}
                        activeOpacity={0.9}
                    >
                        <GlassView intensity={10} style={styles.inputCard}>
                            <DefaultView style={styles.inputInterior}>
                                <DefaultView style={[styles.plusCircle, { backgroundColor: primaryColor }]}>
                                    <Plus size={20} color="#000" />
                                </DefaultView>
                                <DefaultView>
                                    <Text style={styles.inputLabel}>add a leaf</Text>
                                    <Text style={styles.placeholderText}>what carried you forward today?</Text>
                                </DefaultView>
                            </DefaultView>
                            <Sparkles size={16} color={primaryColor} opacity={0.4} />
                        </GlassView>
                    </TouchableOpacity>
                </Animated.View>

                {/* Leaves Section - Organic Grid */}
                <DefaultView style={styles.leavesSection}>
                    <Text style={styles.sectionLabel}>Your Leaves of Growth</Text>

                    {leaves.length > 0 ? (
                        <DefaultView style={styles.leavesGrid}>
                            {leaves.map((win, index) => (
                                <Animated.View
                                    key={win.id}
                                    entering={FadeInUp.delay(index * 150).springify().damping(15)}
                                    style={[
                                        styles.leafCardWrapper,
                                        index % 2 === 1 ? { marginTop: 24 } : { marginTop: 0 }
                                    ]}
                                >
                                    <GlassView intensity={4} style={styles.leafCard}>
                                        <DefaultView style={styles.leafHeader}>
                                            <Leaf size={14} color={primaryColor} />
                                            <Text style={styles.leafDate}>
                                                {new Date(win.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </Text>
                                        </DefaultView>
                                        <SerifText style={styles.leafText}>{win.text}</SerifText>
                                        <DefaultView style={styles.leafFooter}>
                                            <Sparkles size={12} color={primaryColor} opacity={0.3} />
                                        </DefaultView>
                                    </GlassView>
                                </Animated.View>
                            ))}
                        </DefaultView>
                    ) : (
                        <Animated.View entering={FadeInUp.delay(600)} style={styles.emptyGarden}>
                            <Leaf size={32} color={primaryColor} opacity={0.2} />
                            <Text style={styles.emptyText}>Your garden is quiet. Plant your first leaf of proof.</Text>
                        </Animated.View>
                    )}
                </DefaultView>

                {/* Shared Resources Section */}
                <DefaultView style={styles.resourcesSection}>
                    <Text style={styles.sectionLabel}>sacred seeds</Text>
                    <TouchableOpacity
                        onPress={() => !state.isPremium && setIsPremiumModalVisible(true)}
                        activeOpacity={0.8}
                    >
                        <GlassView intensity={10} style={styles.resourcesContainer}>
                            {!state.isPremium && (
                                <DefaultView style={styles.lockOverlay}>
                                    <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
                                    <DefaultView style={styles.lockContent}>
                                        <Crown size={24} color={primaryColor} />
                                        <Text style={styles.lockText}>Unlock "The Expansion" for shared seeds and ritual depth</Text>
                                    </DefaultView>
                                </DefaultView>
                            )}
                            <DefaultView style={styles.gemsList}>
                                {[
                                    { title: "Identity Shift", desc: "For when you feel the pull of old habits." },
                                    { title: "Morning Grounding", desc: "A 2-minute voice note for steady starts." }
                                ].map((gem, i) => (
                                    <DefaultView key={i} style={styles.gemRow}>
                                        <DefaultView style={styles.gemIndicator} />
                                        <DefaultView>
                                            <Text style={styles.gemTitle}>{gem.title}</Text>
                                            <Text style={styles.gemDesc}>{gem.desc}</Text>
                                        </DefaultView>
                                    </DefaultView>
                                ))}
                            </DefaultView>
                        </GlassView>
                    </TouchableOpacity>
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
        paddingHorizontal: 24,
        paddingBottom: 100,
    },
    header: {
        marginBottom: 40,
        zIndex: 10,
    },
    headerBlur: {
        backgroundColor: 'transparent',
    },
    label: {
        fontSize: 10,
        color: '#8E8E93',
        letterSpacing: 2,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 34,
        color: '#FFF',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        color: '#D4CDC3',
        fontStyle: 'italic',
        opacity: 0.6,
        flex: 1,
    },
    vitalityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        marginTop: 8,
    },
    vitalityContainer: {
        alignItems: 'flex-end',
        gap: 4,
    },
    vitalityLabel: {
        fontSize: 9,
        color: '#8E8E93',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    vitalityBarBackground: {
        width: 60,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    vitalityBarForeground: {
        height: '100%',
        borderRadius: 2,
    },
    vitalityValue: {
        fontSize: 10,
        color: '#FFF',
        fontWeight: 'bold',
    },
    addSection: {
        marginBottom: 40,
    },
    inputCard: {
        padding: 20,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    inputInterior: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    plusCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputLabel: {
        fontSize: 10,
        color: '#8E8E93',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    placeholderText: {
        fontSize: 15,
        color: '#FFF',
        opacity: 0.6,
        fontStyle: 'italic',
        marginTop: 2,
    },
    sectionLabel: {
        fontSize: 11,
        color: '#8E8E93',
        letterSpacing: 1.5,
        marginBottom: 24,
        textTransform: 'uppercase',
    },
    leavesSection: {
        marginBottom: 40,
    },
    leavesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    leafCardWrapper: {
        width: '48%',
    },
    leafCard: {
        padding: 24,
        borderRadius: 36,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.03)',
        minHeight: 160,
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.01)',
    },
    leafHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    leafDate: {
        fontSize: 9,
        color: '#8E8E93',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    leafText: {
        fontSize: 17,
        color: '#FFF',
        lineHeight: 24,
        fontStyle: 'italic',
    },
    leafFooter: {
        marginTop: 16,
        alignItems: 'flex-end',
    },
    leafDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        opacity: 0.3,
    },
    emptyGarden: {
        padding: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'rgba(255,255,255,0.1)',
        gap: 16,
    },
    emptyText: {
        fontSize: 14,
        color: '#8E8E93',
        textAlign: 'center',
        fontStyle: 'italic',
        maxWidth: 200,
    },
    resourcesSection: {
        marginBottom: 40,
    },
    resourcesContainer: {
        borderRadius: 32,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
        minHeight: 160,
    },
    lockOverlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockContent: {
        alignItems: 'center',
        gap: 16,
        padding: 32,
    },
    lockText: {
        color: '#FFF',
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 20,
        fontWeight: '500',
        opacity: 0.9,
    },
    gemsList: {
        padding: 24,
        gap: 20,
    },
    gemRow: {
        flexDirection: 'row',
        gap: 16,
    },
    gemIndicator: {
        width: 2,
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 1,
    },
    gemTitle: {
        fontSize: 15,
        color: '#FFF',
        fontWeight: '600',
        marginBottom: 4,
    },
    gemDesc: {
        fontSize: 13,
        color: '#8E8E93',
        lineHeight: 18,
    }
});
