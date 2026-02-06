import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface Star {
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
    duration: number;
}

// Generate random stars
const generateStars = (count: number): Star[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3000,
        duration: Math.random() * 2000 + 2000,
    }));
};

function Star({ star }: { star: Star }) {
    const twinkle = useSharedValue(0);

    useEffect(() => {
        twinkle.value = withDelay(
            star.delay,
            withRepeat(
                withTiming(1, { duration: star.duration, easing: Easing.inOut(Easing.ease) }),
                -1,
                true
            )
        );
    }, []);

    const starStyle = useAnimatedStyle(() => ({
        opacity: interpolate(twinkle.value, [0, 1], [0.3, 1]),
        transform: [{ scale: interpolate(twinkle.value, [0, 1], [0.8, 1.2]) }],
    }));

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute',
                    left: star.x,
                    top: star.y,
                    width: star.size,
                    height: star.size,
                    borderRadius: star.size / 2,
                    backgroundColor: '#FFF',
                },
                starStyle,
            ]}
        />
    );
}

export function CosmicBackground() {
    const nebulaFloat = useSharedValue(0);
    const stars = useMemo(() => generateStars(50), []);

    useEffect(() => {
        nebulaFloat.value = withRepeat(
            withTiming(1, { duration: 12000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const nebula1Style = useAnimatedStyle(() => ({
        transform: [
            { translateX: interpolate(nebulaFloat.value, [0, 1], [-width * 0.1, width * 0.1]) },
            { translateY: interpolate(nebulaFloat.value, [0, 1], [-height * 0.05, height * 0.05]) },
            { scale: interpolate(nebulaFloat.value, [0, 1], [1, 1.15]) },
        ],
        opacity: interpolate(nebulaFloat.value, [0, 1], [0.4, 0.6]),
    }));

    const nebula2Style = useAnimatedStyle(() => ({
        transform: [
            { translateX: interpolate(nebulaFloat.value, [0, 1], [width * 0.15, -width * 0.15]) },
            { translateY: interpolate(nebulaFloat.value, [0, 1], [height * 0.1, -height * 0.1]) },
            { scale: interpolate(nebulaFloat.value, [0, 1], [1.1, 0.95]) },
        ],
        opacity: interpolate(nebulaFloat.value, [0, 1], [0.5, 0.3]),
    }));

    return (
        <View style={[StyleSheet.absoluteFill, styles.container]} pointerEvents="none">
            {/* Deep space base */}
            <LinearGradient
                colors={[Colors.cosmic.voidBlack, Colors.cosmic.deepSpace, Colors.cosmic.deepSpace]}
                style={StyleSheet.absoluteFill}
            />

            {/* Nebula glow 1 - Purple */}
            <Animated.View style={[styles.nebula, nebula1Style]}>
                <LinearGradient
                    colors={[Colors.cosmic.nebulaPurple, 'transparent']}
                    style={styles.nebulaGradient}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                />
            </Animated.View>

            {/* Nebula glow 2 - Gold accent */}
            <Animated.View style={[styles.nebula, styles.nebulaRight, nebula2Style]}>
                <LinearGradient
                    colors={['rgba(255, 215, 0, 0.15)', 'transparent']}
                    style={styles.nebulaGradient}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                />
            </Animated.View>

            {/* Twinkling stars */}
            {stars.map((star) => (
                <Star key={star.id} star={star} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.cosmic.voidBlack,
        overflow: 'hidden',
        zIndex: -1,
    },
    nebula: {
        position: 'absolute',
        width: width * 1.2,
        height: width * 1.2,
        borderRadius: width,
        top: -width * 0.4,
        left: -width * 0.3,
    },
    nebulaRight: {
        top: height * 0.5,
        left: width * 0.2,
    },
    nebulaGradient: {
        flex: 1,
        borderRadius: width,
    },
});
