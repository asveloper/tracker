var React = require('react');
var ReactNative = require('react-native');
var Button = require('apsl-react-native-button');
var Config = require('../config');

var {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  TextInput,
} = ReactNative;

import { Dashboard } from './dashboard.js';

const REQUEST_URL = Config.SERVER_URL.concat(Config.LOGIN_PATH);

export const Login = React.createClass({
  getInitialState(){
    return{
      dashboard: false
    }
  },

  _handleLogin(event){
    let username = this.refs.username.props.value;
    let password = this.refs.password.props.value;

    this.fetchData(username, password);

  },

  fetchData: function(username, password){
    fetch(REQUEST_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      if(responseData.status == "success"){
        AsyncStorage.setItem('authToken', responseData.data.authToken);
        AsyncStorage.setItem('userId', responseData.data.userId);

        this.setState({dashboard: true});
      }else{
        console.warn("Invalid Username or Password");
      }
    })
    .done();
  },

  render(){

    if(this.state.dashboard){
      return <Dashboard />;
    }

    return(
      <View>
        <TextInput
          style={styles.input}
          autoFocus={true}
          keyboardType='default'
          placeholder='Username'
          ref="username"
          onChangeText={(username) => this.setState({username})}
          value={this.state.username}
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
          style={{backgroundColor: '#87CEFA'}}
          textStyle={{fontSize: 18}}
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
