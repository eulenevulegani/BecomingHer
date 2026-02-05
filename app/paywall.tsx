import { Button } from '@/components/Button';
import { GlassView, SerifText, Text, useThemeColor, View } from '@/components/Themed';
import { AuraBackground } from '@/components/visuals/AuraBackground';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'expo-router';
import { Crown, Shield, Sparkles, X, Zap } from 'lucide-react-native';
import React from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function PaywallScreen() {
    const { setPremium } = useUser();
    const router = useRouter();
    const primaryColor = useThemeColor({}, 'primary');

    const handleSubscribe = () => {
        setPremium(true);
        router.back();
    };

    const features = [
        { icon: <Crown size={20} color={primaryColor} />, title: 'MULTIPLE SEASONS', desc: 'Activate and track multiple growth paths.' },
        { icon: <Shield size={20} color={primaryColor} />, title: 'DEEP ARCHIVE', desc: 'Full access to your previous weekly reflections.' },
        { icon: <Zap size={20} color={primaryColor} />, title: 'SENSORY RECAPS', desc: 'Cinematic AI-summaries of your identity shift.' },
        { icon: <Sparkles size={20} color={primaryColor} />, title: 'UNLIMITED PROOFS', desc: 'Record every whisper of growth.' },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <AuraBackground />

            <Animated.View entering={FadeIn.delay(200)} style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <X size={24} color="#FFF" />
                </TouchableOpacity>
            </Animated.View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.hero}>
                    <View style={[styles.heroGlow, { backgroundColor: primaryColor }]} />
                    <SerifText weight="bold" style={styles.title}>elevate your becoming.</SerifText>
                    <Text style={styles.subtitle}>PROOFA PREMIUM ENROLLMENT</Text>
                </Animated.View>

                <View style={styles.featureGrid}>
                    {features.map((f, i) => (
                        <Animated.View key={i} entering={FadeInDown.delay(400 + i * 100).springify()}>
                            <GlassView intensity={20} style={styles.featureCard}>
                                <View style={styles.iconCircle}>{f.icon}</View>
                                <View style={styles.featureInfo}>
                                    <Text weight="bold" style={styles.featureTitle}>{f.title.toLowerCase()}</Text>
                                    <Text style={styles.featureDesc}>{f.desc.toLowerCase()}</Text>
                                </View>
                            </GlassView>
                        </Animated.View>
                    ))}
                </View>

                <Animated.View entering={ZoomIn.delay(800).springify()} style={styles.pricing}>
                    <GlassView intensity={40} style={styles.priceCard}>
                        <View style={[styles.priceTag, { backgroundColor: primaryColor }]}>
                            <Text style={styles.priceTagText}>BEST VALUE</Text>
                        </View>
                        <SerifText weight="bold" style={styles.priceAmount}>$79.99</SerifText>
                        <Text style={styles.pricePeriod}>PER YEAR</Text>
                        <Text style={styles.priceDiscount}>save 33% on yearly</Text>
                    </GlassView>
                </Animated.View>

                <Animated.View entering={FadeIn.delay(1000)} style={styles.footer}>
                    <Button
                        title="begin elevation"
                        onPress={handleSubscribe}
                        size="lg"
                        variant="primary"
                        style={styles.subscribeButton}
                    />
                    <Text style={styles.terms}>by subscribing, you agree to our terms of identity.</Text>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 24,
        alignItems: 'flex-start',
        backgroundColor: 'transparent',
        zIndex: 10,
    },
    closeButton: {
        padding: 8,
    },
    scrollContent: {
        paddingBottom: 60,
        paddingHorizontal: 24,
    },
    hero: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 48,
        backgroundColor: 'transparent',
    },
    heroGlow: {
        position: 'absolute',
        width: 200,
        height: 100,
        borderRadius: 100,
        filter: 'blur(60px)',
        opacity: 0.2,
        top: 20,
    },
    title: {
        fontSize: 40,
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 10,
        letterSpacing: 4,
        color: '#AF9500',
        fontWeight: 'bold',
    },
    featureGrid: {
        gap: 16,
        marginBottom: 48,
    },
    featureCard: {
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
        gap: 16,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureInfo: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    featureTitle: {
        fontSize: 12,
        letterSpacing: 1,
        color: '#FFF',
        marginBottom: 2,
    },
    featureDesc: {
        fontSize: 11,
        color: '#8E8E93',
        lineHeight: 16,
    },
    pricing: {
        alignItems: 'center',
        marginBottom: 48,
        backgroundColor: 'transparent',
    },
    priceCard: {
        width: '100%',
        padding: 32,
        alignItems: 'center',
        borderColor: 'rgba(175, 149, 0, 0.3)',
        borderWidth: 1,
    },
    priceTag: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 4,
        position: 'absolute',
        top: -12,
    },
    priceTagText: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#000',
    },
    priceAmount: {
        fontSize: 40,
        color: '#FFF',
        marginBottom: 4,
    },
    pricePeriod: {
        fontSize: 10,
        letterSpacing: 2,
        color: '#8E8E93',
        marginBottom: 12,
    },
    priceDiscount: {
        fontSize: 12,
        color: '#AF9500',
        fontWeight: 'bold',
    },
    monthlyOption: {
        marginTop: 24,
    },
    monthlyText: {
        fontSize: 10,
        letterSpacing: 2,
        color: '#8E8E93',
    },
    footer: {
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    subscribeButton: {
        width: '100%',
        marginBottom: 24,
    },
    terms: {
        fontSize: 10,
        color: '#3A3A3C',
        textAlign: 'center',
        letterSpacing: 1,
    },
});
