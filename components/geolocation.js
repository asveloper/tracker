var React = require('react');
var ReactNative = require('react-native');
var MapView = require('react-native-maps');
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

var screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

let REQUEST_URL = Config.SERVER_URL.concat(Config.LATLNG_PATH);

export const Geolocation = React.createClass({
  watchID: (null: ?number),

  getInitialState: function() {
    return {
      authToken: undefined,
      userId: undefined,
      tripId: undefined,
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
    };
  },

  componentDidMount: function() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
      // this.setState({
      //   region: {
      //     latitude: position.coords.latitude,
      //     longitude: position.coords.longitude
      //   }
      // });
    });

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
  },

  saveLatLng: function(latitude, longitude){
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

  render: function() {
    return (
      <View style={styles.container}>
        <MapView
          ref="map"
          style={styles.map}
          region={this.state.region}
          onRegionChange={this._onRegionChange}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this._stop} style={[styles.bubble, styles.button]}>
            <Text>Stop</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  },

  _onRegionChange(region) {
    this.setState({ region });
  },

  _stop( event ){

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
    paddingVertical: 12,
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
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});
