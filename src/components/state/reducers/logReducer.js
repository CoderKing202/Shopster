const reducer = (state=false,action)=>{
    if(action.type==="logChange")
    {
        return action.payload
    } 
    else{
        return state
    }
}
export default reducer