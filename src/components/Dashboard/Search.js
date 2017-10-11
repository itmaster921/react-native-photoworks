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
  TextInput,
  Alert
} from 'react-native';

import { Header, Left, Right, Icon, Title, Container, Content, Button, Thumbnail, Body, Toast,
        Form, Input, Item, Label, Picker, Footer, FooterTab } from 'native-base';

import {query}      from '../../service'
import Row          from './SearchRow';
import Storage      from '../../storage'
import config       from '../../config'
var SearchBar = require('react-native-search-bar');
const storage = new Storage();

export default class Search extends Component {
    constructor(props) {
        super(props);       

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
         
            isLoading: false,
            keyword: this.props.keyword,          
            dataSource: this.ds.cloneWithRows(this.props.result)
        }
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.result !== undefined){
            var source = this.ds.cloneWithRows(nextProps.result);
            this.setState({ dataSource: source });
        }
    }

    componentDidMount(){       
        this.refs.searchBar.focus();  
    }

    onRowPress = (id) => {   
        this.props.setItemID(id);
        this.props.navigation.navigate('ProductDetail');
    }

    handleSearch = () => {    
        this.refs.searchBar.unFocus();  
        this.setState({ isLoading: true })
        this.props.setSearchKeyword(this.state.keyword)
                 
        query('http://photoworks-api.thnk.xyz/api/search', 'POST', {
            deviceToken: this.props.deviceToken, 
            userToken:   this.props.userToken, 
            keyword:     this.state.keyword
        })
        .then(response=> {     
            this.setState({ isLoading: false });
            if (response.success == false) {   
                if (response.reason == "No Results Found") {
                    Alert.alert(
                        'No Results Found',
                        'Do you want to create item "BARCODE"?',
                        [
                            { text: 'NO', onPress: () => {                            
                                return;

                            }, style: 'cancel'},
                            { text: 'YES', onPress: () => {                                      
                                this._createItem();                      
                            }},
                        ]             
                    ) 
                }
                else{
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
            }
        })
        .catch(error => {
            this.setState({isLoading: false});
            console.log(error);
        })  
    }

    _createItem = () => {
        let url = 'http://photoworks-api.thnk.xyz/api/item/' + this.state.keyword;
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

    handleCancel = () => {
        this.props.setSearchKeyword('');
        this.props.setSearchResult([]);
    }

    render() {

        var spinner = this.state.isLoading ?
        ( <ActivityIndicator
                style={{ marginTop: 100}}
                size='large'/> ) :
        ( <View/>);

        return (
            <Container style={ StyleSheet.flatten(styles.container) }> 
                <Header>  
                    <Left/>              
                    <Body style={{ paddingLeft: 30 }}>
                        <Title>ADEN PhotoWorks</Title>
                    </Body>
                    <Right>
                        {/*<TouchableHighlight>
                            <Text style={ styles.btnText }>History</Text>
                        </TouchableHighlight>*/}
                    </Right>
                </Header>   
                <View >                
                 <SearchBar
                    ref='searchBar'                    
                    placeholder='Search'
                    text={ this.state.keyword }
                    showsCancelButton={ true }
                    onChangeText={ (text) => this.setState({keyword: text}) }
                    onSearchButtonPress={ this.handleSearch }
                    onCancelButtonPress={ this.handleCancel }
                    />
                </View>                            
                <Content styles={{ paddingTop: 10 }}>  
                    { this.props.result.length > 0 &&
                        <ListView                    
                            dataSource={ this.state.dataSource }
                            renderRow={ (data) =>  <Row {...data} handleClick={this.onRowPress}/> }
                            renderSeparator={ (sectionId, rowId) => <View key={rowId} style={styles.separator} /> }                                       
                        /> 
                    }   

                    {spinner}                
                </Content>
                <Footer>
                <FooterTab>
                    <Button>                    
                        <Text style={styles.btnText}>Search</Text>
                    </Button>         
                    <Button onPress={ () => this.props.navigation.navigate('Barcode') }>                   
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
    searchContainer: {      
        padding: 8,
        height: 45,        
        margin: 0,
        backgroundColor: '#C1C1C1',
    },
    informText:{
        fontSize: 15,
        alignSelf: 'center'
    },
    SearchInput: {
        height: 30,
        flex: 1,
        paddingHorizontal: 8,
        fontSize: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        textAlign: 'center',
    },
    icon: { 
        paddingBottom: 0,
        width: 60,
        height: 60,
    },
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
    searchBar: {
        height: 30,
        flex: 1,
        paddingHorizontal: 8,
        fontSize: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
    },
    cameraButton: {
        height: 60,
        width: 60,
        resizeMode: 'contain',
    },
    btnText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: 'bold'
    },
    footerButton: {
        paddingLeft: 5 ,
        paddingRight: 5,       
        alignItems: 'center',
        justifyContent: 'center'
    },
});