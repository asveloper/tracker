var React = require('react');
var ReactNative = require('react-native');
var Button = require('react-native-button');

var {
  ToastAndroid,
  AsyncStorage,
  View,
} = ReactNative;

import { Trips } from './trips.js';
import { Geolocation } from './geolocation.js';

export const StartTracking = React.createClass({
  getInitialState(){
    return{
      geolocation: false,
      listTrips: false
    }
  },

  _handleGeolocation(event){
    this.setState({geolocation: true});
  },

  _listTrips(event){
    this.setState({listTrips: true});
  },

  render(){

    if(this.state.geolocation){
      return <Geolocation />;
    }

    if(this.state.listTrips){
      return <Trips />;
    }

    return(
      <View>
        <Button
          style={{fontSize: 20, color: 'green', marginTop: 50}}
          styleDisabled={{color: 'red'}}
          onPress={this._handleGeolocation}
        >
          Start!
        </Button>

        <Button
          style={{fontSize: 20, color: 'green', marginTop: 50}}
          styleDisabled={{color: 'red'}}
          onPress={this._listTrips}
        >
          List Trips!
        </Button>
      </View>
    );
  },
});
