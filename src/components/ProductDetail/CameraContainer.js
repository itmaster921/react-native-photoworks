import { connect } from 'react-redux'
import { setAWS } from '../../action'
import Camera from './Camera'


const mapStateToProps = (state) => {
  return {
    id: state.id,
    deviceToken: state.deviceToken,
    userToken: state.userToken,
    aws: state.aws    
  }
}

export default connect(
  mapStateToProps
)(Camera)

