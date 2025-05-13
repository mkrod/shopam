import { useEffect, useState } from 'react'

interface Return {
    canAddMore: boolean;
    isAddingMore: boolean;
    isEnded: boolean;
    addMore: () => void;
    maxLength: number;
}
interface Prop {
    data: any[];
    perPage: number;
}
const useInfinitePagination = ({ data, perPage = 20 }: Prop) : Return => {


        // pagination
        //const perPage : number = 20;
        const [page, setPage] = useState<number>(1);
        const maxLength : number = perPage * page;
        const [isEnded, setIsEnded] = useState<boolean>(false);
        const [isAddingMore, setIsAddingMore] = useState<boolean>(false);
        const [canAddMore, setCanAddmore] = useState<boolean>(data.length > (perPage * page));

        useEffect(() => {
            setCanAddmore(data.length > (perPage * page));
        }, [data, perPage, page]);
      
        const addMore = () => {
          function updatePage() {
            setPage((prev) => prev + 1); // increase page
            setIsAddingMore(false); // hide loader
          }
          // add more item to recent sliced
          setIsAddingMore(true); //show loader
          setTimeout(updatePage, 2000); //load more recent
          setIsEnded(false); //optional cleanup.
          if (data.length <= perPage * page) return setCanAddmore(false);
        }
        



      return  {canAddMore, isAddingMore, isEnded, addMore, maxLength}
}

export default useInfinitePagination