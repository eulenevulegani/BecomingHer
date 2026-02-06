import { Button } from '@/components/Button';
import { GlassView, SerifText, Text, View } from '@/components/Themed';
import { CosmicBackground } from '@/components/visuals/CosmicBackground';
import { FloatingPlanet, PLANET_POSITIONS } from '@/components/visuals/FloatingPlanet';
import Colors from '@/constants/Colors';
import { INTENTIONS_MAP } from '@/constants/Content';
import { useUser } from '@/context/UserContext';
import { COPY } from '@/lib/copy';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, StatusBar, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function WelcomeScreen() {
    const { updateState } = useUser();
    const router = useRouter();
    const [selectedIntention, setSelectedIntention] = useState<string | null>(null);

    const handleSelect = (intention: string) => {
        // If tapping the same planet again, navigate directly
        if (selectedIntention === intention) {
            handleLaunch();
            return;
        }
        setSelectedIntention(intention);
    };

    const handleLaunch = async () => {
        if (!selectedIntention) return;

        updateState({
            hasCompletedOnboarding: true,
            activeIntentions: [selectedIntention],
            currentFocusCycle: {
                intention: selectedIntention,
                practices: INTENTIONS_MAP.find(i => i.intention === selectedIntention)?.practices || [],
                weekStartDate: new Date().toISOString()
            }
        });
        router.replace('/(tabs)/today');
    };

    const selectedData = INTENTIONS_MAP.find(i => i.intention === selectedIntention);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <CosmicBackground />

            {/* Title Section */}
            <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.header}>
                <Text style={styles.label}>her universe</Text>
                <SerifText weight="bold" style={styles.title}>
                    {COPY.onboarding.intention.title}
                </SerifText>
                <Text style={styles.subtitle}>{COPY.onboarding.intention.helper}</Text>
            </Animated.View>

            {/* Floating Planets Universe */}
            <Animated.View entering={FadeIn.delay(500)} style={styles.universeContainer}>
                {INTENTIONS_MAP.map((item, index) => (
                    <FloatingPlanet
                        key={item.id}
                        pillar={item.pillar}
                        intention={item.intention}
                        isSelected={selectedIntention === item.intention}
                        onPress={() => handleSelect(item.intention)}
                        position={PLANET_POSITIONS[index % PLANET_POSITIONS.length]}
                        size={55 + (index % 3) * 8}
                        floatDelay={index * 200}
                    />
                ))}
            </Animated.View>

            {/* Selected Identity Display */}
            {selectedIntention && (
                <Animated.View entering={FadeInUp.delay(100).springify()} style={styles.selectionPanelContainer}>
                    <GlassView intensity={20} style={styles.selectionPanel}>
                        <Text style={styles.selectedLabel}>your identity</Text>
                        <SerifText style={styles.selectedIntention}>
                            "{selectedIntention}"
                        </SerifText>
                        {selectedData && (
                            <Text style={styles.selectedDescription} numberOfLines={2}>
                                {selectedData.description}
                            </Text>
                        )}
                    </GlassView>
                </Animated.View>
            )}

            {/* Launch Button */}
            {selectedIntention && (
                <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.footer}>
                    <Button
                        variant="glow"
                        title="begin my journey"
                        onPress={handleLaunch}
                        color={Colors.cosmic.stardustGold}
                        size="lg"
                    />
                </Animated.View>
            )}

            {/* Subtle hint when nothing selected */}
            {!selectedIntention && (
                <Animated.View entering={FadeIn.delay(1500)} style={styles.hintContainer}>
                    <Text style={styles.hintText}>tap a world to begin</Text>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.cosmic.deepSpace,
    },
    header: {
        paddingTop: 70,
        paddingHorizontal: 32,
        alignItems: 'center',
        zIndex: 10,
    },
    label: {
        fontSize: 10,
        color: Colors.cosmic.stardustGold,
        letterSpacing: 4,
        marginBottom: 12,
        textTransform: 'lowercase',
    },
    title: {
        fontSize: 26,
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 13,
        color: '#8E8E93',
        textAlign: 'center',
        lineHeight: 20,
    },

    // Universe Container
    universeContainer: {
        flex: 1,
        marginTop: 20,
        marginHorizontal: 10,
        position: 'relative',
        minHeight: SCREEN_HEIGHT * 0.45,
    },

    // Selection Panel
    selectionPanelContainer: {
        marginHorizontal: 24,
    },
    selectionPanel: {
        paddingVertical: 24,
        paddingHorizontal: 28,
        alignItems: 'center',
    },
    selectedLabel: {
        fontSize: 9,
        color: Colors.cosmic.stardustGold,
        letterSpacing: 2,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    selectedIntention: {
        fontSize: 17,
        color: '#FFF',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 6,
    },
    selectedDescription: {
        fontSize: 12,
        color: '#8E8E93',
        textAlign: 'center',
        lineHeight: 18,
    },

    // Footer
    footer: {
        padding: 24,
        paddingBottom: 50,
    },

    // Hint
    hintContainer: {
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    hintText: {
        fontSize: 12,
        color: '#6E6E73',
        letterSpacing: 1,
    },
});
