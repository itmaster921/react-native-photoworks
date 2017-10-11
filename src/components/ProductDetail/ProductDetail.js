import React, {Component} from 'react';
import {  
  AppRegistry,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  ActivityIndicator,
  TouchableHighlight,
  ScrollView,
  ListView,
  TextInput,
  Modal
} from 'react-native';

import { Header, Left, Right, Icon, Title, Container, Content, Button, Body, 
         Form, Input, Item, Label, Picker, Footer, FooterTab, Toast} from 'native-base';
import {PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator} from 'rn-viewpager';

import { query }                    from '../../service'
import Row                          from './Row';
import Storage                      from '../../storage'
import config                       from '../../config'
import Image                        from 'react-native-image-progress';
import Progress                     from 'react-native-progress';
import { setPhotos, fetchPhotos }   from '../../action'

const storage = new Storage();

export default class ProductDetail extends Component {
    constructor(props) {
        super(props);

        this.data = [];        
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
       
        this.state = {
            isLoading: true,           
            isNewData: false,
            newMetaData: '', 
            modalVisible: false,
            editIndex: 0,
            eidtKey: '',
            editMeta: '',          
            dataSource: this.ds.cloneWithRows([]), 
            images: []     
        }        
    }

    componentWillMount(){       
        var url = 'http://photoworks-api.thnk.xyz/api/item/' + this.props.id;
        query(url, 'POST', {
            deviceToken: this.props.deviceToken,
            userToken: this.props.userToken,
            forceCreate: false,
            description: 'Optional Description'
            }
        )
        .then(res => {
        
            this.data = res.meta;
            var source = this.ds.cloneWithRows(this.data);
            this.setState({ dataSource: source, isLoading: false });  

        })
        .catch(error => {
            console.log(error);
            this.setState({ isLoading: false })
        })

        this.props.dispatch(fetchPhotos({id: this.props.id, deviceToken: this.props.deviceToken, userToken: this.props.userToken}));  
    }

    componentWillReceiveProps(nextProps){       
        this.setState({ images: nextProps.photos });
    }

    onFinish= () => {
        this.setState({ isLoading: true })
        url = 'http://photoworks-api.thnk.xyz/api/item/' + this.props.id + '/update';
        query(url, 'POST', {
            deviceToken: this.props.deviceToken,
            userToken: this.props.userToken,  
            description: 'Optional Description',
            meta: this.data
            }
        )
        .then(res => {   
            this.setState({ isLoading: false });      
           
            if (res.success) {
                Toast.show({
                    text: 'Saved successfully!',
                    position: 'bottom',
                    duration: 1000,            
                    type: 'success'
                })
                this.setState({ isLoading: false });     
                this.props.navigation.goBack();
            }
            else{
                Toast.show({
                    text: 'Save failed!',
                    position: 'bottom',
                    duration: 1000,            
                    type: 'danger'
                })
            }
        })
        .catch(error => {
            console.log(error);
            this.setState({ isLoading: false });     
        })   

    }

    addNewMeta = () => {  
        this.setState({ editIndex: this.data.length + 1, editKey: '', editMeta: '', modalVisible: true, isNewData: true });        
    }

    handleRowDelete = (index) => {     
        
        this.data.splice(index, 1);
        var source = this.ds.cloneWithRows(this.data);
        this.setState({ dataSource: source }); 
    }

    handleRowPress = (index, data) => {     
        this.setState({ editIndex: index, editKey: data.key, editMeta: data.value, modalVisible: true });       
    }

    handelEditDone = () => {

        if (this.state.isNewData){
            var temp = {key: this.state.editKey, value: this.state.editMeta};
            this.data.push(temp);
        }
        else{                   
            this.data[this.state.editIndex].key = this.state.editKey;
            this.data[this.state.editIndex].value = this.state.editMeta;
        }

        var source = this.ds.cloneWithRows(this.data);
        this.setState({ dataSource: source, modalVisible: false, isNewData: false}); 
        
    }

    _renderDotIndicator() {
        return <PagerDotIndicator selectedDotStyle={{ backgroundColor: '#007AFF' }} pageCount={this.state.images.length} />;
    }

