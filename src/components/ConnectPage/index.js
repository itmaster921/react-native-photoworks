import { connect } from 'react-redux'
import { setUsername, setDeviceToken, setAWS } from '../../action'
import ConnectPage from './ConnectPage'

const mapDispatchToProps = (dispatch) => {
  return {
    setUsername: (username) => {
      dispatch(setUsername(username))
    },
    setDeviceToken: (deviceToken) => {
      dispatch(setDeviceToken(deviceToken))
    },
    setAWS: (aws) => {
      dispatch(setAWS(aws))
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(ConnectPage)