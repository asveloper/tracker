var ReactNative = require('react-native');

var {
  AppRegistry,
} = ReactNative;

import { Login } from './components/login.js';

AppRegistry.registerComponent('KoTacTracker', () => Login);
