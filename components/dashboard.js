import React, { Component } from 'react';
import Meteor, { createContainer } from 'react-native-meteor';
import Button from 'apsl-react-native-button';

import {
  View,
  Text,
  Switch,
  StyleSheet,
} from 'react-native';

import Trips from './trips.js';
import Geolocation from './geolocation.js';

class Dashboard extends Component {

  constructor(props){
    super(props);

    this.state = {
      switchIsOn: false
    }

    //bind functions here
    this._handleSwitch = this._handleSwitch.bind(this);
    this._handleTripsListing = this._handleTripsListing.bind(this);
  }

  _handleSwitch(value){
    this.setState({switchIsOn: value});
  }

  _handleTripsListing(event){
    this.setState({
      switchIsOn: false
    });
  }

  tripsListing(){
    return(
      <Button
        style={{backgroundColor: '#87CEFA', height: 30}}
        textStyle={{fontSize: 14}}
        onPress={this._handleTripsListing}
      >
        Trips
      </Button>
    );
  }

  render(){

    let currentView;
    if(this.state.switchIsOn){
      currentView =  <Geolocation />;
    }else{
      currentView = <Trips />;
    }

    return(
      <View style={styles.container}>

        <View style={styles.header}>
          <Text>Log Book of {Meteor.user().profile.name} ID: {Meteor.userId()}</Text>
          <Text>Total Trip / Current Trip</Text>
        </View>

        <View style={styles.viewContainer}>{currentView}</View>

        <View style={styles.footer}>

          <View style={styles.footerCol}>{this.tripsListing()}</View>

          <View style={styles.footerCol}>
            <Switch
              onValueChange={this._handleSwitch}
              value={this.state.switchIsOn} />
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
    height: 450,
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
  }
});
