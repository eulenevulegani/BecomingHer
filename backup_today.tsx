import { SerifText, Text, useThemeColor, View } from '@/components/Themed';
import { ActiveOrb } from '@/components/visuals/ActiveOrb';
import { AuraBackground } from '@/components/visuals/AuraBackground';
import { PracticeLog, useUser } from '@/context/UserContext';
import { COPY } from '@/lib/copy';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function TodayScreen() {
  const { state, logPractice } = useUser();
  const router = useRouter();
  const primaryColor = useThemeColor({}, 'primary');

  const [showAffirmation, setShowAffirmation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowAffirmation(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleMarkWin = () => {
    router.push({
      pathname: '/modal',
      params: { type: 'win' }
    });
  };

  const handleLogPractice = (practice: string, level: PracticeLog['level']) => {
    logPractice({
      id: Math.random().toString(36).substr(2, 9),
      practice,
      level,
      timestamp: new Date().toISOString()
    });
  };

  const currentFocusCycle = state.currentFocusCycle;
  const currentIntention = currentFocusCycle?.intention || "becoming someone who trusts herself";
  const recentWin = (state.wins && state.wins[0]) ? state.wins[0].text : COPY.home.emptyProof;

  if (showAffirmation) {
    return (
      <View style={styles.affirmationContainer}>
        <StatusBar barStyle="light-content" />
        <AuraBackground />
        <Animated.View entering={FadeIn.duration(1200)} exiting={FadeOut.duration(800)}>
          <SerifText style={styles.affirmationText}>{COPY.home.affirmationPrompt}</SerifText>
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
              onPress={handleMarkWin}
            />
          </Animated.View>
        </View>

        {currentFocusCycle && currentFocusCycle.practices.length > 0 && (
          <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.practicesSection}>
            <Text style={styles.label}>your practices</Text>
            <Text style={styles.practiceSub}>Did you practice any of these today?</Text>

            <View style={styles.practicesList}>
              {currentFocusCycle.practices.map((practice, index) => (
                <View key={index} style={styles.practiceCard}>
                  <Text style={styles.practiceName}>{practice}</Text>
                  <View style={styles.practiceActions}>
                    <TouchableOpacity
                      onPress={() => handleLogPractice(practice, 'yes')}
                      style={styles.actionButton}
                    >
                      <Text style={styles.actionText}>yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleLogPractice(practice, 'little')}
                      style={styles.actionButton}
                    >
                      <Text style={styles.actionText}>a little</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleLogPractice(practice, 'not_today')}
                      style={styles.actionButton}
                    >
                      <Text style={styles.actionText}>not today</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.winSection}>
          <Text style={styles.label}>{COPY.home.sections.proof}</Text>
          <SerifText style={styles.recentWinText}>
            {recentWin}
          </SerifText>
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
  scrollContent: {
    paddingBottom: 100,
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
    paddingTop: 80,
    paddingHorizontal: 40,
    backgroundColor: 'transparent',
    marginBottom: 40,
  },
  label: {
    fontSize: 10,
    color: '#8E8E93',
    letterSpacing: 2,
    marginBottom: 12,
    textTransform: 'lowercase',
  },
  intentionText: {
    fontSize: 28,
    color: '#FFF',
    lineHeight: 38,
    fontStyle: 'italic',
  },
  orbWrapper: {
    alignItems: 'center',
    marginBottom: 60,
    backgroundColor: 'transparent',
  },
  practicesSection: {
    paddingHorizontal: 40,
    marginBottom: 60,
    backgroundColor: 'transparent',
  },
  practiceSub: {
    fontSize: 14,
    color: '#D4CDC3',
    fontStyle: 'italic',
    marginBottom: 20,
    opacity: 0.6,
  },
  practicesList: {
    gap: 16,
    backgroundColor: 'transparent',
  },
  practiceCard: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  practiceName: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 16,
  },
  practiceActions: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'transparent',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  actionText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  winSection: {
    width: '100%',
    paddingHorizontal: 40,
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  recentWinText: {
    fontSize: 18,
    color: '#D4CDC3',
    lineHeight: 26,
    opacity: 0.8,
  },
});


