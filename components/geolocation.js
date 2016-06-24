var React = require('react');
var ReactNative = require('react-native');
var MapView = require('react-native-maps');
var Geolib = require('geolib');
var Config = require('../config');

var {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  TouchableOpacity,
  AsyncStorage,
} = ReactNative;

import { Dashboard } from './dashboard.js';

var screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.000922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

let REQUEST_URL = Config.SERVER_URL.concat(Config.COORDS_PATH);
let UPDATE_REQUEST_URL = Config.SERVER_URL.concat(Config.TRIP_UPDATE_PATH);

export const Geolocation = React.createClass({
  watchID: (null: ?number),

  getInitialState: function() {
    return {
      authToken: undefined,
      userId: undefined,
      tripId: undefined,
      distance: 0.0,
      dashboard: false,
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      coordinates: [],
      endMarkerCheck: false,
      region: {
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
      endMarker: {
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
  },

  componentDidMount: function() {

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
        console.alert(error);
      },
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
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

      this.updateCoords(position.coords.latitude, position.coords.longitude);

    },
    (error) => {
      console.log(error);
    },
    { timeout: 30000 }
    );

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
    AsyncStorage.getItem('tripId', (err, tripId) => {
      if(err){
        console.log(err);
      }else{
        this.setState({tripId: tripId});
      }
    });

  },

  componentWillUnmount: function() {
    navigator.geolocation.clearWatch(this.watchID);

    AsyncStorage.removeItem('tripId', (err) => {
      if(err){
        console.log(err);
      }
    });
  },

  saveTrip: function(latitude, longitude){
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
          console.log(responseData);
        }
      }
    };

    let params = "latitude="+latitude+"&longitude="+longitude+"&tripId="+this.state.tripId+"&createdBy="+this.state.userId;
    request.open('POST', REQUEST_URL);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.setRequestHeader("X-Auth-Token", this.state.authToken);
    request.setRequestHeader("X-User-Id", this.state.userId);
    request.send(params);

  },

  updateCoords: function(latitude, longitude){

    let coordinates = this.state.coordinates.slice();
    let lat = parseFloat(latitude);
    let lng = parseFloat(longitude);
    coordinates.push({latitude: lat, longitude: lng});

    this.setState({coordinates: coordinates});


    //calculate distance
    let distanceInMeters = Geolib.getPathLength(coordinates);
    let distance = Geolib.convertUnit('km', distanceInMeters, 2);

    this.setState({distance: distance});

  },

  stopTrip: function(){
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
          console.log(responseData);

          this.state.coordinates.map((coordinate) => {
            this.saveTrip(coordinate.latitude, coordinate.longitude);
          });

        }
      }
    };

    let params = "distance="+this.state.distance+"&_id="+this.state.tripId+"&updatedBy="+this.state.userId;
    request.open('POST', UPDATE_REQUEST_URL);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.setRequestHeader("X-Auth-Token", this.state.authToken);
    request.setRequestHeader("X-User-Id", this.state.userId);
    request.send(params);

  },

  _onRegionChange(region) {
    // this.setState({ region });
  },

  _stop( event ){
    this.stopTrip();

    this.setState({
      dashboard: true,
      endMarkerCheck: true
    });
  },

  render: function() {

    if(this.state.dashboard){
      return <Dashboard />;
    }

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
          onRegionChange={this._onRegionChange}
        >

          <MapView.Marker
            coordinate={this.state.initialMarker.coordinate}
            title='Starting Point'
          />

          <MapView.Polyline
            coordinates={this.state.coordinates}
            strokeColor="#F00"
            fillColor="rgba(255,0,0,0.5)"
            strokeWidth={3}
            lineCap='round'
          />

        </MapView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.bubble, styles.coords]}>
            <Text>{this.state.region.latitude}, {this.state.region.longitude}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.bubble, styles.distance]}>
            <Text>{this.state.distance} KM</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this._stop} style={[styles.bubble, styles.button]}>
            <Text>Stop</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  },

});

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
