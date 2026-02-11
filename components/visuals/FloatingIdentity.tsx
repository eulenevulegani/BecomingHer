import Colors, { IDENTITY_COLORS } from '@/constants/Colors';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming
} from 'react-native-reanimated';
import { SerifText, Text } from '../Themed';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface FloatingIdentityProps {
    identity: string;
    intention: string;
    isSelected: boolean;
    onPress: () => void;
    size?: number;
    position: { x: number; y: number };
    floatDelay?: number;
}

const IDENTITY_VISUALS: Record<string, { color: string; hasRings?: boolean; hasMoons?: number; glow?: string }> = {
    health: { color: IDENTITY_COLORS.health, glow: 'rgba(77, 182, 172, 0.3)' },
    finances: { color: IDENTITY_COLORS.finances, glow: 'rgba(255, 193, 7, 0.3)' },
    relationships: { color: IDENTITY_COLORS.relationships, hasMoons: 1, glow: 'rgba(236, 64, 122, 0.3)' },
    purpose: { color: IDENTITY_COLORS.purpose, glow: 'rgba(239, 83, 80, 0.3)' },
    growth: { color: IDENTITY_COLORS.growth, hasRings: true, glow: 'rgba(171, 71, 188, 0.3)' },
    environment: { color: IDENTITY_COLORS.environment, glow: 'rgba(66, 165, 245, 0.3)' },
    spirituality: { color: IDENTITY_COLORS.spirituality, hasMoons: 2, glow: 'rgba(189, 189, 189, 0.3)' },
};

export function FloatingIdentity({
    identity,
    intention,
    isSelected,
    onPress,
    size = 60,
    position,
    floatDelay = 0
}: FloatingIdentityProps) {
    const visual = IDENTITY_VISUALS[identity.toLowerCase()] || { color: Colors.brand.primary };

    // Floating animation
    const floatY = useSharedValue(0);
    const floatX = useSharedValue(0);
    const pulse = useSharedValue(0);
    const moonRotation = useSharedValue(0);

    useEffect(() => {
        // Gentle floating motion
        floatY.value = withDelay(
            floatDelay,
            withRepeat(
                withTiming(1, { duration: 3000 + Math.random() * 1000, easing: Easing.inOut(Easing.ease) }),
                -1,
                true
            )
        );
        floatX.value = withDelay(
            floatDelay + 500,
            withRepeat(
                withTiming(1, { duration: 4000 + Math.random() * 1000, easing: Easing.inOut(Easing.ease) }),
                -1,
                true
            )
        );
        // Pulse for selected
        pulse.value = withRepeat(
            withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
        // Moon rotation
        moonRotation.value = withRepeat(
            withTiming(1, { duration: 6000, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    const containerStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: interpolate(floatY.value, [0, 1], [-8, 8]) },
            { translateX: interpolate(floatX.value, [0, 1], [-4, 4]) },
        ],
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: isSelected ? interpolate(pulse.value, [0, 1], [0.5, 1]) : 0,
        transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.4]) }],
    }));

    const moonStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${interpolate(moonRotation.value, [0, 1], [0, 360])}deg` },
        ],
    }));

    // Extract short name from intention
    const shortName = intention
        .replace('becoming a woman who ', '')
        .replace('becoming a woman of ', '');

    return (
        <Animated.View style={[styles.floatingContainer, { left: position.x, top: position.y }, containerStyle]}>
            <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.touchable}>
                {/* Glow effect */}
                <Animated.View
                    style={[
                        styles.glow,
                        {
                            width: size * 1.8,
                            height: size * 1.8,
                            borderRadius: size,
                            backgroundColor: visual.glow || visual.color,
                        },
                        glowStyle,
                    ]}
                />

                {/* Main identity visual */}
                <View
                    style={[
                        styles.identityVisual,
                        {
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                            backgroundColor: visual.color,
                            borderWidth: isSelected ? 2 : 0,
                            borderColor: '#FFF',
                        },
                    ]}
                >
                    {/* Surface highlight */}
                    <View style={styles.highlight} />

                    {/* Shadow side */}
                    <View style={styles.shadow} />
                </View>

                {/* Rings for Saturn-like identities */}
                {visual.hasRings && (
                    <View
                        style={[
                            styles.ring,
                            {
                                width: size * 1.5,
                                height: size * 0.35,
                                borderColor: visual.color,
                            },
                        ]}
                    />
                )}

                {/* Rotating moons */}
                {visual.hasMoons && (
                    <Animated.View
                        style={[
                            styles.moonRotation,
                            { width: size * 1.4, height: size * 1.4 },
                            moonStyle
                        ]}
                    >
                        <View style={styles.moon} />
                        {visual.hasMoons > 1 && (
                            <View style={[styles.moon, styles.moonSecond]} />
                        )}
                    </Animated.View>
                )}

                {/* Label */}
                <View style={styles.labelContainer}>
                    <Text style={[styles.identityLabel, isSelected && { color: visual.color }]}>
                        {identity}
                    </Text>
                    <SerifText style={[styles.intentionLabel, isSelected && { color: '#FFF' }]} numberOfLines={2}>
                        {shortName}
                    </SerifText>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

// Preset positions for 7 identities in a floating constellation
export const IDENTITY_POSITIONS = [
    { x: SCREEN_WIDTH * 0.08, y: 40 },   // Top left
    { x: SCREEN_WIDTH * 0.55, y: 20 },   // Top right
    { x: SCREEN_WIDTH * 0.25, y: 140 },  // Middle left
    { x: SCREEN_WIDTH * 0.60, y: 160 },  // Middle right
    { x: SCREEN_WIDTH * 0.05, y: 280 },  // Bottom left
    { x: SCREEN_WIDTH * 0.40, y: 300 },  // Bottom center
    { x: SCREEN_WIDTH * 0.70, y: 260 },  // Bottom right
];

const styles = StyleSheet.create({
    floatingContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    touchable: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 110,
        height: 140,
    },
    glow: {
        position: 'absolute',
    },
    identityVisual: {
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
        overflow: 'hidden',
    },
    highlight: {
        position: 'absolute',
        top: '12%',
        left: '15%',
        width: '35%',
        height: '25%',
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderRadius: 50,
    },
    shadow: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '50%',
        height: '50%',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderBottomRightRadius: 100,
    },
    ring: {
        position: 'absolute',
        borderWidth: 2,
        borderRadius: 100,
        borderStyle: 'solid',
        opacity: 0.5,
        transform: [{ rotateX: '70deg' }],
    },
    moonRotation: {
        position: 'absolute',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    moon: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.7)',
    },
    moonSecond: {
        position: 'absolute',
        bottom: 0,
        right: '30%',
        width: 4,
        height: 4,
        borderRadius: 2,
    },
    labelContainer: {
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        width: 100,
    },
    identityLabel: {
        fontSize: 8,
        color: '#8E8E93',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 2,
    },
    intentionLabel: {
        fontSize: 10,
        color: '#A0A0A0',
        textAlign: 'center',
        lineHeight: 13,
    },
});
