import { Button } from '@/components/Button';
import { GlassView, SerifText, Text, useThemeColor } from '@/components/Themed';
import { BrandBackground } from '@/components/visuals/BrandBackground';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { ArrowLeft, Crown, Users } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SisterhoodScreen() {
    const router = useRouter();
    const primaryColor = useThemeColor({}, 'primary');

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <BrandBackground />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#FFF" />
                </TouchableOpacity>
                <SerifText weight="bold" style={styles.title}>the sisterhood</SerifText>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Intro Card */}
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <GlassView intensity={20} style={styles.introCard}>
                        <Users size={32} color={primaryColor} />
                        <Text style={styles.introText}>
                            we rise by lifting others.
                        </Text>
                        <Text style={styles.introSubtext}>
                            connect with women on the same path. share your wins, hold the vision.
                        </Text>
                    </GlassView>
                </Animated.View>

                {/* Challenges Section */}
                <Animated.View entering={FadeInDown.delay(200)}>
                    <View style={styles.sectionHeader}>
                        <SerifText weight="medium" style={styles.sectionTitle}>active challenges</SerifText>
                    </View>

                    {/* Mock Challenge 1 */}
                    <GlassView intensity={15} style={styles.challengeCard}>
                        <View style={styles.challengeHeader}>
                            <Crown size={20} color="#FFD700" />
                            <Text style={styles.challengeTag}>community favorite</Text>
                        </View>
                        <SerifText weight="bold" style={styles.challengeTitle}>7 Days of Self-Love</SerifText>
                        <Text style={styles.challengeMeta}>248 sisters participating • starts monday</Text>
                        <Button
                            title="join challenge"
                            onPress={() => { }}
                            variant="glow"
                            style={{ marginTop: 16 }}
                        />
                    </GlassView>
                </Animated.View>

                {/* Invite Section */}
                <Animated.View entering={FadeInDown.delay(300)} style={styles.inviteSection}>
                    <GlassView intensity={10} style={styles.inviteCard}>
                        <Text style={styles.inviteTitle}>invite a sister</Text>
                        <Text style={styles.inviteDesc}>
                            becoming her is better together. send an invite to your accountability partner.
                        </Text>
                        <Button
                            title="share invite link"
                            onPress={() => { }}
                            variant="outline"
                        />
                    </GlassView>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.brand.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    title: {
        fontSize: 20,
        color: '#FFF',
        letterSpacing: 1,
    },
    content: {
        padding: 20,
        gap: 24,
    },
    introCard: {
        padding: 24,
        borderRadius: 24,
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.2)',
    },
    introText: {
        fontSize: 20,
        color: '#FFF',
        textAlign: 'center',
        fontFamily: 'PlayfairDisplay_600SemiBold_Italic',
    },
    introSubtext: {
        fontSize: 14,
        color: '#8E8E93',
        textAlign: 'center',
        lineHeight: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        color: '#FFF',
    },
    challengeCard: {
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    challengeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    challengeTag: {
        fontSize: 12,
        color: '#FFD700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: 'bold',
    },
    challengeTitle: {
        fontSize: 24,
        color: '#FFF',
        marginBottom: 8,
    },
    challengeMeta: {
        fontSize: 14,
        color: '#8E8E93',
    },
    inviteSection: {
        marginTop: 10,
    },
    inviteCard: {
        padding: 24,
        borderRadius: 20,
        gap: 12,
    },
    inviteTitle: {
        fontSize: 18,
        color: '#FFF',
        fontFamily: 'Inter_600SemiBold',
    },
    inviteDesc: {
        fontSize: 14,
        color: '#8E8E93',
        lineHeight: 20,
    }
});
