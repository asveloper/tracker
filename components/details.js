'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Config = require('../config');

var {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  BackAndroid,
} = ReactNative;

import { Dashboard } from './dashboard.js';

var REQUEST_URL = Config.SERVER_URL.concat(Config.USER_TRIPS_PATH);

export const Details = React.createClass({
  getInitialState: function(){
    return{
      authToken: undefined,
      userId: undefined,
      dashboard: false
    }
  },

  fetchData: function(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status > 210) {
        console.warn('Error occured');
        console.log(responseData);
      } else {
        let responseData = JSON.parse(request.responseText);

        if(responseData.status == "success"){

        }
      }
    };

    request.open('GET', REQUEST_URL);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.setRequestHeader("X-Auth-Token", this.state.authToken);
    request.setRequestHeader("X-User-Id", this.state.userId);
    request.send();

  },

  componentDidMount: function(){
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
        this.fetchData();
      }
    });

    BackAndroid.addEventListener('hardwareBackPress', this.backAndroidHandler);
  },

  componentWillUnmount: function() {
    BackAndroid.removeEventListener('hardwareBackPress', this.backAndroidHandler);
  },

  backAndroidHandler: function() {
    this.setState({dashboard: true});
    return true;
  },

  render: function() {

    if(this.state.dashboard){
      return <Dashboard />;
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderTrip}
        style={styles.listView}
        renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
      />
    );
  },

  renderTrip: function(trip){
    let date = new Date(trip.createdAt);
    let day = date.getDate(); //Date of the month: 2 in our example
    let month = date.getMonth(); //Month of the Year: 0-based index, so 1 in our example
    let year = date.getFullYear(); //Year: 2013

    return(
      <View style={styles.container}>
        <View style={styles.dateColumn}>
          <Text>{day}-{month}-{year}</Text>
        </View>
        <View style={styles.distanceColumn}>
          <Text>{trip.distance} KM</Text>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  dateColumn: {
    width: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
    flex: 1
  },
  distanceColumn: {
    width: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
});
