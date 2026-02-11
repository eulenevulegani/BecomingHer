import { SerifText } from '@/components/Themed';
import Colors from '@/constants/Colors';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface CelebrationEffectProps {
    isVisible: boolean;
    onComplete: () => void;
    message?: string;
}

export function CelebrationEffect({ isVisible, onComplete, message }: CelebrationEffectProps) {
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.5);

    useEffect(() => {
        if (isVisible) {
            opacity.value = withSequence(
                withTiming(1, { duration: 300 }),
                withDelay(1500, withTiming(0, { duration: 500 }, (finished) => {
                    if (finished) runOnJS(onComplete)();
                }))
            );
            scale.value = withSequence(
                withSpring(1.1, { damping: 12 }),
                withDelay(1500, withTiming(0.9, { duration: 500 }))
            );
        }
    }, [isVisible]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }]
    }));

    if (!isVisible) return null;

    return (
        <View style={styles.container} pointerEvents="none">
            {/* Background Dim */}
            <Animated.View style={[styles.dim, { opacity: opacity.value * 0.4 }]} />

            {/* Central feedback message */}
            <Animated.View style={[styles.content, animatedStyle]}>
                <SerifText weight="bold" style={styles.message}>
                    {message || "Done"}
                </SerifText>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    dim: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        paddingVertical: 32,
        borderRadius: 24,
        backgroundColor: 'rgba(20,20,30,0.85)', // Glassmorphism
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        maxWidth: width * 0.85,
    },
    message: {
        fontSize: 32,
        color: '#FFF',
        textAlign: 'center',
        lineHeight: 40,
        textShadowColor: Colors.brand.primary + '80', // Gold glow
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
    }
});
