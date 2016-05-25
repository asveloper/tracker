var React = require('react');
var ReactNative = require('react-native');
var Button = require('react-native-button');

var {
  ToastAndroid,
  AsyncStorage
} = ReactNative;

import { TripTitle } from './trip_title.js';
import { Trips } from './trips.js';

export const StartTracking = React.createClass({
  getInitialState(){
    return{
      tripTitle: false,
      listTrips: false
    }
  },

  _handleTrip(event){
    this.setState({tripTitle: true});
  },

  _listTrips(event){
    this.setState({listTrips: true});
  },

  render(){

    if(this.state.tripTitle){
      return <TripTitle />;
    }

    if(this.state.listTrips){
      return <Trips />;
    }

    return(
      <View>
        <Button
          style={{fontSize: 20, color: 'green', marginTop: 50}}
          styleDisabled={{color: 'red'}}
          onPress={this._handleTrip}
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
