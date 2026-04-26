import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Colors, Typography, Spacing} from '../../theme';

const ChildDashboardScreen: React.FC = () => {
  const hasRestrictions = true;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Welcome Section */}
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>Hoş Geldin! 👋</Text>
        <Text style={styles.welcomeSubtitle}>Cihazın güvenli kullanım altında</Text>
      </View>

      {/* Active Restrictions */}
      <Text style={styles.sectionTitle}>Aktif Kısıtlamalar</Text>

      {hasRestrictions ? (
        <>
          {/* Blocked Apps */}
          <View style={styles.restrictionCard}>
            <View style={styles.restrictionHeader}>
              <Text style={styles.blockIcon}>🚫</Text>
              <Text style={styles.restrictionTitle}>Engellenmiş Uygulamalar</Text>
            </View>
            {['TikTok', 'Snapchat'].map(app => (
              <View key={app} style={styles.restrictionItem}>
                <View style={styles.appIcon}>
                  <Text style={styles.appEmoji}>📱</Text>
                </View>
                <Text style={styles.appName}>{app}</Text>
                <Text style={styles.blockedStatus}>Engellendi</Text>
              </View>
            ))}
          </View>

          {/* Time Restrictions */}
          <View style={styles.timeCard}>
            <View style={styles.restrictionHeader}>
              <Text style={styles.blockIcon}>⏰</Text>
              <Text style={styles.timeTitle}>Zaman Kısıtlamaları</Text>
            </View>
            {[
              {app: 'Instagram', time: '09:00 - 17:00', limit: '60 dk'},
              {app: 'YouTube', time: '10:00 - 20:00', limit: '120 dk'},
            ].map(item => (
              <View key={item.app} style={styles.restrictionItem}>
                <View style={styles.appIcon}>
                  <Text style={styles.appEmoji}>📱</Text>
                </View>
                <View style={styles.timeInfo}>
                  <Text style={styles.appName}>{item.app}</Text>
                  <Text style={styles.timeRange}>{item.time}</Text>
                </View>
                <Text style={styles.timeLimit}>{item.limit}</Text>
              </View>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.noRestrictions}>
          <Text style={styles.noRestrictionsIcon}>✅</Text>
          <Text style={styles.noRestrictionsTitle}>Şu anda aktif kısıtlama yok</Text>
          <Text style={styles.noRestrictionsSubtitle}>Tüm uygulamaları serbestçe kullanabilirsin</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {flex: 1, backgroundColor: Colors.background},
  container: {padding: Spacing.screenPadding},
  welcomeCard: {
    backgroundColor: Colors.childPrimary + '15',
    borderRadius: 12,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.childPrimary + '30',
    marginBottom: Spacing.lg,
  },
  welcomeTitle: {
    ...Typography.headlineSmall,
    color: Colors.childPrimary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  welcomeSubtitle: {...Typography.bodyMedium, color: Colors.textSecondary},
  sectionTitle: {...Typography.headlineSmall, fontWeight: '700', marginBottom: Spacing.md},
  restrictionCard: {
    backgroundColor: Colors.error + '10',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.error + '30',
    marginBottom: Spacing.md,
  },
  timeCard: {
    backgroundColor: Colors.warning + '10',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.warning + '30',
    marginBottom: Spacing.md,
  },
  restrictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  blockIcon: {fontSize: 18, marginRight: Spacing.sm},
  restrictionTitle: {
    ...Typography.bodyMedium,
    color: Colors.error,
    fontWeight: '600',
  },
  timeTitle: {
    ...Typography.bodyMedium,
    color: Colors.warning,
    fontWeight: '600',
  },
  restrictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  appIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appEmoji: {fontSize: 16},
  appName: {...Typography.bodyMedium, flex: 1, marginLeft: Spacing.sm},
  blockedStatus: {...Typography.bodySmall, color: Colors.error, fontWeight: '500'},
  timeInfo: {flex: 1, marginLeft: Spacing.sm},
  timeRange: {...Typography.bodySmall, color: Colors.textSecondary},
  timeLimit: {...Typography.bodySmall, color: Colors.warning, fontWeight: '500'},
  noRestrictions: {
    backgroundColor: Colors.success + '10',
    borderRadius: 12,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.success + '30',
    alignItems: 'center',
  },
  noRestrictionsIcon: {fontSize: 48, marginBottom: Spacing.md},
  noRestrictionsTitle: {...Typography.bodyLarge, color: Colors.success, fontWeight: '500'},
  noRestrictionsSubtitle: {...Typography.bodySmall, color: Colors.textSecondary, marginTop: Spacing.xs},
});

export default ChildDashboardScreen;
