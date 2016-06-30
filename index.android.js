import Meteor from 'react-native-meteor';

import {
  AppRegistry,
} from 'react-native';

import Config from "./config.json";

Meteor.connect(Config.SOCKET_URL);

Meteor.ddp.on('connected', () => {
  console.log("DDP connected");
});

import Login from './components/login.js';

AppRegistry.registerComponent('KoTacTracker', () => Login);
