import React, {Component} from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Image from 'react-native-image-progress';
const styles = StyleSheet.create({
  
    container: {
      flex: 1,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      marginLeft: 12,
      fontSize: 16,
    },
    photo: {
      height: 70,
      width: 70,
      resizeMode: 'contain',
      borderColor: '#BDBDBD',
      borderWidth: 1,    
    },
});

class Row extends Component{  
    constructor(props){
        super(props)
    }

    onPress = () => {
        this.props.handleClick(this.props.id)
    }

    render(){
        return(
            <TouchableOpacity onPress={ this.onPress }>
                <View style={{flex: 1, flexDirection: 'row', padding: 10}}>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text>{this.props.partNumber}</Text>
                        <Text>{this.props.description}</Text>
                        <Text style={{opacity: 0.7}}>Additional notes about the item</Text> 
                    </View>
                    <Image style={styles.photo} source={
                        this.props.primaryPhoto?
                        {uri:  this.props.primaryPhoto} : require('../../assets/noImage.png')
                    }/>            
                </View>
            </TouchableOpacity>
        )
    }
}

export default Row;