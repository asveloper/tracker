'use strict';

import {
  AppRegistry,
} from 'react-native';

import { Login } from './components/login.js';
import { Geolocation } from './components/geolocation.js';
import { StartTracking } from './components/start_tracking.js';

AppRegistry.registerComponent('KoTacTracker', () => StartTracking);
