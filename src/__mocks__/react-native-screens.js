// Web mock for react-native-screens
const React = require('react');
const {View} = require('react-native');

module.exports = {
  enableScreens: () => {},
  enableFreeze: () => {},
  screensEnabled: () => true,
  Screen: View,
  ScreenContainer: View,
  NativeScreen: View,
  NativeScreenContainer: View,
  ScreenStack: View,
  ScreenStackHeaderConfig: View,
  ScreenStackHeaderSubview: View,
  ScreenStackHeaderLeftView: View,
  ScreenStackHeaderRightView: View,
  ScreenStackHeaderCenterView: View,
  ScreenStackHeaderBackButtonImage: View,
  SearchBar: View,
  FullWindowOverlay: View,
  useTransitionProgress: () => ({}),
};
