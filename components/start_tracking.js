var React = require('react');
var ReactNative = require('react-native');
var Button = require('apsl-react-native-button');
var Config = require('../config');

var {
  ToastAndroid,
  AsyncStorage,
  View,
  StyleSheet,
} = ReactNative;

import { Trips } from './trips.js';
import { Geolocation } from './geolocation.js';

let REQUEST_URL = Config.SERVER_URL.concat(Config.TRIP_PATH);

export const StartTracking = React.createClass({
  getInitialState(){
    return{
      geolocation: false,
      listTrips: false,
      authToken: undefined,
      userId: undefined
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

  _startTrip(event){
    this.saveTrip();
  },

  _listTrips(event){
    this.setState({listTrips: true});
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

          this.setState({geolocation: true});
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

    if(this.state.geolocation){
      return <Geolocation />;
    }

    if(this.state.listTrips){
      return <Trips />;
    }

    return(
      <View style={styles.container}>
        <Button
          style={{backgroundColor: '#87CEFA'}}
          textStyle={{fontSize: 20}}
          onPress={this._startTrip}
        >
          Start!
        </Button>

        <Button
          style={{backgroundColor: 'green'}}
          textStyle={{fontSize: 20}}
          onPress={this._listTrips}
        >
          List Trips!
        </Button>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    marginTop: 50
  }
});
