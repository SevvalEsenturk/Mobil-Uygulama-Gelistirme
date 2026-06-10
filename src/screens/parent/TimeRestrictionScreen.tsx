import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Switch,
  Alert,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {Colors, Typography, Spacing} from '../../theme';
import apiClient from '../../api/apiClient';

interface TimeRestrictionScreenProps {
  navigation: any;
}

interface Restriction {
  id: string;
  appName: string;
  packageName: string;
  dailyLimit: number;
  startTime: string;
  endTime: string;
  allowedDays: string;
  isEnabled: boolean;
}

const MOCK_APPS = [
  {packageName: 'com.instagram.android', appName: 'Instagram'},
  {packageName: 'com.whatsapp', appName: 'WhatsApp'},
  {packageName: 'com.tiktok.android', appName: 'TikTok'},
  {packageName: 'com.google.android.youtube', appName: 'YouTube'},
  {packageName: 'com.spotify.music', appName: 'Spotify'},
];

const TimeRestrictionScreen: React.FC<TimeRestrictionScreenProps> = ({navigation}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [restrictions, setRestrictions] = useState<Restriction[]>([]);

  // Form states for adding/editing a restriction
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [dailyLimit, setDailyLimit] = useState('60');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [allowedDays, setAllowedDays] = useState('Her gün');
  const [editingId, setEditingId] = useState<string | null>(null);

  const tabs = ['Aktif Kısıtlamalar', 'Yeni Kısıtlama', 'Geçmiş'];

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
      console.error('Ebeveyn profil yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChildId) {
      fetchRestrictions();
    }
  }, [selectedChildId]);

  const fetchRestrictions = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/rules/time-restrictions');
      if (res.data && res.data.restrictions) {
        const childRestr = res.data.restrictions.filter(
          (r: any) => r.child_id === selectedChildId
        );
        
        const mapped: Restriction[] = childRestr.map((r: any) => ({
          id: r.id,
          appName: r.app_name,
          packageName: r.package_name,
          dailyLimit: r.daily_limit,
          startTime: r.start_time,
          endTime: r.end_time,
          allowedDays: r.day_of_week,
          isEnabled: r.is_active === 1,
        }));
        setRestrictions(mapped);
      }
    } catch (error) {
      console.error('Kısıtlamalar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRestriction = async (id: string, currentStatus: boolean) => {
    try {
      const updatedStatus = !currentStatus;
      setRestrictions(prev =>
        prev.map(r => (r.id === id ? {...r, isEnabled: updatedStatus} : r))
      );

      await apiClient.put(`/rules/time-restrictions/${id}`, {
        is_active: updatedStatus ? 1 : 0,
      });
    } catch (error) {
      console.error('Kısıtlama durumu değiştirilemedi:', error);
      Alert.alert('Hata', 'Kısıtlama durumu güncellenemedi.');
      setRestrictions(prev =>
        prev.map(r => (r.id === id ? {...r, isEnabled: currentStatus} : r))
      );
    }
  };

  const deleteRestriction = (id: string) => {
    Alert.alert('Kısıtlamayı Sil', 'Bu zaman kısıtlamasını silmek istediğinizden emin misiniz?', [
      {text: 'İptal'},
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiClient.delete(`/rules/time-restrictions/${id}`);
            setRestrictions(prev => prev.filter(r => r.id !== id));
            Alert.alert('Başarılı', 'Kısıtlama kaldırıldı.');
          } catch (error) {
            console.error('Kısıtlama silme hatası:', error);
            Alert.alert('Hata', 'Kısıtlama silinemedi.');
          }
        },
      },
    ]);
  };

  const handleEditRestriction = (item: Restriction) => {
    setSelectedApp({
      appName: item.appName,
      packageName: item.packageName,
    });
    setEditingId(item.id);
    setDailyLimit(item.dailyLimit.toString());
    setStartTime(item.startTime);
    setEndTime(item.endTime);
    setAllowedDays(item.allowedDays);
    setActiveTab(1); // Go to edit form tab
  };

  const handleSaveRestriction = async () => {
    if (!selectedApp) return;
    const limitMin = parseInt(dailyLimit, 10);
    if (isNaN(limitMin) || limitMin <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir günlük limit süresi (dakika) girin.');
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        const res = await apiClient.put(`/rules/time-restrictions/${editingId}`, {
          app_name: selectedApp.appName,
          package_name: selectedApp.packageName,
          day_of_week: allowedDays,
          start_time: startTime,
          end_time: endTime,
          daily_limit: limitMin,
        });

        if (res.data) {
          Alert.alert('Başarılı', 'Kısıtlama başarıyla güncellendi.');
          fetchRestrictions();
          setSelectedApp(null);
          setEditingId(null);
          setActiveTab(0);
        }
      } else {
        const res = await apiClient.post('/rules/time-restrictions', {
          child_id: selectedChildId,
          app_name: selectedApp.appName,
          package_name: selectedApp.packageName,
          day_of_week: allowedDays,
          start_time: startTime,
          end_time: endTime,
          daily_limit: limitMin,
          is_active: 1,
        });

        if (res.data) {
          Alert.alert('Başarılı', `${selectedApp.appName} için zaman kısıtlaması oluşturuldu.`);
          fetchRestrictions();
          setSelectedApp(null);
          setActiveTab(0);
        }
      }
    } catch (error) {
      console.error('Kısıtlama kaydedilemedi:', error);
      Alert.alert('Hata', 'Kısıtlama kaydedilirken bir hata oluştu.');
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

  const renderActiveTab = () => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.parentPrimary} />
        </View>
      );
    }

    if (restrictions.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>⏰</Text>
          <Text style={styles.emptyTitle}>Henüz zaman kısıtlaması yok</Text>
          <Text style={styles.emptySubtitle}>Uygulamalar için zaman kısıtlaması ekleyin</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={restrictions}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({item}) => (
          <View style={styles.restrictionCard}>
            <View style={styles.restrictionHeader}>
              <View style={styles.restrictionIconWrap}>
                <Text style={styles.restrictionEmoji}>📱</Text>
              </View>
              <View style={styles.restrictionInfo}>
                <Text style={styles.restrictionAppName}>{item.appName}</Text>
                <Text style={styles.restrictionPackage}>{item.packageName}</Text>
              </View>
              <Switch
                value={item.isEnabled}
                onValueChange={() => toggleRestriction(item.id, item.isEnabled)}
                trackColor={{false: Colors.greyLight, true: Colors.parentPrimary + '50'}}
                thumbColor={item.isEnabled ? Colors.parentPrimary : Colors.grey}
              />
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Günlük Limit</Text>
                <Text style={styles.detailValue}>{item.dailyLimit} dakika</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>İzin Verilen Günler</Text>
                <Text style={styles.detailValue}>{item.allowedDays}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Zaman Aralığı</Text>
                <Text style={styles.detailValue}>{item.startTime} - {item.endTime}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Durum</Text>
                <Text style={[styles.detailValue, {color: item.isEnabled ? Colors.success : Colors.error}]}>
                  {item.isEnabled ? 'Aktif' : 'Pasif'}
                </Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleEditRestriction(item)}>
                <Text style={styles.editText}>✏️ Düzenle</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => deleteRestriction(item.id)}>
                <Text style={styles.deleteText}>🗑️ Sil</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    );
  };

  const renderNewRestrictionTab = () => {
    if (selectedApp) {
      return (
        <ScrollView contentContainerStyle={styles.listContent}>
          <Text style={styles.sectionTitle}>
            {editingId ? 'Kısıtlamayı Düzenle' : 'Kısıtlama Kurallarını Belirleyin'}
          </Text>
          <View style={styles.formCard}>
            <Text style={styles.formAppName}>📱 {selectedApp.appName}</Text>
            <Text style={styles.formAppPackage}>{selectedApp.packageName}</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Günlük Limit (Dakika)</Text>
              <TextInput
                style={styles.input}
                value={dailyLimit}
                onChangeText={setDailyLimit}
                keyboardType="numeric"
                placeholder="Örn: 60"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, {flex: 1}]}>
                <Text style={styles.label}>Başlangıç Saati</Text>
                <TextInput
                  style={styles.input}
                  value={startTime}
                  onChangeText={setStartTime}
                  placeholder="Örn: 09:00"
                />
              </View>
              <View style={[styles.inputGroup, {flex: 1}]}>
                <Text style={styles.label}>Bitiş Saati</Text>
                <TextInput
                  style={styles.input}
                  value={endTime}
                  onChangeText={setEndTime}
                  placeholder="Örn: 17:00"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>İzin Verilen Günler</Text>
              <TextInput
                style={styles.input}
                value={allowedDays}
                onChangeText={setAllowedDays}
                placeholder="Örn: Her gün"
              />
            </View>

            <View style={styles.formButtonRow}>
              <TouchableOpacity
                style={[styles.formBtn, styles.formBtnCancel]}
                onPress={() => {
                  setSelectedApp(null);
                  setEditingId(null);
                }}>
                <Text style={styles.formBtnCancelText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.formBtn, styles.formBtnSave]}
                onPress={handleSaveRestriction}>
                <Text style={styles.formBtnSaveText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.listContent}>
        <Text style={styles.sectionTitle}>Yeni Zaman Kısıtlaması</Text>
        <Text style={styles.sectionSubtitle}>Kısıtlama eklemek istediğiniz uygulamayı seçin</Text>
        {MOCK_APPS.map(app => (
          <TouchableOpacity
            key={app.packageName}
            style={styles.appSelectItem}
            onPress={() => {
              setSelectedApp(app);
              setDailyLimit('60');
              setStartTime('09:00');
              setEndTime('17:00');
              setAllowedDays('Her gün');
            }}>
            <View style={styles.restrictionIconWrap}>
              <Text style={styles.restrictionEmoji}>📱</Text>
            </View>
            <View style={styles.restrictionInfo}>
              <Text style={styles.restrictionAppName}>{app.appName}</Text>
              <Text style={styles.restrictionPackage}>{app.packageName}</Text>
            </View>
            <Text style={styles.addIcon}>➕</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderHistoryTab = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>Geçmiş Veriler</Text>
      <Text style={styles.emptySubtitle}>Zaman kısıtlama geçmişi burada görünecek</Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      {/* Child selector */}
      {renderChildSelector()}

      {/* Tabs */}
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === index && styles.activeTab]}
            onPress={() => {
              setActiveTab(index);
              if (index !== 1) {
                setSelectedApp(null);
                setEditingId(null);
              }
            }}>
            <Text style={[styles.tabText, activeTab === index && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 0 && renderActiveTab()}
      {activeTab === 1 && renderNewRestrictionTab()}
      {activeTab === 2 && renderHistoryTab()}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: Colors.background},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  childSelectorContainer: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
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
    backgroundColor: Colors.background,
  },
  childSelectorBtnActive: {
    backgroundColor: Colors.parentPrimary + '15',
    borderColor: Colors.parentPrimary,
  },
  childSelectorText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  childSelectorTextActive: {
    color: Colors.parentPrimary,
    fontWeight: '700',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.parentPrimary,
    paddingHorizontal: Spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {borderBottomColor: Colors.white},
  tabText: {...Typography.bodySmall, color: 'rgba(255,255,255,0.7)', fontWeight: '500'},
  activeTabText: {color: Colors.white, fontWeight: '700'},
  listContent: {padding: Spacing.screenPadding},
  restrictionCard: {
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
  restrictionHeader: {flexDirection: 'row', alignItems: 'center'},
  restrictionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.parentPrimary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restrictionEmoji: {fontSize: 20},
  restrictionInfo: {flex: 1, marginLeft: Spacing.md},
  restrictionAppName: {...Typography.titleSmall, fontWeight: '700'},
  restrictionPackage: {...Typography.bodySmall, color: Colors.textSecondary},
  detailsContainer: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: Spacing.sm,
    marginTop: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  detailLabel: {...Typography.bodyMedium, color: Colors.textSecondary},
  detailValue: {...Typography.bodyMedium, fontWeight: '500'},
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  actionButton: {paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm},
  editText: {...Typography.bodyMedium, color: Colors.info},
  deleteText: {...Typography.bodyMedium, color: Colors.error},
  sectionTitle: {...Typography.titleMedium, fontWeight: '700', marginBottom: Spacing.sm},
  sectionSubtitle: {...Typography.bodyMedium, color: Colors.textSecondary, marginBottom: Spacing.md},
  appSelectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    elevation: 1,
  },
  addIcon: {fontSize: 20},
  emptyState: {flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100},
  emptyIcon: {fontSize: 64, marginBottom: Spacing.md},
  emptyTitle: {...Typography.headlineSmall, color: Colors.textSecondary},
  emptySubtitle: {...Typography.bodyMedium, color: Colors.textSecondary, marginTop: Spacing.sm},
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.divider,
    elevation: 3,
    marginTop: Spacing.md,
  },
  formAppName: {...Typography.headlineSmall, fontWeight: '700', color: Colors.textPrimary},
  formAppPackage: {...Typography.bodySmall, color: Colors.textSecondary, marginBottom: Spacing.lg},
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.titleSmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.greyLight,
    borderRadius: 10,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.background,
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  formButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  formBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formBtnCancel: {
    backgroundColor: Colors.greyLight,
  },
  formBtnCancelText: {
    ...Typography.button,
    color: Colors.textSecondary,
  },
  formBtnSave: {
    backgroundColor: Colors.parentPrimary,
  },
  formBtnSaveText: {
    ...Typography.button,
    color: Colors.white,
  },
});

export default TimeRestrictionScreen;
