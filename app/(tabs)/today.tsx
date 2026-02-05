import { SerifText, Text, useThemeColor, View } from '@/components/Themed';
import { ActiveOrb } from '@/components/visuals/ActiveOrb';
import { AuraBackground } from '@/components/visuals/AuraBackground';
import { CelebrationEffect } from '@/components/visuals/CelebrationEffect';
import { CycleReflectionModal } from '@/components/visuals/CycleReflectionModal';
import { PremiumModal } from '@/components/visuals/PremiumModal';
import { PracticeLog, useUser, Win } from '@/context/UserContext';
import { COPY } from '@/lib/copy';
import { useRouter } from 'expo-router';
import { Check, Edit2, Plus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function TodayScreen() {
  const { state, logPractice, setFocusCycle, updateState, addWin } = useUser();
  const router = useRouter();
  const primaryColor = useThemeColor({}, 'primary');

  const [showAffirmation, setShowAffirmation] = useState(true);
  const [arrivalState, setArrivalState] = useState<'none' | 'showing'>('none');
  const [isReflectionVisible, setIsReflectionVisible] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [proofText, setProofText] = useState('');
  const [editingPracticeIndex, setEditingPracticeIndex] = useState<number | null>(null);
  const [tempPracticeText, setTempPracticeText] = useState('');
  const [isAddingCustomMove, setIsAddingCustomMove] = useState(false);
  const [newCustomMoveText, setNewCustomMoveText] = useState('');
  const [isPremiumModalVisible, setIsPremiumModalVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAffirmation(false);
      setArrivalState('showing');
      // After 2 seconds of arrival, move to main app
      setTimeout(() => setArrivalState('none'), 2200);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // Check for end of week cycle
  useEffect(() => {
    if (state.currentFocusCycle?.weekStartDate) {
      const startDate = new Date(state.currentFocusCycle.weekStartDate);
      const now = new Date();
      const diffDays = (now.getTime() - startDate.getTime()) / (1000 * 3600 * 24);

      // If it's been 7+ days and we haven't reflected on this specific start date yet
      if (diffDays >= 7 && state.lastReflectionDate !== state.currentFocusCycle.weekStartDate) {
        setIsReflectionVisible(true);
      }
    }
  }, [state.currentFocusCycle?.weekStartDate, state.lastReflectionDate]);

  const handleMarkProof = (text?: string) => {
    const finalProof = text || proofText;
    if (!finalProof.trim()) return;

    const proof: Win = {
      id: Math.random().toString(36).substr(2, 9),
      text: finalProof,
      type: 'text',
      timestamp: new Date().toISOString()
    };
    addWin(proof);
    setProofText('');
    setShowCelebration(true);
  };

  const handleUpdatePractice = (index: number, newText: string) => {
    if (!state.currentFocusCycle) return;
    const newPractices = [...state.currentFocusCycle.practices];
    newPractices[index] = newText;
    setFocusCycle({
      ...state.currentFocusCycle,
      practices: newPractices
    });
    setEditingPracticeIndex(null);
  };

  const handleAddCustomMove = () => {
    if (!state.isPremium) {
      setIsPremiumModalVisible(true);
      return;
    }
    setIsAddingCustomMove(true);
  };

  const handleSaveCustomMove = () => {
    if (!newCustomMoveText.trim() || !state.currentFocusCycle) return;

    const newPractices = [...state.currentFocusCycle.practices, newCustomMoveText.trim()];
    setFocusCycle({
      ...state.currentFocusCycle,
      practices: newPractices
    });
    setNewCustomMoveText('');
    setIsAddingCustomMove(false);
    setShowCelebration(true);
  };

  const handleLogPractice = (practice: string, level: PracticeLog['level']) => {
    logPractice({
      id: Math.random().toString(36).substr(2, 9),
      practice,
      level,
      timestamp: new Date().toISOString()
    });
    if (level === 'yes') {
      setShowCelebration(true);
    }
  };

  const handleContinueIdentity = () => {
    if (state.currentFocusCycle) {
      // Refresh the week start date to now to start a new 7-day cycle
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

  const currentFocusCycle = state.currentFocusCycle;
  const currentIntention = currentFocusCycle?.intention || "becoming someone who trusts herself";
  const recentWin = (state.wins && state.wins[0]) ? state.wins[0].text : COPY.home.emptyProof;

  if (showAffirmation) {
    return (
      <View style={styles.arrivalContainer}>
        <StatusBar barStyle="light-content" />
        <AuraBackground />
        <Animated.View entering={FadeIn.duration(1200)} exiting={FadeOut.duration(800)}>
          <SerifText style={styles.affirmationText}>{COPY.home.affirmationPrompt}</SerifText>
        </Animated.View>
      </View>
    );
  }

  if (arrivalState === 'showing') {
    return (
      <View style={styles.arrivalContainer}>
        <StatusBar barStyle="light-content" />
        <AuraBackground />
        <Animated.View entering={FadeIn.duration(800)} exiting={FadeOut.duration(600)} style={{ alignItems: 'center' }}>
          <Text style={styles.arrivalLabel}>Today you are</Text>
          <SerifText style={styles.arrivalIdentity}>“{currentIntention}”</SerifText>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AuraBackground />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Text style={styles.label}>{COPY.home.sections.today}</Text>
            <SerifText weight="bold" style={styles.intentionText}>
              “{currentIntention}”
            </SerifText>
          </Animated.View>
        </View>

        <View style={styles.orbWrapper}>
          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <ActiveOrb
              title="What counted today?"
              momentum="gentle"
              onPress={() => handleMarkProof()}
            />
          </Animated.View>
        </View>

        {currentFocusCycle && currentFocusCycle.practices.length > 0 && (
          <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.practicesSection}>
            <Text style={styles.label}>{COPY.home.sections.move}</Text>

            <View style={styles.practicesList}>
              {currentFocusCycle.practices.map((practice, index) => {
                const isDone = state.practiceLogs?.some(log =>
                  log.practice === practice &&
                  new Date(log.timestamp).toDateString() === new Date().toDateString() &&
                  log.level === 'yes'
                );

                const isEditing = editingPracticeIndex === index;

                return (
                  <View key={index} style={[styles.practiceCard, isDone && { borderColor: primaryColor }]}>
                    <TouchableOpacity
                      style={styles.practiceContent}
                      onPress={() => !isDone && !isEditing && handleLogPractice(practice, 'yes')}
                      disabled={isDone || isEditing}
                    >
                      <View style={styles.practiceTextRow}>
                        {isEditing ? (
                          <TextInput
                            style={styles.practiceInput}
                            value={tempPracticeText}
                            onChangeText={setTempPracticeText}
                            autoFocus
                            onBlur={() => handleUpdatePractice(index, tempPracticeText)}
                            onSubmitEditing={() => handleUpdatePractice(index, tempPracticeText)}
                          />
                        ) : (
                          <Text style={[styles.practiceName, isDone && { opacity: 0.6 }]}>{practice}</Text>
                        )}
                        <View style={styles.practiceActions}>
                          {!isDone && !isEditing && (
                            <TouchableOpacity onPress={() => {
                              setEditingPracticeIndex(index);
                              setTempPracticeText(practice);
                            }}>
                              <Edit2 size={14} color="#8E8E93" />
                            </TouchableOpacity>
                          )}
                          {isDone && <Check size={16} color={primaryColor} />}
                        </View>
                      </View>
                      {!isDone && !isEditing && (
                        <Text style={styles.tapToMark}>tap to mark as done</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}

              {isAddingCustomMove ? (
                <View style={[styles.practiceCard, { borderColor: primaryColor, borderStyle: 'solid' }]}>
                  <TextInput
                    style={styles.practiceInput}
                    placeholder="Type your new move..."
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={newCustomMoveText}
                    onChangeText={setNewCustomMoveText}
                    autoFocus
                    onBlur={() => {
                      if (!newCustomMoveText.trim()) setIsAddingCustomMove(false);
                    }}
                    onSubmitEditing={handleSaveCustomMove}
                  />
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.customMoveButton}
                  onPress={handleAddCustomMove}
                >
                  <Plus size={16} color="#8E8E93" />
                  <Text style={styles.customMoveText}>something else?</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(450).springify()} style={styles.proofSection}>
          <Text style={[styles.label, { paddingHorizontal: 40, marginBottom: 12 }]}>What felt like proof?</Text>
          <View style={styles.proofInputWrapper}>
            <TextInput
              style={styles.proofInput}
              placeholder="Record a small win or moment of grace..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={proofText}
              onChangeText={setProofText}
              multiline
            />
            {proofText.length > 0 && (
              <TouchableOpacity
                style={[styles.proofSubmit, { backgroundColor: primaryColor }]}
                onPress={() => handleMarkProof()}
              >
                <Check size={16} color="#000" />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.winSection}>
          <Text style={styles.label}>{COPY.home.sections.proof}</Text>
          <SerifText style={styles.recentWinText}>
            {recentWin}
          </SerifText>
        </Animated.View>
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
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingBottom: 60,
  },
  arrivalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  arrivalLabel: {
    fontSize: 12,
    color: '#8E8E93',
    letterSpacing: 2,
    textTransform: 'lowercase',
    marginBottom: 12,
  },
  arrivalIdentity: {
    fontSize: 24,
    color: '#EAE5DF',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 36,
    fontStyle: 'italic',
  },
  affirmationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  affirmationText: {
    fontSize: 20,
    color: '#EAE5DF',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 32,
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 40,
    backgroundColor: 'transparent',
    marginBottom: 16,
  },
  label: {
    fontSize: 10,
    color: '#8E8E93',
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: 'lowercase',
  },
  intentionText: {
    fontSize: 22,
    color: '#FFF',
    lineHeight: 30,
    fontStyle: 'italic',
  },
  orbWrapper: {
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  proofSection: {
    marginBottom: 32,
  },
  proofInputWrapper: {
    marginHorizontal: 40,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  proofInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFF',
    lineHeight: 24,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  proofSubmit: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionChipText: {
    fontSize: 12,
    color: '#D4CDC3',
  },
  practiceContent: {
    flex: 1,
  },
  practiceActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  practiceInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFF',
    padding: 0,
    height: 24,
  },
  practicesSection: {
    paddingHorizontal: 40,
    marginBottom: 32,
    backgroundColor: 'transparent',
  },
  practiceSub: {
    fontSize: 13,
    color: '#D4CDC3',
    fontStyle: 'italic',
    marginBottom: 16,
    opacity: 0.6,
  },
  practicesList: {
    gap: 12,
    backgroundColor: 'transparent',
  },
  practiceCard: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  practiceName: {
    fontSize: 16,
    color: '#FFF',
  },
  practiceTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tapToMark: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 4,
    opacity: 0.6,
  },
  customMoveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.1)',
    marginTop: 8,
  },
  customMoveText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  winSection: {
    width: '100%',
    paddingHorizontal: 40,
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  recentWinText: {
    fontSize: 16,
    color: '#D4CDC3',
    lineHeight: 24,
    opacity: 0.8,
  },
});


