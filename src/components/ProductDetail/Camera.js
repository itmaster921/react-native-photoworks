import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImagePickerIOS,
  AsyncStorage,  
  ProgressViewIOS
} from 'react-native'

import { Footer, FooterTab, Button, Left, Right, Icon, Toast } from 'native-base'
import * as Progress    from 'react-native-progress';
import { query }        from '../../service'
import { uploadPhoto }  from '../../service'
import Camera           from 'react-native-camera'
import { RNS3 }         from 'react-native-aws3'
import config           from '../../config'
import { fetchPhotos }  from '../../action'

export default class CameraRollPage extends Component{

  constructor(props){
    super(props);
    this.state = {
      image: null,
      cameraMode: false,
      uploading: false,
      uploadProgress: 0,
    }
    console.log(this.props.aws.accessKey)
  }

  takePicture = () => {
    this.camera.capture()
      .then((data) => {        
        this.setState({ cameraMode: false, image: data.path })
      })
      .catch(err => console.error(err));
  }


  chooseImageFromGallery = () => {  
    ImagePickerIOS.openSelectDialog({}, imageUri => {  
      if (imageUri !== undefined) this.setState({ image: imageUri });
    }, error => console.log("error", error));
  }

  chooseImageFromCamera = () => {
    this.setState({ cameraMode: true })
  }

  cancel = () => {
     this.props.navigation.goBack()
  }

  uploadPhoto = () => {
    if (!this.state.image) return   
    this.setState({ uploading: true });
    
    var name = this.state.image.slice(this.state.image.indexOf('?') + 4, this.state.image.indexOf('&'));
    
    const file = {
        uri: this.state.image,
        name: name + '.jpg',
        type: "image/jpg"
    }

    const options = {
        keyPrefix: this.props.aws.keyPrefix + this.props.id + '/',
        bucket: this.props.aws.bucket,
        region: this.props.aws.region,
        accessKey: this.props.aws.accessKey,
        secretKey: this.props.aws.accessSecret,
        successActionStatus: 201
    }

    RNS3.put(file, options).then(response => {
        if (response.status !== 201)
            throw new Error("Failed to upload image to S3");    
        
        this.setState({ uploading: false, uploadProgress: 0 })
        let url = 'https://s3-' + this.props.aws.region + '.amazonaws.com/' + this.props.aws.bucket + '/' + options.keyPrefix + file.name;
     
        this._addPhoto(url);       
    })
    .progress((e) => this.setState({ uploadProgress: (e.loaded / e.total) }) )
    .catch( error => {
      console.log("error", error)
      this.setState({ uploading: false, uploadProgress: 0 })      
    })

    //if (image) this.props.navigation.navigate('ProductDetail', { image: this.state.image });
  }

  _addPhoto = (url) => {
    var requestUri = 'http://photoworks-api.thnk.xyz/api/item/' + this.props.id + '/photos/add'; 
    query(requestUri, 'POST', {
      deviceToken: this.props.deviceToken,
      userToken: this.props.userToken,
      filename: url,
      setAsPrimary: false,
      setAsPrivate: false,
      label: "OPTIONAL_LABEL"
    })
    .then(res => {    
      Toast.show({
          text: 'Saved successfully!',
          position: 'bottom',
          duration: 1000,            
          type: 'success'
      })
      this.props.dispatch(fetchPhotos({id: this.props.id, deviceToken: this.props.deviceToken, userToken: this.props.userToken}));   
      this.props.navigation.goBack();
    })
    .catch(error => console.log(error))
  }

  render(){
    return(
      <View style={{ flex: 1 }}>
  
        {
          this.state.cameraMode?
          <View style={styles.cameraContainer}>
            <Camera
              ref={(cam) => {
                this.camera = cam;
              }}
              style={styles.camera}              
              captureAudio={false}
           />
            <View style={{ flex: 1, flexDirection: 'row', marginBottom: 100 }}>
              <View style={{ flex: 1 }}>
              <Button transparent warning style={{ marginLeft: 20 }} onPress={() => this.setState({ cameraMode: false })}> 
                <Text style={ styles.btnText }>Cancel</Text>
              </Button>
              </View>
              <View style={{ flex: 1 }}>
              <Button transparent warning style={{ marginRight: 20 }} onPress={this.takePicture}>
                <Text style={ styles.btnText }>Take a Photo</Text>
              </Button>
              </View>
            </View>
           
          </View> :

          <View style={{flex: 1}}>
            <View style={styles.img}>
              {this.state.image? <Image style={{flex: 1}} source={{uri: this.state.image}}/>:null}
              { this.state.uploading &&                 
                <ProgressViewIOS   
                  style={{ margin: 10 }}              
                  progress={ this.state.uploadProgress }                  
                />                    
              }
            </View>
            <View style={styles.container}>
              <Button style={ StyleSheet.flatten(styles.button) } onPress={this.chooseImageFromGallery}>
                <Icon name='image'/>
                <Text style={ styles.buttonText }>Select from Gallery</Text>
              </Button>
              <Button style={ StyleSheet.flatten(styles.button) } onPress={this.chooseImageFromCamera}>
                <Icon name='camera'/>
                <Text style={styles.buttonText}>Select from Camera</Text>
              </Button>
            </View>
            <Footer>
                <FooterTab>
                  <Left>
                    <Button transparent onPress={ this.cancel }>                    
                        <Text style={styles.btnText}>Cacel</Text>
                    </Button>     
                  </Left>
                  <Right>
                    <Button transparent onPress={ this.uploadPhoto }>                   
                        <Text style={styles.btnText}>Upload</Text>
                    </Button>   
                  </Right>         
                </FooterTab>         
            </Footer>
          </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  img: {
    flex: 2,    
    justifyContent: 'center',
    marginTop: 50
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin:10
  },
  button: {
    backgroundColor: 'gray',
    width: '90%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10
  },  
  buttonText: {
    color: 'white'
  },
  btnText: {
        color: '#007AFF',
        fontSize: 17,
        fontWeight: 'bold'
  },
  cameraContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',    
  },
  camera: {
    height: config.DEVICE_HEIGHT,
    width: config.DEVICE_WIDTH,
    backgroundColor: 'salmon'
  },
});