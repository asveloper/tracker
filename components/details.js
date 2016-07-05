import React, { Component } from 'react';
import Meteor,  { createContainer } from 'react-native-meteor';
import moment from 'moment';

import {
  StyleSheet,
  Text,
  PropTypes,
  View,
} from 'react-native';

class Details extends Component {
  constructor(props){
    super(props);

    this.state = {
    };

    // bind functions here
    this.displayTime = this.displayTime.bind(this);
  }

  displayTime(trip, obj){
    let time = null;

    if(obj != null){
      time = moment(obj.createdAt).format("DD-MM-YYYY, h:mm:ss a");
    }else{
      time = moment(trip.createdAt).format("DD-MM-YYYY, h:mm:ss a");
    }

    return time;
  }

  render() {

    const { tripReady, trip, startTime, endTime } = this.props;

    return (
      <View>
        <Text>Start Time: {this.displayTime(trip, startTime)}</Text>
        <Text>End Time: {this.displayTime(trip, endTime)}</Text>
        <Text>Distance: {trip.distance} KM</Text>
      </View>
    );
  }

}

Details.propTypes = {
  tripId: React.PropTypes.string.isRequired
};

Details.defaultProps = {

};

export default createContainer(params => {
  const handle = Meteor.subscribe('trips');
  Meteor.subscribe('coordinates');

  return {
    tripReady: handle.ready(),
    trip: Meteor.collection('trips').findOne({_id: params.tripId}),
    coordinates: Meteor.collection('coordinates').find({tripId: params.tripId}, {sort: {createdAt: 1}}),
    startTime: Meteor.collection('coordinates').findOne({tripId: params.tripId}, {sort: {createdAt: 1}}),
    endTime: Meteor.collection('coordinates').findOne({tripId: params.tripId}, {sort: {createdAt: -1}})
  };
}, Details);


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
