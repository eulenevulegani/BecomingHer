import { Button } from '@/components/Button';
import { GlassView, SerifText, Text, useThemeColor, View } from '@/components/Themed';
import { CelebrationEffect } from '@/components/visuals/CelebrationEffect';
import { CosmicBackground } from '@/components/visuals/CosmicBackground';
import { CycleReflectionModal } from '@/components/visuals/CycleReflectionModal';
import { PremiumModal } from '@/components/visuals/PremiumModal';
import Colors, { PLANET_COLORS } from '@/constants/Colors';
import { DailyMove, useUser, Win } from '@/context/UserContext';
import { AIService } from '@/lib/AIService';
import { COPY } from '@/lib/copy';
import { useRouter } from 'expo-router';
import { Check, Edit2, Moon, Plus, Sparkles } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { View as DefaultView, Dimensions, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function TodayScreen() {
  const {
    state,
    logPractice,
    setFocusCycle,
    updateState,
    addWin,
    setDailyMoves,
    toggleMoveComplete,
    startMorning,
    closeEvening,
    getTimeOfDay
  } = useUser();
  const router = useRouter();
  const primaryColor = useThemeColor({}, 'primary');

  // Core state
  const [showAffirmation, setShowAffirmation] = useState(true);
  const [arrivalState, setArrivalState] = useState<'none' | 'showing'>('none');
  const [isReflectionVisible, setIsReflectionVisible] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isPremiumModalVisible, setIsPremiumModalVisible] = useState(false);

  // Morning/Evening state
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>(getTimeOfDay());
  const [eveningPrompt, setEveningPrompt] = useState<string>('');
  const [reflectionText, setReflectionText] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Editing state
  const [editingMoveIndex, setEditingMoveIndex] = useState<number | null>(null);
  const [tempMoveText, setTempMoveText] = useState('');
  const [isAddingCustomMove, setIsAddingCustomMove] = useState(false);
  const [newCustomMoveText, setNewCustomMoveText] = useState('');

  const currentFocusCycle = state.currentFocusCycle;
  const currentIntention = currentFocusCycle?.intention || "becoming someone who trusts herself";
  const today = new Date().toISOString().split('T')[0];
  const hasDoneMorningSetup = state.lastMorningSetup === today;
  const hasDoneEveningClose = state.lastEveningClose === today;

  // Get pillar color for current identity
  const getPillarColor = () => {
    const pillar = currentFocusCycle?.intention?.toLowerCase() || '';
    if (pillar.includes('body') || pillar.includes('health')) return PLANET_COLORS.health;
    if (pillar.includes('abundance') || pillar.includes('finance')) return PLANET_COLORS.finances;
    if (pillar.includes('community') || pillar.includes('relationship')) return PLANET_COLORS.relationships;
    if (pillar.includes('vision') || pillar.includes('purpose')) return PLANET_COLORS.purpose;
    if (pillar.includes('evolve') || pillar.includes('growth')) return PLANET_COLORS.growth;
    if (pillar.includes('space') || pillar.includes('environment')) return PLANET_COLORS.environment;
    if (pillar.includes('peace') || pillar.includes('spiritual')) return PLANET_COLORS.spirituality;
    return primaryColor;
  };

  const accentColor = getPillarColor();

  // Initialize daily moves from focus cycle if not set for today
  useEffect(() => {
    if (currentFocusCycle && (!state.dailyMoves.length || !hasDoneMorningSetup)) {
      const initialMoves: DailyMove[] = currentFocusCycle.practices.slice(0, 3).map((p, i) => ({
        id: `move-${i}-${Date.now()}`,
        text: p,
        completed: false,
        completedAt: null
      }));
      setDailyMoves(initialMoves);
    }
  }, [currentFocusCycle?.weekStartDate]);

  // Get AI evening prompt when entering evening mode
  useEffect(() => {
    if (timeOfDay === 'evening' && !eveningPrompt) {
      const completedCount = state.dailyMoves.filter(m => m.completed).length;
      const totalCount = state.dailyMoves.length;
      AIService.getEveningReflectionPrompt(completedCount, totalCount, state.activePersonality)
        .then(prompt => setEveningPrompt(prompt));
    }
  }, [timeOfDay, state.dailyMoves]);

  // Affirmation auto-dismiss
  useEffect(() => {
    const timer = setTimeout(() => handleDismissArrival(), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Check for end of week cycle
  useEffect(() => {
    if (state.currentFocusCycle?.weekStartDate) {
      const startDate = new Date(state.currentFocusCycle.weekStartDate);
      const now = new Date();
      const diffDays = (now.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
      if (diffDays >= 7 && state.lastReflectionDate !== state.currentFocusCycle.weekStartDate) {
        setIsReflectionVisible(true);
      }
    }
  }, [state.currentFocusCycle?.weekStartDate, state.lastReflectionDate]);

  const handleDismissArrival = () => {
    if (arrivalState === 'showing') return;
    setShowAffirmation(false);
    setArrivalState('showing');
    setTimeout(() => setArrivalState('none'), 1500);
  };

  const handleStartMyDay = async () => {
    startMorning();
    setShowCelebration(true);
  };

  const handleCloseMyDay = () => {
    if (reflectionText.trim()) {
      const proof: Win = {
        id: Math.random().toString(36).substr(2, 9),
        text: reflectionText,
        type: 'text',
        timestamp: new Date().toISOString()
      };
      addWin(proof);
    }

    state.dailyMoves.forEach(move => {
      logPractice({
        id: Math.random().toString(36).substr(2, 9),
        practice: move.text,
        level: move.completed ? 'yes' : 'not_today',
        timestamp: new Date().toISOString()
      });
    });

    closeEvening();
    setReflectionText('');
    setShowCelebration(true);
  };

  const handleUpdateMove = (index: number, newText: string) => {
    const updatedMoves = [...state.dailyMoves];
    updatedMoves[index] = { ...updatedMoves[index], text: newText };
    setDailyMoves(updatedMoves);
    setEditingMoveIndex(null);
  };

  const handleAddCustomMove = () => {
    if (!state.isPremium && state.dailyMoves.length >= 3) {
      setIsPremiumModalVisible(true);
      return;
    }
    setIsAddingCustomMove(true);
  };

  const handleSaveCustomMove = () => {
    if (!newCustomMoveText.trim()) return;
    const newMove: DailyMove = {
      id: `custom-${Date.now()}`,
      text: newCustomMoveText.trim(),
      completed: false,
      completedAt: null
    };
    setDailyMoves([...state.dailyMoves, newMove]);
    setNewCustomMoveText('');
    setIsAddingCustomMove(false);
    setShowCelebration(true);
  };

  const handleToggleMove = (moveId: string) => {
    toggleMoveComplete(moveId);
    const move = state.dailyMoves.find(m => m.id === moveId);
    if (move && !move.completed) {
      setShowCelebration(true);
    }
  };

  const handleContinueIdentity = () => {
    if (state.currentFocusCycle) {
      setFocusCycle({
        ...state.currentFocusCycle,
        weekStartDate: new Date().toISOString()
      });
      updateState({ lastReflectionDate: state.currentFocusCycle.weekStartDate });
    }
    setIsReflectionVisible(false);
  };

  const handlePivot = () => {
    if (state.currentFocusCycle) {
      updateState({ lastReflectionDate: state.currentFocusCycle.weekStartDate });
    }
    setIsReflectionVisible(false);
    router.push('/(tabs)/becoming');
  };

  const getGreeting = () => {
    if (timeOfDay === 'morning') return 'good morning';
    if (timeOfDay === 'afternoon') return 'good afternoon';
    return 'good evening';
  };

  const completedCount = state.dailyMoves.filter(m => m.completed).length;
  const totalMoves = state.dailyMoves.length;
  const isMorningMode = timeOfDay === 'morning' && !hasDoneMorningSetup;
  const isEveningMode = timeOfDay === 'evening';
  const canEdit = !isEveningMode;

  // Affirmation screen
  if (showAffirmation) {
    return (
      <TouchableOpacity activeOpacity={1} onPress={handleDismissArrival} style={styles.arrivalContainer}>
        <StatusBar barStyle="light-content" />
        <CosmicBackground />
        <Animated.View entering={FadeIn.duration(800)} exiting={FadeOut.duration(500)}>
          <SerifText style={styles.affirmationText}>{COPY.home.affirmationPrompt}</SerifText>
        </Animated.View>
        <Text style={styles.tapToContinue}>tap anywhere</Text>
      </TouchableOpacity>
    );
  }

  // Identity reveal screen
  if (arrivalState === 'showing') {
    return (
      <View style={styles.arrivalContainer}>
        <StatusBar barStyle="light-content" />
        <CosmicBackground />
        <Animated.View entering={FadeIn.duration(800)} exiting={FadeOut.duration(600)} style={{ alignItems: 'center' }}>
          <Text style={styles.arrivalLabel}>your world today</Text>
          <SerifText style={[styles.arrivalIdentity, { color: accentColor }]}>
            "{currentIntention.replace('becoming a woman who ', '').replace('becoming a woman of ', '')}"
          </SerifText>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <CosmicBackground />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.header}>
          <DefaultView style={styles.headerRow}>
            <DefaultView>
              <DefaultView style={styles.greetingRow}>
                <DefaultView style={[styles.planetDot, { backgroundColor: accentColor }]} />
                <Text style={styles.greeting}>{getGreeting()}</Text>
              </DefaultView>
              <SerifText weight="bold" style={styles.intentionText}>
                {currentIntention.replace('becoming a woman who ', '').replace('becoming a woman of ', '')}
              </SerifText>
            </DefaultView>

            {/* Star counter */}
            <DefaultView style={styles.starCounter}>
              <Sparkles size={14} color={Colors.cosmic.stardustGold} />
              <Text style={styles.starCount}>{state.wins?.length || 0}</Text>
            </DefaultView>
          </DefaultView>
        </Animated.View>

        {/* Morning Setup CTA */}
        {isMorningMode && (
          <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.morningCTA}>
            <GlassView intensity={10} style={styles.morningCard}>
              <Text style={styles.morningTitle}>set your flow for today</Text>
              <Text style={styles.morningSubtitle}>
                choose which paths you'll walk before the day begins
              </Text>
            </GlassView>
          </Animated.View>
        )}

        {/* Evening Reflection */}
        {isEveningMode && !hasDoneEveningClose && (
          <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.eveningSection}>
            <GlassView intensity={10} style={styles.eveningCard}>
              <Text style={styles.eveningLabel}>cosmic reflection</Text>
              <SerifText style={styles.eveningPrompt}>
                "{eveningPrompt || "what light did you find today?"}"
              </SerifText>
              <TextInput
                style={styles.reflectionInput}
                placeholder="whisper to the stars..."
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={reflectionText}
                onChangeText={setReflectionText}
                multiline
              />
            </GlassView>
          </Animated.View>
        )}

        {/* Daily Moves */}
        {state.dailyMoves.length > 0 && (
          <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.movesSection}>
            <DefaultView style={styles.movesSectionHeader}>
              <Text style={styles.label}>
                {isEveningMode ? 'your moves today' : COPY.home.sections.move}
              </Text>
              <Text style={styles.moveCount}>{completedCount}/{totalMoves}</Text>
            </DefaultView>

            <View style={styles.movesList}>
              {state.dailyMoves.map((move, index) => {
                const isEditing = editingMoveIndex === index;

                return (
                  <Animated.View
                    key={move.id}
                    entering={FadeInDown.delay(500 + index * 100)}
                    style={[styles.moveCard, move.completed && styles.moveCardDone]}
                  >
                    <TouchableOpacity
                      style={styles.moveContent}
                      onPress={() => !isEveningMode && !move.completed && handleToggleMove(move.id)}
                      disabled={move.completed || isEditing}
                    >
                      <DefaultView style={styles.moveMain}>
                        <DefaultView style={[
                          styles.checkbox,
                          move.completed && { backgroundColor: accentColor, borderColor: accentColor }
                        ]}>
                          {move.completed && <Check size={12} color="#000" />}
                        </DefaultView>

                        {isEditing && canEdit ? (
                          <TextInput
                            style={styles.moveInput}
                            value={tempMoveText}
                            onChangeText={setTempMoveText}
                            autoFocus
                            onBlur={() => handleUpdateMove(index, tempMoveText)}
                            onSubmitEditing={() => handleUpdateMove(index, tempMoveText)}
                          />
                        ) : (
                          <Text style={[styles.moveName, move.completed && styles.moveNameDone]}>
                            {move.text}
                          </Text>
                        )}
                      </DefaultView>

                      {canEdit && !move.completed && !isEditing && (
                        <TouchableOpacity
                          onPress={() => {
                            setEditingMoveIndex(index);
                            setTempMoveText(move.text);
                          }}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <Edit2 size={14} color="#8E8E93" />
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}

              {canEdit && !isAddingCustomMove && (
                <TouchableOpacity style={styles.addMoveButton} onPress={handleAddCustomMove}>
                  <Plus size={16} color="#8E8E93" />
                  <Text style={styles.addMoveText}>add a move</Text>
                </TouchableOpacity>
              )}

              {isAddingCustomMove && (
                <View style={[styles.moveCard, { borderColor: accentColor }]}>
                  <TextInput
                    style={styles.moveInput}
                    placeholder="your next move..."
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={newCustomMoveText}
                    onChangeText={setNewCustomMoveText}
                    autoFocus
                    onBlur={() => !newCustomMoveText.trim() && setIsAddingCustomMove(false)}
                    onSubmitEditing={handleSaveCustomMove}
                  />
                </View>
              )}
            </View>
          </Animated.View>
        )}

        {/* Action Button */}
        {(isMorningMode || (isEveningMode && !hasDoneEveningClose)) && (
          <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.actionSection}>
            <Button
              variant="glow"
              color={Colors.cosmic.stardustGold}
              title={isMorningMode ? 'begin today' : 'close today'}
              onPress={isMorningMode ? handleStartMyDay : handleCloseMyDay}
              size="lg"
            />
          </Animated.View>
        )}

        {/* Completed state */}
        {hasDoneEveningClose && (
          <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.completedSection}>
            <GlassView intensity={10} style={styles.completedCard}>
              <Moon size={28} color={Colors.cosmic.stardustGold} />
              <SerifText style={styles.completedTitle}>day complete ✨</SerifText>
              <Text style={styles.completedSubtitle}>
                {completedCount} stars collected today.
                {'\n'}rest well. tomorrow awaits.
              </Text>
            </GlassView>
          </Animated.View>
        )}
      </ScrollView>

      <CycleReflectionModal
        isVisible={isReflectionVisible}
        onClose={() => setIsReflectionVisible(false)}
        onContinue={handleContinueIdentity}
        onPivot={handlePivot}
        currentIdentity={currentIntention}
        stats={{
          wins: state.wins?.filter(w =>
            state.currentFocusCycle?.weekStartDate &&
            new Date(w.timestamp) >= new Date(state.currentFocusCycle.weekStartDate)
          ).length || 0,
          practices: state.practiceLogs?.filter(l =>
            state.currentFocusCycle?.weekStartDate &&
            new Date(l.timestamp) >= new Date(state.currentFocusCycle.weekStartDate) &&
            l.level !== 'not_today'
          ).length || 0
        }}
      />

      <PremiumModal
        isVisible={isPremiumModalVisible}
        onClose={() => setIsPremiumModalVisible(false)}
        onUpgrade={() => {
          updateState({ isPremium: true });
          setIsPremiumModalVisible(false);
        }}
      />

      <CelebrationEffect
        isVisible={showCelebration}
        onComplete={() => setShowCelebration(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cosmic.deepSpace,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  arrivalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cosmic.deepSpace,
  },
  arrivalLabel: {
    fontSize: 11,
    color: Colors.cosmic.stardustGold,
    letterSpacing: 3,
    textTransform: 'lowercase',
    marginBottom: 16,
  },
  arrivalIdentity: {
    fontSize: 28,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 40,
  },
  affirmationText: {
    fontSize: 22,
    color: '#E8E2D9',
    textAlign: 'center',
    paddingHorizontal: 50,
    lineHeight: 34,
  },
  tapToContinue: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 24,
    opacity: 0.5,
    letterSpacing: 2,
  },

  // Header
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  planetDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  greeting: {
    fontSize: 11,
    color: '#8E8E93',
    letterSpacing: 2,
    textTransform: 'lowercase',
  },
  intentionText: {
    fontSize: 26,
    color: '#FFF',
    lineHeight: 34,
    maxWidth: width - 120,
  },
  starCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  starCount: {
    fontSize: 14,
    color: Colors.cosmic.stardustGold,
    fontWeight: '600',
  },
  label: {
    fontSize: 10,
    color: '#8E8E93',
    letterSpacing: 2,
    textTransform: 'lowercase',
  },

  // Morning CTA
  morningCTA: {
    paddingHorizontal: 24,
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  morningCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  morningTitle: {
    fontSize: 15,
    color: '#FFF',
    marginBottom: 6,
  },
  morningSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 20,
  },

  // Evening
  eveningSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  eveningCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  eveningLabel: {
    fontSize: 10,
    color: Colors.cosmic.stardustGold,
    letterSpacing: 2,
    textTransform: 'lowercase',
    marginBottom: 12,
  },
  eveningPrompt: {
    fontSize: 17,
    color: '#D4CDC3',
    fontStyle: 'italic',
    lineHeight: 26,
    marginBottom: 16,
  },
  reflectionInput: {
    fontSize: 15,
    color: '#FFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 16,
    minHeight: 70,
    textAlignVertical: 'top',
  },

  // Moves
  movesSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  movesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  moveCount: {
    fontSize: 12,
    color: '#6E6E73',
  },
  movesList: {
    gap: 10,
    backgroundColor: 'transparent',
  },
  moveCard: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  moveCardDone: {
    opacity: 0.5,
  },
  moveContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moveMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moveName: {
    fontSize: 15,
    color: '#FFF',
    flex: 1,
  },
  moveNameDone: {
    textDecorationLine: 'line-through',
    color: '#6E6E73',
  },
  moveInput: {
    flex: 1,
    fontSize: 15,
    color: '#FFF',
    padding: 0,
  },
  addMoveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  addMoveText: {
    fontSize: 13,
    color: '#6E6E73',
  },

  // Action Button
  actionSection: {
    paddingHorizontal: 24,
    marginTop: 8,
    backgroundColor: 'transparent',
  },

  // Completed
  completedSection: {
    paddingHorizontal: 24,
    paddingTop: 40,
    backgroundColor: 'transparent',
  },
  completedCard: {
    padding: 36,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  completedTitle: {
    fontSize: 24,
    color: '#FFF',
    marginTop: 16,
    marginBottom: 8,
  },
  completedSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },

});
