'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Config = require('../config');

var {
  StyleSheet,
  Text,
  View,
  ListView,
  AsyncStorage,
} = ReactNative;

var REQUEST_URL = Config.SERVER_URL.concat(Config.USER_TRIPS_PATH);

export const Trips = React.createClass({
  getInitialState: function(){
    return{
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      loaded: false,
      authToken: undefined,
      userId: undefined
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
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(responseData.data),
            loaded: true
          });
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

    console.log("Trips rendered");
  },
  render: function() {
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
    return(
      <View style={styles.container}>
        <View style={styles.row}>
          <Text>{trip.createdAt}</Text>
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
  row: {
    width: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
});
