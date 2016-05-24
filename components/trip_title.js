var React = require('react');
var ReactNative = require('react-native');
var Button = require('react-native-button');

var {
  ToastAndroid,
  StyleSheet,
  View,
  Text,
  TextInput,
} = ReactNative;

import { Geolocation } from './geolocation.js';
import { StartTracking } from './start_tracking.js';

export const TripTitle = React.createClass({
  getInitialState() {
    return {
      geolocation: false,
      startTracking: false
    };
  },

  _handleStart(event) {

    //TODO: Send title to server and store _id in AsyncStorage

    this.setState({ geolocation: true });
  },

  _handleCancel(event){
    this.setState({ startTracking: true });
  },

  render() {

    if(this.state.geolocation){
      return <Geolocation />;
    }

    if(this.state.startTracking){
      return <StartTracking />;
    }

    return (
      <View style={[styles.container, styles.backgroundStyle]}>
        <View style={[styles.innerContainer, styles.innerContainerTransparentStyle]}>
          <Text>Enter the title.</Text>
          <View>
            <TextInput
              autoFocus={true}
              keyboardType='default'
              placeholder='Title'
            />

          </View>
          <Button
            onPress={this._handleStart}
            style={styles.modalButton}>
             Start
          </Button>
          <Button
            onPress={this._handleCancel}
            style={styles.modalButton}>
             Cancel
          </Button>
        </View>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  innerContainer: {
    borderRadius: 10,
    alignItems: 'center',
  },
  row: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginBottom: 20,
  },
  rowTitle: {
    flex: 1,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 5,
    flex: 1,
    height: 44,
    alignSelf: 'stretch',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  buttonText: {
    fontSize: 18,
    margin: 5,
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
  },
  innerContainerTransparentStyle: {
    backgroundColor: '#fff',
    padding: 20
  },
  backgroundStyle: {
    backgroundColor: '#f5fcff'
  }
});
