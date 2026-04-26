import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Colors, Typography, Spacing} from '../../theme';

interface AppBlockingScreenProps {
  navigation: any;
}

// Mock data
const MOCK_APPS = [
  {packageName: 'com.instagram.android', appName: 'Instagram'},
  {packageName: 'com.whatsapp', appName: 'WhatsApp'},
  {packageName: 'com.tiktok.android', appName: 'TikTok'},
  {packageName: 'com.google.android.youtube', appName: 'YouTube'},
  {packageName: 'com.twitter.android', appName: 'X (Twitter)'},
  {packageName: 'com.spotify.music', appName: 'Spotify'},
  {packageName: 'com.snapchat.android', appName: 'Snapchat'},
  {packageName: 'com.discord', appName: 'Discord'},
];

const AppBlockingScreen: React.FC<AppBlockingScreenProps> = ({navigation}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [blockedApps, setBlockedApps] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const tabs = ['Uygulamalar', 'Engellenen', 'Loglar'];

  const toggleBlock = (packageName: string, appName: string) => {
    setBlockedApps(prev => {
      const next = new Set(prev);
      if (next.has(packageName)) {
        next.delete(packageName);
        Alert.alert('Engel Kaldırıldı', `${appName} engeli kaldırıldı`);
      } else {
        next.add(packageName);
        Alert.alert('Engellendi', `${appName} engellendi`);
      }
      return next;
    });
  };

  const renderAppsTab = () => (
    <FlatList
      data={MOCK_APPS}
      keyExtractor={item => item.packageName}
      contentContainerStyle={styles.listContent}
      renderItem={({item}) => (
        <View style={styles.appItem}>
          <View style={styles.appIcon}>
            <Text style={styles.appEmoji}>📱</Text>
          </View>
          <View style={styles.appInfo}>
            <Text style={styles.appName}>{item.appName}</Text>
            <Text style={styles.appPackage}>{item.packageName}</Text>
          </View>
          <Switch
            value={blockedApps.has(item.packageName)}
            onValueChange={() => toggleBlock(item.packageName, item.appName)}
            trackColor={{false: Colors.greyLight, true: Colors.error + '50'}}
            thumbColor={blockedApps.has(item.packageName) ? Colors.error : Colors.grey}
          />
        </View>
      )}
    />
  );

  const renderBlockedTab = () => {
    const blocked = MOCK_APPS.filter(app => blockedApps.has(app.packageName));
    if (blocked.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🚫</Text>
          <Text style={styles.emptyTitle}>Engellenen uygulama yok</Text>
        </View>
      );
    }
    return (
      <FlatList
        data={blocked}
        keyExtractor={item => item.packageName}
        contentContainerStyle={styles.listContent}
        renderItem={({item}) => (
          <View style={styles.appItem}>
            <View style={[styles.appIcon, {backgroundColor: Colors.error + '15'}]}>
              <Text style={styles.appEmoji}>🚫</Text>
            </View>
            <View style={styles.appInfo}>
              <Text style={styles.appName}>{item.appName}</Text>
              <Text style={[styles.appPackage, {color: Colors.error}]}>Engellendi</Text>
            </View>
            <TouchableOpacity
              onPress={() => toggleBlock(item.packageName, item.appName)}>
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    );
  };

  const renderLogsTab = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>Henüz log kaydı yok</Text>
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
            <Text
              style={[
                styles.tabText,
                activeTab === index && styles.activeTabText,
              ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      {activeTab === 0 && renderAppsTab()}
      {activeTab === 1 && renderBlockedTab()}
      {activeTab === 2 && renderLogsTab()}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: Colors.background},
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.warning,
    paddingHorizontal: Spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {borderBottomColor: Colors.white},
  tabText: {
    ...Typography.bodyMedium,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  activeTabText: {color: Colors.white, fontWeight: '700'},
  listContent: {padding: Spacing.screenPadding},
  appItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  appIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appEmoji: {fontSize: 22},
  appInfo: {flex: 1, marginLeft: Spacing.md},
  appName: {...Typography.bodyMedium, fontWeight: '600'},
  appPackage: {...Typography.bodySmall, color: Colors.textSecondary},
  deleteIcon: {fontSize: 20},
  emptyState: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  emptyIcon: {fontSize: 64, marginBottom: Spacing.md},
  emptyTitle: {...Typography.headlineSmall, color: Colors.textSecondary},
});

export default AppBlockingScreen;
