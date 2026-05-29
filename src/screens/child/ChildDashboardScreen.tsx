import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Colors, Typography, Spacing} from '../../theme';
import apiClient from '../../api/apiClient';
import {authService} from '../../services/authService';

interface AppUsageItem {
  name: string;
  package: string;
  minutes: number;
  emoji: string;
  limit: number;
}

const ChildDashboardScreen: React.FC = () => {
  const [userName, setUserName] = useState<string>('Çocuk');
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [blockedApps, setBlockedApps] = useState<any[]>([]);
  const [timeLimits, setTimeLimits] = useState<any[]>([]);

  // Simulated App Usages
  const [usages, setUsages] = useState<AppUsageItem[]>([
    {name: 'Instagram', package: 'com.instagram.android', minutes: 25, emoji: '📸', limit: 60},
    {name: 'YouTube', package: 'com.google.android.youtube', minutes: 45, emoji: '▶️', limit: 120},
    {name: 'WhatsApp', package: 'com.whatsapp', minutes: 15, emoji: '💬', limit: 90},
    {name: 'Brawl Stars', package: 'com.supercell.brawlstars', minutes: 30, emoji: '🎮', limit: 45},
    {name: 'Chrome', package: 'com.android.chrome', minutes: 10, emoji: '🌐', limit: 30},
  ]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Fetch user profile
      const user = await authService.getUser();
      if (user && user.name) {
        setUserName(user.name);
      }

      // Fetch active block rules
      const blockRes = await apiClient.get('/rules/block');
      if (blockRes.data && blockRes.data.rules) {
        setBlockedApps(blockRes.data.rules);
      }

      // Fetch active time restrictions
      const timeRes = await apiClient.get('/rules/time-restrictions');
      if (timeRes.data && timeRes.data.restrictions) {
        setTimeLimits(timeRes.data.restrictions);
      }
    } catch (error) {
      console.error('Veri çekme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  // Simulated time adjustments (+/- minutes)
  const adjustMinutes = (index: number, amount: number) => {
    setUsages(prev =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        const newMinutes = Math.max(0, item.minutes + amount);
        return {...item, minutes: newMinutes};
      })
    );
  };

  // Sync today's usage stats to the parent via Backend API
  const handleSyncUsage = async () => {
    try {
      setSyncing(true);
      const today = new Date().toISOString().split('T')[0];

      // POST each usage stat to backend sequentially/concurrently
      const promises = usages.map(item =>
        apiClient.post('/usage/stats', {
          app_name: item.name,
          package_name: item.package,
          usage_minutes: item.minutes,
          usage_date: today,
        })
      );

      await Promise.all(promises);

      Alert.alert(
        'Başarılı 🎉',
        'Uygulama kullanım istatistikleriniz başarıyla ebeveyn kontrol paneline aktarıldı!',
        [{text: 'Harika'}]
      );
    } catch (error: any) {
      console.error('Senkronizasyon hatası:', error);
      Alert.alert(
        'Eşitleme Başarısız',
        error.response?.data?.message || 'Lütfen cihazınızın internet bağlantısını kontrol edip tekrar deneyin.'
      );
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.childPrimary} />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Welcome Card with Gradient Aesthetic */}
      <View style={styles.welcomeCard}>
        <View style={styles.welcomeInfo}>
          <Text style={styles.welcomeTitle}>Hoş Geldin, {userName}! 👋</Text>
          <Text style={styles.welcomeSubtitle}>Cihazın güvende ve ebeveyn koruması altında.</Text>
        </View>
        <Text style={styles.welcomeAvatar}>👧</Text>
      </View>

      {/* Dynamic App Usage Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Bugünkü Uygulama Kullanım Süren</Text>
          <Text style={styles.cardSubtitle}>
            Sürelerini artırmak/azaltmak için butonları kullan ve ebeveynine aktar.
          </Text>
        </View>

        {usages.map((item, index) => {
          const isOverLimit = item.minutes >= item.limit;
          const ratio = Math.min(1, item.minutes / item.limit);

          return (
            <View key={item.package} style={styles.usageRow}>
              <View style={styles.appIconContainer}>
                <Text style={styles.appIconEmoji}>{item.emoji}</Text>
              </View>

              <View style={styles.usageMain}>
                <View style={styles.usageTextRow}>
                  <Text style={styles.appName}>{item.name}</Text>
                  <Text style={[styles.appTimeText, isOverLimit && styles.textError]}>
                    {item.minutes} dk / {item.limit} dk
                  </Text>
                </View>

                {/* Progress Bar Container */}
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${ratio * 100}%`,
                        backgroundColor: isOverLimit ? Colors.error : Colors.childPrimary,
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Incremental Adjustment Buttons for Simulation */}
              <View style={styles.adjustmentControls}>
                <TouchableOpacity
                  style={styles.adjustBtn}
                  onPress={() => adjustMinutes(index, -5)}>
                  <Text style={styles.adjustBtnText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.adjustBtn, styles.adjustBtnPlus]}
                  onPress={() => adjustMinutes(index, 5)}>
                  <Text style={[styles.adjustBtnText, styles.adjustBtnTextPlus]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* Sync Button */}
        <TouchableOpacity
          style={[styles.syncButton, syncing && styles.syncButtonDisabled]}
          onPress={handleSyncUsage}
          disabled={syncing}>
          {syncing ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              <Text style={styles.syncButtonEmoji}>🔄</Text>
              <Text style={styles.syncButtonText}>Kullanım Verilerini Ebeveyne Aktar</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Active Restrictions */}
      <Text style={styles.sectionHeaderTitle}>Aktif Kısıtlamalar</Text>

      {blockedApps.length === 0 && timeLimits.length === 0 ? (
        <View style={styles.noRestrictions}>
          <Text style={styles.noRestrictionsIcon}>✅</Text>
          <Text style={styles.noRestrictionsTitle}>Harika! Aktif Kısıtlama Yok</Text>
          <Text style={styles.noRestrictionsSubtitle}>Tüm uygulamaları serbestçe kullanabilirsin.</Text>
        </View>
      ) : (
        <>
          {/* Blocked Apps List */}
          {blockedApps.length > 0 && (
            <View style={[styles.card, styles.borderError]}>
              <View style={styles.restrictionHeader}>
                <Text style={styles.blockIcon}>🚫</Text>
                <Text style={[styles.cardTitle, {color: Colors.error}]}>Engellenmiş Uygulamalar</Text>
              </View>
              {blockedApps.map(app => (
                <View key={app.id || app.package_name} style={styles.restrictionItem}>
                  <View style={[styles.smallAppIcon, {backgroundColor: Colors.error + '15'}]}>
                    <Text style={styles.smallIconEmoji}>📱</Text>
                  </View>
                  <Text style={styles.restrictionAppName}>{app.app_name}</Text>
                  <Text style={styles.blockedBadge}>Engelli</Text>
                </View>
              ))}
            </View>
          )}

          {/* Time Restrictions List */}
          {timeLimits.length > 0 && (
            <View style={[styles.card, styles.borderWarning]}>
              <View style={styles.restrictionHeader}>
                <Text style={styles.blockIcon}>⏰</Text>
                <Text style={[styles.cardTitle, {color: Colors.warning}]}>Zaman Kısıtlamaları</Text>
              </View>
              {timeLimits.map(limit => (
                <View key={limit.id} style={styles.restrictionItem}>
                  <View style={[styles.smallAppIcon, {backgroundColor: Colors.warning + '15'}]}>
                    <Text style={styles.smallIconEmoji}>⏳</Text>
                  </View>
                  <View style={styles.restrictionTimeInfo}>
                    <Text style={styles.restrictionAppName}>{limit.app_name}</Text>
                    <Text style={styles.restrictionSubText}>
                      Gün: {limit.day_of_week}
                    </Text>
                  </View>
                  <Text style={styles.timeRangeBadge}>
                    {limit.start_time} - {limit.end_time}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {flex: 1, backgroundColor: Colors.background},
  container: {padding: Spacing.screenPadding, paddingBottom: Spacing.xl},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background},
  loadingText: {marginTop: Spacing.md, ...Typography.bodyMedium, color: Colors.textSecondary},
  welcomeCard: {
    backgroundColor: Colors.childPrimary + '15',
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.childPrimary + '30',
    marginBottom: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeInfo: {flex: 1, marginRight: Spacing.md},
  welcomeTitle: {
    ...Typography.headlineSmall,
    color: Colors.childPrimary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  welcomeSubtitle: {...Typography.bodyMedium, color: Colors.textSecondary},
  welcomeAvatar: {fontSize: 48},
  sectionHeaderTitle: {
    ...Typography.headlineSmall,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.greyLight,
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  borderError: {borderColor: Colors.error + '30'},
  borderWarning: {borderColor: Colors.warning + '30'},
  cardHeader: {marginBottom: Spacing.lg},
  cardTitle: {...Typography.headline6, fontWeight: '700', color: Colors.textPrimary},
  cardSubtitle: {...Typography.bodySmall, color: Colors.textSecondary, marginTop: Spacing.xs},
  usageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  appIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.greyLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appIconEmoji: {fontSize: 22},
  usageMain: {
    flex: 1,
    marginLeft: Spacing.md,
    marginRight: Spacing.sm,
  },
  usageTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  appName: {...Typography.bodyMedium, fontWeight: '600', color: Colors.textPrimary},
  appTimeText: {...Typography.bodySmall, fontWeight: '600', color: Colors.textSecondary},
  textError: {color: Colors.error},
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.greyLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  adjustmentControls: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  adjustBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: Colors.greyLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adjustBtnPlus: {
    backgroundColor: Colors.childPrimary + '15',
  },
  adjustBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  adjustBtnTextPlus: {
    color: Colors.childPrimary,
  },
  syncButton: {
    marginTop: Spacing.md,
    height: 52,
    backgroundColor: Colors.childPrimary,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    elevation: 2,
    shadowColor: Colors.childPrimary,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  syncButtonDisabled: {
    opacity: 0.6,
  },
  syncButtonEmoji: {fontSize: 18},
  syncButtonText: {
    ...Typography.button,
    color: Colors.white,
    fontWeight: '700',
  },
  restrictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyLight,
    paddingBottom: Spacing.sm,
  },
  blockIcon: {fontSize: 20, marginRight: Spacing.sm},
  restrictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyLight + '50',
  },
  smallAppIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallIconEmoji: {fontSize: 16},
  restrictionAppName: {...Typography.bodyMedium, flex: 1, marginLeft: Spacing.sm, fontWeight: '600', color: Colors.textPrimary},
  restrictionTimeInfo: {flex: 1, marginLeft: Spacing.sm},
  restrictionSubText: {...Typography.bodySmall, color: Colors.textSecondary},
  blockedBadge: {
    ...Typography.caption,
    color: Colors.error,
    fontWeight: '700',
    backgroundColor: Colors.error + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timeRangeBadge: {
    ...Typography.caption,
    color: Colors.warning,
    fontWeight: '700',
    backgroundColor: Colors.warning + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  noRestrictions: {
    backgroundColor: Colors.success + '10',
    borderRadius: 16,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.success + '30',
    alignItems: 'center',
  },
  noRestrictionsIcon: {fontSize: 48, marginBottom: Spacing.md},
  noRestrictionsTitle: {...Typography.bodyLarge, color: Colors.success, fontWeight: '600'},
  noRestrictionsSubtitle: {...Typography.bodySmall, color: Colors.textSecondary, marginTop: Spacing.xs, textAlign: 'center'},
});

export default ChildDashboardScreen;

