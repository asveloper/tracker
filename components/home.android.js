import React, { Component } from 'react';
import Meteor, { createContainer } from 'react-native-meteor';

import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  DrawerLayoutAndroid,
  StatusBar,
  ListView,
} from 'react-native';

import Dashboard from './dashboard.js';

const data = [
  {label: "Payments", value: "payments"},
  {label: "Settings", value: "settings"}
]

class Home extends Component {

  constructor(props){
    super(props);

    this.state = {
      translucent: false,
      dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
    }

    //bind functions here
  }

  componentDidMount(){
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(data),
    });
  }

  _pressRow(rowID){
    console.log(rowID);
  }

  _renderRow(rowData: string, sectionID: number, rowID: number){
    return (
      <TouchableHighlight onPress={() => {
          this._pressRow(rowID);
        }}>
        <View style={styles.content}>
          <View>
            <Text style={styles.rowLabel}>{rowData.label}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render(){

    let navigationView = (

      <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
        />
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
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  rowLabel: {
    color: '#fff',
    fontSize: 18
  }
});
