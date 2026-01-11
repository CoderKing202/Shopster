import {combineReducers} from "redux"
import logReducer from "./logReducer"

const reducer = combineReducers({
    logStatus:logReducer
})

export default reducer