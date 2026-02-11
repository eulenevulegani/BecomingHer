import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export function BrandBackground() {
    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <LinearGradient
                colors={[Colors.brand.deep, Colors.brand.background]}
                style={StyleSheet.absoluteFill}
            />
        </View>
    );
}
