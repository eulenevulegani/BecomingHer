import { GlassView, SerifText, Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useUser } from '@/context/UserContext';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

export function DailyWeaver() {
    const { state, getCuratedIdentity } = useUser();
    const [isVisible, setIsVisible] = useState(true);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('good morning');
        else if (hour < 18) setGreeting('good afternoon');
        else setGreeting('good evening');

        // Auto-dismiss after 5 seconds
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 8000);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    const identity = getCuratedIdentity();
    const name = state.name.split(' ')[0];

    return (
        <Animated.View
            entering={FadeInDown.springify()}
            exiting={FadeOutUp.duration(500)}
            style={styles.container}
        >
            <GlassView intensity={20} style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.greeting}>{greeting}, {name}</Text>
                    <View style={styles.dot} />
                </View>

                <SerifText weight="bold" style={styles.focusText}>
                    Today, you are {identity.name.replace('I am becoming ', '')}.
                </SerifText>

                <View style={styles.divider} />

                <Text style={styles.subtext}>
                    {identity.description}
                </Text>
            </GlassView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    card: {
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.15)',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    greeting: {
        fontSize: 11,
        color: Colors.brand.primary,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.brand.primary,
        opacity: 0.5,
    },
    focusText: {
        fontSize: 24,
        color: '#FFF',
        lineHeight: 32,
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 12,
        width: 40,
    },
    subtext: {
        fontSize: 14,
        color: '#8E8E93',
        lineHeight: 20,
        fontStyle: 'italic',
    },
});
