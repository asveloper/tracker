import React, { Component } from 'react';
import Meteor,  { createContainer, MeteorComplexListView } from 'react-native-meteor';
import moment from 'moment';

import {
  StyleSheet,
  Text,
  View,
  PropTypes,
  TouchableHighlight,
  TextInput,
} from 'react-native';

import Details from './details.js';

class Trips extends Component {
  constructor(props){
    super(props);

    this.state = {
      tripId: undefined
    };

    // bind functions here
  }

  showDetails(trip){
    this.setState({
      tripId: trip._id
    });

    this.props.showTrip(true);
  }

  renderHeader(){
    return(
      <View style={styles.content}>
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

    let date = moment(trip.createdAt).format("Do MMMM YYYY, hh:mm a");

    return(
      <TouchableHighlight onPress={() => this.showDetails(trip)}>
        <View style={styles.content}>
          <View style={styles.dateColumn}>
            <Text>{date}</Text>
          </View>
          <View style={styles.distanceColumn}>
            <Text>{trip.distance} KM</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render() {

    const { tripsReady, details } = this.props;

    if(details){
      return <Details tripId={this.state.tripId}  />;
    }

    return (
      <View style={{flex: 1}}>
        <TextInput
          ref="search"
          keyboardType={'default'}
          placeholder='Search Trips'
          style={styles.search}
          enablesReturnKeyAutomatically={true}
          onChangeText={(search) => this.setState({search})}
          value={this.state.search}
        />

        <MeteorComplexListView
          elements={()=>{return Meteor.collection('trips').find({createdBy: Meteor.userId()}, {sort: {createdAt: -1}})}}
          renderHeader={this.renderHeader}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections={true}
          style={styles.listView}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
        />
      </View>
    );
  }

}

Trips.propTypes = {
  details: React.PropTypes.bool.isRequired,
  showTrip: React.PropTypes.func.isRequired
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
    backgroundColor: '#F5FCFF',
  },
  container: {
    marginTop: 0,
  },
  content: {
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
  },
  search: {
    height: 30,
    borderColor: 'gray',
    backgroundColor: 'white',
    marginBottom: 5,
    paddingTop: 0,
    paddingBottom: 0,
  }
});
