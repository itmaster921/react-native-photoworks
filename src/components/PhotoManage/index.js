import { connect } from 'react-redux'
import PhotoManage from './PhotoManage'


const mapStateToProps = (state) => {
  return {
    id: state.id,
    deviceToken: state.deviceToken,
    userToken: state.userToken,
    photos: state.photos  
  }
}

export default connect(
  mapStateToProps
)(PhotoManage)

