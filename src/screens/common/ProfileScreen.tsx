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

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/users/profile');
      if (res.data && res.data.user) {
        const u = res.data.user;
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
});

export default ProfileScreen;
