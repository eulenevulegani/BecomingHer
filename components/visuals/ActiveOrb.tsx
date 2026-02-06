import { SerifText, Text, useThemeColor, View } from '@/components/Themed';
import { Typography } from '@/constants/Typography';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
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

    const scale = useSharedValue(1);

    const containerStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
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
            <Animated.View style={[styles.content, containerStyle]}>
                <Text style={styles.momentumLabel}>{momentum.toUpperCase()}</Text>
                <SerifText weight="bold" style={styles.dailyMove}>
                    {title}
                </SerifText>
                <View style={[styles.indicator, { backgroundColor: primaryColor }]} />
            </Animated.View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    content: {
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    momentumLabel: {
        fontSize: 9,
        letterSpacing: 2,
        color: '#8E8E93',
        marginBottom: 8,
    },
    dailyMove: {
        fontSize: Typography.sizes.lg,
        textAlign: 'center',
        color: '#FFF',
        lineHeight: 28,
        maxWidth: width * 0.8,
    },
    indicator: {
        marginTop: 16,
        width: 4,
        height: 4,
        borderRadius: 2,
    }
});

