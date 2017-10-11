import { connect } from 'react-redux'
import PhotoDetail from './PhotoDetail'

const mapStateToProps = (state) => {
  return {
    id: state.id,
    deviceToken: state.deviceToken,
    userToken: state.userToken,
    photos: state.photos ,
    photo: state.selectedPhoto
  }
}

export default connect(
  mapStateToProps 
)(PhotoDetail)

