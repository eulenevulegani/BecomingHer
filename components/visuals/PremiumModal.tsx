import { Button } from '@/components/Button';
import { GlassView, SerifText, Text, useThemeColor, View } from '@/components/Themed';
import { AuraBackground } from '@/components/visuals/AuraBackground';
import { BlurView } from 'expo-blur';
import { Chrome, Sparkles, Target, X, Zap } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface PremiumModalProps {
    isVisible: boolean;
    onClose: () => void;
    onUpgrade: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isVisible, onClose, onUpgrade }) => {
    const primaryColor = useThemeColor({}, 'primary');

    const features = [
        {
            icon: <Sparkles size={20} color={primaryColor} />,
            title: "Multiple AI Voices",
            description: "Journey with the Muse, the Anchor, or the Pioneer."
        },
        {
            icon: <Target size={20} color={primaryColor} />,
            title: "Expanded Focus",
            description: "Select up to 7 practices & moves for deep expansion."
        },
        {
            icon: <Chrome size={20} color={primaryColor} />,
            title: "Shared Gems",
            description: "Unlock community-sourced meditations & prompts."
        },
        {
            icon: <Zap size={20} color={primaryColor} />,
            title: "Identity Mapping",
            description: "Visualize the person you are becoming with deep insights."
        }
    ];

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />

                <Animated.View entering={FadeInDown.springify()} style={styles.container}>
                    <GlassView intensity={40} style={styles.content}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={20} color="#FFF" />
                        </TouchableOpacity>

                        <AuraBackground />

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                            <View style={styles.header}>
                                <Text style={[styles.label, { color: primaryColor }]}>the expansion</Text>
                                <SerifText weight="bold" style={styles.title}>Commit to the depth of your journey</SerifText>
                                <Text style={styles.subtitle}>Unlock the full 'Becoming Her' experience for $6.99</Text>
                            </View>

                            <View style={styles.featuresList}>
                                {features.map((feature, index) => (
                                    <View key={index} style={styles.featureItem}>
                                        <View style={styles.featureIcon}>{feature.icon}</View>
                                        <View style={styles.featureText}>
                                            <Text style={styles.featureTitle}>{feature.title}</Text>
                                            <Text style={styles.featureDescription}>{feature.description}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>

                            <Button
                                title="Begin Expansion"
                                onPress={onUpgrade}
                                variant="primary"
                                style={styles.upgradeButton}
                            />

                            <TouchableOpacity onPress={onClose} style={styles.maybeLater}>
                                <Text style={styles.maybeLaterText}>continue with the core</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </GlassView>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    container: {
        width: width * 0.9,
        maxHeight: height * 0.8,
        borderRadius: 40,
        overflow: 'hidden',
    },
    content: {
        flex: 1,
        padding: 32,
        borderRadius: 40,
    },
    closeButton: {
        position: 'absolute',
        top: 24,
        right: 24,
        zIndex: 10,
        padding: 8,
    },
    scrollContent: {
        paddingTop: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
        backgroundColor: 'transparent',
    },
    label: {
        fontSize: 12,
        letterSpacing: 3,
        textTransform: 'uppercase',
        marginBottom: 16,
        fontWeight: '600',
    },
    title: {
        fontSize: 28,
        color: '#FFF',
        textAlign: 'center',
        lineHeight: 38,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14,
        color: '#8E8E93',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    featuresList: {
        gap: 24,
        marginBottom: 40,
        backgroundColor: 'transparent',
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        backgroundColor: 'transparent',
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureText: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    featureTitle: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: '600',
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: 13,
        color: '#8E8E93',
        lineHeight: 18,
    },
    upgradeButton: {
        width: '100%',
        paddingVertical: 18,
    },
    maybeLater: {
        alignItems: 'center',
        marginTop: 20,
        padding: 10,
    },
    maybeLaterText: {
        fontSize: 12,
        color: '#8E8E93',
        letterSpacing: 1,
        textTransform: 'lowercase',
    }
});
