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
    else if(action.type === "incrementQuantity"){
        return state.map(
            (product)=>{
                return (product.id === action.payload.id)?{...product,quantity:product.quantity + 1}:product
            }
        )   
    }
    else if(action.type === "decrementQuantity"){
        return state.map((product)=>{  
            return (product.id === action.payload.id)?{...product,quantity:action.payload.quantity - 1}:product
        })
    }
    else {
        return state
    }
}
export default reducer