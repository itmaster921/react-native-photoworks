import React, {Component} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Image from 'react-native-image-progress';

var Dimensions = require('Dimensions');
var {
  width,
  height
} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    margin: 10,
    width: width* 0.4,
    height: width* 0.4,    
    justifyContent: 'center'
  },

  text: {
    marginLeft: 12,
    fontSize: 16,
  },

  photo: {
    width: width* 0.4,
    height: width* 0.4,
    resizeMode: 'contain',
    borderColor: '#BDBDBD',
    borderWidth: 1,    
  },

  photoHighlight: {
    width: width* 0.4,
    height: width* 0.4,
    resizeMode: 'contain',
    borderColor: '#007AFF',
    borderWidth: 3,    
  },

});

export default class Row extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isSelected: false
    }  
  }

  componentWillReceiveProps(nextProps){
    if (!nextProps.isSelectMode) this.setState({ isSelected: false })
  }

  handleClick = () => {
  
    if (this.props.isSelectMode) {
      this.setState({ isSelected: !this.state.isSelected });   
      this.props.handleClick(this.props.index,  this.state.isSelected? false : true);
     
    }
    else{
      this.props.handleClick(this.props.index, null);
    }
  }
 
  render() {
    return(
      <View style={styles.container}>
        <TouchableOpacity onPress={ this.handleClick }>   
          {
            this.props.isSelectMode && this.state.isSelected ?
            <Image style={styles.photoHighlight} source={{ uri: this.props.filename }}/> : 
            <Image style={styles.photo} source={{ uri: this.props.filename }}/>    
          }         
        </TouchableOpacity>
      </View>
      );
  }

}

