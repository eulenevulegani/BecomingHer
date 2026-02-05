import { SerifText, Text, useThemeColor, View } from '@/components/Themed';
import { AuraBackground } from '@/components/visuals/AuraBackground';
import { INTENTIONS_MAP, MOVES_EXAMPLES, WEEK_WORDS } from '@/constants/Content';
import { Move, useUser } from '@/context/UserContext';
import { Check } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function WeekScreen() {
    const { state, setFocusCycle } = useUser();
    const primaryColor = useThemeColor({}, 'primary');

    const activeIntentions = state.activeIntentions || [];
    const currentFocusCycle = state.currentFocusCycle;

    const [selectedIntention, setSelectedIntention] = useState<string | null>(currentFocusCycle?.intention || null);
    const [availablePractices, setAvailablePractices] = useState<string[]>([]);
    const [selectedPractices, setSelectedPractices] = useState<string[]>(currentFocusCycle?.practices || []);
    const [selectedMoves, setSelectedMoves] = useState<string[]>(
        (currentFocusCycle?.moves || []).map(m => m.text)
    );
    const [selectedWord, setSelectedWord] = useState(currentFocusCycle?.word || null);

    useEffect(() => {
        if (selectedIntention) {
            const data = INTENTIONS_MAP.find(i => i.intention === selectedIntention);
            setAvailablePractices(data?.practices || []);
        } else {
            setAvailablePractices([]);
        }
    }, [selectedIntention]);

    const handleTogglePractice = (practice: string) => {
        if (selectedPractices.includes(practice)) {
            setSelectedPractices(selectedPractices.filter(p => p !== practice));
        } else if (selectedPractices.length < 2) {
            setSelectedPractices([...selectedPractices, practice]);
        }
    };

    const handleToggleMove = (moveText: string) => {
        if (selectedMoves.includes(moveText)) {
            setSelectedMoves(selectedMoves.filter(m => m !== moveText));
        } else if (selectedMoves.length < 3) {
            setSelectedMoves([...selectedMoves, moveText]);
        }
    };

    const handleSaveFocusCycle = () => {
        const moves: Move[] = selectedMoves.map(text => ({
            id: Math.random().toString(36).substr(2, 9),
            text,
            status: null,
            timestamp: null
        }));

        setFocusCycle({
            intention: selectedIntention,
            practices: selectedPractices,
            moves,
            word: selectedWord,
            weekStartDate: new Date().toISOString()
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <AuraBackground />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.header}>
                    <Text style={styles.label}>focus cycle</Text>
                    <SerifText weight="bold" style={styles.title}>“This week doesn’t need perfection. It needs honesty.”</SerifText>
                </Animated.View>

                {/* Step 1: Intention */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>1. Choose your focus intention</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                        {activeIntentions.map((intention) => (
                            <TouchableOpacity
                                key={intention}
                                onPress={() => {
                                    setSelectedIntention(intention);
                                    setSelectedPractices([]); // Reset practices on intention change
                                }}
                                style={[
                                    styles.intentionPill,
                                    selectedIntention === intention && { borderColor: primaryColor, backgroundColor: 'rgba(255,255,255,0.05)' }
                                ]}
                            >
                                <Text style={[styles.pillText, selectedIntention === intention && { color: primaryColor }]}>
                                    {intention}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        {activeIntentions.length === 0 && (
                            <Text style={styles.emptyNote}>Set your intentions in 'Becoming' first.</Text>
                        )}
                    </ScrollView>
                </View>

                {/* Step 2: Practices */}
                {selectedIntention && (
                    <Animated.View entering={FadeInDown} style={styles.section}>
                        <Text style={styles.sectionLabel}>2. Select 1–2 practices (options, not rules)</Text>
                        <View style={styles.practicesGrid}>
                            {availablePractices.map((practice) => {
                                const isSelected = selectedPractices.includes(practice);
                                return (
                                    <TouchableOpacity
                                        key={practice}
                                        onPress={() => handleTogglePractice(practice)}
                                        style={[
                                            styles.practiceItem,
                                            isSelected && { borderColor: primaryColor }
                                        ]}
                                    >
                                        <Text style={[styles.practiceText, isSelected && { color: primaryColor }]}>{practice}</Text>
                                        {isSelected && <Check size={14} color={primaryColor} />}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </Animated.View>
                )}

                {/* Step 3: Moves */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>3. Optional: Specific Moves (1–3 small actions)</Text>
                    <View style={styles.movesGrid}>
                        {MOVES_EXAMPLES.map((move) => {
                            const isSelected = selectedMoves.includes(move);
                            return (
                                <TouchableOpacity
                                    key={move}
                                    onPress={() => handleToggleMove(move)}
                                    style={[
                                        styles.moveItem,
                                        isSelected && { borderColor: primaryColor }
                                    ]}
                                >
                                    <Text style={[styles.moveText, isSelected && { color: primaryColor }]}>{move}</Text>
                                    {isSelected && <Check size={14} color={primaryColor} />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Step 4: Word */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>4. Optional: A Word for the Week</Text>
                    <View style={styles.wordCloud}>
                        {WEEK_WORDS.map((word) => (
                            <TouchableOpacity
                                key={word}
                                onPress={() => setSelectedWord(word)}
                                style={[
                                    styles.wordPill,
                                    selectedWord === word && { backgroundColor: primaryColor }
                                ]}
                            >
                                <Text style={[styles.wordText, selectedWord === word && { color: '#000' }]}>{word}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: primaryColor, opacity: selectedIntention ? 1 : 0.5 }]}
                    onPress={handleSaveFocusCycle}
                    disabled={!selectedIntention}
                >
                    <Text style={styles.saveButtonText}>Set Focus Cycle</Text>
                </TouchableOpacity>
                {!selectedIntention && (
                    <Text style={styles.helpText}>Select an intention to continue</Text>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollContent: {
        paddingTop: 80,
        paddingHorizontal: 32,
        paddingBottom: 100,
    },
    header: {
        marginBottom: 40,
        backgroundColor: 'transparent',
    },
    label: {
        fontSize: 10,
        color: '#8E8E93',
        letterSpacing: 2,
        marginBottom: 8,
        textTransform: 'lowercase',
    },
    title: {
        fontSize: 24,
        color: '#FFF',
        lineHeight: 34,
        fontStyle: 'italic',
    },
    section: {
        marginBottom: 32,
        backgroundColor: 'transparent',
    },
    sectionLabel: {
        fontSize: 12,
        color: '#8E8E93',
        marginBottom: 16,
        textTransform: 'lowercase',
    },
    horizontalScroll: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    intentionPill: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        marginRight: 12,
    },
    pillText: {
        fontSize: 14,
        color: '#D4CDC3',
    },
    emptyNote: {
        fontSize: 14,
        color: '#8E8E93',
        fontStyle: 'italic',
    },
    practicesGrid: {
        gap: 12,
        backgroundColor: 'transparent',
    },
    practiceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    practiceText: {
        fontSize: 14,
        color: '#FFF',
    },
    movesGrid: {
        gap: 12,
        backgroundColor: 'transparent',
    },
    moveItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    moveText: {
        fontSize: 14,
        color: '#FFF',
    },
    wordCloud: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        backgroundColor: 'transparent',
    },
    wordPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    wordText: {
        fontSize: 13,
        color: '#8E8E93',
    },
    saveButton: {
        padding: 20,
        borderRadius: 24,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    helpText: {
        textAlign: 'center',
        marginTop: 12,
        fontSize: 12,
        color: '#8E8E93',
        fontStyle: 'italic',
    },
});
