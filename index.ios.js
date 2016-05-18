var ReactNative = require('react-native');

var {
  AppRegistry
} = ReactNative;

import { Geolocation } from './geolocation.js';

AppRegistry.registerComponent('KoTacTracker', () => Geolocation);
