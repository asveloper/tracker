var React = require('react');
var ReactNative = require('react-native');
var Button = require('apsl-react-native-button');
var Config = require('../config');

var {
  ToastAndroid,
  AsyncStorage,
  View,
  Switch,
  StyleSheet,
} = ReactNative;

import { Trips } from './trips.js';
import { Geolocation } from './geolocation.js';

let REQUEST_URL = Config.SERVER_URL.concat(Config.TRIP_PATH);

export const Dashboard = React.createClass({
  getInitialState(){
    return{
      authToken: undefined,
      userId: undefined,
      switchIsOn: false
    }
  },

  componentDidMount(){
    AsyncStorage.getItem('authToken', (err, authToken) => {
      if(err){
        console.log(err);
      }else{
        this.setState({authToken: authToken});
      }
    });
    AsyncStorage.getItem('userId', (err, userId) => {
      if(err){
        console.log(err);
      }else{
        this.setState({userId: userId});
      }
    });
  },

  _handleSwitch(value){
    this.setState({switchIsOn: value});

    if(value){
      this.saveTrip();
    }else{
      // TODO: Stop existing trip and save it in DB
    }
  },

  saveTrip: function(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status > 210) {
        console.warn('Error occured');
      } else {
        let responseData = JSON.parse(request.responseText);

        if(responseData.status == "success"){
          AsyncStorage.setItem('tripId', responseData.data._id);
        }
      }
    };

    let params = "createdBy="+this.state.userId;
    request.open('POST', REQUEST_URL);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.setRequestHeader("X-Auth-Token", this.state.authToken);
    request.setRequestHeader("X-User-Id", this.state.userId);
    request.send(params);

  },

  render(){

    var currentView;
    if(this.state.switchIsOn){
      currentView =  <Geolocation />;
    }else{
      currentView = <Trips />;
    }

    return(
      <View style={styles.container}>

        <View style={styles.viewContainer}>{currentView}</View>

        <Switch
          onValueChange={this._handleSwitch}
          ref="switchIsOn"
          value={this.state.switchIsOn} />

      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    margin: 10
  },
  viewContainer: {
    marginTop: 50,
    marginLeft: 20,
    marginRight: 20,
    width: 300,
    height: 400,
  }
});
