const reducer = (state = localStorage.getItem("token"), action) => {
    if(action.type === "setToken"){
        return action.payload
    }
    else{
        return state
    }
};
export default reducer;
