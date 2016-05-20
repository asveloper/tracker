var React = require('react');
var ReactNative = require('react-native');
var Button = require('react-native-button');
var Config = require('../config');

var {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  TextInput,
  ToastAndroid
} = ReactNative;

import { StartTracking } from './start_tracking.js';

const REQUEST_URL = Config.SERVER_URL.concat(Config.LOGIN_PATH);

export const Login = React.createClass({
  getInitialState(){
    return{
      startTracking: false,
    }
  },
  _handleLogin(event){
    ToastAndroid.show('Login Pressed!', ToastAndroid.LONG);

    // TODO: send form creds and fetch data

    // TODO: Store authToken and userId in AsyncStorage

    this.setState({startTracking: true});
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

    if(this.state.startTracking){
      return <StartTracking />;
    }

    return(
      <View>
        <TextInput
          style={styles.input}
          autoFocus={true}
          keyboardType='email-address'
          placeholder='Email'
          onChangeText={(email) => this.setState({email})}
          value={this.state.email}
        />

        <TextInput
          style={styles.input}
          placeholder='Password'
          secureTextEntry={true}
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
        />

        <Button
          style={{fontSize: 20, color: 'green', marginTop: 20}}
          styleDisabled={{color: 'red'}}
          onPress={this._handleLogin}
        >
          Login!
        </Button>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1
  }
});
