var ReactNative = require('react-native');

var {
  AppRegistry
} = ReactNative;

import { Geolocation } from './app/geolocation.js';

AppRegistry.registerComponent('KoTacTracker', () => Geolocation);
