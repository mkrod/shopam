import React, { useEffect, useState } from 'react'
import "./css/desktop_orders.css";
import { OrderList, useGlobalProvider } from '@/constants/provider';
import MobileOrderListCard from '@/components/mobile_order_list_card';
import { FaBoxOpen } from 'react-icons/fa6';
import ActivityIndicator from '@/components/activity_indicator';

const DesktopOrders : React.FC = () : React.JSX.Element => {

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
    <div className='desktop_orders_container'>
        <h3 style={{position: 'absolute', }}>Orders</h3>
        <div style={{display: "flex", flexDirection: "column", marginTop: "50px"}}>
            <div className="desktop_orders_tabs">
                {tabs.map((tab: Tab, index:number)=>(
                    <div key={index} className={`desktop_orders_tab ${activeTab.name.toLowerCase() === tab.name.toLowerCase() && "desktop_order_active_tab"}`} onClick={tab.onclick}>
                        {tab.name}
                    </div>
                ))}
            </div>
        </div>
        <div style={{marginTop: "50px"}} className="desktop_orders_contents">
            {!isFiltering && filteredList.length > 0 && filteredList.map((item: OrderList, index: number)=>(
            <MobileOrderListCard data={item} key={index} />
            ))}
        
            {(isFiltering || filteredList.length < 1) && <div className="desktop_orders_empty_container">
                {!isFiltering && filteredList.length < 1 && (
                <div style={{marginTop: "100px"}} className='mobile_order_list_empty_container'>
                    <FaBoxOpen size={65} className='mobile_order_list_empty_image' />
                    <h3 className='mobile_order_list_empty_text'>No orders found</h3>
                </div>
                )}
                {isFiltering && (
                <div style={{marginTop: "100px"}} className='mobile_order_list_loader_container'>
                    <ActivityIndicator size='small' />
                </div>
                )}
            </div>}
        </div>
    </div>
  )
}

export default DesktopOrders