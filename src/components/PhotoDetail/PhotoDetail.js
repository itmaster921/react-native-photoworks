import React, {Component} from 'react';
import {  
  StyleSheet,
  Text,
  View, 
  TouchableOpacity,
  ListView,
  Alert,
  PanResponder,
  Modal,
  TouchableHighlight,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';

import { Header, Left, Right, Title, Icon, Item, Container, Label, Input, Content, Button, Form, Body, 
         Footer, FooterTab, Toast } from 'native-base';

import {query}                      from '../../service'
import Row                          from './Row';
import Image                        from 'react-native-image-progress';

var Dimensions = require('Dimensions');
var {
  width,
  height
} = Dimensions.get('window');

export default class PhotoDetail extends Component {
  
    constructor(props) {
        super(props);
        this.imageID = '';        
        
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            modalVisible: false,          
            pins: this.props.photo.marks,
            photoCaption: '',
            dataSource: this.ds.cloneWithRows(this.props.photo.marks),      
            editLabel: '',
            editIndex: '',
        }   

        console.log("PhotoDetailProps:", this.props)   
        
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({   
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onPanResponderRelease: (evt, gestureState) => {
            if (!this.imageID) this.imageID = evt.nativeEvent.target;

            x = Math.floor(evt.nativeEvent.locationX);
            y = Math.floor(evt.nativeEvent.locationY);  
              
            pageX = evt.nativeEvent.pageX;
            pageY = evt.nativeEvent.pageY;           
            
            var temp = this.state.pins.concat();                      

            if (this.imageID != evt.nativeEvent.target){  
                pageX = pageX - width * 0.05;
                pageY = pageY - 74;  
                
                this.state.pins.map( (item, index) => {
                    dx = Math.abs(pageX - item.x);
                    dy = item.y - pageY;

                    if ( dx > 15 || dy > 30 || dy < 0) return;
                    else {
                        Alert.alert(
                            'Alert',
                            'Do you want to delete this Pin?',
                            [
                                { text: 'Cancel', onPress: () => {                            
                                    return;

                                }, style: 'cancel'},
                                { text: 'OK', onPress: () => {                                      
                                    temp.splice(index, 1);
                                    var source = this.ds.cloneWithRows(temp);
                                    this.setState({ pins: temp, dataSource: source });                                
                                }},
                            ]             
                        ) 
                        return;
                    }

                })                              
            }else{    
                            
                var pin = { x: x, y: y, type: 'mark', label: 'optional Label'};
                temp.push(pin);
                var source = this.ds.cloneWithRows(temp);
                this.setState({ pins: temp, dataSource: source });            
                       
            }         
        },    
        });
    }

    onSave = () => { 
        this.setState({ isLoading: true })             
        
        let url = 'http://photoworks-api.thnk.xyz/api/item/' + this.props.id + '/photo/' + this.props.photo.index + '/update';
        console.log(url)
        query(url, 'POST', {
             deviceToken: this.props.deviceToken, 
             userToken: this.props.userToken,
             marks: this.state.pins,             
         })
         .then( res => {
            this.setState({ isLoading: false });
            Toast.show({
                text: 'Saved',
                position: 'bottom',
                duration: 1000,            
                type: 'success'
            })
         })
         .catch( error => {
             this.setState({ isLoading: false });
             console.error(error);
         })
    }

    onCancel = () => {
        Alert.alert(
            'ADEN PhotoWorks',            
            'Do you want to cancel?',
            [
                { text: 'No', onPress: () => {                            
                    return;

                }, style: 'cancel'},
                { text: 'Yes', onPress: () => {                                      
                    this.props.navigation.goBack();                        
                }},
            ]             
        )     
    }

    handleRowDelete = (index) => {
        var temp = this.state.pins.concat();
        temp.splice(index, 1);
        var source = this.ds.cloneWithRows(temp);
        this.setState({ pins: temp, dataSource: source }); 

    }

    handleRowPress = (data) => {            
        this.setState({ editLabel: data.label, editIndex: data.index, modalVisible: true });        
    }

    handleEdit = () => {
        var temp = this.state.pins.concat();
        temp[this.state.editIndex].label = this.state.editLabel;
        this.setState({ pins: temp, modalVisible: false })
    }

    render() {
        var spinner = this.state.isLoading ?
        ( <ActivityIndicator
            size='large'/> ) :
        ( <View/>); 
        return (
            <Container style={StyleSheet.flatten(styles.container)} > 
                <Header>                       
                    <Left>                                                  
                    </Left>
                    <Body >
                        <Title style = {{ width: 150 }} >ADEN PhotoWorks</Title>
                    </Body>  
                    <Right/>               
                </Header> 
                <Content>   
                    <View  style={{ alignItems: 'center' }}>
                    <Image {...this._panResponder.panHandlers} style={StyleSheet.flatten(styles.photo)} square source={{uri: this.props.photo.filename}}>
                    { this.state.pins.length > 0 &&
                        this.state.pins.map( (item, index) => {
                            return <Image key={index} style= {{width: 30, height: 30, position: 'absolute', left: item.x - 15, top: item.y - 30}} source={require('../../assets/pin.png')}/>   
                        })
                    }                                      
                    </Image>                      
                    </View>
                    { spinner }
                    <Form>
                        <Item fixedLabel>
                            <Label>Caption</Label>
                            <Input  
                            placeholder="Photo Caption Here"
                            autoCapitalize="none"
                            autoCorrect={false} 
                            onChangeText={(text) => this.setState({photoCaption: text})}
                            />
                        </Item>
                    </Form>
                    { this.state.pins.length > 0 &&
                        <ListView                                         
                            dataSource={ this.state.dataSource }                           
                            renderRow={ (data, secId, rowId) => <Row {...data} handleClick={ this.handleRowPress } index={this.state.pins.indexOf(data)} onRowDelete = { this.handleRowDelete } /> }   
                            renderSeparator={ (sectionId, rowId) => <View key={rowId} style={styles.separator} /> }                        
                            rightOpenValue={ -50 } 
                                                                                                                                      
                        />
                    }
                </Content>

                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.modalVisible}                   
                >
                    <View style={ styles.modal }>                  
                        <Form>  
                            <Item fixedLabel>
                                <Label>Label</Label>
                                <Input 
                                value={ this.state.editLabel }
                                placeholder='Input Message'        
                                autoCorrect={false}
                                autoCapitalize="none" 
                                onChangeText={(text) => this.setState({editLabel: text})}/>
                            </Item>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                <Button transparent onPress={() => this.setState({ modalVisible: false }) }>
                                    <Text style={ styles.btnStyle }>Cancel</Text>
                                </Button>                         
                                <Button transparent onPress={ this.handleEdit }>
                                    <Text style={ styles.btnStyle }>Save</Text>
                                </Button>                         
                            </View>        
                        </Form>            
                    </View>
                </Modal>

                <Footer>
                    <Left>
                        <Button transparent onPress={ this.onCancel }>                    
                            <Text style={ styles.btnStyle }>Cancel</Text>
                        </Button>
                    </Left>
                    <Right>         
                        <Button transparent onPress={ this.onSave }>                   
                            <Text style={ styles.btnStyle }>Save</Text>
                        </Button>                
                    </Right>         
                </Footer>               
            </Container>
           
        );
    }
}

const styles = StyleSheet.create({
    btnStyle: {
        color: '#007AFF',
        fontSize: 18,
        fontWeight: 'bold'
    },
    normalText: {
        color: '#007AFF',
        fontSize: 17,
    },
    photo: {
        width: width * 0.9,
        height: width * 0.8,
        resizeMode: 'contain',
        borderColor: '#BDBDBD',
        borderWidth: 1,    
        marginTop: 10
    },
    pin: {
        width: 20,
        height: 20,
    },
    container: {
        flex: 1,                 
        backgroundColor: 'white',
    },
    separator: {
        flex: 1,
        height: 1,
        backgroundColor: '#BDBDBD',
        marginLeft: 60,
    },
    modal: {
        marginTop: 100,
        flexDirection: 'column',
        flex: 1,
    }
});