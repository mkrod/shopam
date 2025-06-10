import React, { CSSProperties, useEffect, useState } from 'react';
import "./css/cart_card.css";
import { CartProp, Product, useGlobalProvider, Variant } from '@/constants/provider';
import { RiDeleteBinLine } from 'react-icons/ri';
//import { FaMinus, FaPlus } from 'react-icons/fa6';
import ActivityIndicator from './activity_indicator';
import { formatNumberWithCommas, returnUrl } from '@/constants';
import { useNavigate } from 'react-router';
import { TbEdit } from 'react-icons/tb';
import { removeCartItem, Response } from '@/constants/api';


interface Props { 
    data: CartProp; 
    otherStyles?: CSSProperties; 
    onSelect?: (value: any) => void; 
    allSelected: boolean; 
    setAllSelected: (value: boolean) => void;
    removeSelected: (id: string) => void
}

const CartCard : React.FC<Props> = ({ data, otherStyles, onSelect, allSelected, setAllSelected, removeSelected }) : React.JSX.Element => {

    const navigate = useNavigate();

    const { products, setNote, setCartChanged, currency } = useGlobalProvider();
    const [product, setProduct] = useState<Product>();
    useEffect(()  => {
        if(!products) return;
        const thisProduct = products?.find((product) => product.id === data.id);
        setProduct(thisProduct);
    }, [products, data]);
    const [imgLoading, setImgLoading] = useState<boolean>(true);

    const [checked, setChecked] = useState<boolean>(false);

    //track the parent selected all checkbox
    useEffect(() => {
        setChecked(allSelected);
    }, [allSelected]);

    //individual checkbox, uncheck the select all if any of them is ever false
    useEffect(() => {
        if(checked) return;
        setAllSelected(false);
    }, [checked]);


    //const inStock : boolean = products?.find((p) => p.id === data.id)?.availability ?? true; //for later, only available if in stock

    const removeFromCart = async () => {
    if(!product || !data.id) return;
        const response : Response = await removeCartItem({id: product.id});
        if(response.message === "success"){
            setNote({type: "success", title: "Success", body: "Item removed from cart"});
            setCartChanged(true);
            removeSelected(product.id);
            return setTimeout(() => setNote(undefined), 2000);
        }else{
            setNote({type: "error", title: "Failed", body: "failed to cart item"});
            return setTimeout(() => setNote(undefined), 2000);
        }
    }

    const [price, setPrice] = useState<number>(0);
    useEffect(() => {
        if(!data) return;

        const hasVarAmount = Object.values(data.selectedVariant||{}).some((val: Variant) => val.price !== 0);
        const price:number = ((!hasVarAmount ? product?.price.current : Object.values(data.selectedVariant||{}).find((val: Variant) => val.price !== 0)?.price) || 0);
        setPrice(price)
    },[data, product]);


    console.log(data);

   return product ? (
    <div style={otherStyles} className='cart_card_container'>
        <div className="cart_card_check_box_container">
            <input onChange={() => {
                setChecked(!checked);
                onSelect ? onSelect({ id: data.id }) : null;
            }} checked={checked}
           
            value={checked ? "on" : "off"}
            type="checkbox" className='cart_card_checkbox' />
        </div>
        <div className="cart_card_image_container">
            {product.gallery && product.gallery[0] && (
                <img onLoad={() => setImgLoading(false)} loading='lazy' src={product.gallery[0].url} alt='' className='cart_card_image' />
            )}
            {imgLoading && (
                <div style={{position: 'absolute', top: "0", left: "0", right: "0", bottom: "0", backgroundColor: "var(--background-color)", display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <ActivityIndicator size='small' />
                </div>
            )}
        </div>
        <div className="cart_card_metadata_container">
            <div className='cart_card_metadata_title' onClick={() => navigate(returnUrl({
                goto: "/product",
                params: {
                    id: data.id
                }
            }))}>
                {product.title}
            </div>
            <div className='cart_card_metadata_price_container' onClick={() => navigate(returnUrl({
                goto: "/product",
                params: {
                    id: data.id
                }
            }))}>
                {price > 0 && <h4>{currency.symbol + " " +  formatNumberWithCommas(price)}</h4>}
                {product.price.prev !== 0 && <h6 className='cart_card_metadata_prev_price'>{currency.symbol + " " +  formatNumberWithCommas(product.price.prev)}</h6>}
            </div>

            {/*data.variant && <div className="cart_card_variant_container">
                {data.variant.size && (
                <div className='cart_card_variant_size_container'>
                    <span className='cart_cart_variant_label'>Size:</span>
                    <h5>{data.variant.size}</h5>
                </div>)}
                {data.variant.color && (
                <div className='cart_card_variant_size_container'>
                    <span className='cart_cart_variant_label'>Color:</span>
                    <h5>{data.variant.color}</h5>
                </div>)}
            </div>*/}

        <div className="cart_card_variant_container">
            {Object.values(data.selectedVariant||{}).length > 0 && Object.values(data.selectedVariant||{}).map((val:Variant, index: number) => (
                <span className='cart_card_variant' key={index}>{val.value}</span>
            ))}
        </div>

            <div className="cart_card_delete_and_qty_container">
                <div onClick={removeFromCart} style={{alignItems: "end", justifyContent: "start"}} className='cart_card_delete_icon'>
                    <RiDeleteBinLine size={20} />
                </div>
                <div className='cart_card_qty_container'>
                    <div className='cart_card_edit_container' onClick={() => navigate(returnUrl({
                goto: "/product",
                params: {
                    id: data.id
                }
                   }))}>
                        <TbEdit />
                    </div>
                    <h6>Quantity:</h6>
                    <h6>{data.qty}</h6>
                </div>
            </div>
        </div>






    </div>
    
    ) :  
    (<div className='product_not_available_cart_display'>
        <span className='product_not_available_cart_text'>Not Available</span>
        <div onClick={removeFromCart} className='cart_card_delete_icon'><RiDeleteBinLine /></div>
    </div>);
}

export default CartCard