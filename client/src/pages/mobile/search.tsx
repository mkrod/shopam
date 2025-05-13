import ActivityIndicator from '@/components/activity_indicator';
import MobileProductCard from '@/components/mobile_product_card';
import { Product, useGlobalProvider } from '@/constants/provider';
import useInfinitePagination from '@/constants/use_infinite_pagination';
import React, { useEffect, useState } from 'react'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa6';
import { LuSettings2 } from 'react-icons/lu';
import { MdOutlineCancel } from 'react-icons/md';
import { TbShoppingBagSearch } from 'react-icons/tb';
import { Sort } from './category';
import { SortData } from '@/constants';

interface Prop {
    query: string | undefined;
    type: string | undefined;
}

const MobileSearch : React.FC<Prop> = ({ query, type }) : React.JSX.Element => {

    const { products, setLoading } = useGlobalProvider();

    const [searchResult, setSearchResult] = useState<Product[]>([])
    useEffect(() => {
        if(!products || !query || !type) return;
        
        const types = type.split(",");
        let allResults : Product[] = [];

        types.forEach((t) => {

            const results = products.filter((p) => {
                if (t in p && typeof p[t as keyof Product] === 'string') {
                    const value = (p[t as keyof Product] as string).toLowerCase();
                    return query.toLowerCase().split(" ").some(word => value.includes(word));
                }
                return false;
            });

            
            allResults.push(...results);
            
            

        })


        setTimeout(() => {
            setLoading(false); //anytime request is made, i opened loader then after result is ready, just set it
            setSearchResult(allResults)
        } , 2000);

    }, [products, query, type])


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
        const rearraged : Product[] = SortData(searchResult, descending, sort.value);
        setSorted(rearraged);
    }, [sort, descending, searchResult]);

    const { canAddMore, isEnded, isAddingMore, maxLength, addMore } = useInfinitePagination({data: sorted, perPage: 20});
    const [sorting, setSorting] = useState<boolean>(false);

  return (
    <div className='mobile_view_category_container'>
        <div className="mobile_category_header_container">
            <div className="mobile_category_header_label_sort">
                <h6 className='' style={{marginRight: 10}}>{`Search Result for ${query}`}</h6>
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
        </div>
        

        {sorted.length > 0 && (
        <div className="mobile_category_content_container">
            {sorted.slice(0, maxLength).map((item: Product, index: number) => (
                <MobileProductCard data={item} key={index} />
            ))}
        </div>)}
        {sorted.length < 1 && (
        <div style={{minHeight: "60vh"}} className="mobile_saved_no_content">
            <TbShoppingBagSearch size={35} />
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

export default MobileSearch