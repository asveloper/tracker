import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';

import Meteor, { createContainer } from 'react-native-meteor';
import Button from 'react-native-awesome-button';

import Dashboard from './dashboard.js';

class Login extends Component {

  constructor(props){
    super(props);
    this.state = {
      dashboard: false,
      buttonState: 'idle'
    }

    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(event){
    var _this = this;

    let username = this.refs.username.props.value;
    let password = this.refs.password.props.value;

    this.setState({ buttonState: 'busy' });

    Meteor.loginWithPassword(username, password, function(err, result){
      if(err){
        console.log(err);
      }else{
        _this.setState({ buttonState: 'success' })
        _this.setState({dashboard: true});
      }
    });
  }

  render(){

    if(this.state.dashboard){
      return <Dashboard />;
    }

    return(
      <View style={styles.container}>

        <TextInput
          style={styles.input}
          autoFocus={true}
          keyboardType={'default'}
          placeholder='Username'
          ref="username"
          returnKeyType={'next'}
          enablesReturnKeyAutomatically={true}
          onChangeText={(username) => this.setState({username})}
          onSubmitEditing={(event) => { this.refs.password.focus(); }}
          value={this.state.username}
        />

        <TextInput
          style={styles.input}
          placeholder='Password'
          secureTextEntry={true}
          ref="password"
          returnKeyType={'done'}
          enablesReturnKeyAutomatically={true}
          onSubmitEditing={this.handleLogin}
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
        />

        <View>
          <Button
            backgroundStyle={styles.loginButtonBackground}
            labelStyle={styles.loginButtonLabel}
            transitionDuration={200}
            buttonState={this.state.buttonState}
            states={{
              idle: {
                text: 'Log In',
                onPress: this.handleLogin,
                backgroundColor: '#1155DD',
              },
              busy: {
                text: 'Logging In',
                backgroundColor: '#002299',
                spinner: true,
              },
              success: {
                text: 'Logged In',
                backgroundColor: '#339944'
              }
            }}
          />
        </View>

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
  };
}, Login)

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    marginLeft: 10,
    fontSize: 18
  },
  loginButtonBackground: {
    width: 100,
    height: 40,
    borderRadius: 5
  },
  loginButtonLabel: {
    color: 'white'
  }
});
