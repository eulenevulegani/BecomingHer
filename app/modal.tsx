import { Button } from '@/components/Button';
import { SerifText, Text, useThemeColor, View } from '@/components/Themed';
import { BrandBackground } from '@/components/visuals/BrandBackground';
import { CelebrationEffect } from '@/components/visuals/CelebrationEffect';
import { BECOMING_PROMPTS } from '@/constants/Content';
import { useUser, Win } from '@/context/UserContext';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, StatusBar, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function WinRecordingModal() {
  const { addWin } = useUser();
  const router = useRouter();
  const primaryColor = useThemeColor({}, 'primary');
  const [winText, setWinText] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  const handleSaveWin = () => {
    if (winText.trim().length === 0) return;

    const newWin: Win = {
      id: Math.random().toString(36).substr(2, 9),
      text: winText,
      type: 'text',
      timestamp: new Date().toISOString()
    };

    addWin(newWin);
    setShowCelebration(true);

    // Give time for celebration to start before going back
    setTimeout(() => {
      router.back();
    }, 1000);
  };

  const placeholders = BECOMING_PROMPTS.placeholders;
  const randomPlaceholder = React.useMemo(() => {
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <BrandBackground />

      <Animated.View entering={FadeIn.delay(200)} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <X size={24} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(300).springify()}
        style={styles.content}
      >
        <Text style={styles.label}>acknowledgment</Text>
        <SerifText weight="bold" style={styles.title}>
          {BECOMING_PROMPTS.win}
        </SerifText>
        <Text style={styles.subtitle}>
          Inner effort counts as much as visible action.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={randomPlaceholder}
            placeholderTextColor="#8E8E93"
            multiline
            autoFocus
            value={winText}
            onChangeText={setWinText}
            maxLength={140}
          />
        </View>

        <View style={styles.actions}>
          <Button
            title="let it count"
            onPress={handleSaveWin}
            variant="glow"
            color={primaryColor}
            disabled={winText.trim().length === 0}
            style={styles.saveButton}
          />
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelText}>maybe later</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

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
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 10,
    color: '#8E8E93',
    letterSpacing: 2,
    marginBottom: 12,
    textTransform: 'lowercase',
  },
  title: {
    fontSize: 28,
    color: '#FFF',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#D4CDC3',
    fontStyle: 'italic',
    opacity: 0.8,
    marginBottom: 40,
  },
  inputContainer: {
    minHeight: 120,
    backgroundColor: 'transparent',
  },
  input: {
    fontSize: 20,
    color: '#FFF',
    fontFamily: 'PlayfairDisplay_400Regular',
    lineHeight: 30,
  },
  actions: {
    marginTop: 'auto',
    marginBottom: 60,
    gap: 20,
    backgroundColor: 'transparent',
  },
  saveButton: {
    width: '100%',
  },
  cancelButton: {
    width: '100%',
    alignItems: 'center',
    padding: 12,
  },
  cancelText: {
    fontSize: 14,
    color: '#8E8E93',
    letterSpacing: 1,
  },
});
