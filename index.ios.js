var React = require('react');
var ReactNative = require('react-native');
var Button = require('react-native-button');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ToastAndroid
} = ReactNative;

import { Geolocation } from './components/geolocation.js';

var KoTacTracker = React.createClass({
  getInitialState(){
    return{
      geolocation: false,
    }
  },
  _handlePress(event){
    ToastAndroid.show('Start Pressed!', ToastAndroid.LONG);
    this.setState({geolocation: true});
  },
  render(){

    if(this.state.geolocation){
      return <Geolocation />;
    }

    return(
      <Button
        style={{fontSize: 20, color: 'green', marginTop: 50}}
        styleDisabled={{color: 'red'}}
        onPress={this._handlePress}
      >
        Start!
      </Button>
    );
  },
});

AppRegistry.registerComponent('KoTacTracker', () => KoTacTracker);
