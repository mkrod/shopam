import { useState, useEffect } from 'react'

interface Prop {
    data: any[];
    perPage: number;
    sH: number;
    sP: number;
    cH: number;
    eventElement: HTMLElement | Window;
}

interface Return {
    ended: boolean;
    addingMore: boolean;
    maxLength: number;
}

const useInfiniteScroll = ({data, perPage, sH, sP, cH, eventElement } : Prop) : Return => {

      // pagination
      const [page, setPage] = useState<number>(1);
      const maxLength : number = perPage * page;
      const [ended, setEnded] = useState<boolean>(false);
      const [addingMore, setAddingMore] = useState<boolean>(false);

      useEffect(() => {
        const handleScroll = () => {
          // Handle scroll event here
          const scrollPosition = eventElement instanceof Window ? window.scrollY : (eventElement as HTMLElement).scrollTop;
          const scrollHeight = eventElement instanceof Window ? document.documentElement.scrollHeight : (eventElement as HTMLElement).scrollHeight;
          const clientHeight = eventElement instanceof Window ? window.innerHeight : (eventElement as HTMLElement).clientHeight;

          if (scrollPosition + clientHeight >= scrollHeight) {
            console.log("bottom")
            // Scroll is at the bottom
            if(maxLength >= data.length){
              // no more item to show
              setEnded(true);
              setAddingMore(false); // hide loader
            }else{
              function updatePage() {
                setPage((prev) => prev + 1); // increase page
                setAddingMore(false); // hide loader
              }
              // add more item to recent sliced
              setAddingMore(true); //show loader
              setTimeout(updatePage, 2000); //load more recent
              setEnded(false); //optional cleanup.
            }


          }
        };
        eventElement.addEventListener("scroll", handleScroll);
        return () => eventElement.removeEventListener("scroll", handleScroll);
      }, [page, data, sP, sH, cH]);

  return {ended, addingMore, maxLength}
}

export default useInfiniteScroll