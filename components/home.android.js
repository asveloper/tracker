import React, { Component } from 'react';
import Meteor, { createContainer } from 'react-native-meteor';

import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  DrawerLayoutAndroid,
  StatusBar,
} from 'react-native';

import Dashboard from './dashboard.js';

class Home extends Component {

  constructor(props){
    super(props);

    this.state = {
      translucent: false
    }

    //bind functions here
  }

  render(){

    let navigationView = (

      {/* TODO: Add list view to display items in drawer */}

      <TouchableHighlight style={{flex: 1, backgroundColor: '#000', marginTop: 30}} underlayColor={'transparent'} onPress={() => this.setState({text: "Sumbal"})}>
        <Text style={{margin: 10, fontSize: 15, textAlign: 'left', color: '#fff'}}>I'm in the Drawer!</Text>
      </TouchableHighlight>
    );

    return (
      <DrawerLayoutAndroid
        drawerWidth={300}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => navigationView}
        drawerBackgroundColor={'#000'}
        keyboardDismissMode={'on-drag'}
        onDrawerOpen={() => StatusBar.setHidden(true, 'slide')}
        onDrawerClose={() => StatusBar.setHidden(false)}
      >
        <View style={{flex: 1, alignItems: 'center'}}>

          <StatusBar
              translucent={this.state.translucent}
          />

          <Dashboard />

        </View>
      </DrawerLayoutAndroid>
    );
  }

}

Home.propTypes = {

};

Home.defaultProps = {

};

export default createContainer(params => {
  return {

  };
}, Home);

var styles = StyleSheet.create({
  container: {
  },
});
