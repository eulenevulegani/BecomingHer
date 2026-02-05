import { SerifText, Text, useThemeColor, View } from '@/components/Themed';
import { Typography } from '@/constants/Typography';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const ORB_SIZE = Math.min(width * 0.65, 380);

interface ActiveOrbProps {
    title: string;
    onPress: () => void;
    momentum: string;
}

export function ActiveOrb({ title, onPress, momentum }: ActiveOrbProps) {
    const primaryColor = useThemeColor({}, 'primary');
    const glowColor = useThemeColor({}, 'glow');

    const pulse = useSharedValue(0);
    const scale = useSharedValue(1);

    useEffect(() => {
        pulse.value = withRepeat(
            withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const containerStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: interpolate(pulse.value, [0, 1], [0.3, 0.7]),
        transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.2]) }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.92);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            style={styles.container}
        >
            <Animated.View style={[styles.glow, glowStyle, { backgroundColor: primaryColor }]} />
            <Animated.View style={[styles.orbContainer, containerStyle]}>
                <BlurView intensity={80} style={styles.blur}>
                    <View style={[styles.innerBorder, { borderColor: primaryColor }]} />
                    <View style={styles.content}>
                        <Text style={styles.momentumLabel}>{momentum.toUpperCase()}</Text>
                        <SerifText weight="bold" style={styles.dailyMove}>
                            {title}
                        </SerifText>
                        <View style={[styles.indicator, { backgroundColor: primaryColor }]} />
                    </View>
                </BlurView>
            </Animated.View>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    container: {
        width: ORB_SIZE,
        height: ORB_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    glow: {
        position: 'absolute',
        width: ORB_SIZE * 1.1,
        height: ORB_SIZE * 1.1,
        borderRadius: ORB_SIZE,
        filter: 'blur(40px)',
    },
    orbContainer: {
        width: ORB_SIZE,
        height: ORB_SIZE,
        borderRadius: ORB_SIZE / 2,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    blur: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    innerBorder: {
        position: 'absolute',
        width: '90%',
        height: '90%',
        borderRadius: ORB_SIZE,
        borderWidth: 0.5,
        opacity: 0.2,
    },
    content: {
        padding: 32,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    momentumLabel: {
        fontSize: 9,
        letterSpacing: 2,
        color: '#8E8E93',
        marginBottom: 16,
    },
    dailyMove: {
        fontSize: Typography.sizes.lg, // slightly smaller to fit well
        textAlign: 'center',
        color: '#FFF',
        lineHeight: 28,
    },
    indicator: {
        marginTop: 24,
        width: 4,
        height: 4,
        borderRadius: 2,
    }
});
