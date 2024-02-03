import * as _ from 'lodash-es'

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
   
    return [...new Set(keys)];
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
    }).join(' ').toLowerCase();
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
  