import { createStore, applyMiddleware }  from 'redux'
import reducer          from '../reducer/reducer'
import { createLogger } 							from 'redux-logger'
import thunk 							from 'redux-thunk'
import promise 							from 'redux-promise-middleware'


const middleware = applyMiddleware(promise(),thunk,createLogger())

export default createStore(reducer, middleware)