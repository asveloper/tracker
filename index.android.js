import Meteor from 'react-native-meteor';

import {
  AppRegistry
} from 'react-native';

import Config from "./config.json";

if(process.env.NODE_ENV == "development"){
  Meteor.connect(Config.DEV_SOCKET_URL);
}else if(process.env.NODE_ENV == "production"){
  Meteor.connect(Config.PROD_SOCKET_URL);
}

Meteor.ddp.on('connected', () => {
  console.log("DDP connected");
});

import Login from './components/login.js';

AppRegistry.registerComponent('KoTacTracker', () => Login);
