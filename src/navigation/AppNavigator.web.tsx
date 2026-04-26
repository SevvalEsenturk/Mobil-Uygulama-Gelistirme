import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {Colors, Typography, Spacing} from '../theme';

// Onboarding Screens
import SplashScreen from '../screens/onboarding/SplashScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import RoleSelectionScreen from '../screens/onboarding/RoleSelectionScreen';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Parent Screens
import ParentDashboardScreen from '../screens/parent/ParentDashboardScreen';
import AppBlockingScreen from '../screens/parent/AppBlockingScreen';
import TimeRestrictionScreen from '../screens/parent/TimeRestrictionScreen';
import UsageStatisticsScreen from '../screens/parent/UsageStatisticsScreen';
import QrGenerationScreen from '../screens/parent/QrGenerationScreen';
import PairingScreen from '../screens/parent/PairingScreen';
import ReportsScreen from '../screens/parent/ReportsScreen';
import RulesEditScreen from '../screens/parent/RulesEditScreen';

// Child Screens
import ChildDashboardScreen from '../screens/child/ChildDashboardScreen';
import QrScannerScreen from '../screens/child/QrScannerScreen';
import PairingInputScreen from '../screens/child/PairingInputScreen';

// Common Screens
import SettingsScreen from '../screens/common/SettingsScreen';
import NotificationsScreen from '../screens/common/NotificationsScreen';
import PermissionScreen from '../screens/common/PermissionScreen';
import ErrorScreen from '../screens/common/ErrorScreen';

const screens: Record<string, React.FC<any>> = {
  Splash: SplashScreen,
  Onboarding: OnboardingScreen,
  RoleSelection: RoleSelectionScreen,
  Login: LoginScreen,
  Register: RegisterScreen,
  ParentDashboard: ParentDashboardScreen,
  AppBlocking: AppBlockingScreen,
  TimeRestriction: TimeRestrictionScreen,
  UsageStatistics: UsageStatisticsScreen,
  QrGeneration: QrGenerationScreen,
  PairingScreen: PairingScreen,
  Reports: ReportsScreen,
  RulesEdit: RulesEditScreen,
  ChildDashboard: ChildDashboardScreen,
  QrScanner: QrScannerScreen,
  PairingInput: PairingInputScreen,
  Settings: SettingsScreen,
  Notifications: NotificationsScreen,
  Permissions: PermissionScreen,
  Error: ErrorScreen,
};

const screenTitles: Record<string, string> = {
  Splash: '',
  Onboarding: '',
  RoleSelection: 'Rol Seçimi',
  Login: '',
  Register: 'Kayıt Ol',
  ParentDashboard: 'Ebeveyn Paneli',
  AppBlocking: 'Uygulama Kilidi',
  TimeRestriction: 'Zaman Kısıtlamaları',
  UsageStatistics: 'Kullanım İstatistikleri',
  QrGeneration: 'QR Kod Oluştur',
  PairingScreen: 'Cihaz Eşleştirme',
  Reports: 'Raporlar',
  RulesEdit: 'Kural Düzenleme',
  ChildDashboard: 'Çocuk Paneli',
  QrScanner: 'QR Kod Tara',
  PairingInput: 'Eşleştirme Kodu',
  Settings: 'Ayarlar',
  Notifications: 'Bildirimler',
  Permissions: 'İzinler',
  Error: 'Hata',
};

const noHeaderScreens = ['Splash', 'Onboarding', 'Login'];

const AppNavigator: React.FC = () => {
  const [stack, setStack] = useState<Array<{name: string; params?: any}>>([
    {name: 'Splash'},
  ]);

  const currentRoute = stack[stack.length - 1];
  const CurrentScreen = screens[currentRoute.name] || ErrorScreen;
  const title = screenTitles[currentRoute.name] || '';
  const showHeader = !noHeaderScreens.includes(currentRoute.name);
  const canGoBack = stack.length > 1 && showHeader;

  const navigation = {
    navigate: useCallback((name: string, params?: any) => {
      setStack(prev => [...prev, {name, params}]);
    }, []),
    replace: useCallback((name: string, params?: any) => {
      setStack(prev => {
        const next = [...prev];
        next[next.length - 1] = {name, params};
        return next;
      });
    }, []),
    goBack: useCallback(() => {
      setStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
    }, []),
    reset: useCallback(({routes}: {index: number; routes: Array<{name: string}>}) => {
      setStack(routes.map(r => ({name: r.name})));
    }, []),
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', flex: 1, maxWidth: 480, width: '100%', margin: '0 auto', minHeight: '100vh', backgroundColor: '#fff', boxShadow: '0 0 20px rgba(0,0,0,0.1)'}}>
      {/* Header */}
      {showHeader && title ? (
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '12px 16px', backgroundColor: Colors.primary, minHeight: 56}}>
          {canGoBack && (
            <div
              onClick={navigation.goBack}
              style={{cursor: 'pointer', padding: '4px 8px', marginRight: 8, color: '#fff', fontSize: 20}}>
              ←
            </div>
          )}
          <span style={{color: '#fff', fontSize: 18, fontWeight: 600}}>{title}</span>
        </div>
      ) : null}

      {/* Screen Content */}
      <div style={{display: 'flex', flexDirection: 'column', flex: 1, overflow: 'auto'}}>
        <CurrentScreen
          navigation={navigation}
          route={{params: currentRoute.params}}
        />
      </div>
    </div>
  );
};

export default AppNavigator;
