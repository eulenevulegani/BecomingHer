import { Button } from '@/components/Button';
import { HerbitItem } from '@/components/HerbitItem'; // New Import
import { GlassView, SerifText, Text, useThemeColor } from '@/components/Themed';
import { BrandBackground } from '@/components/visuals/BrandBackground';
import { CelebrationEffect } from '@/components/visuals/CelebrationEffect';
import { DailyWeaver } from '@/components/visuals/DailyWeaver'; // Added import
import Colors from '@/constants/Colors';
import { MainHerbit, useUser } from '@/context/UserContext';
import { AIService } from '@/lib/AIService';
import { useRouter } from 'expo-router';
import { Plus, Sparkles } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View as DefaultView, Dimensions, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function FlowScreen() {
  const {
    state,
    addHerbit,
    removeHerbit,
    logHerbitCompletion,
    getTodaysHerbits,
    getHerbitStreak,
    getCuratedIdentity
  } = useUser();
  const router = useRouter();
  const primaryColor = useThemeColor({}, 'primary');

  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState(''); // New State
  const [isAddingHerbit, setIsAddingHerbit] = useState(false);
  const [newHerbitText, setNewHerbitText] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState<MainHerbit['schedule']>('daily');
  const [freqCount, setFreqCount] = useState(3);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<MainHerbit['timeOfDay']>('anytime');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [detectedIdentity, setDetectedIdentity] = useState<string | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);

  const todaysHerbits = getTodaysHerbits(selectedDate);
  const todayStr = new Date().toISOString().split('T')[0];

  // Generate week dates
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i - 3); // Center around today
    return {
      full: d.toISOString().split('T')[0],
      day: d.toLocaleString('en-US', { weekday: 'short' }).toLowerCase(),
      date: d.getDate(),
      isToday: d.toISOString().split('T')[0] === todayStr
    };
  });

  // Get completion status for each herbit
  const getHerbitCompletion = (herbitId: string): boolean => {
    return state.herbitLogs.some(
      log => log.herbitId === herbitId && log.date === selectedDate && log.completed
    );
  };

  // Get identity color
  const getIdentityColorLocal = (identityId: string | null) => {
    const { IDENTITY_COLORS } = require('@/constants/Colors');
    if (!identityId) return primaryColor;
    return IDENTITY_COLORS[identityId as keyof typeof IDENTITY_COLORS] || primaryColor;
  };

  // Handle manual herbit add
  const handleAddHerbit = async () => {
    if (!newHerbitText.trim()) return;

    let identity = detectedIdentity;

    // If no manual identity or keyword detection worked, try AI classification
    if (!identity) {
      setIsClassifying(true);
      const { detectIdentityFromText } = require('@/constants/Content');
      identity = detectIdentityFromText(newHerbitText);
      if (!identity) {
        identity = await AIService.classifyHerbit(newHerbitText);
      }
      setIsClassifying(false);
    }

    const newHerbit: MainHerbit = {
      id: `herbit-${Date.now()}`,
      text: newHerbitText.trim(),
      identity,
      schedule: selectedFrequency,
      frequencyCount: selectedFrequency === 'frequency' ? freqCount : undefined,
      frequencyPeriod: selectedFrequency === 'frequency' ? 'week' : undefined,
      timeOfDay: selectedTimeOfDay,
      createdAt: new Date().toISOString(),
      createdVia: 'text'
    };

    addHerbit(newHerbit);
    setNewHerbitText('');
    setDetectedIdentity(null);
    setIsAddingHerbit(false);
    setDetectedIdentity(null);
    setIsAddingHerbit(false);

    // Feedback for creation
    setCelebrationMessage("Intention set.");
    setShowCelebration(true);
  };

  // Effect to auto-detect identity from text via keywords (faster feedback)
  useEffect(() => {
    if (newHerbitText.trim().length > 3) {
      const { detectIdentityFromText } = require('@/constants/Content');
      const identity = detectIdentityFromText(newHerbitText);
      if (identity) {
        setDetectedIdentity(identity);
      }
    }
  }, [newHerbitText]);

  // Handle herbit toggle
  const handleToggleHerbit = (herbitId: string) => {
    const isCompleted = getHerbitCompletion(herbitId);
    const herbit = todaysHerbits.find(h => h.id === herbitId);

    logHerbitCompletion(herbitId, !isCompleted, selectedDate);

    // Only celebrate completion, not un-checking
    if (!isCompleted && herbit) {
      const streak = getHerbitStreak(herbit.id);
      const { FeedbackService } = require('@/lib/FeedbackService');
      const message = FeedbackService.generateFeedback({
        identity: herbit.identity,
        streak: streak + 1, // Anticipate the new streak
        timeOfDay: herbit.timeOfDay || 'anytime', // Use herbit's time or default
        text: herbit.text
      });
      setCelebrationMessage(message);
      setShowCelebration(true);
    }
  };

  const completedCount = todaysHerbits.filter(h => getHerbitCompletion(h.id)).length;
  const totalHerbits = todaysHerbits.length;

  return (
    <DefaultView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <BrandBackground />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <DailyWeaver />
        {/* Calendar Stripe */}
        <DefaultView style={styles.calendarContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarScroll}>
            {weekDates.map((item) => (
              <TouchableOpacity
                key={item.full}
                onPress={() => setSelectedDate(item.full)}
                style={[
                  styles.dateCard,
                  selectedDate === item.full && styles.dateCardActive
                ]}
              >
                <Text style={[styles.dateDay, selectedDate === item.full && styles.dateTextActive]}>
                  {item.day}
                </Text>
                <Text style={[styles.dateNumber, selectedDate === item.full && styles.dateTextActive]}>
                  {item.date}
                </Text>
                {item.isToday && <DefaultView style={styles.todayIndicator} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </DefaultView>

        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
          <SerifText weight="regular" style={styles.identityMantra}>
            {getCuratedIdentity().name}
          </SerifText>
          <DefaultView style={styles.progressRow}>
            <Text style={styles.tagline}>
              {completedCount}/{totalHerbits} herbits {selectedDate === todayStr ? 'today' : 'on ' + selectedDate.split('-').slice(1).join('/')}
            </Text>
          </DefaultView>
        </Animated.View>

        {/* Herbits List */}
        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.herbitsSection}>
          <DefaultView style={styles.herbitsList}>
            {todaysHerbits.length === 0 ? (
              <GlassView intensity={10} style={styles.emptyCard}>
                <Sparkles size={32} color={Colors.brand.primary} />
                <Text style={styles.emptyText}>no herbits yet</Text>
                <Text style={styles.emptyHint}>
                  type to add your first herbit
                </Text>
              </GlassView>
            ) : (
              todaysHerbits.map((herbit, index) => {
                const isCompleted = getHerbitCompletion(herbit.id);
                const identityColor = getIdentityColorLocal(herbit.identity);
                const streak = getHerbitStreak(herbit.id);

                return (
                  <HerbitItem
                    key={herbit.id}
                    index={index}
                    herbit={herbit}
                    isCompleted={isCompleted}
                    identityColor={identityColor}
                    streak={streak}
                    onToggle={() => handleToggleHerbit(herbit.id)}
                    onDelete={() => removeHerbit(herbit.id)}
                  />
                );
              })
            )}

            {/* Add Herbit Button */}
            {!isAddingHerbit ? (
              <TouchableOpacity onPress={() => setIsAddingHerbit(true)}>
                <GlassView intensity={5} style={styles.addHerbitButton}>
                  <Plus size={16} color={Colors.brand.textMuted} />
                  <Text style={styles.addHerbitText}>add herbit</Text>
                </GlassView>
              </TouchableOpacity>
            ) : (
              <Animated.View entering={FadeInDown.delay(100).springify()}>
                <GlassView intensity={15} style={styles.addHerbitCard}>
                  <TextInput
                    style={styles.herbitInput}
                    placeholder="what will you practice?"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={newHerbitText}
                    onChangeText={setNewHerbitText}
                    autoFocus
                    onSubmitEditing={handleAddHerbit}
                  />

                  <DefaultView style={styles.addHerbitActions}>
                    <DefaultView style={styles.classifyingInfo}>
                      {isClassifying && (
                        <>
                          <ActivityIndicator size="small" color={primaryColor} />
                          <Text style={styles.classifyingText}>classifying...</Text>
                        </>
                      )}
                    </DefaultView>
                    <TouchableOpacity
                      onPress={() => {
                        setIsAddingHerbit(false);
                        setDetectedIdentity(null);
                        setNewHerbitText('');
                      }}
                      style={styles.cancelButton}
                    >
                      <Text style={styles.cancelText}>cancel</Text>
                    </TouchableOpacity>
                    <Button
                      variant="glow"
                      title="add"
                      onPress={handleAddHerbit}
                      color={primaryColor}
                      size="sm"
                      disabled={isClassifying}
                    />
                  </DefaultView>
                </GlassView>
              </Animated.View>
            )}
          </DefaultView>
        </Animated.View>


      </ScrollView>

      <CelebrationEffect
        isVisible={showCelebration}
        message={celebrationMessage}
        onComplete={() => setShowCelebration(false)}
      />
    </DefaultView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header
  header: {
    paddingTop: 20,
    paddingHorizontal: 24,
    marginBottom: 40,
    alignItems: 'center',
  },
  calendarContainer: {
    paddingTop: 60,
    paddingBottom: 10,
  },
  calendarScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  dateCard: {
    width: 60,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  dateCardActive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: Colors.brand.primary + '40',
  },
  dateDay: {
    fontSize: 10,
    color: '#8E8E93',
    textTransform: 'lowercase',
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFF',
  },
  dateTextActive: {
    color: Colors.brand.primary,
  },
  todayIndicator: {
    position: 'absolute',
    bottom: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.brand.primary,
  },
  identityMantra: {
    fontSize: 28,
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagline: {
    fontSize: 12,
    color: Colors.brand.primary,
    letterSpacing: 1,
    textTransform: 'lowercase',
  },

  // Voice Section
  voiceSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  voiceHint: {
    fontSize: 12,
    color: '#6E6E73',
    marginTop: 12,
    letterSpacing: 1,
  },

  // Habits
  herbitsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  herbitsList: {
    gap: 12,
  },
  herbitCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  herbitCardDone: {
    opacity: 0.7,
  },
  herbitContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  deleteButton: {
    padding: 8,
  },

  // Empty State
  emptyCard: {
    padding: 48,
    borderRadius: 24,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    color: '#FFF',
  },
  emptyHint: {
    fontSize: 13,
    color: '#6E6E73',
    textAlign: 'center',
  },

  // Add Herbit
  addHerbitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  addHerbitText: {
    fontSize: 13,
    color: '#6E6E73',
  },
  addHerbitCard: {
    padding: 20,
    borderRadius: 20,
    gap: 16,
  },
  herbitInput: {
    fontSize: 16,
    color: '#FFF',
    padding: 0,
    marginBottom: 8,
  },
  frequencyRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  frequencyAdjustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  nButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  nText: {
    fontSize: 13,
    color: '#FFF',
  },
  timesText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  timeOfDayRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  timeButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 11,
    color: '#8E8E93',
    textTransform: 'lowercase',
  },
  freqButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  freqText: {
    fontSize: 11,
    color: '#8E8E93',
    textTransform: 'lowercase',
  },
  addHerbitActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 16,
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    fontSize: 13,
    color: '#6E6E73',
  },
  pillarRow: {
    marginBottom: 4,
  },
  classifyingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  classifyingText: {
    fontSize: 11,
    color: '#8E8E93',
    fontStyle: 'italic',
  },

  // Actions
  actionsSection: {
    paddingHorizontal: 24,
  },
});
