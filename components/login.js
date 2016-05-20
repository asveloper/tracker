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
      loggedIn: false
    }
  },
  _handleLogin(event){
    ToastAndroid.show('Login Pressed!', ToastAndroid.LONG);
    let email = this.refs.email.props.value;
    let password = this.refs.password.props.value;

    this.fetchData(email, password);

    if(this.state.loggedIn){
      this.setState({startTracking: true});
    }

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
      if(status == "success"){
        AsyncStorage.setItem('authToken', responseData.data.authToken);
        AsyncStorage.setItem('userId', responseData.data.userId);

        this.setState({loggedIn: true});
      }
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
          ref="email"
          onChangeText={(email) => this.setState({email})}
          value={this.state.email}
        />

        <TextInput
          style={styles.input}
          placeholder='Password'
          secureTextEntry={true}
          ref="password"
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
