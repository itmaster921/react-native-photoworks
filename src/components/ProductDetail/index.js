import { connect } from 'react-redux'
import { setPhotos } from '../../action'
import ProductDetail from './ProductDetail'


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
)(ProductDetail)

