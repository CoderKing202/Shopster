export const logStatus = (amount)=>{
    return (dispatch)=>{
        dispatch({
            type:'logChange',
            payload:amount
        })
    }
}
