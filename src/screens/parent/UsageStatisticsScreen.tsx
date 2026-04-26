import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Colors, Typography, Spacing} from '../../theme';

const UsageStatisticsScreen: React.FC = () => {
  const mockStats = [
    {app: 'Instagram', time: '2s 15dk', emoji: '📸'},
    {app: 'YouTube', time: '1s 45dk', emoji: '▶️'},
    {app: 'WhatsApp', time: '1s 20dk', emoji: '💬'},
    {app: 'TikTok', time: '50dk', emoji: '🎵'},
    {app: 'Chrome', time: '30dk', emoji: '🌐'},
  ];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Summary Cards */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, {backgroundColor: Colors.success + '15'}]}>
          <Text style={styles.summaryEmoji}>⏱️</Text>
          <Text style={styles.summaryLabel}>Toplam Süre</Text>
          <Text style={[styles.summaryValue, {color: Colors.success}]}>6s 40dk</Text>
        </View>
        <View style={[styles.summaryCard, {backgroundColor: Colors.info + '15'}]}>
          <Text style={styles.summaryEmoji}>📱</Text>
          <Text style={styles.summaryLabel}>Uygulama Sayısı</Text>
          <Text style={[styles.summaryValue, {color: Colors.info}]}>5</Text>
        </View>
      </View>

      {/* App Usage List */}
      <Text style={styles.sectionTitle}>En Çok Kullanılan Uygulamalar</Text>
      {mockStats.map((stat, index) => (
        <View key={stat.app} style={styles.usageItem}>
          <Text style={styles.rank}>#{index + 1}</Text>
          <View style={styles.usageIcon}>
            <Text style={styles.usageEmoji}>{stat.emoji}</Text>
          </View>
          <View style={styles.usageInfo}>
            <Text style={styles.usageApp}>{stat.app}</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {width: `${(5 - index) * 20}%`},
                ]}
              />
            </View>
          </View>
          <Text style={styles.usageTime}>{stat.time}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {flex: 1, backgroundColor: Colors.background},
  container: {padding: Spacing.screenPadding},
  summaryRow: {flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl},
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
  },
  summaryEmoji: {fontSize: 24, marginBottom: Spacing.xs},
  summaryLabel: {...Typography.bodySmall, color: Colors.textSecondary},
  summaryValue: {...Typography.headline5, fontWeight: '700', marginTop: Spacing.xs},
  sectionTitle: {...Typography.headline6, marginBottom: Spacing.md},
  usageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    elevation: 1,
  },
  rank: {...Typography.bodyMedium, color: Colors.textSecondary, fontWeight: '700', width: 30},
  usageIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  usageEmoji: {fontSize: 20},
  usageInfo: {flex: 1, marginLeft: Spacing.md},
  usageApp: {...Typography.bodyMedium, fontWeight: '600'},
  progressBar: {
    height: 6,
    backgroundColor: Colors.greyLight,
    borderRadius: 3,
    marginTop: Spacing.xs,
  },
  progressFill: {
    height: 6,
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  usageTime: {...Typography.bodySmall, color: Colors.textSecondary, fontWeight: '500'},
});

export default UsageStatisticsScreen;
