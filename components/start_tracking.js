var React = require('react');
var ReactNative = require('react-native');
var Button = require('react-native-button');

var {
  ToastAndroid,
  AsyncStorage
} = ReactNative;

import { TripTitle } from './trip_title.js';

export const StartTracking = React.createClass({
  getInitialState(){
    return{
      tripTitle: false,
    }
  },
  _handleTrip(event){
    ToastAndroid.show('Start Pressed!', ToastAndroid.LONG);
    this.setState({tripTitle: true});
  },

  render(){

    if(this.state.tripTitle){
      return <TripTitle />;
    }

    return(
      <Button
        style={{fontSize: 20, color: 'green', marginTop: 50}}
        styleDisabled={{color: 'red'}}
        onPress={this._handleTrip}
      >
        Start!
      </Button>
    );
  },
});
