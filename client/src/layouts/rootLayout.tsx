import React, { useEffect, useState } from 'react'
import "./css/root.css";
import { Outlet, useLocation, useNavigate } from 'react-router'
import { Suggestion, useGlobalProvider } from '@/constants/provider';
import { MdOutlineErrorOutline } from 'react-icons/md';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
//import Footer from '@/components/footer';
import SearchBox from '@/components/search_box';
import SearchSuggestion from '@/components/search_suggestion';
import { returnUrl } from '@/constants';

const RootLayout : React.FC = () : React.JSX.Element => {
  const { note, loading, display, hotSearch, setLoading } = useGlobalProvider();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);



  const location = useLocation();
  const [showSearch, setShowSearch] = useState<boolean>(location.hash === "#search");
  useEffect(() => {
    // Check if the hash part of the URL is #search
    setShowSearch(location.hash === "#search");
  }, [location]);

  
  

  useEffect(() => {
    if(showSearch){
      document.body.style.overflow = "hidden"
    }else{
      document.body.style.overflow = ""
    }
  }, [showSearch]);

  ///search suggestion

    const [filteredSuggestion, setFilteredSuggestion] = useState<Suggestion[]>([]);
  
  
    const handleSuggestion = (text: string) => {
      if (text.length < 3) return setFilteredSuggestion([]);
    
      // Filter suggestions based on the text input
      const filtered = hotSearch.filter(suggestion =>
        suggestion.text.toLowerCase().includes(text.toLowerCase().slice(0, 15))
      );
    
      // Remove duplicates by using a Set for unique text
      const uniqueFiltered = filtered.reduce((uniqueSuggestions: Suggestion[], suggestion) => {
        // Check if the suggestion is already in the uniqueSuggestions array
        if (!uniqueSuggestions.some(existing => existing.text.toLowerCase() === suggestion.text.toLowerCase())) {
          uniqueSuggestions.push(suggestion);
        }
        return uniqueSuggestions;
      }, [] as Suggestion[]);
    
      // Set the unique filtered suggestions
      setFilteredSuggestion(uniqueFiltered);
    };



    //


  return (
    <div className='root_layout_container'>
       <div className={`root_layout_popup_modal_container ${note && "popup_modal_active"}`}>
         <div className="root_layout_popup_modal_icon">
          {note && note.type === "success" && <IoMdCheckmarkCircleOutline size={25} color='#00db00'/>}
          {note && note.type === "error" && <MdOutlineErrorOutline size={25} color='#e20000' />}
        </div>
        <div className="root_layout_popup_modal_messages">
          {note && note.title && <span className='root_layout_popup_modal_title'>{note.title}</span>}
          {note && note.body && <span className='root_layout_popup_modal_message'>{note.body}</span>}
        </div>
       </div>
        <div style={{paddingTop: "var(--bar-height)"}}>
          <Outlet />
        </div>


        {display.mobile && showSearch && (
        <div className='root_layout_mobile_search_suggestion_container'>
          <div className="home_top_search_container">
            <SearchBox
              onsearch={(term: string) => {
                setLoading(true);
    
    
                navigate(returnUrl({
                goto: "/search",
                params: {
                  query: term,
                  type: "title,tag,brand"
                }
                  }))
    
                  
            }} 
              onValueChange={(term: string) => handleSuggestion(term)}
            />
          </div>


          {filteredSuggestion.length > 0 && (
              <SearchSuggestion 
              otherStyle={{position: "unset", width: "100%"}}
              data={filteredSuggestion}
              emptyList={() => setFilteredSuggestion([])}
              />
          )}
       </div>)}


        <div className={`root_layout_loading_fidget_container ${loading && "loading"}`}>
          <div className="root_layout_loading_fidget_container_loader"></div>
        </div>
        
    </div>
  )
}

export default RootLayout