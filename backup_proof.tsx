import { GlassView, SerifText, Text, useThemeColor, View } from '@/components/Themed';
import { AuraBackground } from '@/components/visuals/AuraBackground';
import { useUser } from '@/context/UserContext';
import React from 'react';
import { FlatList, StatusBar, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ProofScreen() {
  const { state } = useUser();
  const primaryColor = useThemeColor({}, 'primary');

  // Calculate metrics
  const totalPractices = (state.practiceLogs || []).filter(log => log.level !== 'not_today').length;

  const getWeekNumber = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  const returningWeeks = new Set([
    ...state.practiceLogs.map(log => `${new Date(log.timestamp).getFullYear()}-W${getWeekNumber(new Date(log.timestamp))}`),
    ...state.wins.map(win => `${new Date(win.timestamp).getFullYear()}-W${getWeekNumber(new Date(win.timestamp))}`)
  ]).size;

  const renderItem = ({ item, index }: { item: any, index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()} style={styles.gridItem}>
      <GlassView intensity={15} style={styles.proofCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.date}>{new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
        </View>
        <SerifText style={styles.winText}>{item.text}</SerifText>
      </GlassView>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AuraBackground />

      <FlatList
        data={state.wins}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={1}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.label}>evidence</Text>
              <SerifText weight="bold" style={styles.title}>proof</SerifText>
              <Text style={styles.subtitle}>Success is returning, not finishing.</Text>
            </View>

            <View style={styles.metricsContainer}>
              <GlassView intensity={10} style={styles.metricCard}>
                <SerifText style={styles.metricValue}>{totalPractices}</SerifText>
                <Text style={styles.metricLabel}>times practiced</Text>
              </GlassView>
              <GlassView intensity={10} style={styles.metricCard}>
                <SerifText style={styles.metricValue}>{returningWeeks}</SerifText>
                <Text style={styles.metricLabel}>weeks returned</Text>
              </GlassView>
            </View>

            <Text style={styles.sectionLabel}>what counted lately</Text>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>no proof yet. that’s okay.</Text>
          </View>
        }
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
    paddingTop: 80,
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
    fontSize: 32,
    color: '#FFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
    marginTop: 8,
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 48,
    backgroundColor: 'transparent',
  },
  metricCard: {
    flex: 1,
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  metricValue: {
    fontSize: 32,
    color: '#FFF',
  },
  metricLabel: {
    fontSize: 10,
    color: '#8E8E93',
    textTransform: 'lowercase',
    letterSpacing: 1,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 16,
    textTransform: 'lowercase',
  },
  listContent: {
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  gridItem: {
    width: '100%',
    marginBottom: 16,
  },
  proofCard: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  date: {
    fontSize: 10,
    color: '#8E8E93',
    letterSpacing: 1,
    textTransform: 'lowercase',
  },
  winText: {
    fontSize: 18,
    color: '#FFF',
    lineHeight: 26,
  },
  emptyContainer: {
    marginTop: 40,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
});
