import { useThemeColor } from '@/components/Themed';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { Dimensions, Platform, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PARTICLE_COUNT = 40;

const CELEBRATION_MESSAGES = [
    "proud of you",
    "clapping for you",
    "she's arriving",
    "pure magic",
    "that counted",
    "becoming her"
];

interface ParticleProps {
    color: string;
    index: number;
}

const ConfettiParticle: React.FC<ParticleProps> = ({ color, index }) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const rotation = useSharedValue(0);
    const scale = useSharedValue(0);
    const opacity = useSharedValue(1);

    useEffect(() => {
        const angle = (Math.PI * 2 * index) / PARTICLE_COUNT + (Math.random() * 0.5);
        const distance = 120 + Math.random() * 250;

        // Explosion phase
        translateX.value = withSpring(Math.cos(angle) * distance, { damping: 10, stiffness: 80 });
        translateY.value = withSpring(Math.sin(angle) * distance, { damping: 10, stiffness: 80 });
        scale.value = withSequence(
            withSpring(1.2 + Math.random(), { damping: 8 }),
            withDelay(1200, withTiming(0, { duration: 600 }))
        );
        rotation.value = withTiming(Math.random() * 1080, { duration: 2500 });

        // Gravity/Fall phase
        translateY.value = withDelay(
            400,
            withTiming(SCREEN_HEIGHT / 2 + 200, { duration: 2500 })
        );
        opacity.value = withDelay(1800, withTiming(0, { duration: 700 }));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { rotate: `${rotation.value}deg` },
            { scale: scale.value }
        ],
        opacity: opacity.value,
        backgroundColor: color,
    }));

    return <Animated.View style={[styles.particle, animatedStyle]} />;
};

interface CelebrationEffectProps {
    isVisible: boolean;
    onComplete: () => void;
}

export const CelebrationEffect: React.FC<CelebrationEffectProps> = ({ isVisible, onComplete }) => {
    const primaryColor = useThemeColor({}, 'primary');
    const colors = [primaryColor, '#FFD700', '#FF69B4', '#00E5FF', '#7C4DFF', '#FFFFFF'];
    const [particles, setParticles] = useState<number[]>([]);
    const [message, setMessage] = useState("");

    const messageOpacity = useSharedValue(0);
    const messageScale = useSharedValue(0.8);

    useEffect(() => {
        if (isVisible) {
            setParticles(Array.from({ length: PARTICLE_COUNT }, (_, i) => i));
            setMessage(CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)]);

            // Haptic feedback
            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }

            messageOpacity.value = withSequence(
                withTiming(1, { duration: 400 }),
                withDelay(1500, withTiming(0, { duration: 600 }))
            );
            messageScale.value = withSpring(1.1, { damping: 12 });

            const timer = setTimeout(() => {
                onComplete();
                setParticles([]);
                messageOpacity.value = 0;
                messageScale.value = 0.8;
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    const messageStyle = useAnimatedStyle(() => ({
        opacity: messageOpacity.value,
        transform: [{ scale: messageScale.value }]
    }));

    if (!isVisible) return null;

    return (
        <Animated.View style={styles.container} pointerEvents="none">
            {particles.map((i) => (
                <ConfettiParticle
                    key={i}
                    index={i}
                    color={colors[i % colors.length]}
                />
            ))}
            <Animated.View style={[styles.messageBox, messageStyle]}>
                <Animated.Text style={[styles.celebrationText, { color: primaryColor }]}>
                    {message}
                </Animated.Text>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
    },
    particle: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 3,
    },
    messageBox: {
        position: 'absolute',
        top: '35%',
        paddingHorizontal: 20,
    },
    celebrationText: {
        fontSize: 38,
        fontFamily: 'PlayfairDisplay_700Bold',
        letterSpacing: 3,
        textAlign: 'center',
        fontStyle: 'italic',
        textShadowColor: 'rgba(0,0,0,0.6)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 15,
    }
});
