export const logStatus = (amount)=>{
    return (dispatch)=>{
        dispatch({
            type:'logStatus',
            payload:amount
        })
    }
}
export const withDrawMoney = (amount)=>{
        return (dispatch)=>{
            dispatch({
            type:"withdraw",
            payload:amount
            })
        }
}
