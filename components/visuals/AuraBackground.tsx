import { useColorScheme } from '@/components/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export function AuraBackground() {
    const colorScheme = useColorScheme() ?? 'dark';
    const pulse = useSharedValue(0);

    useEffect(() => {
        pulse.value = withRepeat(
            withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const aura1Style = useAnimatedStyle(() => ({
        transform: [
            { translateX: interpolate(pulse.value, [0, 1], [-width * 0.2, width * 0.2]) },
            { translateY: interpolate(pulse.value, [0, 1], [-height * 0.1, height * 0.1]) },
            { scale: interpolate(pulse.value, [0, 1], [1, 1.2]) },
        ],
        opacity: interpolate(pulse.value, [0, 1], [0.3, 0.6]),
    }));

    const aura2Style = useAnimatedStyle(() => ({
        transform: [
            { translateX: interpolate(pulse.value, [0, 1], [width * 0.3, -width * 0.3]) },
            { translateY: interpolate(pulse.value, [0, 1], [height * 0.2, -height * 0.2]) },
            { scale: interpolate(pulse.value, [0, 1], [1.2, 1]) },
        ],
        opacity: interpolate(pulse.value, [0, 1], [0.4, 0.2]),
    }));

    return (
        <View style={[StyleSheet.absoluteFill, styles.container]} pointerEvents="none">
            <Animated.View style={[styles.aura, aura1Style]}>
                <LinearGradient
                    colors={['#AF9500', 'transparent']}
                    style={styles.gradient}
                />
            </Animated.View>
            <Animated.View style={[styles.aura, aura2Style, styles.auraRight]}>
                <LinearGradient
                    colors={['#5856D6', 'transparent']}
                    style={styles.gradient}
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#050505',
        overflow: 'hidden',
        zIndex: -1,
    },
    aura: {
        position: 'absolute',
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: width,
        top: -width * 0.2,
        left: -width * 0.2,
    },
    auraRight: {
        top: height * 0.6,
        left: width * 0.4,
    },
    gradient: {
        flex: 1,
        borderRadius: width,
    },
});
