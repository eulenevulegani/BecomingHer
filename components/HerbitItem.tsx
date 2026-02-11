import { MainHerbit } from '@/context/UserContext';
import { Check, Trash2 } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import Animated, { FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';
import { GlassView, SerifText, Text } from './Themed';

interface HerbitItemProps {
    herbit: MainHerbit;
    isCompleted: boolean;
    identityColor: string;
    streak: number;
    onToggle: () => void;
    onDelete: () => void;
    index: number;
}

export const HerbitItem = ({
    herbit,
    isCompleted,
    identityColor,
    streak,
    onToggle,
    onDelete,
    index
}: HerbitItemProps) => {

    const renderRightActions = (progress: any, dragX: any) => {
        return (
            <TouchableOpacity onPress={onDelete} style={styles.deleteAction}>
                <View style={styles.deleteIconContainer}>
                    <Trash2 size={24} color="#FF453A" />
                    <Text style={styles.deleteText}>Delete</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderLeftActions = (progress: any, dragX: any) => {
        if (isCompleted) return null; // Don't show complete if already done
        return (
            <TouchableOpacity onPress={onToggle} style={[styles.completeAction, { backgroundColor: identityColor }]}>
                <View style={styles.completeIconContainer}>
                    <Check size={24} color="#000" />
                    <Text style={styles.completeText}>Complete</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 80).springify()}
            layout={LinearTransition.springify()}
            exiting={FadeOut}
        >
            <GestureHandlerRootView>
                <Swipeable
                    renderRightActions={renderRightActions}
                    renderLeftActions={renderLeftActions}
                    overshootRight={false}
                    overshootLeft={false}
                    onSwipeableLeftOpen={onToggle} // Trigger on full swipe
                >
                    <GlassView
                        intensity={15}
                        style={[
                            styles.herbitCard,
                            isCompleted && styles.herbitCardDone,
                            { borderLeftColor: identityColor, borderLeftWidth: 3 }
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.herbitContent}
                            onPress={onToggle}
                            activeOpacity={0.9}
                        >
                            <View style={styles.herbitMain}>
                                <View style={[
                                    styles.checkbox,
                                    isCompleted && { backgroundColor: identityColor, borderColor: identityColor }
                                ]}>
                                    {isCompleted && <Check size={14} color="#000" />}
                                </View>

                                <View style={styles.herbitInfo}>
                                    <SerifText style={[
                                        styles.herbitText,
                                        isCompleted && styles.herbitTextDone
                                    ]}>
                                        {herbit.text}
                                    </SerifText>
                                    <View style={styles.herbitMeta}>
                                        {herbit.identity && (
                                            <Text style={[styles.identityBadge, { color: identityColor }]}>
                                                {herbit.identity}
                                            </Text>
                                        )}
                                        {streak > 1 && (
                                            <Text style={styles.streakBadge}>🔥 {streak}</Text>
                                        )}
                                        <Text style={styles.timeBadge}>{herbit.timeOfDay}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </GlassView>
                </Swipeable>
            </GestureHandlerRootView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    herbitCard: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        backgroundColor: '#0A0A0F', // Ensure opacity for swipe reveal
        marginVertical: 6,
    },
    herbitCardDone: {
        opacity: 0.7,
    },
    herbitContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    herbitMain: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    checkbox: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    herbitInfo: {
        flex: 1,
    },
    herbitText: {
        fontSize: 17,
        color: '#FFF',
    },
    herbitTextDone: {
        textDecorationLine: 'line-through',
        color: '#6E6E73',
    },
    herbitMeta: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 4,
        alignItems: 'center'
    },
    identityBadge: {
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    streakBadge: {
        fontSize: 10,
        color: '#FFA500',
    },
    timeBadge: {
        fontSize: 10,
        color: '#6E6E73',
        textTransform: 'lowercase',
    },

    // Swipe Actions
    deleteAction: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: 100,
        height: '100%',
        marginVertical: 6,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },
    deleteIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: '100%',
        marginRight: 10,
    },
    deleteText: {
        color: '#FF453A',
        fontSize: 10,
        marginTop: 4,
        fontWeight: '600',
    },
    completeAction: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: 100,
        height: '100%',
        marginVertical: 6,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
    completeIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: '100%',
        marginLeft: 10,
    },
    completeText: {
        color: '#000',
        fontSize: 10,
        marginTop: 4,
        fontWeight: '600',
        textTransform: 'uppercase'
    },
});
