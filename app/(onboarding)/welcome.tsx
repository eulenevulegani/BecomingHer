import { Button } from '@/components/Button';
import { SerifText, Text, View } from '@/components/Themed';
import { CosmicBackground } from '@/components/visuals/CosmicBackground';
import Colors from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { useUser } from '@/context/UserContext';
import { COPY } from '@/lib/copy';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View as DefaultView, Dimensions, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, TextInput } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function WelcomeScreen() {
    const { updateState, addHerbit } = useUser();
    const router = useRouter();
    const [step, setStep] = useState<'welcome' | 'name' | 'herbit'>('welcome');
    const [name, setName] = useState('');
    const [herbitText, setHerbitText] = useState('');

    const handleNextStep = () => {
        if (step === 'welcome') setStep('name');
        else if (step === 'name' && name.trim()) setStep('herbit');
    };

    const handleLaunch = async () => {
        if (!herbitText.trim()) return;

        // Save name
        updateState({
            hasCompletedOnboarding: true,
            name: name.trim(),
            activeIntentions: [],
            currentFocusCycle: null
        });

        // Add first herbit
        const newHerbit = {
            id: Math.random().toString(36).substring(7),
            text: herbitText.trim(),
            identity: null, // Will be auto-detected in addHerbit
            schedule: 'daily' as const,
            createdAt: new Date().toISOString(),
            createdVia: 'text' as const,
            timeOfDay: 'anytime' as const,
        };
        addHerbit(newHerbit);

        router.replace('/(tabs)/today');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />
            <CosmicBackground />

            <DefaultView style={styles.content}>
                {step === 'welcome' && (
                    <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.welcomeContent}>
                        <View style={styles.header} lightColor="transparent">
                            <Text style={styles.label}>HERbit</Text>
                            <SerifText weight="bold" style={styles.mainWelcomeTitle}>
                                {COPY.onboarding.welcome.title}
                            </SerifText>
                            <Text style={styles.subtitle}>{COPY.onboarding.welcome.subtitle}</Text>
                        </View>

                        <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.footer}>
                            <Button
                                variant="glow"
                                title={COPY.onboarding.welcome.cta}
                                onPress={handleNextStep}
                                color={Colors.brand.primary}
                                size="lg"
                            />
                        </Animated.View>
                    </Animated.View>
                )}

                {step === 'name' && (
                    <Animated.View entering={FadeInDown} style={styles.stepContent}>
                        <View style={styles.header} lightColor="transparent">
                            <Text style={styles.label}>her identity</Text>
                            <SerifText weight="bold" style={styles.title}>
                                {COPY.onboarding.name.title}
                            </SerifText>
                            <Text style={styles.subtitle}>your name will anchor your daily mantras.</Text>
                        </View>

                        <View style={styles.inputContainer} lightColor="transparent">
                            <TextInput
                                style={styles.input}
                                placeholder={COPY.onboarding.name.placeholder}
                                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                                value={name}
                                onChangeText={setName}
                                autoFocus
                                keyboardAppearance="dark"
                                autoCapitalize="words"
                            />
                        </View>

                        <Animated.View entering={FadeInUp.delay(200)} style={styles.footer}>
                            <Button
                                variant="glow"
                                title={COPY.onboarding.name.cta}
                                onPress={handleNextStep}
                                color={Colors.brand.primary}
                                size="lg"
                                disabled={!name.trim()}
                            />
                        </Animated.View>
                    </Animated.View>
                )}

                {step === 'herbit' && (
                    <Animated.View entering={FadeInDown} style={styles.stepContent}>
                        <View style={styles.header} lightColor="transparent">
                            <Text style={styles.label}>her first step</Text>
                            <SerifText weight="bold" style={styles.title}>
                                {COPY.onboarding.firstHerbit.title}
                            </SerifText>
                            <Text style={styles.subtitle}>
                                {COPY.onboarding.firstHerbit.helper}
                            </Text>
                        </View>

                        <View style={styles.inputContainer} lightColor="transparent">
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. morning walk"
                                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                                value={herbitText}
                                onChangeText={setHerbitText}
                                autoFocus
                                keyboardAppearance="dark"
                                autoCapitalize="none"
                                multiline
                            />
                        </View>

                        <Animated.View entering={FadeInUp.delay(200)} style={styles.footer}>
                            <Button
                                variant="glow"
                                title={COPY.onboarding.firstHerbit.cta}
                                onPress={handleLaunch}
                                color={Colors.brand.primary}
                                size="lg"
                                disabled={!herbitText.trim()}
                            />
                        </Animated.View>
                    </Animated.View>
                )}
            </DefaultView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.brand.deep,
    },
    content: {
        flex: 1,
    },
    header: {
        paddingTop: 100,
        paddingHorizontal: 32,
        alignItems: 'center',
        zIndex: 10,
    },
    label: {
        fontSize: 10,
        color: Colors.brand.primary,
        letterSpacing: 4,
        marginBottom: 12,
        textTransform: 'lowercase',
    },
    welcomeContent: {
        flex: 1,
        justifyContent: 'center',
    },
    stepContent: {
        flex: 1,
        justifyContent: 'center',
    },
    mainWelcomeTitle: {
        fontSize: 42,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 52,
        letterSpacing: -0.5,
    },
    title: {
        fontSize: 32,
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 8,
        lineHeight: 40,
    },
    subtitle: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
        lineHeight: 22,
        fontWeight: '300',
        paddingHorizontal: 20,
    },
    inputContainer: {
        paddingHorizontal: 40,
        marginTop: 40,
        alignItems: 'center',
    },
    input: {
        fontSize: 24,
        color: '#FFF',
        fontFamily: Typography.families.serif,
        textAlign: 'center',
        width: '100%',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    footer: {
        padding: 32,
        paddingBottom: 60,
        width: '100%',
    },
});
