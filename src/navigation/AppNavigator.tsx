import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Colors} from '../theme';

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

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: {backgroundColor: Colors.primary},
          headerTintColor: Colors.white,
          headerTitleStyle: {fontWeight: '600'},
          contentStyle: {backgroundColor: Colors.background},
        }}>
        {/* Onboarding Flow */}
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RoleSelection"
          component={RoleSelectionScreen}
          options={{title: 'Rol Seçimi'}}
        />

        {/* Auth Flow */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{title: 'Kayıt Ol'}}
        />

        {/* Parent Screens */}
        <Stack.Screen
          name="ParentDashboard"
          component={ParentDashboardScreen}
          options={{
            title: 'Ebeveyn Paneli',
            headerLeft: () => null, // Prevent back navigation
          }}
        />
        <Stack.Screen
          name="AppBlocking"
          component={AppBlockingScreen}
          options={{
            title: 'Uygulama Kilidi',
            headerStyle: {backgroundColor: Colors.warning},
          }}
        />
        <Stack.Screen
          name="TimeRestriction"
          component={TimeRestrictionScreen}
          options={{
            title: 'Zaman Kısıtlamaları',
            headerStyle: {backgroundColor: Colors.parentPrimary},
            headerTintColor: Colors.white,
          }}
        />
        <Stack.Screen
          name="UsageStatistics"
          component={UsageStatisticsScreen}
          options={{title: 'Kullanım İstatistikleri'}}
        />
        <Stack.Screen
          name="QrGeneration"
          component={QrGenerationScreen}
          options={{title: 'QR Kod Oluştur'}}
        />
        <Stack.Screen
          name="PairingScreen"
          component={PairingScreen}
          options={{title: 'Cihaz Eşleştirme'}}
        />
        <Stack.Screen
          name="Reports"
          component={ReportsScreen}
          options={{title: 'Raporlar'}}
        />
        <Stack.Screen
          name="RulesEdit"
          component={RulesEditScreen}
          options={{title: 'Kural Düzenleme'}}
        />

        {/* Child Screens */}
        <Stack.Screen
          name="ChildDashboard"
          component={ChildDashboardScreen}
          options={{
            title: 'Çocuk Paneli',
            headerStyle: {backgroundColor: Colors.childPrimary},
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="QrScanner"
          component={QrScannerScreen}
          options={{title: 'QR Kod Tara'}}
        />
        <Stack.Screen
          name="PairingInput"
          component={PairingInputScreen}
          options={{title: 'Eşleştirme Kodu'}}
        />

        {/* Common Screens */}
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{title: 'Ayarlar'}}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{title: 'Bildirimler'}}
        />
        <Stack.Screen
          name="Permissions"
          component={PermissionScreen}
          options={{title: 'İzinler'}}
        />
        <Stack.Screen
          name="Error"
          component={ErrorScreen}
          options={{title: 'Hata'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