    render()
    {
        var spinner = this.state.isLoading ?
        ( <ActivityIndicator
                style={{ marginTop: 10}}
                size='large'/> ) :
        ( <View/>);

      return(
         <Container style={StyleSheet.flatten(styles.container)}> 
            <Header>                       
                <Left>
                    <Button transparent onPress={ () => this.props.navigation.goBack() }>
                        <Icon name='arrow-back' />
                        <Text style={styles.normalText}>Back</Text>
                    </Button>                                    
                </Left>
                <Body >
                    <Title style = {{ width: 150 }} >ADEN PhotoWorks</Title>
                </Body>  
                <Right/>               
            </Header> 
            <Content>    
                <View style={ styles.separatorLine }/>             
                <IndicatorViewPager
                    style={{height:200}}
                    indicator={this._renderDotIndicator()}
                >
                    {
                        this.state.images.map((item, index)=>{
                        return <View key={index}>
                            <Image style={ styles.photo } source={{ uri: item.filename }}/>
                            </View>
                        })

                    }                            
                </IndicatorViewPager>
                <View style={ styles.separatorLine }/> 

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 7 }}>
                    <Text style={{ marginLeft: 11, fontSize: 15 }} >PartNumber</Text>
                    <Text style={{ marginRight: 27, fontSize: 15, opacity: 0.7 }}>{ this.props.id }</Text>
                </View>
                <View style={styles.rowSeparator}/>
               { this.data.length > 0 &&
                <ListView                    
                    dataSource={this.state.dataSource}
                    renderRow={ (data, secId, rowId, rowMap) => 
                        <Row                         
                        data={data}                    
                        index={ this.data.indexOf(data) }
                        onRowDelete={ this.handleRowDelete }  
                        onRowClick={ this.handleRowPress }                    
                        />}
                    renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.rowSeparator} />}   
                    rightOpenValue={ -50 }                                    
                />   
               }    
                <Button transparent onPress={this.addNewMeta}><Text style={styles.normalText}> Add Data... </Text></Button>
                {spinner}              
            </Content>

                <Modal
                    animationType={"fade"}                    
                    transparent={false}
                    visible={this.state.modalVisible}                   
                >
                    <View style={ styles.modal }>                  
                        <Form>
                            <Item fixedLabel>
                                <Label>Meta Key</Label>
                                <Input 
                                value={ this.state.editKey }
                                placeholder='Type new meta key'        
                                autoCorrect={false}
                                autoCapitalize="none" 
                                onChangeText={(text) => this.setState({editKey: text})}
                                />
                            </Item>
                            <Item fixedLabel>
                                <Label>Meta Data</Label>
                                <Input 
                                value={ this.state.editMeta }
                                placeholder='Type new meta data'        
                                autoCorrect={false}
                                autoCapitalize="none" 
                                onChangeText={(text) => this.setState({editMeta: text})}
                                />
                            </Item>
                            <View style={{ flexDirection: 'row', paddingLeft: 40, paddingRight: 50, marginBottom: 10}}>
                                <Button transparent onPress={ this.handelEditDone }>
                                    <Text style={ styles.btnText }>Save</Text>
                                </Button>                                                                          
                                <Right><Button transparent onPress={() => this.setState({ modalVisible: false }) }>
                                    <Text style={ styles.btnText }>Cancel</Text>
                                </Button></Right>
                            </View>                                     
                        </Form>           
                    </View>
                </Modal>

            <Footer >
            <FooterTab>
                <Button onPress={ () => this.props.navigation.navigate('PhotoManage') }>                    
                    <Text style={styles.btnText}>Photos</Text>
                </Button>         
                <Button onPress={ () => this.props.navigation.navigate('CameraRoll') }>                   
                    <Image
                    source={require('../../assets/camera.png')}
                    style={styles.icon}
                    />
                </Button>
                <Button onPress={ this.onFinish }>                   
                    <Text style={styles.btnText}>Finished</Text>
                </Button>            
            </FooterTab>         
            </Footer>

          </Container>        
      )
   
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    imageView: {
        marginTop: 10,
    },
    normalText: {
        color: '#007AFF',
        fontSize: 17,       
    },
    btnText: {
        color: '#007AFF',
        fontSize: 17,
        fontWeight: 'bold'
    },
    photo: {
        height: config.DEVICE_HEIGHT*0.3,
        width: config.DEVICE_WIDTH,
        resizeMode: 'contain',  
    },
    separatorLine: {       
        height: 1,
        backgroundColor: '#BDBDBD',
        margin: 10,     
    },
    rowSeparator: {       
        height: 1,
        backgroundColor: '#BDBDBD',
        marginLeft: 10,  
    },
    icon: { 
        paddingBottom: 0,
        width: 60,
        height: 60,
    },
    modal: {
        marginTop: 100,
        flexDirection: 'column',
        flex: 1,
    }
});
