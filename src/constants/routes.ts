export const Routes = {
  // Onboarding
  Splash: 'Splash',
  Onboarding: 'Onboarding',
  RoleSelection: 'RoleSelection',

  // Auth
  Login: 'Login',
  Register: 'Register',

  // Parent
  ParentDashboard: 'ParentDashboard',
  AppBlocking: 'AppBlocking',
  TimeRestriction: 'TimeRestriction',
  UsageStatistics: 'UsageStatistics',
  QrGeneration: 'QrGeneration',
  PairingScreen: 'PairingScreen',
  Reports: 'Reports',
  RulesEdit: 'RulesEdit',

  // Child
  ChildDashboard: 'ChildDashboard',
  QrScanner: 'QrScanner',
  PairingInput: 'PairingInput',

  // Common
  Settings: 'Settings',
  Notifications: 'Notifications',
  Permissions: 'Permissions',
  Error: 'Error',
} as const;

export type RouteName = (typeof Routes)[keyof typeof Routes];
