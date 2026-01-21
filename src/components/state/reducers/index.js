import { combineReducers } from "redux"
import logReducer from "./logReducer"
import cartReducer from "./cartReducer"

const reducer = combineReducers({
    logStatus: logReducer,
    cartItems: cartReducer
})

export default reducer