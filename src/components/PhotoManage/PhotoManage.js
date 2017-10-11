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

import { Container, Header, Left, Right, Body, Title, Icon, Content, Button, Thumbnail, 
         Footer, FooterTab, Toast } from 'native-base';

import {query}  from '../../service'
import Row      from './Row';
import { fetchPhotos, setSelectedPhoto }  from '../../action'

export default class PhotoManage extends Component {    
    constructor(props) {
        super(props);      
       
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            isSelectMode: false,       
            selectedList: [],
            selectedCount: 0,
            data: this.props.photos,
            dataSource: this.ds.cloneWithRows(this.props.photos),
        };     
    }

    componentWillMount(){        
        var source = this.ds.cloneWithRows(this.state.data);
        this.setState({ dataSource: source });        
    }

    componentWillReceiveProps(nextProps){        
        var source = this.ds.cloneWithRows(nextProps.photos);
        this.setState({ data: nextProps.photos, dataSource: source })
    }

    onSwichMode = () => {  
        this.setState( prevState => ({ isSelectMode: !prevState.isSelectMode }))   
        var source = this.ds.cloneWithRows(this.state.data);
        this.setState({ dataSource: source, selectedList: [], selectedCount: 0 });        
    }

    onRowPress = (index, selected) => {    
           
        if (this.state.isSelectMode){     
            var temp = this.state.selectedList.concat();
            temp[index] = selected;
            
            var count = 0;
            temp.map( item => {                
                if (item === true) count++
            })
            this.setState({ selectedList: temp, selectedCount: count });
         
        }
        else {            
            this.props.dispatch(setSelectedPhoto(this.state.data[index]));
            this.props.navigation.navigate('PhotoDetail');
        }
    }

    onPrimary = () => {                
        var index = 0;     
        for (i = 0; i < this.state.selectedList.length; i++){               
            if (this.state.selectedList[i]) {
                index = i 
            }
        }
             
        url = 'http://photoworks-api.thnk.xyz/api/item/' + this.props.id + '/photo/' + this.props.photos[index].index + '/update';     
        query(url, 'POST', {
            deviceToken: this.props.deviceToken, 
            userToken:   this.props.userToken,   
            primary:     true,
            label:       null,
            marks:       null                 
        })
        .then(res => {
            if (res.success==true){
                Toast.show({
                    text: 'Updated successfully!',
                    position: 'bottom',
                    duration: 1000,            
                    type: 'success'
                })
            }
        })
        .catch(err => console.log(err))
    }

    onDelete = () => {          
        for (i = 0; i < this.state.selectedList.length; i++){
            if (this.state.selectedList[i]){               
                url = 'http://photoworks-api.thnk.xyz/api/item/' + this.props.id + '/photo/' + this.props.photos[i].index + '/delete'                
                query(url, 'POST', {
                    deviceToken: this.props.deviceToken, 
                    userToken:   this.props.userToken,                    
                })
                .then(res => {                    
                    if (res.success) {     
                        temp = this.state.data.concat();
                        temp.splice(i-1, 1);
                        var source = this.ds.cloneWithRows(temp);
                        this.setState({ data: temp, dataSource: source, selectedList: [], selectedCount: 0 });  
                        this.props.dispatch(fetchPhotos({id: this.props.id, deviceToken: this.props.deviceToken, userToken: this.props.userToken}));                 
                    }
                 })
                .catch(err => console.log(err))
            }
        }
    }
        
    render() {
        return (
            <Container style={StyleSheet.flatten(styles.container)}> 
                <Header>  
                    <Button transparent onPress={ () => this.props.navigation.goBack() }>
                        <Icon name='arrow-back' />
                        <Text style={styles.normalText}>Back</Text>
                    </Button>             
                    <Body >
                        <Title >ADEN PhotoWorks</Title>
                    </Body>
                    <Button transparent onPress={this.onSwichMode}>
                        { this.state.isSelectMode ? 
                            <Text style={styles.selectedText}>Select</Text> :
                            <Text style={styles.normalText}>Select</Text> 
                        }
                        
                    </Button>                   
                </Header>

                <Content>               
                <ListView
                    dataSource={ this.state.dataSource }
                    renderRow={ (data, secId, rowId) => <Row {...data} handleClick={ this.onRowPress } index={ this.state.data.indexOf(data) } isSelectMode={ this.state.isSelectMode }  />}
                    contentContainerStyle={ styles.list }                    
                />                  
                </Content>
                <Footer style={{ alignItems: 'center', justifyContent: 'center'}}>                                    
                    <FooterTab>
                    <Button disabled={ this.state.selectedCount != 1 } transparent style={ StyleSheet.flatten(styles.footerButton) } onPress={this.onPrimary}>                   
                        <Text style={ {color: 'green', fontSize: 15, fontWeight: 'bold'} }>Make Primary</Text>
                    </Button>                  
                   
                    <Button disabled={ this.state.selectedCount == 0 } transparent style={ StyleSheet.flatten(styles.footerButton) } onPress={this.onDelete}>                   
                        <Text style={ {color: 'red', fontSize: 15, fontWeight: 'bold'} }>{"Delete(" + this.state.selectedCount + ")"}</Text>
                    </Button>                 
                   </FooterTab>
                </Footer>
            </Container>
           
        );
    }
}

const styles = StyleSheet.create({

    list: {
        flexDirection: 'row',
        flexWrap: 'wrap',        
        justifyContent: 'center',        
    },

    normalText: {
        color: '#007AFF',
        fontSize: 17,
    },

    selectedText: {
        color: '#007AFF',
        fontSize: 17,
        fontWeight: 'bold',
    },

    footerButton: {
        paddingLeft: 5 ,
        paddingRight: 5,  
        alignItems: 'center',
        justifyContent: 'center'
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
});