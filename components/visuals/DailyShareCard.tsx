import { SerifText, Text, useThemeColor } from '@/components/Themed';
import { AuraBackground } from '@/components/visuals/AuraBackground';
import { DailyMove } from '@/context/UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Sparkles, X } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface DailyShareCardProps {
    identity: string;
    moves: DailyMove[];
    proofText?: string;
    showWatermark?: boolean; // true for freemium, false for premium
}

export function DailyShareCard({ identity, moves, proofText, showWatermark = true }: DailyShareCardProps) {
    const primaryColor = useThemeColor({}, 'primary');

    const formattedDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

    const completedCount = moves.filter(m => m.completed).length;
    const totalCount = moves.length;
    const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <View style={styles.cardContainer}>
            <View style={styles.card}>
                {/* Background Layer */}
                <View style={StyleSheet.absoluteFill}>
                    <AuraBackground />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                        style={StyleSheet.absoluteFill}
                    />
                </View>

                {/* Content Layer */}
                <View style={styles.content}>
                    {/* Header with watermark for freemium */}
                    {showWatermark && (
                        <View style={styles.header}>
                            <Sparkles size={14} color={primaryColor} />
                            <Text style={styles.appName}>BECOMING HER</Text>
                            <Sparkles size={14} color={primaryColor} />
                        </View>
                    )}

                    {/* Date */}
                    <Text style={styles.date}>{formattedDate}</Text>

                    {/* Identity */}
                    <View style={styles.identitySection}>
                        <Text style={styles.label}>today i showed up as</Text>
                        <SerifText style={styles.identity}>"{identity}"</SerifText>
                    </View>

                    {/* Moves List */}
                    <View style={styles.movesSection}>
                        {moves.map((move, index) => (
                            <View key={move.id} style={styles.moveRow}>
                                <View style={[
                                    styles.moveIcon,
                                    { backgroundColor: move.completed ? primaryColor : 'rgba(255,255,255,0.1)' }
                                ]}>
                                    {move.completed ? (
                                        <Check size={10} color="#000" />
                                    ) : (
                                        <X size={10} color="#666" />
                                    )}
                                </View>
                                <Text style={[
                                    styles.moveText,
                                    !move.completed && styles.moveTextIncomplete
                                ]}>
                                    {move.text}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Completion Rate */}
                    <View style={styles.statsSection}>
                        <SerifText style={styles.statValue}>{completionRate}%</SerifText>
                        <Text style={styles.statLabel}>showing up</Text>
                    </View>

                    {/* Proof snippet */}
                    {proofText && (
                        <View style={styles.proofSection}>
                            <Text style={styles.proofLabel}>proof</Text>
                            <Text style={styles.proofText} numberOfLines={2}>
                                "{proofText}"
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        width: 300,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: '100%',
        aspectRatio: 9 / 16,
        borderRadius: 28,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        position: 'relative',
        backgroundColor: '#000',
    },
    content: {
        flex: 1,
        padding: 28,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 8,
    },
    appName: {
        fontSize: 10,
        letterSpacing: 3,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '600',
    },
    date: {
        fontSize: 11,
        color: '#8E8E93',
        textTransform: 'lowercase',
        letterSpacing: 1,
        textAlign: 'center',
    },
    identitySection: {
        alignItems: 'center',
        marginVertical: 16,
    },
    label: {
        fontSize: 9,
        color: '#8E8E93',
        letterSpacing: 2,
        textTransform: 'lowercase',
        marginBottom: 8,
    },
    identity: {
        fontSize: 18,
        color: '#FFF',
        textAlign: 'center',
        lineHeight: 26,
        fontStyle: 'italic',
    },
    movesSection: {
        gap: 10,
        marginVertical: 16,
    },
    moveRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    moveIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    moveText: {
        fontSize: 13,
        color: '#FFF',
        flex: 1,
    },
    moveTextIncomplete: {
        color: '#666',
        textDecorationLine: 'line-through',
    },
    statsSection: {
        alignItems: 'center',
        marginVertical: 16,
    },
    statValue: {
        fontSize: 36,
        color: '#FFF',
    },
    statLabel: {
        fontSize: 10,
        color: '#8E8E93',
        letterSpacing: 2,
        textTransform: 'lowercase',
        marginTop: 4,
    },
    proofSection: {
        marginTop: 'auto',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    proofLabel: {
        fontSize: 9,
        color: '#8E8E93',
        letterSpacing: 2,
        textTransform: 'lowercase',
        marginBottom: 6,
    },
    proofText: {
        fontSize: 12,
        color: '#D4CDC3',
        fontStyle: 'italic',
        lineHeight: 18,
    },
});
