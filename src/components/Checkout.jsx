import React, { use, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Checkout() {
  const logStatus = useSelector((state)=>state.logStatus)
  const navigate = useNavigate()
   useEffect(() => {
     if (!localStorage.getItem("token")) {
       navigate("/loginplease");
     }
   },[]);
  return (
    <div>Checkout</div>
  )
}

export default Checkout