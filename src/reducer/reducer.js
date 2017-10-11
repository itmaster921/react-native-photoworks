const initialState = {
    username: '',
    deviceToken: '',
    userToken: '',
    aws: {},
    search: {
      keyword: '',
      result: []
    },
    id: '',
    photos: [],
    selectedPhoto: {},
}

export default (state = initialState, action) => {
   
    switch (action.type) {
        case 'SET_USERNAME':
            return {
                ...state,
                username: action.username
            }
            
        case 'SET_DEVICETOKEN':
            return{
              ...state,
              deviceToken: action.deviceToken
            }            
      
        case 'SET_USERTOKEN':
            return{
              ...state,
              userToken: action.userToken
            }            

        case 'SET_AWS':
            return{
              ...state,
              aws: action.aws
            }            

        case 'SET_SEARCH_KEYWORD':
            return{
              ...state,
              search: {
                ...state.search,
                keyword: action.keyword
              }
            }            
        
        case 'SET_SEARCH_RESULT':
            return{
              ...state,
              search: {
                ...state.search,
                result: action.result
              }
            }     
        case 'SET_ITEM_ID':
            return{
                ...state,
                id: action.id
            }
        case 'SET_PHOTOS':
            return{
                ...state,
                photos: action.photos
            }
        case 'SET_SELECTED_PHOTO':
            return{
                ...state,
                selectedPhoto: action.photo
            }
    }

    return state

}