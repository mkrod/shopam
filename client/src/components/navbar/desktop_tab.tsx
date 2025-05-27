import { appLogoUri, appName, returnUrl } from '@/constants'
import React, { useState } from 'react'
import "./css/desktop_tab.css";
import SearchBox from '@/components/search_box';
import { FiShoppingBag, FiShoppingCart } from 'react-icons/fi'
import { Category, Suggestion, useGlobalProvider } from '@/constants/provider';
import { PiBellSimpleRingingBold } from 'react-icons/pi';
import { GrFavorite } from 'react-icons/gr';
import { FaGear } from 'react-icons/fa6';
import { HiOutlineLogout } from 'react-icons/hi';
import { useNavigate } from 'react-router';
import { FaAngleDown } from 'react-icons/fa';
import { TbCategory } from 'react-icons/tb';
import { MdCancel } from 'react-icons/md';
import { IoSearch } from 'react-icons/io5';
import SearchSuggestion from '../search_suggestion';
import { logout } from '@/constants/auth';
import { Response } from '@/constants/api';
import Avatar from '../avatar';
//import { compareTwoStrings } from 'string-similarity';


const DeskTopTabNavBar : React.FC = () : React.JSX.Element => {

  const { display, cart, saved, categories, hotSearch, setLoading, user } = useGlobalProvider();
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const navigate = useNavigate();
  const [openCategories, setOpenCategories] = useState<boolean>(false);
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
  



  const path =  window.location.pathname;


  return (
    <div className='desktop_navbar_container'>
      <div className="desktop_navbar_left">
        <img onClick={() => navigate("/")} className='desktop_navbar_left_app_logo' src={appLogoUri} alt={`${appName} logo`} />
      </div>
      {display.desktop && (
      <div className="desktop_navbar_center">
        <SearchBox 
          onsearch={(term: string) => {
            setLoading(true);
            setFilteredSuggestion([]);


            navigate(returnUrl({
            goto: "/search",
            params: {
              query: term,
              type: "title,tag,brand"
            }
             }))

             
        }} 
          onValueChange={handleSuggestion}
        />


        {filteredSuggestion.length > 0 && (
          <SearchSuggestion 
          otherStyle={{position: "absolute", width: "max(450px, 30%)", boxShadow: "0 0 20px var(--background-fade)"}}
          data={filteredSuggestion}
          emptyList={() => setFilteredSuggestion([])}
          />
        )}
      </div>)}

      
      {!display.mobile && <div onClick={() => setOpenCategories(!openCategories)} className="desktop_navbar_category_container">
        <h5>Categories</h5>
        <FaAngleDown />

        {openCategories && (
          <div className='desktop_navbar_categories_container'>
            {categories && categories.map((category: Category, index: number) => (
              <div onClick={() => navigate(returnUrl({
                goto: "/category",
                params: {name:  category.name, id: category.id}
              }))} key={index} className='desktop_navbar_category'>
                <div className="desktop_navbar_category_image_container">
                  {category.image && <img src={category.image} className="desktop_navbar_category_image" />}
                  {!category.image && <TbCategory size={20} />}
                </div>
                <span className='desktop_navbar_category_name'>{category.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>}
      <div className="desktop_navbar_right">
        {display.mobile && path !== "/" && <div onClick={() => navigate("#search")} className="desktop_navbar_right_option_container">
          <IoSearch className='icon_cursor_pointer' size={16} />
          <span className="desktop_navbar_right_option_label">Search</span>
        </div>}
        <div onClick={() => navigate("/cart")} className="desktop_navbar_right_option_container">
          <FiShoppingCart className='icon_cursor_pointer' size={16} />
          <span className="desktop_navbar_right_option_label">Cart</span>
          {cart.length > 0 && <div className='desktop_navbar_right_option_notification_count'>{cart.length}</div>}
        </div>
        <div onClick={() => navigate("/saved")} className="desktop_navbar_right_option_container">
          <GrFavorite className='icon_cursor_pointer' size={16} />
          <span className="desktop_navbar_right_option_label">Saved</span>
          {saved.length > 0 && <div className='desktop_navbar_right_option_notification_count'>{saved.length}</div>}
        </div>
        <div className="desktop_navbar_right_option_container">
          <PiBellSimpleRingingBold  className='icon_cursor_pointer' size={16} />
          <span className="desktop_navbar_right_option_label">Inbox</span>
          <div className='desktop_navbar_right_option_notification_count'>5</div>
        </div>
        <div className="desktop_navbar_right_option_container" style={{marginLeft: 20}}>
          <div onClick={() => setOpenMenu(!openMenu)} className={`desktop_navbar_right_picture_menu_container ${openMenu && "menu_triggered"}`}>
            <Avatar name={user.email || "User"} size={30} />
          </div>
        </div>
        
        <div className={`desktop_me_options_container ${openMenu && "desktop_me_options_container_open"}`}>
          <div className="desktop_me_profile_container">
            <div className="desktop_me_profile_picture_container">
               <Avatar name={user.email || "User"} size={30} />
            </div>
            <div className="desktop_me_profile_name_email">
              <span className='desktop_me_profile_name'>{ user.user_data.name ? user.user_data.name?.first + " " + user.user_data.name?.last : user.user_id }</span>
              <span className='desktop_me_profile_email'>{ user.email != "" ? user.email : "Not logged in"}</span>
            </div>

            {display.mobile && <div onClick={() => setOpenMenu(false)} className="desktop_me_options_close">
              <MdCancel size={25} />
            </div>}
          </div>

          <div className="desktop_me_options">
            <div onClick={() => {
              if(!user || !user.email){
                return navigate("/auth/signin");
              }
              navigate("/profile");
              setOpenMenu(false);
              }} className="desktop_me_option_container">
              <div className="desktop_me_option_left">
                <FaGear />
              </div>
              <div className="desktop_me_option_right">Manage Account</div>
            </div>
            <div onClick={() => {
              if(!user || !user.email){
                return navigate("/auth/signin");
              }
              navigate("/orders");
              setOpenMenu(false);
            }} className="desktop_me_option_container">
              <div className="desktop_me_option_left">
                <FiShoppingBag />
              </div>
              <div className="desktop_me_option_right">My orders</div>
            </div>
            {(user && user.email !== "") && <div  onClick={() => {
              logout()
              .then((res: Response) => {
                if(res.message === "success"){
                  window.location.reload();
                }
              })
              }} className="desktop_me_option_container">
              <div className="desktop_me_option_left">
                <HiOutlineLogout />
              </div>
              <div className="desktop_me_option_right">Sign out</div>
            </div>}
            {(!user || user.email === "") && <div onClick={() => navigate("/auth/signin")} className="desktop_me_option_container">
              <div className="desktop_me_option_left">
                <HiOutlineLogout />
              </div>
              <div className="desktop_me_option_right">Sign in</div>
            </div>}
          </div>

          <div className="desktop_me_options_bottom">
            <span>Secured by Paystack</span>
          </div>
        </div>


      </div>
    </div>
  )
}

export default DeskTopTabNavBar