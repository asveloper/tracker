import React, { Component } from 'react';
import Meteor, { createContainer } from 'react-native-meteor';
import MaterialSwitch from 'react-native-material-design-switch';

import {
  Platform,
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableHighlight,
  Image,
} from 'react-native';

import Trips from './trips.js';
import Geolocation from './geolocation.js';

class Dashboard extends Component {

  constructor(props){
    super(props);

    this.state = {
      switchIsOn: false,
      showDetails: false,
      currentTrip: undefined
    }

    //bind functions here
    this.handleTrips = this.handleTrips.bind(this);
    this.showTrip = this.showTrip.bind(this);
    this.currentTrip = this.currentTrip.bind(this);
    this.renderSwitch = this.renderSwitch.bind(this);
  }

  handleTrips(event){
    this.setState({
      switchIsOn: false,
      showDetails: false
    });
  }

  // Trips
  showTrip(value){
    this.setState({
      showDetails: value
    });
  }

  // Geolocation
  currentTrip(value){
    this.setState({
      currentTrip: value
    });
  }

  tripsListingButton(){

    if(this.state.switchIsOn || this.state.showDetails){
      return(
        <TouchableHighlight
          onPress={this.handleTrips}
          style={styles.buttonContainer}
          underlayColor='transparent'
        >
          <Image
            style={styles.button}
            source={require('../assets/images/trips_history.png')}
          />
        </TouchableHighlight>
      );
    }

  }

  renderSwitch(){
    if(Platform.OS === 'ios'){
      return (
        <Switch
          onValueChange={(value) => this.setState({switchIsOn: value})}
          value={this.state.switchIsOn}
          onTintColor={'#7fff00'}
          tintColor={'#ff0000'}
          thumbTintColor={switchColor}
        />
      );
    }else{
      return (
        <MaterialSwitch
          onChangeState={(value) => this.setState({switchIsOn: value})}
          value={this.state.switchIsOn}
          inactiveButtonColor={'#42A5F5'}
          inactiveBackgroundColor={'#ff0000'}
          inactiveButtonPressedColor={'#42A5F5'}
          activeButtonColor={'#42A5F5'}
          activeBackgroundColor={'#7fff00'}
          switchWidth={70}
          switchHeight={40}
        />
      );
    }
  }

  renderCurrentTrip(){
    if(this.state.currentTrip || this.state.switchIsOn){
      return (
        <Text>Current Trip: {this.state.currentTrip} KM</Text>
      );
    }else{
      return (
        <Text>Total Trip: 0 KM</Text>
      );
    }
  }

  render(){

    let currentView = this.state.switchIsOn ? <Geolocation currentTrip={this.currentTrip} /> : <Trips details={this.state.showDetails}  showTrip={this.showTrip} />;
    let switchColor = this.state.switchIsOn ? '#7fff00' : '#ff0000';

    return(
      <View style={styles.container}>

        <View style={styles.header}>
          <Text>Log Book of <Text style={styles.userName}>{Meteor.user().profile.name}</Text> ID: {Meteor.userId()}</Text>
          {this.renderCurrentTrip()}
        </View>

        <View style={styles.viewContainer}>{currentView}</View>

        <View style={styles.footer}>

          <View style={styles.footerCol}>{this.tripsListingButton()}</View>

          <View style={styles.buttonCol}>
            {this.renderSwitch()}
          </View>

          <View style={styles.footerCol}>

          </View>

        </View>

      </View>
    );
  }
}

Dashboard.propTypes = {

};

Dashboard.defaultProps = {

};

export default createContainer(params => {
  return {

  };
}, Dashboard);

var styles = StyleSheet.create({
  container: {
    margin: 10
  },
  header: {
    alignItems: 'center',
  },
  viewContainer: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    width: 300,
    height: 430,
  },
  footer: {
    width: 300,
    marginTop:10,
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'row',
  },
  footerCol: {
    width: 100,
    left: 1,
    flexDirection: 'column',
  },
  buttonCol: {
    width: 120,
    left: 1,
    marginTop: -10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold"
  },
  buttonContainer: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
