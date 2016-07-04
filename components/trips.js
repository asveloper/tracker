import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

import Meteor,  { createContainer, MeteorComplexListView } from 'react-native-meteor';

import Details from './details.js';

class Trips extends Component {
  constructor(props){
    super(props);

    this.state = {
      details: false,
      tripId: undefined
    };

    // bind functions here
    this.onRender = this.onRender.bind(this);
  }

  componentWillUnmount(){
    console.log("trips component mounted");
  }

  showDetails(trip){
    // this.setState({
    //   tripId: trip._id,
    //   details: true
    // });
  }

  onRender(){
    console.log("Parent function called from child");
  }

  renderHeader(){
    return(
      <View style={styles.container}>
        <View style={styles.dateColumn}>
          <Text style={styles.headerText}>Trip Date</Text>
        </View>
        <View style={styles.distanceColumn}>
          <Text style={styles.headerText}>Distance</Text>
        </View>
      </View>
    );
  }

  renderRow(trip){

    let date = new Date(trip.createdAt);
    let day = date.getDate(); //Date of the month: 2 in our example
    let month = date.getMonth() + 1; //Month of the Year: 0-based index, so 1 in our example
    let year = date.getFullYear(); //Year: 2013

    return(
      <TouchableHighlight onPress={() => this.showDetails(trip)}>
        <View style={styles.container}>
          <View style={styles.dateColumn}>
            <Text>{day}-{month}-{year}</Text>
          </View>
          <View style={styles.distanceColumn}>
            <Text>{trip.distance} KM</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render() {

    const { tripsReady } = this.props;

    if(this.state.details){
      return <Details tripId={this.state.tripId} onRender={this.onRender} />;
    }

    return (

      <MeteorComplexListView
        elements={()=>{return Meteor.collection('trips').find({createdBy: Meteor.userId()}, {sort: {createdAt: -1}})}}
        renderHeader={this.renderHeader}
        renderRow={this.renderRow.bind(this)}
        enableEmptySections={true}
        style={styles.listView}
        renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
      />
    );
  }

}

Trips.propTypes = {

};

Trips.defaultProps = {

};

export default createContainer(params => {
  const handle = Meteor.subscribe('trips');

  return {
    tripsReady: handle.ready(),
    trips: Meteor.collection('trips').find({createdBy: Meteor.userId()}, {sort: {createdAt: -1}})
  };
}, Trips);


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
  headerText: {
    fontSize: 22,
    fontWeight: "bold"
  }
});
