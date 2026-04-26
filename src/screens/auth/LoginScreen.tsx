import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Colors, Typography, Spacing} from '../../theme';
import {authService} from '../../services/authService';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [obscurePassword, setObscurePassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

  const validate = (): boolean => {
    const newErrors: {email?: string; password?: string} = {};
    if (!email.trim()) {
      newErrors.email = 'E-posta adresi gerekli';
    } else if (!email.includes('@')) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }
    if (!password) {
      newErrors.password = 'Şifre gerekli';
    } else if (password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalı';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      const result = await authService.login({
        email: email.trim(),
        password,
      });

      if (result.user.role === 'Parent') {
        navigation.replace('ParentDashboard');
      } else {
        navigation.replace('ChildDashboard');
      }
    } catch (e: any) {
      Alert.alert('Giriş Başarısız', e.message || 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>

        <Text style={styles.title}>LockApp</Text>
        <Text style={styles.subtitle}>Ebeveyn Kontrol Uygulaması</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-posta</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="ornek@email.com"
            placeholderTextColor={Colors.textDisabled}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={text => {
              setEmail(text);
              if (errors.email) setErrors(prev => ({...prev, email: undefined}));
            }}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Şifre</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
              placeholder="Şifrenizi girin"
              placeholderTextColor={Colors.textDisabled}
              secureTextEntry={obscurePassword}
              value={password}
              onChangeText={text => {
                setPassword(text);
                if (errors.password) setErrors(prev => ({...prev, password: undefined}));
              }}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setObscurePassword(!obscurePassword)}>
              <Text style={styles.eyeIcon}>
                {obscurePassword ? '👁️' : '🙈'}
              </Text>
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={Colors.white} size="small" />
          ) : (
            <Text style={styles.loginButtonText}>Giriş Yap</Text>
          )}
        </TouchableOpacity>

        {/* Register Link */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Hesabınız yok mu? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Kayıt Ol</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flexGrow: 1,
    padding: Spacing.screenPadding,
    justifyContent: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  lockIcon: {
    fontSize: 40,
  },
  title: {
    ...Typography.headline2,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.titleSmall,
    marginBottom: Spacing.xs,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.greyLight,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
  },
  inputError: {
    borderColor: Colors.error,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  eyeIcon: {
    fontSize: 22,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  loginButton: {
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    ...Typography.button,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  registerText: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
  },
  registerLink: {
    ...Typography.bodyMedium,
    color: Colors.primary,
    fontWeight: '700',
  },
});

export default LoginScreen;
