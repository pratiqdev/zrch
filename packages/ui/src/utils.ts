import { useRef, useEffect } from 'react';
import * as _ from 'lodash-es'

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// export const groupArrayBy = (arr:any[], iter:Iteratee<any>) => {
  //   return  Object.entries(_.groupBy(arr, iter)) 
  // }

interface GroupArrayByOptions {
  maxGroups?: number;
  maxItemsPerGroup?: number;
  maxGroupResults?: number;
}
type Iteratee<T> = ((value: T) => any) | any;

export const groupArrayBy = (arr: any[], iter: Iteratee<any>, options?: GroupArrayByOptions) => {
  const { maxGroups, maxItemsPerGroup, maxGroupResults } = options || {};

  const grouped = _.groupBy(arr, iter);

  let resultGroups: [string, any[]][] = [];
  let totalGroupResults = 0;

  for (const [key, group] of Object.entries(grouped)) {
    if (maxGroups !== undefined && resultGroups.length >= maxGroups) {
      break;
    }

    let limitedGroup: any[];

    if (maxItemsPerGroup !== undefined) {
      limitedGroup = group.slice(0, maxItemsPerGroup);
    } else {
      limitedGroup = group;
    }

    if (maxGroupResults !== undefined) {
      const remainingResults = maxGroupResults - totalGroupResults;
      limitedGroup = limitedGroup.slice(0, remainingResults);
    }

    resultGroups.push([key, limitedGroup]);
    totalGroupResults += limitedGroup.length;
  }

  return resultGroups;
};




export const getUniqueTopLevelKeys = (values:any[]):string[] => {
    if(!Array.isArray(values)) return []
    return values.reduce((acc, obj) => {
        Object.keys(obj).forEach(key => {
          if (!acc.includes(key)) {
            acc.push(key);
          }
        });
        return acc;
    }, []);
    
}


// function getUniqueKeys(obj:any | any[], prefix:string = '') {
//     let keys:string[] = [];
   
//     if (_.isArray(obj)) {
//      obj.forEach((item, index) => {
//          keys = keys.concat(getUniqueKeys(item, prefix));
//      });
//     } else {
//      _.forOwn(obj, function(value, key) {
//          let newKey = prefix ? `${prefix}.${key}` : key;
//          keys.push(newKey);
   
//          if (_.isPlainObject(value)) {
//              keys = keys.concat(getUniqueKeys(value, newKey));
//          } else if (_.isArray(value)) {
//              value.forEach((item, index) => {
//                  keys = keys.concat(getUniqueKeys(item, `${newKey}.${index}`));
//              });
//          }
//      });
//     }
   
//     return [...new Set(keys)];
//    }

function getUniqueKeys(obj:any | any[], prefix:string = '') {
    let keys:string[] = [];
   
    if (_.isArray(obj)) {
     obj.forEach((item, index) => {
         keys = keys.concat(getUniqueKeys(item, prefix));
     });
    } else {
     _.forOwn(obj, function(value, key) {
         let newKey = prefix ? `${prefix}.${key}` : key;
   
         if (_.isPlainObject(value)) {
             keys = keys.concat(getUniqueKeys(value, newKey));
         } else if (_.isArray(value)) {
             value.forEach((item, index) => {
                 keys = keys.concat(getUniqueKeys(item, `${newKey}.${index}`));
             });
         } else {
             keys.push(newKey);
         }
     });
    }
   
    return Array.from(new Set(keys));
 }
  
  
   /** find all the unique non-number keys from any number of nested arrays or objects */
  export const getProbableKeys = (data:any | any[]) => {
      return getUniqueKeys(data).filter(v => !Number(v) && v !== '0')
  }

  export const createSearchableString = (...values: any[]): string => {
    // const log = mainLog.extend('createSearchableString')
  
    // log('creating searchable string from values:', values)
    
    return values.map((value) => {
      if (typeof value === 'string' || typeof value === 'number') {
        // log('value is string or number:', value)
        return value.toString();
      } else if (Array.isArray(value)) {
        // log('value is array:', value)
        return value.map((item) => createSearchableString(item)).join(' ');
      } else if (typeof value === 'object' && value !== null) {
        // log('recurse into object:', value)
        return createSearchableString(...Object.values(value));
      } else {
        // log('value is idk:', value)
        return '';
      }
    }).join(' ')
    // .toLowerCase();
  };
  
  export const getUniqueSubstrings = (source:string, min:number = 3, max:number = 18): string[] => {
    const regex = new RegExp(`\\b\\w{${min},${max}}\\b`, 'g');
    const words = source.match(regex)
    return words ? Array.from(new Set(words)) : []  
  }
  
/** Convert the provided arg to a searchable string, then parse for unique words between 3 and 18 chars length */
  export const getUniqueStrings = (searchable: any):string[] => {
    return getUniqueSubstrings(createSearchableString(searchable))
  }
  


/**
 * Generates a random color.
 */
export function randomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`
}

/**
 * Returns either black or white, depending on which has a better
 * contrast with the given color.
 *
 * It doesn't work well for all colors but it's sufficient for
 * our demo purposes.
 */
export function matchingTextColor(color: string) {
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000

  return yiq >= 128 ? '#000' : '#fff'
}




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