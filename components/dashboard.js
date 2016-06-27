var React = require('react');
var ReactNative = require('react-native');
var Button = require('apsl-react-native-button');
var Config = require('../config');

var {
  ToastAndroid,
  View,
  Text,
  Switch,
  StyleSheet,
} = ReactNative;

import { Trips } from './trips.js';
import { Geolocation } from './geolocation.js';

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
  },

  _handleTripsListing(event){

  },

  render(){

    let currentView, tripsListing;
    if(this.state.switchIsOn){
      currentView =  <Geolocation />;
      tripsListing = undefined;
    }else{
      currentView = <Trips />;
      tripsListing = this.tripsListing();
    }

    return(
      <View style={styles.container}>

        <View style={styles.header}>
          <Text>Log Book User ID: {this.state.userId}</Text>
          <Text>Total Trip / Current Trip</Text>
        </View>

        <View style={styles.viewContainer}>{currentView}</View>

        <View style={styles.footer}>

          <View style={styles.footerCol}>{tripsListing}</View>

          <View style={styles.footerCol}>
            <Switch
              onValueChange={this._handleSwitch}
              value={this.state.switchIsOn} />
          </View>

          <View style={styles.footerCol}>

          </View>

        </View>

      </View>
    );
  },

  tripsListing(){
    return(
      <Button
        style={{backgroundColor: '#87CEFA', height: 30}}
        textStyle={{fontSize: 14}}
        onPress={this._handleTripsListing}
      >
        Trips
      </Button>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    margin: 10
  },
  header: {
    alignItems: 'center',
  },
  viewContainer: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    width: 300,
    height: 450,
  },
  footer: {
    width: 300,
    marginTop:10,
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'row',
  },
  footerCol: {
    width: 100,
    left: 1,
    flexDirection: 'column',
  }
});
