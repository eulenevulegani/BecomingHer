import { GlassView, SerifText } from '@/components/Themed';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface IdentityScoreCardProps {
    identity: string;
    score: number;
    color: string;
    level: number;
    description?: string;
}

export function IdentityScoreCard({ identity, score, color, level, description }: IdentityScoreCardProps) {
    return (
        <GlassView intensity={10} style={styles.container}>
            <View style={styles.header}>
                <View style={[styles.iconPlaceholder, { backgroundColor: color + '20' }]}>
                    <Text style={[styles.iconText, { color: color }]}>{identity.charAt(0)}</Text>
                </View>
                <View style={styles.titleContainer}>
                    <SerifText style={styles.identityName}>{identity}</SerifText>
                    <Text style={styles.levelText}>Level {level}</Text>
                </View>
                <View style={styles.scoreContainer}>
                    <Text style={[styles.scoreValue, { color }]}>{score}</Text>
                    <Text style={styles.scoreLabel}>score</Text>
                </View>
            </View>

            {description && (
                <Text style={styles.description}>{description}</Text>
            )}

            <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${Math.min(score, 100)}%`, backgroundColor: color }]} />
            </View>
        </GlassView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    iconText: {
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    titleContainer: {
        flex: 1,
    },
    identityName: {
        fontSize: 18,
        color: '#FFF',
        textTransform: 'capitalize',
    },
    levelText: {
        fontSize: 12,
        color: '#8E8E93',
    },
    scoreContainer: {
        alignItems: 'flex-end',
    },
    scoreValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    scoreLabel: {
        fontSize: 10,
        color: '#6E6E73',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    description: {
        fontSize: 13,
        color: '#CCCCCC',
        marginBottom: 12,
        lineHeight: 18,
    },
    progressBarBg: {
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 2,
    },
});
