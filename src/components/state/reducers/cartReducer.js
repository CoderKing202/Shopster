const reducer = (state = [], action) => {
    if (action.type === "addToCart") {
        return [...state, action.payload]
    }
    else if (action.type === "removeFromCart") {
        return state.filter((product) => {
            return (product.id !== action.payload.id)
        })
    }
    else if(action.type === "userCartItems"){
            return [...action.payload]
    }
    else {
        return state
    }
}
export default reducer