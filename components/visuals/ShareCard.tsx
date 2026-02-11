import { SerifText, Text, useThemeColor } from '@/components/Themed';
import { AuraBackground } from '@/components/visuals/AuraBackground';
import { FocusCycle } from '@/context/UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface ShareCardProps {
    cycle: FocusCycle;
    stats: {
        wins: number;
        practices: number;
        vitality: number;
    };
    showWatermark?: boolean; // true for freemium, false for premium
}

export function ShareCard({ cycle, stats, showWatermark = true }: ShareCardProps) {
    const primaryColor = useThemeColor({}, 'primary');

    const formattedDate = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <View style={styles.cardContainer}>
            <View style={styles.card}>
                {/* Background Layer */}
                <View style={StyleSheet.absoluteFill}>
                    <AuraBackground />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)']}
                        style={StyleSheet.absoluteFill}
                    />
                </View>

                {/* Content Layer */}
                <View style={styles.content}>
                    {showWatermark && (
                        <View style={styles.header}>
                            <Sparkles size={16} color={primaryColor} />
                            <Text style={styles.appName}>BECOMING HER</Text>
                            <Sparkles size={16} color={primaryColor} />
                        </View>
                    )}

                    {!showWatermark && <View style={styles.headerSpacer} />}

                    <View style={styles.divider} />

                    <View style={styles.main}>
                        <Text style={styles.label}>Weekly Rhythm Recap</Text>
                        <SerifText style={styles.intention}>"{cycle.intention}"</SerifText>

                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <SerifText style={styles.statValue}>{stats.wins}</SerifText>
                                <Text style={styles.statLabel}>Wins</Text>
                            </View>
                            <View style={styles.statItem}>
                                <SerifText style={styles.statValue}>{stats.practices}</SerifText>
                                <Text style={styles.statLabel}>Practices Done</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.date}>{formattedDate}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        width: 320,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: '100%',
        aspectRatio: 4 / 5,
        borderRadius: 32,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        position: 'relative',
        backgroundColor: '#000',
    },
    content: {
        flex: 1,
        padding: 32,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerSpacer: {
        height: 30,
    },
    appName: {
        fontSize: 12,
        letterSpacing: 3,
        color: '#FFF',
        fontWeight: '600',
    },
    divider: {
        width: 40,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginTop: 24,
        marginBottom: 24,
    },
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    label: {
        fontSize: 10,
        color: '#D4CDC3',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    intention: {
        fontSize: 24,
        color: '#FFF',
        textAlign: 'center',
        lineHeight: 34,
        fontStyle: 'italic',
        paddingHorizontal: 12,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 32,
        marginTop: 24,
    },
    statItem: {
        alignItems: 'center',
        gap: 4,
    },
    statValue: {
        fontSize: 28,
        color: '#FFF',
    },
    statLabel: {
        fontSize: 9,
        color: '#8E8E93',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    footer: {
        marginTop: 'auto',
    },
    date: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
});
