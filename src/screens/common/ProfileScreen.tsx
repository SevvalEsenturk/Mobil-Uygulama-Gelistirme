import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors, Typography, Spacing} from '../../theme';
import apiClient from '../../api/apiClient';
import {authService} from '../../services/authService';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({navigation}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [createdAt, setCreatedAt] = useState<string>('');
  const [children, setChildren] = useState<any[]>([]);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/users/profile');
      if (res.data && res.data.user) {
        const u = res.data.user;
        setUserId(u.id);
        setName(u.name || '');
        setEmail(u.email || '');
        setRole(u.role === 'parent' ? 'Ebeveyn 👨‍💼' : 'Çocuk 👧');
        
        // Format date nicely
        if (u.created_at) {
          const date = new Date(u.created_at.replace(' ', 'T'));
          setCreatedAt(
            date.toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          );
        }

        // Fetch children if parent
        if (u.role === 'parent') {
          const childrenRes = await apiClient.get(`/users/${u.id}/children`);
          if (childrenRes.data && childrenRes.data.children) {
            setChildren(childrenRes.data.children);
          }
        }
      }
    } catch (error) {
      console.error('Profil yükleme hatası:', error);
      Alert.alert('Hata', 'Profil bilgileri yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Hata', 'Ad Soyad ve E-posta alanları boş bırakılamaz.');
      return;
    }

    try {
      setUpdating(true);
      const res = await apiClient.put('/users/profile', {
        name: name.trim(),
        email: email.trim(),
      });

      if (res.data && res.data.user) {
        // Update local session AsyncStorage
        await AsyncStorage.setItem('user_data', JSON.stringify(res.data.user));
        
        Alert.alert('Başarılı 🎉', 'Profil bilgileriniz başarıyla güncellendi.', [
          {text: 'Tamam', onPress: () => navigation.goBack()},
        ]);
      }
    } catch (error: any) {
      console.error('Profil güncelleme hatası:', error);
      Alert.alert(
        'Güncelleme Başarısız',
        error.response?.data?.message || 'Bir hata oluştu.'
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteChild = (childId: string, childName: string) => {
    Alert.alert(
      'Çocuğu Sil 📱',
      `"${childName}" isimli çocuğun cihaz bağlantısını kesmek ve bu cihaza ait tüm istatistik/kuralları kalıcı olarak silmek istediğinize emin misiniz?\n\nBu işlem kesinlikle geri alınamaz!`,
      [
        {text: 'İptal', style: 'cancel'},
        {
          text: 'Eşleştirmeyi Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              setUpdating(true);
              await apiClient.delete(`/users/children/${childId}`);
              Alert.alert('Başarılı 🎉', 'Çocuk bağlantısı ve verileri başarıyla silindi.');
              fetchProfileData(); // Refresh list
            } catch (error: any) {
              console.error('Çocuk silme hatası:', error);
              Alert.alert(
                'Hata',
                error.response?.data?.message || 'Çocuk silinirken bir hata oluştu.'
              );
            } finally {
              setUpdating(false);
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Hesabı Kalıcı Olarak Sil ⚠️',
      'Hesabınızı silmek istediğinize emin misiniz? Bu işlem sonucunda hesabınız ve varsa bağlı tüm çocuk cihazlarının kuralları/verileri kalıcı olarak silinecektir.',
      [
        {text: 'İptal', style: 'cancel'},
        {
          text: 'Devam Et',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Son Uyarı 🚨',
              'Bu eylem kesinlikle geri alınamaz! Tüm verileriniz kalıcı olarak yok edilecektir. Onaylıyor musunuz?',
              [
                {text: 'İptal', style: 'cancel'},
                {
                  text: 'Hesabımı Kalıcı Olarak Sil',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      setUpdating(true);
                      await apiClient.delete('/users/profile');
                      await authService.logout();
                      Alert.alert(
                        'Hesap Silindi',
                        'Hesabınız ve tüm verileriniz başarıyla silinmiştir.',
                        [
                          {
                            text: 'Tamam',
                            onPress: () =>
                              navigation.reset({
                                index: 0,
                                routes: [{name: 'Login'}],
                              }),
                          },
                        ]
                      );
                    } catch (error: any) {
                      console.error('Hesap silme hatası:', error);
                      Alert.alert(
                        'Hata',
                        error.response?.data?.message || 'Hesap silinirken bir hata oluştu.'
                      );
                    } finally {
                      setUpdating(false);
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Profil Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        
        {/* Header Card with Harmonious Colors */}
        <View style={styles.avatarCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>{role.includes('Ebeveyn') ? '👨‍💼' : '👧'}</Text>
          </View>
          <Text style={styles.headerName}>{name || 'Kullanıcı'}</Text>
          <Text style={styles.headerRole}>{role}</Text>
        </View>

        {/* Form Container */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Hesap Bilgileri</Text>

          {/* Name Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ad Soyad</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Adınız Soyadınız"
              placeholderTextColor={Colors.textDisabled}
            />
          </View>

          {/* Email Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-posta Adresi</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="ornek@email.com"
              placeholderTextColor={Colors.textDisabled}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Read-Only Join Date */}
          <View style={styles.readOnlyGroup}>
            <Text style={styles.label}>Kayıt Tarihi</Text>
            <Text style={styles.readOnlyText}>{createdAt || 'Bilinmiyor'}</Text>
          </View>
        </View>

        {/* Connected Children Section (Only for Parents) */}
        {role.includes('Ebeveyn') && (
          <View style={styles.card}>
            <Text style={styles.cardHeader}>👨‍👩‍👧‍👦 Bağlı Çocuklar</Text>
            {children.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>📱</Text>
                <Text style={styles.emptyText}>Henüz eşleşmiş bir çocuk cihazı bulunmuyor.</Text>
                <TouchableOpacity
                  style={styles.connectButton}
                  onPress={() => navigation.navigate('QrGeneration')}>
                  <Text style={styles.connectButtonText}>Çocuk Cihazı Eşleştir</Text>
                </TouchableOpacity>
              </View>
            ) : (
              children.map(child => (
                <View key={child.id} style={styles.childItem}>
                  <View style={styles.childAvatar}>
                    <Text style={styles.childAvatarText}>👧</Text>
                  </View>
                  <View style={styles.childInfo}>
                    <Text style={styles.childName}>{child.name || 'İsimsiz Çocuk'}</Text>
                    {child.age && <Text style={styles.childDetails}>Yaş: {child.age}</Text>}
                    <Text style={styles.childDetails}>{child.child_email || 'Cihaz Eşleşmiş'}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteChildButton}
                    onPress={() => handleDeleteChild(child.id, child.name)}>
                    <Text style={styles.deleteChildEmoji}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, updating && styles.disabledBtn]}
          onPress={handleUpdateProfile}
          disabled={updating}>
          {updating ? (
            <ActivityIndicator color={Colors.white} size="small" />
          ) : (
            <Text style={styles.saveBtnText}>Değişiklikleri Kaydet</Text>
          )}
        </TouchableOpacity>

        {/* Account Management (Danger Zone) */}
        <View style={styles.dangerZone}>
          <Text style={styles.dangerZoneTitle}>Kritik İşlemler</Text>
          <TouchableOpacity
            style={[styles.deleteAccountButton, updating && styles.disabledBtn]}
            onPress={handleDeleteAccount}
            disabled={updating}>
            <Text style={styles.deleteAccountText}>🗑️ Hesabı Kalıcı Olarak Sil</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1, backgroundColor: Colors.background},
  scroll: {flex: 1},
  container: {padding: Spacing.screenPadding, paddingBottom: Spacing.xl},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background},
  loadingText: {marginTop: Spacing.md, ...Typography.bodyMedium, color: Colors.textSecondary},
  avatarCard: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary + '30',
  },
  avatarEmoji: {fontSize: 44},
  headerName: {...Typography.headlineSmall, fontWeight: '700', color: Colors.textPrimary},
  headerRole: {...Typography.bodyMedium, color: Colors.textSecondary, marginTop: 4},
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.divider,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 6,
    marginBottom: Spacing.lg,
  },
  cardHeader: {
    ...Typography.headline6,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    paddingBottom: Spacing.sm,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.titleSmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.greyLight,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.background,
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
  },
  readOnlyGroup: {
    marginTop: Spacing.xs,
    paddingTop: Spacing.sm,
  },
  readOnlyText: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    fontWeight: '600',
    paddingVertical: 4,
  },
  saveButton: {
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  disabledBtn: {opacity: 0.7},
  saveBtnText: {
    ...Typography.button,
    color: Colors.white,
    fontWeight: '700',
  },

  // Children Section Styles
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: Spacing.xs,
    opacity: 0.5,
  },
  emptyText: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  connectButton: {
    backgroundColor: Colors.primary + '15',
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
  },
  connectButtonText: {
    ...Typography.bodyMedium,
    color: Colors.primary,
    fontWeight: '600',
  },
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  childAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.childPrimary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  childAvatarText: {
    fontSize: 20,
  },
  childInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  childName: {
    ...Typography.bodyLarge,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  childDetails: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  deleteChildButton: {
    padding: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteChildEmoji: {
    fontSize: 20,
  },

  // Danger Zone
  dangerZone: {
    marginTop: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: Spacing.md,
  },
  dangerZoneTitle: {
    ...Typography.titleSmall,
    color: Colors.error,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  deleteAccountButton: {
    height: 52,
    borderWidth: 1,
    borderColor: Colors.error + '40',
    backgroundColor: Colors.error + '08',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteAccountText: {
    ...Typography.button,
    color: Colors.error,
    fontWeight: '700',
  },
});

export default ProfileScreen;

