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

interface ChildProfile {
  id: string;
  name: string;
  age?: number;
}

const ReportsScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  
  // Dynamic stats
  const [weeklyScreenTime, setWeeklyScreenTime] = useState<string>('0 saat');
  const [topAppsText, setTopAppsText] = useState<string>('Henüz veri yok');
  const [violationCountText, setViolationCountText] = useState<string>('Bu hafta limit aşımı kaydedilmedi.');

  useEffect(() => {
    fetchProfileAndChildren();
  }, []);

  const fetchProfileAndChildren = async () => {
    try {
      setLoading(true);
      const profileRes = await apiClient.get('/users/profile');
      if (profileRes.data && profileRes.data.user) {
        const u = profileRes.data.user;
        if (u.role === 'parent') {
          const childrenRes = await apiClient.get(`/users/${u.id}/children`);
          if (childrenRes.data && childrenRes.data.children && childrenRes.data.children.length > 0) {
            setChildren(childrenRes.data.children);
            setSelectedChildId(childrenRes.data.children[0].id);
          }
        }
      }
    } catch (error) {
      console.error('Rapor profil ve çocuk yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChildId) {
      calculateChildReports();
    }
  }, [selectedChildId]);

  const calculateChildReports = async () => {
    try {
      setLoading(true);
      const selectedChild = children.find(c => c.id === selectedChildId);
      const childName = selectedChild?.name || '';

      // 1. Fetch usage statistics
      const statsRes = await apiClient.get('/usage/stats');
      if (statsRes.data && statsRes.data.stats) {
        const childStats = statsRes.data.stats.filter(
          (s: any) => s.child_id === selectedChildId
        );

        // Sum usage minutes of past week (7 days)
        const totalMinutes = childStats.reduce((sum: number, stat: any) => sum + stat.usage_minutes, 0);
        if (totalMinutes < 60) {
          setWeeklyScreenTime(`${totalMinutes} dakika`);
        } else {
          const hours = Math.floor(totalMinutes / 60);
          const mins = totalMinutes % 60;
          setWeeklyScreenTime(mins > 0 ? `${hours} saat ${mins} dk` : `${hours} saat`);
        }

        // Aggregate top apps
        const appMap: {[key: string]: number} = {};
        childStats.forEach((stat: any) => {
          appMap[stat.app_name] = (appMap[stat.app_name] || 0) + stat.usage_minutes;
        });

        const sortedApps = Object.entries(appMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(entry => entry[0]);

        if (sortedApps.length > 0) {
          setTopAppsText(sortedApps.join(', ') + ' en çok kullanılan uygulamalar.');
        } else {
          setTopAppsText('Henüz kullanım verisi senkronize edilmedi.');
        }
      }

      // 2. Fetch limit violation logs from notifications
      const notifRes = await apiClient.get('/notifications');
      if (notifRes.data && notifRes.data.notifications) {
        const notifications = notifRes.data.notifications;
        // Filter notifications regarding limit violations containing the child's name
        const childViolations = notifications.filter(
          (n: any) => n.title === 'Limit Aşıldı' && n.message.includes(childName)
        );

        if (childViolations.length > 0) {
          setViolationCountText(`Bu hafta ${childViolations.length} kez günlük limit aşımı kaydedildi.`);
        } else {
          setViolationCountText('Bu hafta limit aşımı kaydedilmedi.');
        }
      }
    } catch (error) {
      console.error('Hata raporları hesaplanamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderChildSelector = () => {
    if (children.length <= 1) return null;
    return (
      <View style={styles.childSelectorContainer}>
        <Text style={styles.childSelectorTitle}>Çocuk Seçin:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.childSelectorScroll}>
          {children.map(child => {
            const isSelected = child.id === selectedChildId;
            return (
              <TouchableOpacity
                key={child.id}
                style={[styles.childSelectorBtn, isSelected && styles.childSelectorBtnActive]}
                onPress={() => setSelectedChildId(child.id)}>
                <Text style={[styles.childSelectorText, isSelected && styles.childSelectorTextActive]}>
                  👧 {child.name || 'Çocuk'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  if (loading && children.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Child selector */}
      {renderChildSelector()}

      <View style={styles.header}>
        <Text style={styles.headerEmoji}>📊</Text>
        <Text style={styles.title}>Raporlar</Text>
        <Text style={styles.subtitle}>Çocuğunuzun cihaz kullanım raporları</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
      ) : (
        <>
          <View style={styles.reportCard}>
            <Text style={styles.reportTitle}>📅 Haftalık Rapor</Text>
            <Text style={styles.reportDesc}>Bu hafta toplam {weeklyScreenTime} ekran süresi kullanıldı.</Text>
          </View>
          <View style={styles.reportCard}>
            <Text style={styles.reportTitle}>📈 En Çok Kullanılan</Text>
            <Text style={styles.reportDesc}>{topAppsText}</Text>
          </View>
          <View style={[styles.reportCard, {borderColor: Colors.error + '25', borderWidth: 1}]}>
            <Text style={[styles.reportTitle, {color: Colors.error}]}>🚫 Limit Aşımları</Text>
            <Text style={styles.reportDesc}>{violationCountText}</Text>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {flex: 1, backgroundColor: Colors.background},
  container: {padding: Spacing.screenPadding},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background},
  childSelectorContainer: {
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    marginBottom: Spacing.md,
  },
  childSelectorTitle: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  childSelectorScroll: {
    gap: Spacing.sm,
  },
  childSelectorBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
    backgroundColor: Colors.surface,
  },
  childSelectorBtnActive: {
    backgroundColor: Colors.primary + '15',
    borderColor: Colors.primary,
  },
  childSelectorText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  childSelectorTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  header: {alignItems: 'center', marginBottom: Spacing.xl, marginTop: Spacing.sm},
  headerEmoji: {fontSize: 48, marginBottom: Spacing.md},
  title: {...Typography.headline3, marginBottom: Spacing.sm},
  subtitle: {...Typography.bodyMedium, color: Colors.textSecondary},
  reportCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  reportTitle: {...Typography.cardTitle, marginBottom: Spacing.sm},
  reportDesc: {...Typography.bodyMedium, color: Colors.textSecondary},
  loader: {marginTop: Spacing.xl},
});

export default ReportsScreen;
