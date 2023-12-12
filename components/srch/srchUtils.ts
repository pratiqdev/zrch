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