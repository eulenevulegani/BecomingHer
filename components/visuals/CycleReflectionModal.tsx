import { GlassView, SerifText, Text, useThemeColor, View } from '@/components/Themed';
import { IDENTITY_SHIFT_FACTS } from '@/constants/Content';
import { BlurView } from 'expo-blur';
import { CheckCircle2, RefreshCw, Sparkles, Target } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { CelebrationEffect } from './CelebrationEffect';

interface CycleReflectionModalProps {
    isVisible: boolean;
    onClose: () => void;
    onContinue: () => void;
    onPivot: () => void;
    stats: {
        wins: number;
        practices: number;
    };
    currentIdentity: string;
}

export const CycleReflectionModal: React.FC<CycleReflectionModalProps> = ({
    isVisible,
    onClose,
    onContinue,
    onPivot,
    stats,
    currentIdentity
}) => {
    const primaryColor = useThemeColor({}, 'primary');

    const randomFact = useMemo(() => {
        return IDENTITY_SHIFT_FACTS[Math.floor(Math.random() * IDENTITY_SHIFT_FACTS.length)];
    }, [isVisible]);

    return (
        <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <BlurView intensity={40} style={StyleSheet.absoluteFill} tint="dark" />

                <Animated.View entering={FadeInDown.springify()} style={styles.container}>
                    <GlassView intensity={40} style={styles.content}>
                        <View style={styles.header}>
                            <Sparkles size={32} color={primaryColor} />
                            <SerifText weight="bold" style={styles.title}>One week of being.</SerifText>
                            <Text style={styles.subtitle}>you’ve been practicing</Text>
                            <SerifText style={styles.identity}>“{currentIdentity}”</SerifText>
                        </View>

                        <View style={styles.statsGrid}>
                            <View style={styles.statCard}>
                                <Target size={20} color={primaryColor} opacity={0.8} />
                                <Text style={styles.statValue}>{stats.wins}</Text>
                                <Text style={styles.statLabel}>small wins</Text>
                            </View>
                            <View style={styles.statCard}>
                                <CheckCircle2 size={20} color={primaryColor} opacity={0.8} />
                                <Text style={styles.statValue}>{stats.practices}</Text>
                                <Text style={styles.statLabel}>show-ups</Text>
                            </View>
                        </View>

                        <Animated.View entering={FadeInUp.delay(300)} style={styles.factContainer}>
                            <GlassView intensity={10} style={styles.factCard}>
                                <Text style={styles.factLabel}>did you know?</Text>
                                <SerifText weight="bold" style={styles.factTitle}>{randomFact.title}</SerifText>
                                <Text style={styles.factDescription}>{randomFact.fact}</Text>
                            </GlassView>
                        </Animated.View>

                        <View style={styles.actions}>
                            <TouchableOpacity
                                onPress={onContinue}
                                style={[styles.primaryButton, { backgroundColor: primaryColor }]}
                            >
                                <Text style={styles.primaryButtonText}>Keep practicing this identity</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={onPivot}
                                style={styles.secondaryButton}
                            >
                                <RefreshCw size={16} color="#FFF" opacity={0.6} />
                                <Text style={styles.secondaryButtonText}>Pivot to a new focus</Text>
                            </TouchableOpacity>
                        </View>
                    </GlassView>
                </Animated.View>
            </View>

            <CelebrationEffect
                isVisible={isVisible}
                onComplete={() => { }}
            />
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    container: {
        width: '100%',
        maxWidth: 400,
    },
    content: {
        borderRadius: 40,
        padding: 32,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 28,
        color: '#FFF',
        marginTop: 16,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 12,
        color: '#8E8E93',
        letterSpacing: 1,
        marginTop: 12,
        textTransform: 'lowercase',
    },
    identity: {
        fontSize: 20,
        color: '#D4CDC3',
        fontStyle: 'italic',
        marginTop: 4,
        textAlign: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
        backgroundColor: 'transparent',
    },
    statCard: {
        flex: 1,
        padding: 20,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.03)',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 10,
        color: '#666',
        textTransform: 'lowercase',
        marginTop: 2,
    },
    factContainer: {
        marginBottom: 32,
    },
    factCard: {
        padding: 24,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    factLabel: {
        fontSize: 10,
        color: '#8E8E93',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    factTitle: {
        fontSize: 18,
        color: '#FFF',
        marginBottom: 8,
    },
    factDescription: {
        fontSize: 14,
        color: '#D4CDC3',
        lineHeight: 20,
        fontStyle: 'italic',
    },
    actions: {
        gap: 12,
        backgroundColor: 'transparent',
    },
    primaryButton: {
        padding: 18,
        borderRadius: 20,
        alignItems: 'center',
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    secondaryButton: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    secondaryButtonText: {
        fontSize: 14,
        color: '#8E8E93',
    },
});
