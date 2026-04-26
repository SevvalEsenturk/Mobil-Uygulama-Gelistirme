import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import {Colors, Typography, Spacing} from '../../theme';

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

const MOCK_RESTRICTIONS: Restriction[] = [
  {
    id: '1',
    appName: 'Instagram',
    packageName: 'com.instagram.android',
    dailyLimit: 60,
    startTime: '09:00',
    endTime: '17:00',
    allowedDays: 'Pazartesi - Cuma',
    isEnabled: true,
  },
  {
    id: '2',
    appName: 'YouTube',
    packageName: 'com.google.android.youtube',
    dailyLimit: 120,
    startTime: '10:00',
    endTime: '20:00',
    allowedDays: 'Her gün',
    isEnabled: true,
  },
];

const MOCK_APPS = [
  {packageName: 'com.instagram.android', appName: 'Instagram'},
  {packageName: 'com.whatsapp', appName: 'WhatsApp'},
  {packageName: 'com.tiktok.android', appName: 'TikTok'},
  {packageName: 'com.google.android.youtube', appName: 'YouTube'},
  {packageName: 'com.spotify.music', appName: 'Spotify'},
];

const TimeRestrictionScreen: React.FC<TimeRestrictionScreenProps> = ({navigation}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [restrictions, setRestrictions] = useState<Restriction[]>(MOCK_RESTRICTIONS);

  const tabs = ['Aktif Kısıtlamalar', 'Yeni Kısıtlama', 'Geçmiş'];

  const toggleRestriction = (id: string) => {
    setRestrictions(prev =>
      prev.map(r => (r.id === id ? {...r, isEnabled: !r.isEnabled} : r)),
    );
  };

  const deleteRestriction = (id: string) => {
    Alert.alert('Kısıtlamayı Sil', 'Bu zaman kısıtlamasını silmek istediğinizden emin misiniz?', [
      {text: 'İptal'},
      {
        text: 'Sil',
        style: 'destructive',
        onPress: () => setRestrictions(prev => prev.filter(r => r.id !== id)),
      },
    ]);
  };

  const addRestriction = (app: typeof MOCK_APPS[0]) => {
    const newRestriction: Restriction = {
      id: Date.now().toString(),
      appName: app.appName,
      packageName: app.packageName,
      dailyLimit: 60,
      startTime: '09:00',
      endTime: '17:00',
      allowedDays: 'Pazartesi - Cuma',
      isEnabled: true,
    };
    setRestrictions(prev => [...prev, newRestriction]);
    Alert.alert('Başarılı', `${app.appName} için zaman kısıtlaması oluşturuldu`);
    setActiveTab(0);
  };

  const renderActiveTab = () => {
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
                onValueChange={() => toggleRestriction(item.id)}
                trackColor={{false: Colors.greyLight, true: Colors.parentPrimary + '50'}}
                thumbColor={item.isEnabled ? Colors.parentPrimary : Colors.grey}
              />
            </View>

            {/* Details */}
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

            {/* Actions */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionButton}>
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

  const renderNewRestrictionTab = () => (
    <ScrollView contentContainerStyle={styles.listContent}>
      <Text style={styles.sectionTitle}>Yeni Zaman Kısıtlaması</Text>
      <Text style={styles.sectionSubtitle}>Kısıtlama eklemek istediğiniz uygulamayı seçin</Text>
      {MOCK_APPS.map(app => (
        <TouchableOpacity
          key={app.packageName}
          style={styles.appSelectItem}
          onPress={() => addRestriction(app)}>
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

  const renderHistoryTab = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>Geçmiş Veriler</Text>
      <Text style={styles.emptySubtitle}>Zaman kısıtlama geçmişi burada görünecek</Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      {/* Tabs */}
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === index && styles.activeTab]}
            onPress={() => setActiveTab(index)}>
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
  emptyState: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  emptyIcon: {fontSize: 64, marginBottom: Spacing.md},
  emptyTitle: {...Typography.headlineSmall, color: Colors.textSecondary},
  emptySubtitle: {...Typography.bodyMedium, color: Colors.textSecondary, marginTop: Spacing.sm},
});

export default TimeRestrictionScreen;
