import React, { Component } from 'react';
import Meteor, { createContainer } from 'react-native-meteor';
import Button from 'apsl-react-native-button';
import MaterialSwitch from 'react-native-material-design-switch';

import {
  Platform,
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
      switchIsOn: false,
      showDetails: false
    }

    //bind functions here
    this.showTrip = this.showTrip.bind(this);
  }

  showTrip(value){
    this.setState({
      showDetails: value
    });
  }

  tripsListingButton(){
    return(
      <Button
        style={{backgroundColor: '#87CEFA', height: 45}}
        textStyle={{fontSize: 14}}
        onPress={(event) => this.setState({switchIsOn: false, showDetails: false})}
      >
        Trips
      </Button>
    );
  }

  switch(){
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

  render(){

    let currentView = this.state.switchIsOn ? <Geolocation /> : <Trips details={this.state.showDetails}  showTrip={this.showTrip} />;
    let switchColor = this.state.switchIsOn ? '#7fff00' : '#ff0000';

    return(
      <View style={styles.container}>

        <View style={styles.header}>
          <Text>Log Book of {Meteor.user().profile.name} ID: {Meteor.userId()}</Text>
          <Text>Total Trip / Current Trip</Text>
        </View>

        <View style={styles.viewContainer}>{currentView}</View>

        <View style={styles.footer}>

          <View style={styles.footerCol}>{this.tripsListingButton()}</View>

          <View style={styles.buttonCol}>
            {this.switch()}
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
});
