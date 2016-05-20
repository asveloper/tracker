var React = require('react');
var ReactNative = require('react-native');
var Button = require('react-native-button');
var Config = require('./config');

var {
  AppRegistry,
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  ToastAndroid
} = ReactNative;

import { Start } from './components/start.js';

const REQUEST_URL = Config.SERVER_URL.concat(Config.LOGIN_PATH);

var KoTacTracker = React.createClass({
  getInitialState(){
    return{
      start: false,
    }
  },
  _handleLogin(event){
    ToastAndroid.show('Login Pressed!', ToastAndroid.LONG);

    // TODO: send form creds and fetch data

    // TODO: Store authToken and userId in AsyncStorage

    this.setState({start: true});
  },
  fetchData: function(email, password){
    fetch(REQUEST_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log(responseData);
    })
    .done();
  },
  render(){

    if(this.state.start){
      return <Start />;
    }

    return(
      <Button
        style={{fontSize: 20, color: 'green', marginTop: 50}}
        styleDisabled={{color: 'red'}}
        onPress={this._handleLogin}
      >
        Login!
      </Button>
    );
  },
});

AppRegistry.registerComponent('KoTacTracker', () => KoTacTracker);
