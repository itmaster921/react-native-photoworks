import {query}  from '../service'

export const setUsername = (username) => {
  return {
      type: 'SET_USERNAME',
      username
  }
}

export const setDeviceToken = (deviceToken) => {
  return {
    type: 'SET_DEVICETOKEN',
    deviceToken
  }
}

export const setUserToken = (userToken) => {
  return {
    type: 'SET_USERTOKEN',
    userToken
  }
}

export const setAWS = (aws) => {
  return {
    type: 'SET_AWS',
    aws
  }
}

export const setSearchKeyword = (keyword) => {
  return {
    type: 'SET_SEARCH_KEYWORD',
    keyword
  }
}

export const setSearchResult = (result) => {
  return {
    type: 'SET_SEARCH_RESULT',
    result
  }
}

export const setItemID = (id) => {
  return {
    type: 'SET_ITEM_ID',
    id
  }
}

export const setPhotos = (photos) => {
  return {
    type: 'SET_PHOTOS',
    photos
  }
}

export function fetchPhotos(state){

  return dispatch => {
    url = 'http://photoworks-api.thnk.xyz/api/item/' + state.id + '/photos';
    query(url, 'POST', {
        deviceToken: state.deviceToken,
        userToken: state.userToken,     
    })
    .then(res => {          
        dispatch(setPhotos(res));                   
    })
    .catch(error => {
        console.log(error);           
    })       
  }
}

export const setSelectedPhoto = (photo) => {
  return {
    type: 'SET_SELECTED_PHOTO',
    photo
  }
}