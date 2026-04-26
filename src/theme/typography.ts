import {StyleSheet} from 'react-native';
import {Colors} from './colors';

export const Typography = StyleSheet.create({
  headline1: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  headline2: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  headline3: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  headline5: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  headline6: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  headlineSmall: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  titleMedium: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  titleSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  caption: {
    fontSize: 11,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
});
