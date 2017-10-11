import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TouchableHighlight} from 'react-native';
import {Form, Label, Item, Icon, Right, Button} from 'native-base';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import Swipeout from 'react-native-swipeout';

var Dimensions = require('Dimensions');
var {
  width,
  height
} = Dimensions.get('window');

const styles = StyleSheet.create({
  
    container: {
      flex: 1,
      padding: 7,
      width: '100%',
      flexDirection: 'row',
      height: 40,      
    },

    text: {
      marginLeft: 12,
      fontSize: 15,      
      paddingTop: 7
    },

    textRight: {
      marginRight: 20,
      fontSize: 15,      
      paddingTop: 7, 
      paddingRight: 7,  
      opacity: 0.7
    },

    icon: {
      height: 30,
      width: 30,
      resizeMode: 'contain',
      marginLeft: 10,           
    },

    arrow: {
      position: 'absolute',
      paddingTop: 8,
      right: 10,
      paddingBottom: 5
    },

    btn: {
      marginLeft: 70
    },

    backRightBtn: {
      alignItems: 'center',
      bottom: 0,
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
      right: 0,
      width: 70,
      backgroundColor: 'red',
    },

    rowBack: {
      alignItems: 'center',  
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 15,
    },
 
});

export default class Row extends Component {

    onRowDelete = () => {
      this.props.onRowDelete(this.props.index);      
    }

    onRowPress = () => {     
      this.props.handleClick(this.props)
    }

    render() {
      let swipeBtns = [{
        text: 'Delete',
        backgroundColor: 'red',     
        onPress: this.onRowDelete
      }];

      return(
        <Swipeout right={swipeBtns}
          autoClose={true}
          backgroundColor= 'transparent'>    
          <TouchableOpacity onPress={ this.onRowPress }>    
              <View style={ styles.container }>      
                  <Image style={ styles.icon } source={require('../../assets/pin.png')}/>               
                  <Text style={ styles.text }>Pin {this.props.index + 1}</Text>                  
                  <Right><Text style={ styles.textRight }>X: {this.props.x}, Y: {this.props.y}</Text></Right>                  
                  <Icon name='arrow-forward' style={StyleSheet.flatten(styles.arrow)}/>          
              </View>       
          </TouchableOpacity>    
          </Swipeout>

      )
    }
}
