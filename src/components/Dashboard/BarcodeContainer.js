import { connect } from 'react-redux'
import { setSearchKeyword, setSearchResult, setItemID } from '../../action'
import Barcode from './Barcode'

const mapStateToProps = (state) => {
  return {
    ...state.search,
    deviceToken: state.deviceToken,
    userToken: state.userToken    
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSearchKeyword: (keyword) => {
      dispatch(setSearchKeyword(keyword))
    },
    setSearchResult: (result) => {
      dispatch(setSearchResult(result))
    },
    setItemID: (id) => {
      dispatch(setItemID(id))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Barcode)
