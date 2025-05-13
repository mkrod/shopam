import React from 'react'
import { useLocation } from 'react-router'

const Checkout : React.FC = () : React.JSX.Element => {

  const { state } = useLocation();

  console.log(state)
  return (
    <div className=''>Checkout</div>
  )
}

export default Checkout