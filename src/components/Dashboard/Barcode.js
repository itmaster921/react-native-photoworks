import React, { Component } from 'react';
import {  
  AppRegistry,
  StyleSheet,
  Image,
  Text,
  View,
  ActivityIndicator,
  AsyncStorage,
  Platform,
  Alert  
} from 'react-native';
import { Container, Content, Button, Footer, FooterTab, Toast } from 'native-base'

import {query} from '../../service';
import BarcodeScanner from 'react-native-barcode-scanner-universal';

export default class Barcode extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isLoading: false,
            scanned: false		
        };
    } 

    handleBarcode = (code) => {
        if (this.state.scanned) return;
        this.setState({ scanned: true });       
      
        Toast.show({
            text: 'Barcode Scanned',
            position: 'bottom',
            duration: 1000,            
            type: 'success'
        })
       
        query('http://photoworks-api.thnk.xyz/api/search', 'POST', {
            deviceToken: this.props.deviceToken, 
            userToken:   this.props.userToken, 
            keyword:     code.data.toString()
        })
        .then(response=> {     
            this.setState({ isLoading: false });
            if (response.success == false) {   
                if (response.reason == "No Results Found") {
                    Alert.alert(
                        'No Results Found',
                        'Do you want to create item with this BARCODE?',
                        [
                            { text: 'NO', onPress: () => {                            
                                return;

                            }, style: 'cancel'},
                            { text: 'YES', onPress: () => {                                      
                                this._createItem(code.data);                      
                            }},
                        ]             
                    ) 
                }
                else{
                    console.log("error", response.reason)
                    Toast.show({
                        text: response.reason,
                        position: 'bottom',
                        buttonText: 'OK',
                        type: 'danger'
                    })
                }
            }
            else{ 
                this.props.setSearchResult(response);   
                this.props.setSearchKeyword(code.data);
                this.props.navigation.navigate('Search');
            }
        })
        .catch(error => {
            this.setState({isLoading: false});
            console.log(error);
        })  

    }

    _createItem = (code) => {
        let url = 'http://photoworks-api.thnk.xyz/api/item/' + code;
            query(url, 'POST', {
                deviceToken: this.props.deviceToken,
                userToken: this.props.userToken,
                forceCreate: true,
                description: 'Optional Description'
                }
            )
            .then(res => {              
                this.props.setItemID(res.id);
                this.props.navigation.navigate('ProductDetail')
            })
            .catch(error => {
                console.log(error)
            })
   
    }

    render() {

        let scanArea = null;
        if (Platform.OS === 'ios') {
            scanArea = (
            <View style={styles.rectangleContainer}>
                <View style={styles.rectangle} />
            </View>
            )
        }

        return (
            <Container>        
                <BarcodeScanner
                ref="scanner"
                onBarCodeRead={ (code) => this.handleBarcode(code) }
                style={styles.camera}>
                {scanArea}
                </BarcodeScanner>  
            
                <Footer>
                    <FooterTab>
                        <Button onPress={ () => this.props.navigation.navigate('Search') }>                    
                            <Text style={styles.btnText}>Search</Text>
                        </Button>         
                        <Button >                   
                            <Image
                            source={require('../../assets/camera.png')}
                            style={styles.icon}
                            />
                        </Button>
                        <Button onPress={ () => this.props.navigation.navigate('Queue') }>                   
                            <Text style={styles.btnText}>Queue</Text>
                        </Button>            
                    </FooterTab>         
                </Footer>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    camera: {
        flex: 1
    },
    rectangleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    rectangle: {
        height: 250,
        width: 250,
        borderWidth: 2,
        borderColor: '#00FF00',
        backgroundColor: 'transparent'
    },
    icon: { 
        paddingBottom: 0,
        width: 60,
        height: 60,
    },
    btnText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: 'bold'
    },
});
