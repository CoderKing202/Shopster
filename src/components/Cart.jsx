import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Cart() {
  const logStatus = useSelector((state) => state.logStatus);
  const navigate = useNavigate();
  useEffect(() => {
    if (!logStatus) {
      navigate("/loginplease");
    }
  },[]);

  return <div>Add to Cart</div>;
}

export default Cart;
