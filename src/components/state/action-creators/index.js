export const logStatus = (amount) => {
    return (dispatch) => {
        dispatch({
            type: 'logChange',
            payload: amount
        })
    }
}

export const addItem = (item) => {
    return ((dispatch) => {
        dispatch(
            {
                type: "addToCart",
                payload: item
            }
        )
    })
}
export const removeItem =(item)=>{
 return(
    (dispatch)=>{
        dispatch({
            type:"removeFromCart",
            payload:item
        })
    }
 )
}