import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {Colors, Typography, Spacing} from '../../theme';
import apiClient from '../../api/apiClient';

interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: number;
  created_at: string;
}

const getNotificationEmoji = (title: string, message: string): string => {
  const t = title.toLowerCase();
  const m = message.toLowerCase();
  if (t.includes('hoş geldin') || t.includes('kayıt') || m.includes('kayıt')) return '🎉';
  if (t.includes('engelle') || m.includes('engellendi') || m.includes('kilit')) return '🚫';
  if (t.includes('eşleştir') || m.includes('eşleşti')) return '🔗';
  if (t.includes('limit') || t.includes('zaman') || m.includes('saat')) return '⏰';
  if (t.includes('rapor') || t.includes('istatistik')) return '📊';
  return '🔔';
};

const formatDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr.replace(' ', 'T')); // Handle SQLite datetime format
    if (isNaN(date.getTime())) return dateStr;
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffMins < 1) return 'Az önce';
    if (diffMins < 60) return `${diffMins} dk önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dateStr;
  }
};

const NotificationsScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/notifications');
      if (res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Bildirimler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string, isRead: number) => {
    if (isRead === 1) return;
    try {
      await apiClient.put(`/notifications/${id}/read`);
      // Update local state
      setNotifications(prev =>
        prev.map(item => (item.id === id ? {...item, is_read: 1} : item))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Bildirim okundu işaretlenemedi:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Bildirimler Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.unreadTitle}>
          {unreadCount > 0 ? `${unreadCount} Okunmamış Bildirim` : 'Tüm Bildirimler Okundu'}
        </Text>
        <TouchableOpacity onPress={fetchNotifications} style={styles.refreshBtn}>
          <Text style={styles.refreshText}>Yenile 🔄</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({item}) => {
          const isUnread = item.is_read === 0;
          return (
            <TouchableOpacity
              style={[styles.notificationItem, isUnread && styles.unreadItem]}
              onPress={() => handleMarkAsRead(item.id, item.is_read)}
              activeOpacity={0.7}>
              <View style={[styles.notifIcon, isUnread && styles.unreadIconBg]}>
                <Text style={styles.notifEmoji}>
                  {getNotificationEmoji(item.title, item.message)}
                </Text>
              </View>
              <View style={styles.notifContent}>
                <View style={styles.titleRow}>
                  <Text style={[styles.notifTitle, isUnread && styles.unreadTitleText]}>
                    {item.title}
                  </Text>
                  {isUnread && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notifMessage}>{item.message}</Text>
                <Text style={styles.notifTime}>{formatDate(item.created_at)}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyText}>Henüz bir bildirim bulunmuyor.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background},
  loadingText: {marginTop: Spacing.md, ...Typography.bodyMedium, color: Colors.textSecondary},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  unreadTitle: {...Typography.bodyMedium, fontWeight: '700', color: Colors.textPrimary},
  refreshBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: Colors.greyLight,
  },
  refreshText: {...Typography.bodySmall, color: Colors.textSecondary, fontWeight: '600'},
  list: {padding: Spacing.screenPadding, paddingTop: Spacing.xs},
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.divider,
    elevation: 1,
  },
  unreadItem: {
    borderColor: Colors.primary + '30',
    backgroundColor: Colors.primary + '05',
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.greyLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadIconBg: {
    backgroundColor: Colors.primary + '15',
  },
  notifEmoji: {fontSize: 18},
  notifContent: {flex: 1, marginLeft: Spacing.md},
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notifTitle: {...Typography.cardTitle, color: Colors.textPrimary},
  unreadTitleText: {fontWeight: '700', color: Colors.primary},
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  notifMessage: {...Typography.bodySmall, color: Colors.textSecondary, marginTop: 2},
  notifTime: {...Typography.caption, color: Colors.textDisabled, marginTop: 4},
  empty: {flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100},
  emptyIcon: {fontSize: 48, marginBottom: Spacing.md},
  emptyText: {...Typography.bodyMedium, color: Colors.textSecondary, textAlign: 'center'},
});

export default NotificationsScreen;
