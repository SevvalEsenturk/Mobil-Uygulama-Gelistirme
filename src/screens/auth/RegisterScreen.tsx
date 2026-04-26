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

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'Parent' | 'Child'>('Parent');
  const [isLoading, setIsLoading] = useState(false);
  const [obscurePassword, setObscurePassword] = useState(true);
  const [obscureConfirm, setObscureConfirm] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Ad Soyad gerekli';
    if (!email.trim()) newErrors.email = 'E-posta adresi gerekli';
    else if (!email.includes('@')) newErrors.email = 'Geçerli bir e-posta adresi girin';
    if (!password) newErrors.password = 'Şifre gerekli';
    else if (password.length < 6) newErrors.password = 'Şifre en az 6 karakter olmalı';
    if (!confirmPassword) newErrors.confirmPassword = 'Şifre tekrarı gerekli';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await authService.register({
        email: email.trim(),
        password,
        role: selectedRole,
      });
      Alert.alert('Başarılı', 'Kayıt başarılı! Giriş yapabilirsiniz.', [
        {text: 'Tamam', onPress: () => navigation.navigate('Login')},
      ]);
    } catch (e: any) {
      Alert.alert('Kayıt Başarısız', e.message || 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    errorKey: string,
    options?: {
      secureTextEntry?: boolean;
      onToggleSecure?: () => void;
      isSecure?: boolean;
      keyboardType?: any;
      autoCapitalize?: any;
      placeholder?: string;
    },
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={options?.secureTextEntry !== undefined ? styles.passwordContainer : undefined}>
        <TextInput
          style={[
            styles.input,
            options?.secureTextEntry !== undefined && styles.passwordInput,
            errors[errorKey] && styles.inputError,
          ]}
          placeholder={options?.placeholder || label}
          placeholderTextColor={Colors.textDisabled}
          value={value}
          onChangeText={text => {
            onChangeText(text);
            if (errors[errorKey]) setErrors(prev => ({...prev, [errorKey]: ''}));
          }}
          secureTextEntry={options?.isSecure}
          keyboardType={options?.keyboardType || 'default'}
          autoCapitalize={options?.autoCapitalize || 'sentences'}
          autoCorrect={false}
        />
        {options?.onToggleSecure && (
          <TouchableOpacity style={styles.eyeButton} onPress={options.onToggleSecure}>
            <Text style={styles.eyeIcon}>{options.isSecure ? '👁️' : '🙈'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {errors[errorKey] ? <Text style={styles.errorText}>{errors[errorKey]}</Text> : null}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Hesap Oluştur</Text>
        <Text style={styles.subtitle}>LockApp ailesine katılın</Text>

        {renderInput('Ad Soyad', name, setName, 'name', {placeholder: 'Adınız Soyadınız'})}
        {renderInput('E-posta', email, setEmail, 'email', {
          keyboardType: 'email-address',
          autoCapitalize: 'none',
          placeholder: 'ornek@email.com',
        })}
        {renderInput('Şifre', password, setPassword, 'password', {
          secureTextEntry: true,
          isSecure: obscurePassword,
          onToggleSecure: () => setObscurePassword(!obscurePassword),
          placeholder: 'Şifrenizi girin',
        })}
        {renderInput('Şifre Tekrar', confirmPassword, setConfirmPassword, 'confirmPassword', {
          secureTextEntry: true,
          isSecure: obscureConfirm,
          onToggleSecure: () => setObscureConfirm(!obscureConfirm),
          placeholder: 'Şifrenizi tekrar girin',
        })}

        {/* Role Selection */}
        <Text style={styles.roleLabel}>Rol Seçimi</Text>
        <View style={styles.roleRow}>
          <TouchableOpacity
            style={[
              styles.roleOption,
              selectedRole === 'Parent' && {
                borderColor: Colors.parentPrimary,
                backgroundColor: Colors.parentPrimary + '10',
              },
            ]}
            onPress={() => setSelectedRole('Parent')}>
            <Text style={styles.roleEmoji}>👨‍💼</Text>
            <Text
              style={[
                styles.roleText,
                selectedRole === 'Parent' && {
                  color: Colors.parentPrimary,
                  fontWeight: '700',
                },
              ]}>
              Ebeveyn
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleOption,
              selectedRole === 'Child' && {
                borderColor: Colors.childPrimary,
                backgroundColor: Colors.childPrimary + '10',
              },
            ]}
            onPress={() => setSelectedRole('Child')}>
            <Text style={styles.roleEmoji}>👧</Text>
            <Text
              style={[
                styles.roleText,
                selectedRole === 'Child' && {
                  color: Colors.childPrimary,
                  fontWeight: '700',
                },
              ]}>
              Çocuk
            </Text>
          </TouchableOpacity>
        </View>

        {/* Register Button */}
        <TouchableOpacity
          style={[styles.registerButton, isLoading && styles.disabledButton]}
          onPress={handleRegister}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={Colors.white} size="small" />
          ) : (
            <Text style={styles.registerButtonText}>Kayıt Ol</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Zaten hesabınız var mı? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1, backgroundColor: Colors.background},
  container: {flexGrow: 1, padding: Spacing.screenPadding, paddingTop: Spacing.lg},
  title: {...Typography.headline3, textAlign: 'center', marginBottom: Spacing.sm},
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  inputContainer: {marginBottom: Spacing.md},
  label: {...Typography.titleSmall, marginBottom: Spacing.xs},
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
  inputError: {borderColor: Colors.error},
  passwordContainer: {position: 'relative'},
  passwordInput: {paddingRight: 50},
  eyeButton: {position: 'absolute', right: 12, top: 12},
  eyeIcon: {fontSize: 22},
  errorText: {...Typography.caption, color: Colors.error, marginTop: Spacing.xs},
  roleLabel: {...Typography.headline6, marginBottom: Spacing.sm, marginTop: Spacing.sm},
  roleRow: {flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg},
  roleOption: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.greyLight,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  roleEmoji: {fontSize: 36, marginBottom: Spacing.sm},
  roleText: {...Typography.bodyMedium, color: Colors.textSecondary},
  registerButton: {
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {opacity: 0.7},
  registerButtonText: {...Typography.button},
  loginRow: {flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg, marginBottom: Spacing.lg},
  loginText: {...Typography.bodyMedium, color: Colors.textSecondary},
  loginLink: {...Typography.bodyMedium, color: Colors.primary, fontWeight: '700'},
});

export default RegisterScreen;
