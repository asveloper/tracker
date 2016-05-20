var React = require('react');
var ReactNative = require('react-native');
var Button = require('react-native-button');
var Config = require('./config');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ToastAndroid
} = ReactNative;

import { Geolocation } from './components/geolocation.js';

const REQUEST_URL = Config.SERVER_URL.concat(Config.LOGIN_PATH);

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
  fetchData: function(){
    fetch(REQUEST_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: "test@kotactracker.com",
        password: "password"
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log(responseData);
    })
    .done();
  },
  componentDidMount: function(){
    this.fetchData();
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
