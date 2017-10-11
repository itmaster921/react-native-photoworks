import React, {Component} from 'react';
import {  
  AppRegistry,
  StyleSheet,
  Image,
  Text,
  View,
  AsyncStorage,
  ActivityIndicator,
  TouchableHighlight,
  ListView,
  TextInput
} from 'react-native';

import { Header, Left, Right, Icon, Title, Container, Content, Button, Thumbnail, Body, Toast,
        Form, Input, Item, Label, Picker, Footer, FooterTab } from 'native-base';

import {query} from '../../service'
import Row from './QueueRow';

export default class Queue extends Component {

    constructor(props) {
        super(props);

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.data = [];
        this.state = {
            keyword: '',
            dataSource: this.ds.cloneWithRows([]),
        };
    }

    componentWillMount() {   
               
        query('http://photoworks-api.thnk.xyz/api/search', 'POST', {
            deviceToken: this.props.deviceToken, 
            userToken:   this.props.userToken, 
            keyword:     'test'
        })
        .then(response=> {     
          
            if (response.success == false) {   
                Toast.show({
                        text: response.reason,
                        position: 'bottom',
                        buttonText: 'OK',
                        type: 'danger'
                })
            }            
            else{        
                this.data = response;        
                this._handleResponse(response);
            }
        })
        .catch(error => {            
            console.log(error);
        })  
    }

    _handleResponse = (response) => {
        var source = this.ds.cloneWithRows(response);
        this.setState({ dataSource: source });
    }

    render() {
        return (
            <Container style={StyleSheet.flatten(styles.container)}>
                <Header>  
                    <Left/>              
                    <Body >
                        <Title style={{ width: 150 }}>ADEN PhotoWorks</Title>
                    </Body>
                    <Right>            
                    </Right>
                </Header>                                       
                <Content>
                    { this.state.dataSource.length > 0 &&                         
                    <ListView                   
                        dataSource={this.state.dataSource}
                        renderRow={(data) => <Row {...data} />}
                        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}                    
                    />
                    }
                </Content>  
                <Footer>
                <FooterTab>
                    <Button onPress={ () => this.props.navigation.navigate('Search') }>                    
                        <Text style={styles.btnText}>Search</Text>
                    </Button>         
                    <Button onPress={ () => this.props.navigation.navigate('Barcode') }>                   
                        <Image
                        source={require('../../assets/camera.png')}
                        style={styles.icon}
                        />
                    </Button>
                    <Button>                   
                        <Text style={styles.btnText}>Queue</Text>
                    </Button>            
                </FooterTab>         
                </Footer>
        </Container>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    separator: {
        flex: 1,
        height: 1,
        backgroundColor: '#BDBDBD',
        marginLeft: 10,
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