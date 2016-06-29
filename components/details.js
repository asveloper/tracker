import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Meteor,  { createContainer } from 'react-native-meteor';

class Details extends Component {
  constructor(props){
    super(props);

    this.state = {
    };

    // bind functions here
  }

  render() {

    const { tripsReady } = this.props;

    return (

    );
  }

}

Trips.propTypes = {

};

Trips.defaultProps = {

};

export default createContainer(params => {
  const handle = Meteor.subscribe('trips');

  return {
    tripsReady: handle.ready(),
    trips: Meteor.collection('trips').find({createdBy: Meteor.userId()}, {sort: {createdAt: -1}})
  };
}, Trips);


var styles = StyleSheet.create({
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  dateColumn: {
    width: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
    flex: 1
  },
  distanceColumn: {
    width: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
});
