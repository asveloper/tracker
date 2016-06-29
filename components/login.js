import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';

import Meteor, { createContainer } from 'react-native-meteor';
import Button from 'apsl-react-native-button';

import { Dashboard } from './dashboard.js';

class Login extends Component {

  constructor(props){
    super(props);
    this.state = {
      dashboard: false
    }

    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(event){
    var _this = this;

    let username = this.refs.username.props.value;
    let password = this.refs.password.props.value;

    Meteor.loginWithPassword(username, password, function(err, result){
      if(err){
        console.log(err);
      }else{
        _this.setState({dashboard: true});
      }
    });
  }

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
          onPress={this.handleLogin}
        >
          Login!
        </Button>
      </View>
    );
  }
}

Login.propTypes = {

};

Login.defaultProps = {

};

export default createContainer(params => {
  return {
    check: "hello"
  };
}, Login)

var styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1
  }
});
