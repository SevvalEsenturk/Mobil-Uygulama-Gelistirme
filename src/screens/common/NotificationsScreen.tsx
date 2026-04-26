import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {Colors, Typography, Spacing} from '../../theme';

const MOCK_NOTIFICATIONS = [
  {id: '1', title: 'Yeni eşleştirme', message: 'Çocuk cihazı başarıyla eşleştirildi', time: '5 dk önce', emoji: '🔗'},
  {id: '2', title: 'Engelleme denemesi', message: 'TikTok uygulamasına erişim engellendi', time: '1 saat önce', emoji: '🚫'},
  {id: '3', title: 'Günlük rapor', message: 'Günlük kullanım raporu hazır', time: '3 saat önce', emoji: '📊'},
  {id: '4', title: 'Zaman limiti', message: 'Instagram günlük limiti doldu', time: 'Dün', emoji: '⏰'},
];

const NotificationsScreen: React.FC = () => (
  <View style={styles.container}>
    <FlatList
      data={MOCK_NOTIFICATIONS}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
      renderItem={({item}) => (
        <View style={styles.notificationItem}>
          <View style={styles.notifIcon}>
            <Text style={styles.notifEmoji}>{item.emoji}</Text>
          </View>
          <View style={styles.notifContent}>
            <Text style={styles.notifTitle}>{item.title}</Text>
            <Text style={styles.notifMessage}>{item.message}</Text>
            <Text style={styles.notifTime}>{item.time}</Text>
          </View>
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyText}>Bildirim yok</Text>
        </View>
      }
    />
  </View>
);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  list: {padding: Spacing.screenPadding},
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    elevation: 1,
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifEmoji: {fontSize: 18},
  notifContent: {flex: 1, marginLeft: Spacing.md},
  notifTitle: {...Typography.cardTitle},
  notifMessage: {...Typography.bodySmall, color: Colors.textSecondary, marginTop: 2},
  notifTime: {...Typography.caption, marginTop: 4},
  empty: {flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100},
  emptyIcon: {fontSize: 48, marginBottom: Spacing.md},
  emptyText: {...Typography.bodyMedium, color: Colors.textSecondary},
});

export default NotificationsScreen;
