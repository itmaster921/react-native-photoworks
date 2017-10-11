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
  ScrollView,
  ListView,
  TextInput,
  Modal
} from 'react-native';

import { Header, Left, Right, Icon, Title, Container, Content, Button, Body, 
         Form, Input, Item, Label, Picker, Footer, FooterTab} from 'native-base';

import {query}              from '../Service/Service';
import Row                  from './Row';
import { SwipeListView, SwipeRow }    from 'react-native-swipe-list-view';

var Dimensions = require('Dimensions');
var {
  width,
  height
} = Dimensions.get('window');

export default class ProductDetail extends Component {
    constructor(props) {
        super(props);

        this.data = [
            { PartNumber: 'AA1234' },
            {MetaData1: 'Blue'},
            {MetaData2: 'Engine'}
        ]
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.state = {
            keyword: '',
            showNewData: false,
            newMetaData: '', 
            modalVisible: false,
            editMeta: '',          
            dataSource: this.ds.cloneWithRows([{}]),
        }
    }

    componentWillMount(){
        var source = this.ds.cloneWithRows(this.data);
        this.setState({ dataSource: source });  
    }

    onPhotos = () => {
        this.props.navigation.navigate('PhotoManage');
    }
    
    onCamera = () => {
        this.props.navigation.navigate('CameraRoll');
    }

    onFinish= () => {

    }

    addNewMeta = () => {        
        this.data.push({MetaData: this.state.newMetaData});
        var source = this.ds.cloneWithRows(this.data);
        this.setState({ dataSource: source, showNewData: false });         
    }

    handleRowDelete = (index) => {          
        this.data.splice(index, 1);
        var source = this.ds.cloneWithRows(this.data);
        this.setState({ dataSource: source }); 
    }

    handleRowPress = (data) => {     
        this.setState({ editMeta: data, modalVisible: true });
    }

    handelEditDone = () => {
        this.setState({ modalVisible: false })
    }

    render()
    {
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
            <Content>    
                <View style={ styles.separator }/>             
                <ScrollView horizontal={true} pagingEnabled={true} style={styles.imageView}>
                    <Image style={styles.photo}  source={require('../../assets/engine.png')}/>
                    <Image style={styles.photo}  source={require('../../assets/engine.png')}/>
                    <Image style={styles.photo}  source={require('../../assets/engine.png')}/>
                </ScrollView>
                <View style={ styles.separator }/> 
                <SwipeListView                    
            </Header> 
                    dataSource={this.state.dataSource}
                    renderRow={ (data, secId, rowId) => 
                        <Row 
                        {...data}  
                        index={ this.data.indexOf(data) }
                        onRowDelete={ this.handleRowDelete }  
                        onRowDelete={ this.handleRowDelete }  
                        />}
                    renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.rowSeparator} />}   
                />
                    <Form>
                        autoCorrect={ false } 
                        />
                        <Label>Meta Data</Label>
                <Button transparent onPress={()=>this.setState({showNewData: true})}><Text style={styles.normalText}> Add Data... </Text></Button>
                        style={{ textAlign: 'right', paddingRight: 10 }}
                    animationType={"fade"}                    
                    rightOpenValue={ -50 }                                    
                    visible={this.state.modalVisible}                   
                { this.state.showNewData && 
                } 
                        onRowClick={ this.handleRowPress }                    
                        autoCapitalize="none"
                        <Input 
                        onChangeText={ (text) => this.setState({ newMetaData: text }) }
                    </Form>
                                <Label>Meta Data</Label>
                <Modal
                                value={ this.state.editMeta }
                    transparent={false}
                                autoCapitalize="none" 
                >
                            </Item>
                                <Right><Button transparent onPress={() => this.setState({ modalVisible: false }) }>
                                <Button transparent onPress={ this.handelEditDone }>
                                </Button></Right>
                        </Form>           
                        <Form>
                </Modal>
                                <Input 
            <FooterTab>
                                placeholder='Type new meta data'        
                    <Text style={styles.btnText}>Photos</Text>
                                />
                <Button onPress={ this.onCamera }>                   
                            <View style={{ flexDirection: 'row', paddingLeft: 40, paddingRight: 50, marginBottom: 10}}>
                    source={require('../../assets/camera.png')}
                                    <Text style={ styles.btnText }>Save</Text>
                    />
                                    <Text style={ styles.btnText }>Cancel</Text>
                    </View>
                            </View>                                     
            <Footer >
                </Button>            
                <Button onPress={ this.onFinish }>                   
            </Footer>
      )
                <Button onPress={ this.onPhotos }>                    
                    <Image
                </Button>         
   
    }
                </Button>
                    style={styles.icon}

}

                    <Text style={styles.btnText}>Finished</Text>
    container: {
            </FooterTab>         
        flex: 1,
          </Container>        
    },
    imageView: {
    },
        color: '#007AFF',
    },
    btnText: {
const styles = StyleSheet.create({
        fontSize: 17,
        backgroundColor: 'white',
    },
        marginTop: 10,
    photo: {
    normalText: {
        width: width,
    },
    separator: {
        fontSize: 17,       
        flex: 1,
        color: '#007AFF',
        color: '#007AFF',
        height: 1,
        fontWeight: 'bold'
        fontWeight: 'bold'
        margin: 10,     
        margin: 10,     
        height: height*0.3,
        flex: 1,
        flex: 1,
        resizeMode: 'contain',  
    },
        backgroundColor: '#BDBDBD',
        paddingBottom: 0,
    icon: { 
        backgroundColor: '#BDBDBD',
    icon: { 
    },
        backgroundColor: '#BDBDBD',
    },
    rowSeparator: {
        backgroundColor: '#BDBDBD',
    rowSeparator: {
    modal: {
        height: 1,
        height: 1,
        flex: 1,
        marginLeft: 10,  
        marginLeft: 10,  
});
    }
    }

        width: 60,
        width: 60,
        height: 60,
        height: 60,
                                onChangeText={(text) => this.setState({editMeta: text})}
        marginTop: 100,
                        onEndEditing={ this.addNewMeta }
        flexDirection: 'column',
                        onEndEditing={ this.addNewMeta }
                            <Item fixedLabel>
                    <Item last >
                                autoCorrect={false}
        flexDirection: 'column',
            </Content>
                                autoCorrect={false}
            </Content>
                                </Button>                                                                          
                    <View style={ styles.modal }>                  
                        placeholder='type new data'
                    </Item>
                        placeholder='type new data'
                    </Item>