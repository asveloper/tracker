import React, { Component } from 'react';
import Meteor, { createContainer } from 'react-native-meteor';
import MapView from 'react-native-maps';
import Geolib from 'geolib';

import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  TouchableOpacity,
  AsyncStorage,
  PropTypes,
} from 'react-native';

var screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;
// const LATITUDE = 37.78825;
// const LONGITUDE = -122.4324;
const LATITUDE = -37.876831;
const LONGITUDE = 145.142873;
const LATITUDE_DELTA = 0.000922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class Geolocation extends Component {

  constructor(props){
    super(props);

    this.state = {
      tripId: undefined,
      distance: 0.0,
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      path: [],
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      testRegion: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      initialMarker: {
        coordinate: {
          latitude: 0,
          longitude: 0
        }
      },
      data: [
        {latitude: -37.876831, longitude: 145.142873},
        {latitude: -37.8766488, longitude: 145.1411753},
        {latitude: -37.8786473, longitude: 145.1408366},
        {latitude: -37.879087, longitude: 145.1386928},
        {latitude: -37.877777, longitude: 145.1356148},
        {latitude: -37.8775624, longitude: 145.1340531},
        {latitude: -37.8769497, longitude: 145.1309312},
        {latitude: -37.8769963, longitude: 145.1296253},
        {latitude: -37.8771176, longitude: 145.1308502},
        {latitude: -37.8775248, longitude: 145.1337004},
        {latitude: -37.8777593, longitude: 145.1356856},
        {latitude: -37.8779451, longitude: 145.1369028},
        {latitude: -37.8787425, longitude: 145.1376915},
        {latitude: -37.8792274, longitude: 145.1392679},
        {latitude: -37.8792196, longitude: 145.1405213},
        {latitude: -37.8763649, longitude: 145.1413673},
        {latitude: -37.8768381, longitude: 145.1431425},
        {latitude: -37.87701, longitude: 145.1446022},
      ]
    };

    this.watchID;

    //bind functions here
    this.saveCoordinates = this.saveCoordinates.bind(this);
    this.stopTrip = this.stopTrip.bind(this);
    this.updateCoords = this.updateCoords.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
    this.currentTrip = this.currentTrip.bind(this);
  }

  componentDidMount() {

    var _this = this;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition});

        this.setState({
          initialMarker: {
            coordinate: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          },
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

    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({lastPosition});

      this.setState({
        region: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }
      });

      this.saveCoordinates(position.coords.latitude, position.coords.longitude);
      this.updateCoords(position.coords.latitude, position.coords.longitude);

    },
      (error) => {
        console.log(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 1000
      }
    );

    //Add new trip
    Meteor.call("newTrip", Meteor.userId(), function(err, tripId){
      if(err){
        console.log(err);
      }else{
        _this.setState({tripId: tripId});
      }
    });


    this.currentTrip();

  }

  componentWillUnmount() {
    //save trip in DB
    this.stopTrip();

    navigator.geolocation.clearWatch(this.watchID);
  }

  saveCoordinates(latitude, longitude){
    var _this = this;

    Meteor.call('addCoordinates', {latitude: latitude.toString(), longitude: longitude.toString(), tripId: _this.state.tripId, createdBy: Meteor.userId()},  (err, coordinatesId) => {
      if(err){
        console.log(err);
      }
    });

  }

  stopTrip(){
    var _this = this;

    Meteor.collection('trips').update({_id: _this.state.tripId}, {
      $set: {
        distance: _this.state.distance,
        updatedBy: Meteor.userId()
      }
    });

  }

  updateCoords(latitude, longitude){

    let path = this.state.path.slice();
    let lat = parseFloat(latitude);
    let lng = parseFloat(longitude);
    path.push({latitude: lat, longitude: lng});

    this.setState({path: path});

    let distance = this.distance(path);

    this.setState({distance: distance});

    // Updating current trip distance
    this.currentTrip();

  }

  distance(path){
    //calculate distance
    let distanceInMeters = Geolib.getPathLength(path);
    return Geolib.convertUnit('km', distanceInMeters, 2);
  }

  onRegionChange(region){
    console.log(region);
    this.setState({
      testRegion: region
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
      },
      (error) => {
        console.warn(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 1000
      }
    );

  }

  currentTrip(){
    this.props.currentTrip(this.state.distance);
  }

  render() {

    return (
      <View style={styles.container}>
        <MapView
          ref="map"
          style={styles.map}
          region={this.state.region}
          showsUserLocation={true}
          followsUserLocation={true}
          showsScale={true}
          zoomEnabled={true}
          loadingEnabled={true}
          lineJoin='miter'
          onRegionChange={this.onRegionChange}
        >

          <MapView.Marker draggable
            coordinate={this.state.initialMarker.coordinate}
            title='Starting Point'
          />

          <MapView.Polyline
            coordinates={this.state.path}
            strokeColor="#F00"
            fillColor="rgba(255,0,0,0.5)"
            strokeWidth={3}
            lineCap='round'
            geodesic={true}
          />

        </MapView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.bubble, styles.coords]}>
            <Text>{this.state.testRegion.latitude}, {this.state.testRegion.longitude}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.bubble, styles.distance]}>
            <Text>{this.state.distance} KM</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }

}

Geolocation.propTypes = {
  currentTrip: React.PropTypes.func.isRequired
};

Geolocation.defaultProps = {

};

export default createContainer(params => {

  return {

  };
}, Geolocation);

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  distanceContainer: {
    width: 80,
    backgroundColor: 'green',
    flexDirection: 'row',
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    backgroundColor: 'transparent',
  },
  coords: {
    width: 180,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  distance: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
});
