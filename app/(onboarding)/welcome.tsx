import { GlassView, SerifText, Text, useThemeColor, View } from '@/components/Themed';
import { AuraBackground } from '@/components/visuals/AuraBackground';
import { INTENTIONS_MAP } from '@/constants/Content';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'expo-router';
import { ArrowRight, Check } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const STARTER_IDENTITIES = INTENTIONS_MAP.slice(0, 6);

export default function WelcomeScreen() {
    const { updateState } = useUser();
    const router = useRouter();
    const primaryColor = useThemeColor({}, 'primary');
    const [selectedIntention, setSelectedIntention] = useState<string | null>(null);

    const handleBegin = () => {
        if (!selectedIntention) return;

        updateState({
            activeIntentions: [selectedIntention],
            hasCompletedOnboarding: true,
            // Set initial focus cycle to the selected intention
            currentFocusCycle: {
                intention: selectedIntention,
                practices: INTENTIONS_MAP.find(i => i.intention === selectedIntention)?.practices || [],
                weekStartDate: new Date().toISOString()
            }
        });

        router.replace('/(tabs)/today');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <AuraBackground />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.header}>
                    <Text style={styles.label}>becoming her</Text>
                    <SerifText weight="bold" style={styles.title}>Your ritual of self-creation.</SerifText>
                    <Text style={styles.subtitle}>Choose the identity that calls to you most today. We’ll build the rhythm for your most ambitious season.</Text>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(600).springify()} style={styles.grid}>
                    {STARTER_IDENTITIES.map((item, index) => {
                        const isSelected = selectedIntention === item.intention;

                        return (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => setSelectedIntention(item.intention)}
                                activeOpacity={0.8}
                                style={styles.cardWrapper}
                            >
                                <GlassView
                                    intensity={isSelected ? 30 : 15}
                                    style={[styles.card, isSelected && { borderColor: primaryColor }]}
                                >
                                    {isSelected && (
                                        <View style={[styles.checkBadge, { backgroundColor: primaryColor }]}>
                                            <Check size={12} color="#000" />
                                        </View>
                                    )}
                                    <SerifText style={[styles.cardTitle, isSelected && { color: primaryColor }]}>
                                        {item.intention}
                                    </SerifText>
                                    {/* Description removed for cleaner look */}
                                </GlassView>
                            </TouchableOpacity>
                        );
                    })}
                </Animated.View>

                {selectedIntention && (
                    <Animated.View entering={FadeInUp} style={styles.footer}>
                        <TouchableOpacity
                            onPress={handleBegin}
                            style={[styles.button, { backgroundColor: primaryColor }]}
                        >
                            <Text style={styles.buttonText}>Begin My Journey</Text>
                            <ArrowRight size={18} color="#000" />
                        </TouchableOpacity>
                    </Animated.View>
                )}
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
        paddingTop: 100,
        paddingHorizontal: 32,
        paddingBottom: 120,
    },
    header: {
        marginBottom: 48,
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
        color: '#8E8E93',
        letterSpacing: 3,
        marginBottom: 16,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 36,
        color: '#FFF',
        textAlign: 'center',
        lineHeight: 44,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        color: '#D4CDC3',
        textAlign: 'center',
        lineHeight: 24,
        opacity: 0.8,
        paddingHorizontal: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'space-between',
    },
    cardWrapper: {
        width: (width - 64 - 16) / 2,
        marginBottom: 16,
    },
    card: {
        padding: 20,
        borderRadius: 24,
        paddingBottom: 20,
        borderColor: 'rgba(255,255,255,0.05)',
        minHeight: 100, // Reduced height
        justifyContent: 'center', // Center title
    },
    checkBadge: {
        position: 'absolute',
        top: -8,
        right: -8,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    cardTitle: {
        fontSize: 18,
        color: '#FFF',
        lineHeight: 24,
    },
    practicesPreview: {
        marginTop: 12,
        gap: 6,
    },
    practiceTag: {
        fontSize: 10,
        color: '#8E8E93',
        textTransform: 'lowercase',
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 32,
        right: 32,
    },
    button: {
        backgroundColor: '#FFF',
        flexDirection: 'row',
        paddingVertical: 14, // Reduced vertical padding
        paddingHorizontal: 28, // Reduced horizontal padding
        borderRadius: 24, // More rounded for smaller look
        alignItems: 'center',
        justifyContent: 'center', // Added to center content
        gap: 8,
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    buttonText: {
        color: '#000',
        fontSize: 15, // Slightly smaller font
        fontWeight: 'bold',
    }
});
