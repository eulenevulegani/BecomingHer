import Colors from '@/constants/Colors';
import { Mic } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

import { Text } from './Themed';

interface VoiceInputButtonProps {
    onTranscript: (text: string) => void;
    onListeningChange?: (isListening: boolean) => void;
    size?: number;
    placeholder?: string;
}

/**
 * Voice input button that uses Web Speech API on web
 * and provides a fallback text input on native (until native voice is set up).
 * 
 * For full native support, install @jamsch/expo-speech-recognition
 */
export function VoiceInputButton({
    onTranscript,
    onListeningChange,
    size = 64,
    placeholder = 'Listening...'
}: VoiceInputButtonProps) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef<any>(null);

    // Pulse animation
    const pulseScale = useSharedValue(1);

    useEffect(() => {
        if (isListening) {
            pulseScale.value = withRepeat(
                withSequence(
                    withTiming(1.2, { duration: 600, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
                ),
                -1, // infinite
                true
            );
        } else {
            pulseScale.value = withTiming(1, { duration: 200 });
        }
    }, [isListening]);

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseScale.value }],
    }));

    const startListening = () => {
        if (Platform.OS === 'web') {
            // Web Speech API
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (!SpeechRecognition) {
                alert('Speech recognition not supported in this browser. Try Chrome.');
                return;
            }

            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
                onListeningChange?.(true);
            };

            recognition.onresult = (event: any) => {
                const current = event.resultIndex;
                const result = event.results[current];
                const text = result[0].transcript;
                setTranscript(text);

                if (result.isFinal) {
                    onTranscript(text);
                    setIsListening(false);
                    onListeningChange?.(false);
                }
            };

            recognition.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                onListeningChange?.(false);
            };

            recognition.onend = () => {
                setIsListening(false);
                onListeningChange?.(false);
            };

            recognitionRef.current = recognition;
            recognition.start();
        } else {
            // TODO: Native voice - for now, show a placeholder
            // Once expo-speech-recognition is installed, use:
            // ExpoSpeechRecognitionModule.start()
            console.log('Native voice coming soon - use text input for now');
            // For demo, simulate with a prompt
            setIsListening(true);
            onListeningChange?.(true);
            setTimeout(() => {
                setIsListening(false);
                onListeningChange?.(false);
            }, 2000);
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
        onListeningChange?.(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPressIn={startListening}
                onPressOut={stopListening}
                activeOpacity={0.8}
            >
                <Animated.View style={[
                    styles.button,
                    { width: size, height: size, borderRadius: size / 2 },
                    isListening && styles.buttonListening,
                    pulseStyle
                ]}>
                    <Mic
                        size={size * 0.4}
                        color={isListening ? Colors.brand.primary : '#FFF'}
                    />
                </Animated.View>
            </TouchableOpacity>

            {isListening && (
                <View style={styles.transcriptBubble}>
                    <Text style={styles.transcriptText}>
                        {transcript || placeholder}
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: 16,
    },
    button: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    buttonListening: {
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        borderColor: Colors.brand.primary,
    },
    transcriptBubble: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
        maxWidth: 280,
    },
    transcriptText: {
        fontSize: 15,
        color: '#FFF',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});
