import CartCard from '@/components/cart_card';
import { CartProp, useGlobalProvider, Variant } from '@/constants/provider';
import React, { useEffect, useState } from 'react';
import "./css/mobile_cart.css";
import { formatNumberWithCommas, returnUrl } from '@/constants';
import { useNavigate } from 'react-router';
import { TbShoppingCartDollar } from 'react-icons/tb';



const MobileCart: React.FC<{data: CartProp[]}> = ({ data }) => {


  const navigate = useNavigate();
  const [selectedCart, setSelectedCart] = useState<{ id: string; qty?: number | string }[]>([]);
  const [total, setTotal] = useState<number | undefined>(undefined);
  const { products, cart } = useGlobalProvider();



  

          
  useEffect(() => {
    if(!products || !selectedCart || selectedCart.length < 1) return setTotal(undefined);
    let total = 0;

    selectedCart.forEach((Cart) => {
      const thisCart = cart?.find((c) => c.id === Cart.id);
      const thisProduct = products.find((p)=>p.id===Cart.id);
      if(thisCart&&thisProduct){
        const hasVarAmount = Object.values(thisCart.variant||{}).some((val: Variant) => val.price !== 0);
        const price:number = ((!hasVarAmount ? thisProduct?.price.current : Object.values(thisCart.variant||{}).find((val: Variant) => val.price !== 0)?.price) || 0);
        let qty: number = thisCart.qty as number || 1;
        total += price*qty;
      }
    });

    setTotal(total);
  }, [selectedCart, products]);

  const handleTotal = (currentCard: {id: string}) => {
    const isAvailable = selectedCart.find((sc) => sc.id === currentCard.id);
    if(isAvailable){ 
      const filtered = selectedCart.filter((sc) => sc.id !== currentCard.id);
      setSelectedCart(filtered);
    }else{
      const find = cart.find((p) => p.id === currentCard.id);
      if(!find) return;
      setSelectedCart([...selectedCart, find])
    }
  }

  const [allselected, setAllSelected] = useState<boolean>(false);
  

  useEffect(() => {
    if(allselected){
      setSelectedCart(cart);

    }else{
      setSelectedCart([]); //need a way to clear the checkbox in all the cartCard
    }
  }, [allselected]);

  



  return (
    <div className='mobile_view_card_component_container'>
        {data.length > 0 && data.map((cart: CartProp, index: number) => (
            <CartCard 
             allSelected={allselected}
             setAllSelected={(value) => setAllSelected(value)} 
             onSelect={handleTotal} 
             key={index} 
             data={cart}  
             removeSelected={(id) => setSelectedCart(selectedCart.filter((s)=>s.id!==id))}
            />
        ))}

        {data.length < 1 && <div className="mobile_saved_no_content">
            <TbShoppingCartDollar size={35} />
            <h4>Cart empty</h4>
        </div>}

        <div className="cart_card_checkout_container">
            <div className="cart_card_select_all_container">
                <input onChange={() => setAllSelected(!allselected)} checked={allselected} type="checkbox" name="" id="" className='cart_card_checkbox' />
                <h6>Select all</h6>
            </div>
            <div className="cart_card_total_container">
              <span className='cart_card_total_text'>Total</span>
              <h4>{total ? "₦ " + formatNumberWithCommas(Number(total.toFixed(2))) : "--"}</h4>
            </div>
            <div className="cart_card_checkout_button_container">
              <button onClick={() => navigate(returnUrl({goto: '/checkout'}), {state: selectedCart})} disabled={total === 0 || !total} className='cart_card_checkout_button'>Checkout</button>
            </div>
        </div>
    </div>
  );
}

export default MobileCart;