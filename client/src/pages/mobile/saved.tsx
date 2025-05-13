import React, { useEffect, useState } from 'react'
import "./css/saved.css";
import { Product, useGlobalProvider } from '@/constants/provider';
import MobileProductCard from '@/components/mobile_product_card';
import useInfinitePagination from '@/constants/use_infinite_pagination';
import ActivityIndicator from '@/components/activity_indicator';
import { TbShoppingCartDollar } from 'react-icons/tb';


const MobileSaved : React.FC<{data: string[]}> = ({ data }) : React.JSX.Element => {

    const { products } = useGlobalProvider();
    const [items, setItems] = useState<Product[]>([]);

    useEffect(() => {
        if(!data || !products) return;
        let wishlist : Product[] = [];
        data.forEach((id: string) => {
            let thisOne = products.find((obj) => obj.id === id);
            if (thisOne) {
                wishlist.push(thisOne);
            }
        })
        setItems(wishlist);
    }, [data, products]);


    const { canAddMore, isAddingMore, maxLength, addMore, isEnded } = useInfinitePagination({perPage:  10, data: items});
    


  return (
    <div className='mobile_saved_container'>
         {data.length > 0 && 
         <div className="mobile_saved_content_container">
           <h3>Your WishList</h3>

           <div className="mobile_saved_content">
             {items.slice(0, maxLength).map((item: Product, index: number) => (
                <MobileProductCard data={item} key={index} />
             ))}
           </div>

            {canAddMore && !isAddingMore && (
                <button onClick={addMore} className='home_desktop_see_more_item'>
                    See more
                </button>
            )}
            {isEnded && !isAddingMore && <span className='home_mobile_product_list_bottom_text'>No more item</span>}
            {isAddingMore && !isEnded && <div className='desktop_mobile_product_list_bottom_text'>
                <ActivityIndicator size='small' />
            </div>}
        </div>}

        {data.length < 1 && <div className="mobile_saved_no_content">
            <TbShoppingCartDollar size={35} />
            <h4>No Saved item</h4>
        </div>}
    </div>
  )
}

export default MobileSaved