import Colors, { PLANET_COLORS } from '@/constants/Colors';
import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { SerifText, Text } from '../Themed';

interface PlanetProps {
    pillar: string;
    name: string;
    isSelected: boolean;
    onPress: () => void;
    size?: number;
}

const PILLAR_PLANET_MAP: Record<string, { color: string; hasRings?: boolean; hasMoons?: number }> = {
    health: { color: PLANET_COLORS.health },
    finances: { color: PLANET_COLORS.finances },
    relationships: { color: PLANET_COLORS.relationships, hasMoons: 1 },
    purpose: { color: PLANET_COLORS.purpose },
    growth: { color: PLANET_COLORS.growth, hasRings: true },
    environment: { color: PLANET_COLORS.environment },
    spirituality: { color: PLANET_COLORS.spirituality, hasMoons: 2 },
};

export function Planet({ pillar, name, isSelected, onPress, size = 80 }: PlanetProps) {
    const planetConfig = PILLAR_PLANET_MAP[pillar.toLowerCase()] || { color: Colors.cosmic.stardustGold };
    const orbit = useSharedValue(0);
    const pulse = useSharedValue(0);
    const scale = useSharedValue(1);

    useEffect(() => {
        // Slow orbit rotation for moons
        orbit.value = withRepeat(
            withTiming(1, { duration: 8000, easing: Easing.linear }),
            -1,
            false
        );
        // Gentle pulse for selected planet
        pulse.value = withRepeat(
            withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    useEffect(() => {
        scale.value = withSpring(isSelected ? 1.15 : 1, { damping: 15 });
    }, [isSelected]);

    const planetStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
        ],
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: isSelected ? interpolate(pulse.value, [0, 1], [0.4, 0.8]) : 0,
        transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.3]) }],
    }));

    const moonStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${interpolate(orbit.value, [0, 1], [0, 360])}deg` },
        ],
    }));

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <Animated.View style={[styles.container, { width: size * 1.5, height: size * 1.5 }, planetStyle]}>
                {/* Glow effect when selected */}
                <Animated.View
                    style={[
                        styles.glow,
                        {
                            width: size * 1.4,
                            height: size * 1.4,
                            borderRadius: size * 0.7,
                            backgroundColor: planetConfig.color,
                        },
                        glowStyle,
                    ]}
                />

                {/* Main planet body */}
                <View
                    style={[
                        styles.planet,
                        {
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                            backgroundColor: planetConfig.color,
                            borderColor: isSelected ? '#FFF' : 'transparent',
                            borderWidth: isSelected ? 2 : 0,
                        },
                    ]}
                >
                    {/* Planet surface detail */}
                    <View style={[styles.highlight, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
                </View>

                {/* Rings for Saturn-like */}
                {planetConfig.hasRings && (
                    <View
                        style={[
                            styles.ring,
                            {
                                width: size * 1.5,
                                height: size * 0.4,
                                borderColor: planetConfig.color,
                            },
                        ]}
                    />
                )}

                {/* Orbiting moons */}
                {planetConfig.hasMoons && (
                    <Animated.View style={[styles.moonOrbit, { width: size * 1.3, height: size * 1.3 }, moonStyle]}>
                        <View
                            style={[
                                styles.moon,
                                { backgroundColor: 'rgba(255,255,255,0.6)' },
                            ]}
                        />
                    </Animated.View>
                )}

                {/* Planet name label */}
                <View style={styles.labelContainer}>
                    <Text style={[styles.pillarLabel, isSelected && { color: planetConfig.color }]}>
                        {pillar}
                    </Text>
                    <SerifText
                        style={[
                            styles.nameLabel,
                            isSelected && { color: '#FFF' },
                        ]}
                        numberOfLines={2}
                    >
                        {name}
                    </SerifText>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    glow: {
        position: 'absolute',
    },
    planet: {
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    highlight: {
        position: 'absolute',
        top: '15%',
        left: '20%',
        width: '30%',
        height: '20%',
        borderRadius: 100,
    },
    ring: {
        position: 'absolute',
        borderWidth: 2,
        borderRadius: 100,
        borderStyle: 'solid',
        opacity: 0.6,
        transform: [{ rotateX: '70deg' }],
    },
    moonOrbit: {
        position: 'absolute',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    moon: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    labelContainer: {
        position: 'absolute',
        bottom: -10,
        alignItems: 'center',
        width: '100%',
    },
    pillarLabel: {
        fontSize: 9,
        color: '#8E8E93',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 2,
    },
    nameLabel: {
        fontSize: 11,
        color: '#D4CDC3',
        textAlign: 'center',
        lineHeight: 14,
    },
});
