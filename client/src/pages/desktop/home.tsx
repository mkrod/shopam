import ActivityIndicator from '@/components/activity_indicator';
import DesktopBanner from '@/components/desktop_banner';
import DesktopProductCard from '@/components/desktop_product_card';
import EmptyProductState from '@/components/empty_product_state';
import FeaturedCard from '@/components/featured_card';
import { DesktopBannerProp, Product, useGlobalProvider } from '@/constants/provider'
//import { useCurrentAddress } from '@/constants/use_address';
import React, { useEffect, useState } from 'react'
import { FaRegListAlt } from 'react-icons/fa';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa6';
//import { useNavigate } from 'react-router';

const DesktopHomePage : React.FC = () : React.JSX.Element => {
   const { desktopBanner, featuredPost, products } = useGlobalProvider(); 
    //const navigate = useNavigate();
    //const { current_address, address_loading, address_error } = useCurrentAddress();
    const [showingBanner, setShowingBanner] = useState<number>(0);
    useEffect(() => {
      if (!desktopBanner || desktopBanner.length === 0) return;
      const interval = setInterval(() => {
        setShowingBanner(prev => (prev + 1) % (desktopBanner || []).length); // Loop through all banners
      }, 3000); // Change banner every 3 seconds
    
      return () => clearInterval(interval); // Clear the interval on component unmount
    }, [desktopBanner]);
  


    // pagination
    const [recentItems, setRecentItems] = useState<Product[] | undefined>();
    const totalRecentToShow = 200;
    const perPage : number = 20;
    const [page, setPage] = useState<number>(1);
    const maxLength : number = perPage * page;
    const [isRecentEnded, setIsRecentEnded] = useState<boolean>(false);
    const [isAddingMoreRecent, setIsAddingMoreRecent] = useState<boolean>(false);
    const [canAddMore, setCanAddmore] = useState<boolean>(totalRecentToShow > perPage * page);
    useEffect(() => {
      if(!products || products.length === 0) return;
      setRecentItems(products.slice(0, totalRecentToShow));
    }, [products]);
    useEffect(() => {
      const handleScroll = () => {
        // Handle scroll event here
        const screenHeight = window.innerHeight;
        const scrollPosition = window.scrollY;
        const containerHeight = document.documentElement.scrollHeight;
  
        if (scrollPosition + screenHeight >= containerHeight) {
          // Scroll is at the bottom
          if(maxLength >= totalRecentToShow){
            // no more item to show
            setIsRecentEnded(true);
            setIsAddingMoreRecent(false); // hide loader
            setCanAddmore(false);
          }else{
            setCanAddmore(true);
          }
        }
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [page, products]);
  
  
  const addMoreRecent = () => {
    function updatePage() {
        setPage((prev) => prev + 1); // increase page
        setIsAddingMoreRecent(false); // hide loader
      }
      // add more item to recent sliced
      setIsAddingMoreRecent(true); //show loader
      setTimeout(updatePage, 2000); //load more recent
      setIsRecentEnded(false); //optional cleanup.
      if (totalRecentToShow <= perPage * page) return setCanAddmore(false);
  }
  

  ////////////paginate Featured card
  const fpPerView = 3;
  const [currentFpPage, setCurrentFpPage] = useState<number>(1);
  const [startEnd, setStartEnd] = useState<{start: number, end: number}>({start: 0, end: fpPerView});
  const [canNextFp, setCanNextFp] = useState<boolean>(currentFpPage * fpPerView < (featuredPost?.length ?? 0));
  const [canPrevFp, setCanPrevFp] = useState<boolean>(false);

  useEffect(() => {
    if(!featuredPost) return;
      setCanNextFp(currentFpPage * fpPerView < (featuredPost?.length ?? 0))
  },  [currentFpPage, featuredPost]);

  useEffect(() => {
    setCanPrevFp(startEnd.start > 0);
  }, [startEnd]);
  
  const nextFp = () => {
    setCurrentFpPage((prev) => prev + 1);
    setStartEnd((prev) => ({start: prev.start + fpPerView, end: prev.end + fpPerView}))
  }
  const prevFp = () => {
    setCurrentFpPage((prev) => prev - 1);
    setStartEnd((prev) => ({start: prev.start - fpPerView, end: prev.end - fpPerView}))
  }
  
  
  return (
    <div className='home_desktop_container'>
        {desktopBanner && desktopBanner.length > 0 && ( 
         <div className="home_desktop_banners_section_container">
            <div className='home_desktop_banners_container'>
            {desktopBanner.map((item: DesktopBannerProp, index: number) => (
                <div key={item.id} className={`home_desktop_banner_container ${index === showingBanner ? "home_desktop_banner_showing" : ""}`}>
                    <DesktopBanner data={item} variant='desktop' />
                </div>
            ))}
            </div>

            <div className="home_desktop_banner_active_indicator">
                {desktopBanner.map((_, index: number) => (
                    <div key={_.id} className={`home_desktop_banner_active ${index === showingBanner ? "home_desktop_banner_is_active" : ""}`}></div>
                ))}
            </div>
        </div>)}

        {recentItems && recentItems.length > 0 && (
            <div className="home_desktop_recent_section_container">
                <div className="home_desktop_product_list_header">
                    <div className="home_desktop_product_list_header_left">
                        <span className='home_desktop_product_list_header_left_title'>Recently Added</span>
                        <FaRegListAlt />
                    </div>
                    <div className="home_desktop_product_list_header_right"></div>
                </div>


                <div className="home_desktop_products_container">
                    {recentItems.length > 0 && recentItems.slice(0, maxLength).map((item: Product) => (
                        <DesktopProductCard key={item.id} data={item} />
                    ))}
                </div>


            {canAddMore && !isAddingMoreRecent && (
                <button onClick={addMoreRecent} className='home_desktop_see_more_item'>
                    See more
                </button>
            )}
            {isRecentEnded && !isAddingMoreRecent && <span className='home_mobile_product_list_bottom_text'>No more Recent</span>}
            {isAddingMoreRecent && !isRecentEnded && <div className='desktop_mobile_product_list_bottom_text'>
                <ActivityIndicator size='small' />
            </div>}
            {!products && (<div className='home_mobile_empty_product_state_container'>
                <EmptyProductState  />
            </div>)}
            </div>
            )}


        {featuredPost && featuredPost.length > 0 && 
        <div className="desktop_home_feature_card_section">
            <div className="desktop_home_feature_card_header">
                <h3 className='desktop_home_feature_card_header_text'>Featured Products</h3>
                <div className="desktop_home_feature_card_header_navigation_container">
                    <button onClick={prevFp} disabled={!canPrevFp} className='desktop_home_feature_card_header_navigation'><FaCaretLeft /></button>
                    <button onClick={nextFp} disabled={!canNextFp} className='desktop_home_feature_card_header_navigation'><FaCaretRight /></button>
                </div>
            </div>
            <div className="desktop_home_feature_card_container">
                {featuredPost.slice(startEnd.start, startEnd.end).map((item: Product) => (
                    <div style={{aspectRatio: "1/1.2"}} key={item.id}>
                        <FeaturedCard key={item.id} data={item} />
                    </div>
                ))}
            </div>
        </div>}







    </div>
  )
}

export default DesktopHomePage