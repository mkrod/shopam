import { Product, useGlobalProvider } from '@/constants/provider'
import React, { useState, useEffect } from 'react'
import "./css/category.css";
import useInfinitePagination from '@/constants/use_infinite_pagination';
import { SortData } from '@/constants';
import { Sort } from '../mobile/category';
import { LuSettings2 } from 'react-icons/lu';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa6';
import { TbCategory } from 'react-icons/tb';
import ActivityIndicator from '@/components/activity_indicator';
import DesktopProductCard from '@/components/desktop_product_card';



const DesktopCategory : React.FC<{id: string | undefined; name: string | undefined;}> = ({ id, name }) => {

      const { setLoading, products } = useGlobalProvider();
      const [categoryData, setCategoryData] = useState<Product[]>([]);
    
      useEffect(() => {
        if(!products || !id) return;
        const productsInCategory : Product[] = products.filter((product: Product) => 
          (product.category?.id?.toString() === id) || (name && product.category?.name === name)
        );

          setCategoryData(productsInCategory);

      }, [products, id]);
  
      
  
  
  
  
  
      const sortOption = [
          {
              label: "Date",
              value: "created_at", 
          },
          {
              label: "Price", //shown to app users
              value: "price.current", // the value of the field in the object
          }
      ]
  
      const [sort, setSort] = useState<Sort>(sortOption[0]);
      const [descending, setDescending] = useState<boolean>(true);
      const [sorted, setSorted] = useState<Product[]>([]);
      useEffect(() => {
          const rearraged : Product[] = SortData(categoryData, descending, sort.value);
          setSorted(rearraged);
      }, [sort, descending, categoryData]);
  
      //sorted contains data.
      //sort contains sort value.
      //descending true = highest ->  lowest, false is vice-versa.
  
      const { canAddMore, isEnded, isAddingMore, maxLength, addMore } = useInfinitePagination({data: sorted, perPage: 20});
      const [sorting, setSorting] = useState<boolean>(false);
  




  return (
    <div className='desktop_view_category_container'>
      <div className="desktop_view_category_header_container">
          <span className='home_mobile_categories_title'>{ name }</span>
          <div className="home_mobile_categories_order_container">
              <div onClick={()=> setDescending(true)} className={`home_mobile_categories_order ${descending && "home_mobile_categories_order_active"}`}>
                  <FaCaretDown size={15} />
              </div>
              <div onClick={()=> setDescending(false)} className={`home_mobile_categories_order ${!descending && "home_mobile_categories_order_active"}`}>
                  <FaCaretUp size={15} />
              </div>
          </div>
          <div onClick={() => setSorting(!sorting)} className='desktop_view_categories_sort_trigger_container'>
            <h5>Sort</h5>
            <LuSettings2 />


            {sorting && (
              <div className='desktop_view_sorter_container'>
                {sortOption.map((option: Sort, index: number) => (
                  <div key={index} onClick={() => {
                    setLoading(true);
                    setTimeout(() => {
                        setSort(option);
                        setSorting(false);
                        setLoading(false);
                    }, 1000);
                    }} className='desktop_view_sorter'>
                    <h5>{option.label}</h5>
                    <input type='radio' onChange={() => setSort(option)} name='sorting_radio_btn' checked={option.value === sort.value} className='mobile_category_sorter_radio' />
                  </div>
                ))}
              </div>
            )}
          </div>
      </div>

      {sorted.length > 0 && (
        <div className="home_desktop_products_container">
            {sorted.slice(0, maxLength).map((item: Product, index: number) => (
                <DesktopProductCard data={item} key={index} />
            ))}
        </div>)}


      {sorted.length < 1 && (
        <div style={{minHeight: "60vh"}} className="mobile_saved_no_content">
            <TbCategory size={35} />
            <h4>No item in this category</h4>
        </div>)}
        {canAddMore && !isAddingMore && (
            <button onClick={addMore} className='home_desktop_see_more_item'>
                See more
            </button>
        )}
        {isEnded && !isAddingMore && <span className='home_mobile_product_list_bottom_text'>No more item</span>}
        {isAddingMore && !isEnded && 
        (<div className='desktop_mobile_product_list_bottom_text'>
            <ActivityIndicator size='small' />
        </div>)}


    </div>
  )
}

export default DesktopCategory