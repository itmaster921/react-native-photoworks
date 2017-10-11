import { connect } from 'react-redux'
import { setUsername, setUserToken, setDeviceToken, setAWS } from '../../action'
import LoginPage from './LoginPage'

const mapDispatchToProps = (dispatch) => {
  return {
    setUserToken: (userToken) => {
      dispatch(setUserToken(userToken))
    },
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
)(LoginPage)

