import React, { Component } from 'react';
import {  
  AppRegistry,
  StyleSheet,
  Image,
  Text,
  View,
  ActivityIndicator,  
} from 'react-native';

import { Container, Toast, Content, Button, Thumbnail, Body, 
        Form, Input, Item, Label 
} from 'native-base';

import { query }        from '../../service'
import config           from '../../config'
import Storage          from '../../storage'
const storage = new Storage();

export default class ConnectPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: 'test',
            password: 'test123',
            isLoading: false,		
        };
    }
  
    handleConnect = () => {
        
        this.setState({ isLoading: true });  

        query('http://photoworks-api.thnk.xyz/api/device/link', 'POST', {username: this.state.username, password: this.state.password})
        .then(response=> {

            this.setState({isLoading: false});

            if (response.success == false) {              
                Toast.show({
                    text: response.reason,
                    position: 'bottom',
                    buttonText: 'OK',
                    type: 'danger'
                })
            }
            else{              
                this._handleResponse(response);
            }
        }).catch(error => {
            this.setState({isLoading: false});
            console.log(error)
        })    
    }

    _handleResponse = (response) => {     

        storage.save('deviceToken', response.token);
        storage.save('aws', JSON.stringify(response.aws));
        storage.save('companyName', response.name);
        storage.save('username', this.state.username);

        this.props.navigation.navigate('Login', { user: this.state.username });
    }

    render() {

        var spinner = this.state.isLoading ?
        ( <ActivityIndicator
                size='large'/> ) :
        ( <View/>);

        return (
            <Container style={StyleSheet.flatten(styles.container)} >    
                <Content>
                    <Thumbnail style={{width: '100%', height: 200,}} square source={require('../../assets/background1.png')}/>
                    <Text style={styles.welcome}> Welcome to ADEN PhotoWorks, please 
                        login to connect your device to your account. </Text>

                    <Form>
                        <Item fixedLabel>
                            <Label>Username</Label>
                            <Input 
                            value={ this.state.username }
                            placeholder='username'        
                            autoCorrect={false}
                            autoCapitalize="none" 
                            onChangeText={(text) => this.setState({username: text})}/>
                        </Item>
                        <Item fixedLabel>
                            <Label>Password</Label>
                            <Input 
                            value={ this.state.password }
                            placeholder='********' 
                            secureTextEntry 
                            autoCorrect={false}
                            autoCapitalize="none"
                            onChangeText={(text) => this.setState({password: text})}/>
                        </Item>                     
                    </Form>

                    <View style={{padding: 10}}>
                    <Button full style={StyleSheet.flatten(styles.connectButton)} onPress={this.handleConnect}>
                        <Text style={{color: 'white', fontWeight: 'bold'}}>Connect</Text>
                    </Button>
                    </View>

                    {spinner}

                </Content>             
            </Container>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    paddingTop: 20,
    alignItems: 'center',    
  },

  connectButton: {
    backgroundColor: 'red',
    borderRadius: 7,
    marginTop: 10,
    width: '100%',    
  },

  welcome: {
    fontSize: 14,
    textAlign: 'center',
    margin: 8,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
