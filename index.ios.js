import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';

import { StackNavigator, DrawerNavigator, TabNavigator } from 'react-navigation';
import { Provider }     from 'react-redux'
import store            from './src/store/store'

import ConnectPage      from './src/components/ConnectPage';
import LoginPage        from './src/components/LoginPage';
import SearchContainer  from './src/components/Dashboard/SearchContainer';
import QueueContainer   from './src/components/Dashboard/QueueContainer';
import BarcodeContainer from './src/components/Dashboard/BarcodeContainer';
import ProductDetail    from './src/components/ProductDetail';
import CameraContainer  from './src/components/ProductDetail/CameraContainer';
import PhotoManage      from './src/components/PhotoManage';
import PhotoDetail      from './src/components/PhotoDetail';

import Storage          from './src/storage'
const storage = new Storage();

const DashboardTabNavigator = TabNavigator(
  {
      Search:   { screen: SearchContainer },
      Barcode:  { screen: BarcodeContainer },
      Queue:    { screen: QueueContainer },    
  },   
  {      
      animationEnabled: true,
      tabBarOptions: {      
        style: {    
          height: 0
        },    
      },
});

const PhotoWorks = StackNavigator(
  {
    Connect:        { screen: ConnectPage }, 
    Login:          { screen: LoginPage },       
    Dashboard:      { screen: DashboardTabNavigator },
    ProductDetail:  { screen: ProductDetail } ,     
    CameraRoll:     { screen: CameraContainer },    
    PhotoManage:    { screen: PhotoManage } ,
    PhotoDetail:    { screen: PhotoDetail }   
  },
  {
    initialRouteName: storage.get('deviceToken') !== undefined ? 'Login' : 'Connect',
    headerMode: 'none', 
    mode: 'card',

});

class App extends Component {
  render(){
    return(
      <Provider store={store}>
        <PhotoWorks />
      </Provider>
    )
  }
}

AppRegistry.registerComponent('PhotoWorks', () => App);
                                                                   