import { combineReducers } from "redux"
import logReducer from "./logReducer"
import cartReducer from "./cartReducer"
import tokenReducer from "./tokenReducer"

const reducer = combineReducers({
    logStatus: logReducer,
    cartItems: cartReducer,
    token: tokenReducer
})

export default reducer