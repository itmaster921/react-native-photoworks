import { connect } from 'react-redux'
import { setSearchKeyword, setSearchResult } from '../../action'
import Queue from './Queue'

const mapStateToProps = (state) => {
  return {    
    deviceToken: state.deviceToken,
    userToken: state.userToken    
  }
}



export default connect(
  mapStateToProps  
)(Queue)
