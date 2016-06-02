var React = require('react');
var ReactNative = require('react-native');
var Button = require('react-native-button');
var Config = require('../config');

var {
  ToastAndroid,
  StyleSheet,
  AsyncStorage,
  View,
  Text,
  TextInput,
} = ReactNative;

import { Geolocation } from './geolocation.js';
import { StartTracking } from './start_tracking.js';

let REQUEST_URL = Config.SERVER_URL.concat(Config.TRIP_PATH);

export const TripTitle = React.createClass({
  getInitialState() {
    return {
      geolocation: false,
      startTracking: false,
      authToken: undefined,
      userId: undefined,
      title: undefined
    };
  },
  componentDidMount(){
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
  },

  _handleStart(event) {
    let title = this.refs.title.props.value;
    this.saveTrip(title);
  },

  _handleCancel(event){
    this.setState({ startTracking: true });
  },

  saveTrip: function(title){
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
          AsyncStorage.setItem('tripId', responseData.data._id);

          this.setState({geolocation: true});
        }
      }
    };

    let params = "title="+title+"&createdBy="+this.state.userId;
    request.open('POST', REQUEST_URL);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.setRequestHeader("X-Auth-Token", this.state.authToken);
    request.setRequestHeader("X-User-Id", this.state.userId);
    request.send(params);

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
              onChangeText={(title) => this.setState({title})}
              value={this.state.title}
              ref="title"
            />

          </View>
          <Button
            onPress={this._handleStart}
            style={styles.button}>
             Start
          </Button>
          <Button
            onPress={this._handleCancel}
            style={styles.button}>
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
    height: 50,
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
