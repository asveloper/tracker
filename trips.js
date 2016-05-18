'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  ListView
} = React;

var REQUEST_URL = "";

export const Trips = React.createClass({
  getInitialState: function(){
    return{
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      loaded: false
    }
  },
  fetchData: function(){
    fetch(REQUEST_URL)
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(responseData),
        loaded: true
      });
    })
    .done();
  },
  componentDidMount: function(){
    this.fetchData();
  },
  render: function() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderTrip}
        style={styles.listView} />
    );
  },

  renderTrip: function(trip){
    return(
      <View style={styles.container}>
        <Text>{trip.title}</Text>
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
});
