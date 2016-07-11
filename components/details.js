import React, { Component } from 'react';
import Meteor,  { createContainer } from 'react-native-meteor';
import MapView from 'react-native-maps';
import moment from 'moment';

import {
  StyleSheet,
  Text,
  PropTypes,
  Dimensions,
  View,
} from 'react-native';

var screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.000922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class Details extends Component {
  constructor(props){
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
    };

    // bind functions here
    this.displayTime = this.displayTime.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
  }

  componentDidMount(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition});

        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }
        });

      },
      (error) => {
        console.warn(error);
      },
      {
        enableHighAccuracy: false,
        timeout: 1000
      }
    );
  }

  onRegionChange(region){
    this.setState({region});
  }

  displayTime(obj){
    let time = null;

    if(obj != null){
      time = moment(obj.createdAt).format("Do MMMM YYYY, h:mm a");
    }

    return time;
  }

  render() {

    const { tripReady, trip, startTime, endTime } = this.props;

    return (
      <View>
        <Text>Start Time: {this.displayTime(startTime)}</Text>
        <Text>End Time: {this.displayTime(endTime)}</Text>

        <View style={styles.mapContainer}>
          <MapView
            ref="map1"
            style={styles.map}
            region={this.state.region}
            zoomEnabled={true}
            loadingEnabled={true}
            onRegionChange={this.onRegionChange}
          >

          </MapView>

        </View>
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
  mapContainer: {
    marginTop: 20,
    width: 300,
    height: 380,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

});
