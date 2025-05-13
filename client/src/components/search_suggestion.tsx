import { returnUrl } from '@/constants';
import { Suggestion, useGlobalProvider } from '@/constants/provider'
import React, { CSSProperties } from 'react'
import { TbCategory } from 'react-icons/tb';
import { useNavigate } from 'react-router';
import "./css/search_suggestion.css";

type Prop  = {
    data: Suggestion[];
    emptyList: () => void;
    otherStyle: CSSProperties;
}

const SearchSuggestion : React.FC<Prop> = ({ data , emptyList, otherStyle}) : React.JSX.Element => {

    const navigate = useNavigate();

    const { categories, setLoading } = useGlobalProvider();


      const goSearch = (item: Suggestion) => {
        setLoading(true)
        const type = item.type;
        const text = item.text;
        if(type.toLowerCase() === "category"){
          //navigate to catgeory
          navigate(returnUrl({
            goto: "/category",
            params: {
              name: text,
              id: categories?.find((c) => c.name.toLowerCase() === text)?.id,
            }
          }))
    
          
        }else{
        //for now we will sendd all other to /search
           navigate(returnUrl({
            goto: "/search",
            params: {
              q: text,
              type: type,
            }
           }));
        }
    
        setTimeout(() => setLoading(false), 2000);
        return emptyList();
      }

  return (
      <div style={otherStyle} className="desktop_navbar_search_drop_down">
        {data.map((item: Suggestion, index: number) => (
          <div key={index} onClick={() => goSearch(item)} className="desktop_navbar_search_drop_down_item">
            {item.type === "category" && (
            <div className="desktop_navbar_search_drop_down_item_image_container">
              {categories?.find((c) => c.name.toLowerCase() === item.text.toLowerCase())?.image ? 
                      <img src={categories?.find((c) => c.name.toLowerCase() === item.text.toLowerCase())?.image} className='desktop_navbar_search_drop_down_item_image' />  
                      : <TbCategory />}
            </div>)}
            <div className="desktop_navbar_search_drop_down_item_text">{item.type !== "title" ? item.text + " in "  + item.type : item.text}</div>
          </div>
        ))}
      </div>
  )
}

export default SearchSuggestion