import React, { useEffect, useState } from 'react'
import "./css/orders.css";
import { OrderList, useGlobalProvider } from '@/constants/provider';
import MobileOrderListCard from '@/components/mobile_order_list_card';
import ActivityIndicator from '@/components/activity_indicator';
import { FaBoxOpen } from 'react-icons/fa6';

const MobileOrders : React.FC = () : React.JSX.Element => {
  interface Tab {
    name: string;
    onclick: () => void;
  }
  const tabs: Tab[] = [
    {
      name: "All",
      onclick: () => setActiveTab(tabs[0]),
    },
    {
      name: "Processing",
      onclick: () => setActiveTab(tabs[1]),
    },
    {
      name: "Completed",
      onclick: () => setActiveTab(tabs[2]),
    },
    {
      name: "Cancelled",
      onclick: () => setActiveTab(tabs[3]),
    },
    {
      name: "Refunded",
      onclick: () => setActiveTab(tabs[4]),
    },
  ];

  const [activeTab, setActiveTab] = useState<Tab>(tabs[0]);
  const [filteredList, setFilteredList] = useState<OrderList[]>([]);
  const [isFiltering, setIsFiltering] = useState<boolean>(true);
  const { orderList } = useGlobalProvider();
  useEffect(() => {
    if(orderList.length < 1) return;
    setIsFiltering(true);
    if(activeTab.name.toLowerCase() === "all") {
      setTimeout(()=>{
        setFilteredList(orderList);
        setIsFiltering(false);
      }, 1500);
      return;
    }
    const filter = orderList.filter((order)=>order.status.toLowerCase()===activeTab.name.toLowerCase());
    setTimeout(()=>{
      setFilteredList(filter);
      setIsFiltering(false);
    }, 1500);
  }, [orderList.length, activeTab.name]);

  return (
    <div className='mobile_orders_container'>
      <h3 className='mobile_orders_header_text'>Orders</h3>
      <div className='mobile_orders_header_tabs'>
        {tabs.map((item: Tab, index: number) =>  (
          <div key={index} className={`mobile_orders_header_tab ${activeTab.name.toLowerCase() === item.name.toLowerCase() && "mobile_order_active_tab"}`} onClick={item.onclick}>
            {item.name}
          </div>
        ))}
      </div>


      <div className="mobile_order_content_container">
        {!isFiltering && filteredList.length > 0 && filteredList.map((item: OrderList, index: number)=>(
          <MobileOrderListCard data={item} key={index} />
        ))}
        {!isFiltering && filteredList.length < 1 && (
          <div className='mobile_order_list_empty_container'>
            <FaBoxOpen size={65} className='mobile_order_list_empty_image' />
            <h3 className='mobile_order_list_empty_text'>No orders found</h3>
          </div>
        )}
        {isFiltering && (
          <div className='mobile_order_list_loader_container'>
            <ActivityIndicator size='small' />
          </div>
        )}
      </div>
    </div>
  )
}

export default MobileOrders