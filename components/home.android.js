import React, { Component } from 'react';
import Meteor, { createContainer } from 'react-native-meteor';
import Icon from 'react-native-vector-icons/FontAwesome';

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
  {label: "Payments", value: "payments", iconName: "credit-card"},
  {label: "History", value: "history", iconName: "circle-o"},
  {label: "Help", value: "help", iconName: "support"},
  {label: "Free Rides", value: "freeRides", iconName: "share-alt"},
  {label: "Promotions", value: "promotions", iconName: "sun-o"},
  {label: "Notifications", value: "notifications", iconName: "bell-o"},
  {label: "Settings", value: "settings", iconName: "gear"}
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
          <View style={styles.drawerListRow}>
            <View style={styles.drawerListIcon}>
              <Icon name={rowData.iconName} size={15} color="#3b5998"></Icon>
            </View>
            <View style={styles.drawerListLabel}>
              <Text style={styles.rowLabel}>{rowData.label}</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render(){

    let navigationView = (

      <View>

        <View style={styles.drawerHeader}>
          <Text style={styles.drawerHeaderContent}>Nironshah</Text>
        </View>

        <View style={styles.separator}></View>

        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
        />
      </View>

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
  drawerHeader: {
    height: 60,
    marginTop: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerHeaderContent: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff'
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  rowLabel: {
    color: '#fff',
    fontSize: 18
  },
  drawerListRow: {
    flexDirection: 'row',
  },
  drawerListIcon: {
    width: 40,
    left: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginRight: 10
  },
  drawerListLabel: {
    width: 150,
    left: 1,
    flexDirection: 'column',
  },
});
