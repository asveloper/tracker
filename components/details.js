import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  PropTypes,
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

  componentDidMount(){
    this.props.onRender();
  }

  render() {

    const { tripReady, trip } = this.props;

    return (
      <View>
        <Text>Distance: {trip.distance} KM</Text>
      </View>
    );
  }

}

Details.propTypes = {
  tripId: React.PropTypes.string.isRequired
};

Details.defaultProps = {

};

export default createContainer(params => {
  const handle = Meteor.subscribe('trips');

  return {
    tripReady: handle.ready(),
    trip: Meteor.collection('trips').findOne({_id: params.tripId})
  };
}, Details);


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
