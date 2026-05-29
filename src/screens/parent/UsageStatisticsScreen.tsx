import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {Colors, Typography, Spacing} from '../../theme';
import apiClient from '../../api/apiClient';

interface DailySummaryItem {
  app_name: string;
  package_name: string;
  total_minutes: number;
  child_name?: string;
}

const getAppEmoji = (appName: string): string => {
  const name = appName.toLowerCase();
  if (name.includes('instagram')) return '📸';
  if (name.includes('youtube')) return '▶️';
  if (name.includes('whatsapp')) return '💬';
  if (name.includes('brawl stars') || name.includes('game') || name.includes('oyun')) return '🎮';
  if (name.includes('chrome') || name.includes('browser') || name.includes('internet')) return '🌐';
  if (name.includes('tiktok')) return '🎵';
  if (name.includes('snapchat')) return '👻';
  return '📱';
};

const formatMinutes = (totalMin: number): string => {
  if (totalMin < 60) return `${totalMin}dk`;
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  return mins > 0 ? `${hours}s ${mins}dk` : `${hours}s`;
};

const UsageStatisticsScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<DailySummaryItem[]>([]);
  const [totalMinutes, setTotalMinutes] = useState<number>(0);
  const [totalApps, setTotalApps] = useState<number>(0);

  useEffect(() => {
    fetchUsageData();
  }, []);

  const fetchUsageData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/usage/daily-summary');
      if (res.data) {
        setSummary(res.data.summary || []);
        setTotalMinutes(res.data.totalMinutes || 0);
        setTotalApps(res.data.totalApps || 0);
      }
    } catch (error) {
      console.error('İstatistik verisi çekilemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>İstatistikler Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Summary Cards */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, {backgroundColor: Colors.success + '15'}]}>
          <Text style={styles.summaryEmoji}>⏱️</Text>
          <Text style={styles.summaryLabel}>Toplam Süre</Text>
          <Text style={[styles.summaryValue, {color: Colors.success}]}>
            {formatMinutes(totalMinutes)}
          </Text>
        </View>
        <View style={[styles.summaryCard, {backgroundColor: Colors.info + '15'}]}>
          <Text style={styles.summaryEmoji}>📱</Text>
          <Text style={styles.summaryLabel}>Uygulama Sayısı</Text>
          <Text style={[styles.summaryValue, {color: Colors.info}]}>{totalApps}</Text>
        </View>
      </View>

      {/* App Usage List */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Bugün En Çok Kullanılanlar</Text>
        <TouchableOpacity onPress={fetchUsageData} style={styles.refreshBtn}>
          <Text style={styles.refreshText}>Yenile 🔄</Text>
        </TouchableOpacity>
      </View>

      {summary.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>⏳</Text>
          <Text style={styles.emptyTitle}>Henüz Veri Bulunmuyor</Text>
          <Text style={styles.emptySubtitle}>
            Çocuk cihazından kullanım verileri senkronize edildiğinde burada görüntülenecektir.
          </Text>
        </View>
      ) : (
        summary.map((stat, index) => {
          const percentage = totalMinutes > 0 ? (stat.total_minutes / totalMinutes) * 100 : 0;
          return (
            <View key={stat.package_name + index} style={styles.usageItem}>
              <Text style={styles.rank}>#{index + 1}</Text>
              <View style={styles.usageIcon}>
                <Text style={styles.usageEmoji}>{getAppEmoji(stat.app_name)}</Text>
              </View>
              <View style={styles.usageInfo}>
                <View style={styles.appNameRow}>
                  <Text style={styles.usageApp}>{stat.app_name}</Text>
                  {stat.child_name && (
                    <Text style={styles.childBadge}>{stat.child_name}</Text>
                  )}
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {width: `${percentage}%`, backgroundColor: Colors.primary},
                    ]}
                  />
                </View>
              </View>
              <Text style={styles.usageTime}>{formatMinutes(stat.total_minutes)}</Text>
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {flex: 1, backgroundColor: Colors.background},
  container: {padding: Spacing.screenPadding},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background},
  loadingText: {marginTop: Spacing.md, ...Typography.bodyMedium, color: Colors.textSecondary},
  summaryRow: {flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl},
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  summaryEmoji: {fontSize: 24, marginBottom: Spacing.xs},
  summaryLabel: {...Typography.bodySmall, color: Colors.textSecondary},
  summaryValue: {...Typography.headline5, fontWeight: '700', marginTop: Spacing.xs},
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {...Typography.headline6, color: Colors.textPrimary, fontWeight: '700'},
  refreshBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: Colors.greyLight,
  },
  refreshText: {...Typography.bodySmall, color: Colors.textSecondary, fontWeight: '600'},
  usageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.divider,
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
  usageInfo: {flex: 1, marginLeft: Spacing.md, marginRight: Spacing.sm},
  appNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  usageApp: {...Typography.bodyMedium, fontWeight: '600', color: Colors.textPrimary},
  childBadge: {
    ...Typography.caption,
    fontSize: 10,
    backgroundColor: Colors.primary + '15',
    color: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.greyLight,
    borderRadius: 3,
    marginTop: Spacing.xs,
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  usageTime: {...Typography.bodySmall, color: Colors.textSecondary, fontWeight: '600'},
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
    padding: Spacing.xl,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  emptyIcon: {fontSize: 48, marginBottom: Spacing.md},
  emptyTitle: {...Typography.bodyLarge, fontWeight: '700', color: Colors.textPrimary},
  emptySubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
    lineHeight: 18,
  },
});

export default UsageStatisticsScreen;
