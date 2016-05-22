var ReactNative = require('react-native');

var {
  AppRegistry,
} = ReactNative;

import { Login } from './components/login.js';
import { Geolocation } from './components/geolocation.js';

AppRegistry.registerComponent('KoTacTracker', () => Geolocation);
