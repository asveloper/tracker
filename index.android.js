import React from 'react';
import Meteor from 'react-native-meteor';
import DrawerLayout from 'react-native-drawer-layout';

import {
  AppRegistry,
  DrawerLayoutAndroid,
  StatusBar,
  View,
  Text,
  TouchableHighlight
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

// import Login from './components/login.js';

var Nav = React.createClass({
  getInitialState(){
    return {
      text: 'World!',
      translucent: false
    }
  },

  render: function() {
    var navigationView = (
      <TouchableHighlight style={{flex: 1, backgroundColor: '#000', marginTop: 30}} underlayColor={'transparent'} onPress={() => this.setState({text: "Sumbal"})}>
        <Text style={{margin: 10, fontSize: 15, textAlign: 'left', color: '#fff'}}>I'm in the Drawer!</Text>
      </TouchableHighlight>
    );
    return (
      <DrawerLayoutAndroid
        drawerWidth={300}
        drawerPosition={DrawerLayout.positions.Left}
        renderNavigationView={() => navigationView}
        drawerBackgroundColor={'#000'}
        keyboardDismissMode={'on-drag'}
        onDrawerOpen={() => StatusBar.setHidden(true, 'slide')}
        onDrawerClose={() => StatusBar.setHidden(false)}
      >
        <View style={{flex: 1, alignItems: 'center', marginTop: 30}}>
          <StatusBar
              translucent={this.state.translucent}
          />
          <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>Hello</Text>
          <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>{this.state.text}</Text>
        </View>
      </DrawerLayoutAndroid>
    );
  },
});

AppRegistry.registerComponent('KoTacTracker', () => Nav);
