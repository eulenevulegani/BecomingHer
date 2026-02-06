import { SerifText, Text, useThemeColor, View } from '@/components/Themed';
import { AuraBackground } from '@/components/visuals/AuraBackground';
import { CelebrationEffect } from '@/components/visuals/CelebrationEffect';
import { useUser, Win } from '@/context/UserContext';
import { useRouter } from 'expo-router';
import { Camera, ChevronLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { View as DefaultView, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ProofRoomScreen() {
    const { addWin } = useUser();
    const router = useRouter();
    const primaryColor = useThemeColor({}, 'primary');

    const [proofText, setProofText] = useState('');
    const [showCelebration, setShowCelebration] = useState(false);

    const handleLogPromise = () => {
        if (!proofText.trim()) return;

        const proof: Win = {
            id: Math.random().toString(36).substr(2, 9),
            text: proofText.trim(),
            type: 'text',
            timestamp: new Date().toISOString()
        };

        addWin(proof);
        setShowCelebration(true);
        setProofText('');

        // Navigate back after celebration starts
        setTimeout(() => {
            router.back();
        }, 2000);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <AuraBackground />

            <DefaultView style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#FFF" />
                </TouchableOpacity>
                <SerifText weight="bold" style={styles.title}>Proof Room</SerifText>
                <DefaultView style={{ width: 24 }} />
            </DefaultView>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Animated.View entering={FadeInDown.delay(200)} style={styles.infoSection}>
                    <Text style={styles.subtitle}>Log a promise you kept to yourself today.</Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(400)} style={styles.inputCard}>
                    <TextInput
                        style={styles.input}
                        placeholder="I went for a 20 min walk..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={proofText}
                        onChangeText={setProofText}
                        multiline
                        autoFocus
                    />

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.photoButton}>
                        <Camera size={20} color={primaryColor} />
                        <Text style={[styles.photoText, { color: primaryColor }]}>Add Photo</Text>
                    </TouchableOpacity>
                </Animated.View>

                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        { backgroundColor: proofText.trim() ? primaryColor : 'rgba(255,255,255,0.05)' }
                    ]}
                    onPress={handleLogPromise}
                    disabled={!proofText.trim()}
                >
                    <Text style={[styles.submitText, { color: proofText.trim() ? '#000' : 'rgba(255,255,255,0.2)' }]}>
                        Log Promise
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            <CelebrationEffect
                isVisible={showCelebration}
                onComplete={() => setShowCelebration(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    backButton: {
        padding: 4,
    },
    title: {
        fontSize: 28,
        color: '#4B747D',
        textAlign: 'center',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    infoSection: {
        marginBottom: 32,
    },
    subtitle: {
        fontSize: 16,
        color: '#8E8E93',
        textAlign: 'left',
        opacity: 0.8,
    },
    inputCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 32,
        padding: 24,
        minHeight: 200,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    input: {
        fontSize: 18,
        color: '#FFF',
        minHeight: 120,
        textAlignVertical: 'top',
        lineHeight: 26,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginVertical: 16,
    },
    photoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.03)',
        alignSelf: 'flex-start',
    },
    photoText: {
        fontSize: 14,
        fontWeight: '600',
    },
    submitButton: {
        marginTop: 40,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    submitText: {
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    }
});
