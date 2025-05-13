import { useEffect, useState } from 'react';

interface Prop {
    perView: number;
    data: any[];
}

interface Return {
    canNextFp: boolean;
    canPrevFp: boolean;
    startEnd: {start: number, end: number};
    nextFp: () => void;
    prevFp: () => void;
}

const usePagination = ({ perView, data }: Prop): Return => {
      ////////////paginate Featured card
      
      const [currentFpPage, setCurrentFpPage] = useState<number>(1);
      const [startEnd, setStartEnd] = useState<{start: number, end: number}>({start: 0, end: perView});
      const [canNextFp, setCanNextFp] = useState<boolean>(currentFpPage * perView < (data?.length ?? 0));
      const [canPrevFp, setCanPrevFp] = useState<boolean>(false);
      useEffect(() => {
        if(!data) return;
          setCanNextFp(currentFpPage * perView < (data?.length ?? 0))
      },  [currentFpPage, data]);
    
      useEffect(() => {
        setCanPrevFp(startEnd.start > 0);
      }, [startEnd]);
      
      const nextFp = () => {
        setCurrentFpPage((prev) => prev + 1);
        setStartEnd((prev) => ({start: prev.start + perView, end: prev.end + perView}))
      }
      const prevFp = () => {
        setCurrentFpPage((prev) => prev - 1);
        setStartEnd((prev) => ({start: prev.start - perView, end: prev.end - perView}))
      }



  return {canNextFp, canPrevFp, nextFp, prevFp, startEnd}
}

export default usePagination;