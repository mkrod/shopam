import { useEffect, useRef, useState } from 'react';

interface Prop {
  data: any[];
  perPage: number;
  sH?: number;
  sP?: number;
  cH?: number;
}

interface Return {
  ended: boolean;
  addingMore: boolean;
  maxLength: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const useHorizontalInfiniteScroll = ({
  data,
  perPage,
}: Prop): Return => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const maxLength = perPage * page;
  const [ended, setEnded] = useState(false);
  const [addingMore, setAddingMore] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollPosition = el.scrollLeft;
      const scrollWidth = el.scrollWidth;
      const clientWidth = el.clientWidth

      if (scrollPosition + clientWidth >= scrollWidth) {
        if (maxLength >= data.length) {
          setEnded(true);
          setAddingMore(false);
        } else {
          setAddingMore(true);
          setTimeout(() => {
            setPage((prev) => prev + 1);
            setAddingMore(false);
          }, 2000);
          setEnded(false);
        }
      }
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [page, data, maxLength]);

  return { ended, addingMore, maxLength, containerRef };
};

export default useHorizontalInfiniteScroll;
