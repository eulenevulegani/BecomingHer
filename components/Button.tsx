import { Typography } from '@/constants/Typography';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { ActivityIndicator, StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { Text, useThemeColor } from './Themed';

interface ButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    haptic?: Haptics.ImpactFeedbackStyle;
}

export function Button({
    onPress,
    title,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    style,
    textStyle,
    haptic = Haptics.ImpactFeedbackStyle.Medium,
}: ButtonProps) {
    const primaryColor = useThemeColor({}, 'primary');
    const secondaryColor = useThemeColor({}, 'secondary');
    const textColor = useThemeColor({}, 'text');

    const handlePress = () => {
        if (!disabled && !loading) {
            Haptics.impactAsync(haptic);
            onPress();
        }
    };

    const getVariantStyle = () => {
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: primaryColor,
                    shadowColor: primaryColor,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.4,
                    shadowRadius: 15,
                    elevation: 8,
                };
            case 'secondary':
                return { backgroundColor: secondaryColor };
            case 'outline':
                return { backgroundColor: 'transparent', borderWidth: 1, borderColor: primaryColor };
            case 'ghost':
                return { backgroundColor: 'transparent' };
            default:
                return { backgroundColor: primaryColor };
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'primary':
                return { color: '#000' };
            case 'secondary':
                return { color: '#FFFFFF' };
            default:
                return { color: primaryColor };
        }
    };

    const getSizeStyle = () => {
        switch (size) {
            case 'sm':
                return { paddingVertical: 10, paddingHorizontal: 20 };
            case 'lg':
                return { paddingVertical: 18, paddingHorizontal: 40 };
            default:
                return { paddingVertical: 14, paddingHorizontal: 28 };
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={disabled || loading}
            style={[
                styles.button,
                getSizeStyle(),
                getVariantStyle(),
                disabled && styles.disabled,
                style,
            ]}
            activeOpacity={0.9}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? '#000' : primaryColor} />
            ) : (
                <Text
                    weight="bold"
                    style={[
                        styles.text,
                        getTextStyle(),
                        size === 'lg' && { fontSize: Typography.sizes.md, letterSpacing: Typography.letterSpacing.extraWide },
                        textStyle,
                    ]}
                >
                    {title.toUpperCase()}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    text: {
        fontSize: Typography.sizes.xs,
        letterSpacing: Typography.letterSpacing.wide,
    },
    disabled: {
        opacity: 0.3,
    },
});
