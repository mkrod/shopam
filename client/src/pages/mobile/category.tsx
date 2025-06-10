import { returnUrl, SortData } from '@/constants';
import { Category, Product, useGlobalProvider } from '@/constants/provider'
import React, { useEffect, useState } from 'react'
import "./css/category.css";
import { LuSettings2 } from 'react-icons/lu';
import useInfinitePagination from '@/constants/use_infinite_pagination';
import MobileProductCard from '@/components/mobile_product_card';
import { TbCategory } from 'react-icons/tb';
import ActivityIndicator from '@/components/activity_indicator';
import { useNavigate } from 'react-router';
import { MdOutlineCancel } from 'react-icons/md';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa6';
export type Sort = {label: string, value: string};



const MobileCategory : React.FC<{id: string | undefined; name: string | undefined;}> = ({ id, name }) => {

    const { categories, setLoading, products } = useGlobalProvider();
    const navigate = useNavigate();
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
    <div className='mobile_view_category_container'>
        <div className="mobile_category_header_container">
            <div className="mobile_category_header_label_sort">
                <span className='home_mobile_categories_title'>{ name }</span>
                <div className="home_mobile_categories_order_container">
                    <div onClick={()=> setDescending(true)} className={`home_mobile_categories_order ${descending && "home_mobile_categories_order_active"}`}>
                        <FaCaretDown size={15} />
                    </div>
                    <div onClick={()=> setDescending(false)} className={`home_mobile_categories_order ${!descending && "home_mobile_categories_order_active"}`}>
                        <FaCaretUp size={15} />
                    </div>
                </div>
                <div onClick={() => setSorting(true)} className='mobile_category_sort_trigger_container'>
                   <LuSettings2 size={20} />
                </div>
            </div>
            {categories && (
                <div className='home_mobile_categories_container'>
                {categories.map((item: Category, index: number) => (
                    <div style={{backgroundColor: id === item.id ? "var(--accent)" : "var(--background-fade)"}} key={index} onClick={() => navigate(returnUrl({
                        goto: "/category",
                        params: {name: item.name, id: item.id}
                     }))} className="home_mobile_category">{item.name}</div>
                ))}
                </div>
            )}
        </div>
        

        {sorted.length > 0 && (
        <div className="mobile_category_content_container">
            {sorted.slice(0, maxLength).map((item: Product, index: number) => (
                <MobileProductCard data={item} key={item.id+index} />
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
        {isAddingMore && !isEnded && <div className='desktop_mobile_product_list_bottom_text'>
            <ActivityIndicator size='small' />
        </div>}

        {sorting && (
            <div className='mobile_category_sorter_section_container'>
                <div className="mobile_category_sorter_container">
                    <div className="mobile_category_sorter_header">
                        <h4>Sort By</h4>
                        <MdOutlineCancel size={25} onClick={() => setSorting(false)} />
                    </div>

                    <div className="mobile_category_sorters">
                        {sortOption.map((item: Sort, index: number) => (
                            <div key={index} onClick={() => {
                                setLoading(true);
                                setTimeout(() => {
                                    setSort(item);
                                    setSorting(false);
                                    setLoading(false);
                                }, 1000);
                                }} className="mobile_category_sorter">
                                <h4>{item.label}</h4>
                                <input type='radio' onChange={() => setSort(item)} name='sorting_radio_btn' checked={item.value === sort.value} className='mobile_category_sorter_radio' />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default MobileCategory