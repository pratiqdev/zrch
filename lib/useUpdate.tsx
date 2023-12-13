import { useRef, useEffect } from 'react';

export const useUpdate = (fn:() => void, inputs: any[]) => {
 const isMountingRef = useRef(true);

 useEffect(() => {
   isMountingRef.current = false;
 }, []);

 useEffect(() => {
   if (!isMountingRef.current) {
     return fn();
   } else {
     isMountingRef.current = false;
   }
 }, [...inputs]);
};