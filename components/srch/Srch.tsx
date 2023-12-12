"use client";

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  SetStateAction,
  FormEvent,
  useRef,
  useMemo,
  memo,
  JSXElementConstructor,
} from "react";
import { useUpdate } from "@/lib/useUpdate";
import Fuse, { FuseOptionKey, FuseResult } from "fuse.js";
import createDebug from "debug";
import { BaseCtx, SrchCtx } from "./types";
import { getProbableKeys, getUniqueTopLevelKeys } from "./srchUtils";
import {
  CommandInput,
  CommandDialog,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import * as LucideIcons from "lucide-react";
import * as _ from 'lodash-es'

const log = createDebug("srch");
createDebug.disable()
log("init...");


const iconFuse = new Fuse(Object.keys(LucideIcons), {
    isCaseSensitive: false,
    useExtendedSearch: true,
})

const keyFuse = new Fuse(['title'], {
    includeScore: true,
    isCaseSensitive: false,
    findAllMatches: true
})

// log(`iconFuse:`, iconFuse.search('^activ'))

const DEFAULT_CONTEXT: SrchCtx = {
  searchable: [],
  searchValue: "",
  searchResults: [],
  isWindowOpen: true,
  groupBy: null,
  metaConfig: {
    attributionText: "By pratiqdev",
    recommendedLength: 5,
    resultsLength: 10,
    autoCompleteLength: 5,
  },
  fuseConfig: {
    includeScore: false,
    includeMatches: false,
    minMatchCharLength: 1,
    useExtendedSearch: true,
    ignoreFieldNorm: false,
    fieldNormWeight: 0.2,
    findAllMatches: true,
    threshold: 1,
    keys: [],
  },
};

const srchCtx = createContext<BaseCtx>({
  ctx: DEFAULT_CONTEXT,
  setCtx: () => {},
  mergeCtx: () => {},
});

function findValueLike(item:any, like:string[]) {
try{
    // if(!like.includes('company')) return
    log(`findValueLike |`, {
        item, like
    })

    // check each like string for actual keys from allKeys
    // get the fuseResults from each search
    let res = like.flatMap(l => {
        let srch = keyFuse.search(l)
        log(`findValueLike | 0:`, l, srch)

        return srch
    })
    log(`findValueLike | 1:`, like, res)
    
    // .flat()
    res = res.sort((a, b) => a && b && a.score! > b.score! ? 1 : 0)
    log(`findValueLike | 2:`, like, res)
    // .sort((a, b) => a && b && a.item.length! - b.item.length! ? 1 : 0)
    // [0].item
    let keyString = res[0]?.item ?? ''
    log(`findValueLike | 3:`, like, keyString)
    
    let foundValue = _.get(item, keyString)
    log(`findValueLike | 4:`, like, foundValue)
    // return _.get(item,  res)
    if(typeof foundValue == 'string'){
        return foundValue
    }else{
        return null
    }
}catch(err){
    log(`Error finding value:`, err)
    return null
}
}







export const useSrchBase = () => useContext(srchCtx);

//========================================================================================================================
export const useSrch = () => {
  const { ctx, setCtx, mergeCtx } = useContext(srchCtx);

  const setValue = (value?: string) => {
    if (!value || typeof value !== "string") {
      mergeCtx({ searchValue: "" });
      return;
    }
    mergeCtx({ searchValue: value });
  };

  const toggleWindow = (open?: boolean) => {
    mergeCtx({ isWindowOpen: open !== undefined ? !!open : !ctx.isWindowOpen });
  };

  /** Sets a new searchable collection within fuse.js  */
  const setSearchable = (data: any[]) => {
    if (!Array.isArray(data)) {
      log(`The new searchable data must be an array!`);
      return;
    }
    mergeCtx({ searchable: data ?? [] });
  };

  return {
    value: ctx.searchValue,
    results: ctx.searchResults,
    groupedResults: ctx.groupedResults,
    groupBy: ctx.groupBy,
    isWindowOpen: ctx.isWindowOpen,
    setValue,
    toggleWindow,
    setSearchable,
    config: {
        ...ctx.metaConfig,
        ...ctx.fuseConfig
    }
  };
};

//========================================================================================================================
export const SrchProvider = ({
  searchable = [],
  searchKeys = [],
  groupBy,
  children,
}: {
  searchable?: any[];
  searchKeys?: FuseOptionKey<any>[];
  groupBy?: string;
  children?: ReactNode;
}) => {
  const [ctx, setCtx] = useState<SrchCtx>(DEFAULT_CONTEXT);
  const fuseRef = useRef<null | Fuse<any>>(null);

  /** Merge new state with existing state
   *
   * causes global rerender as object ref change causes react state update */
  const mergeCtx = (
    newCtx: Partial<SrchCtx> | SetStateAction<Partial<SrchCtx>>
  ) => {
    try {
      log(`Merging new ctx:`, newCtx);
      setCtx((x) =>
        typeof newCtx === "function"
          ? (newCtx(x) as SrchCtx)
          : { ...x, ...newCtx }
      );
    } catch (err) {
      log("Context merge error:", err);
    }
  };


  const parseSearchableData = () => {
    if (!Array.isArray(searchable)) {
        log(`The data provided to srch must be an array. Recieved:`, searchable)
        return
    }


    /*
        get likely keys used for displaying in the default item
        the searchable array may have:
        item.title || item.Title || item.mainTitle || item.heading
        and could be parsed with fuse to find any keys similar to 'title' => 'mainTitle'


    */

    
    
    mergeCtx({ searchable });
  }



  // perform search
  useUpdate(() => {
    let res = fuseRef.current?.search(ctx?.searchValue ?? "").filter((x, idx) => idx < ctx.metaConfig.resultsLength) ?? []
    let groupedRes = groupBy ? Object.entries(_.groupBy(res, i => i?.item?.[groupBy]  )) : []
            
    mergeCtx({ 
        searchResults: res,
        groupedResults: groupedRes,
        groupBy
    });
  }, [ctx.searchValue, groupBy]);

  //  initialize fuse.js with config and searchable data (this effect is for updating the fust instance and config data)
  useUpdate(() => {
    log(`Searchable data or config updated:`, ctx.searchable, ctx.config);

    // check if there is keys config
    log(`Checking for fuse keys...`);
    let fuseKeys = searchKeys ?? ctx?.fuseConfig?.keys ?? [];
    if (fuseKeys.length === 0) {
      log(`No fuse keys provided - parsing data for probable keys`);
      fuseKeys = getProbableKeys(searchable)
      log(`Found probable keys:`, fuseKeys)
    } else {
      log(`Custom fuse keys provided:`, fuseKeys);
    }

    let probKeys = getProbableKeys(searchable) as any
    log(`updating prob keys:`, probKeys)
    
    keyFuse.setCollection(probKeys)
    log(`keys uupdated?:`, keyFuse)

    mergeCtx({ fuseConfig: { ...ctx.fuseConfig, keys: fuseKeys } });

    // create fuse instance
    fuseRef.current = new Fuse(ctx.searchable, {
      includeScore: ctx.fuseConfig.includeScore,
      includeMatches: ctx.fuseConfig.includeMatches,
      useExtendedSearch: ctx.fuseConfig.useExtendedSearch,
      minMatchCharLength: ctx.fuseConfig.minMatchCharLength,
      ignoreFieldNorm: ctx.fuseConfig.ignoreFieldNorm,
      // increase the importance of shorter text samples
      fieldNormWeight: ctx.fuseConfig.fieldNormWeight,
      findAllMatches: ctx.fuseConfig.findAllMatches,
      threshold: ctx.fuseConfig.threshold,
      keys: fuseKeys,
    });
    log(`Created fuse instance:`, fuseRef.current);
  }, [ctx.searchable, ctx.config]);

  // get the searchable data from props (this useEffect is for handling props from this component)
  useEffect(() => {
    parseSearchableData()
  }, [searchable]);

  return (
    <srchCtx.Provider value={{ ctx, setCtx, mergeCtx }}>
      {children}
      {/* <pre className="text-xs left-0 w-[50vw]">
            {JSON.stringify({ ...ctx, searchable: ["set"] }, null, 2)}
        </pre> */}
    </srchCtx.Provider>
  );
};

//========================================================================================================================
const DefaultItem = ({
  type,
  item,
}: {
  type: string;
  item: FuseResult<any>["item"];
}) => {
    const { config } = useSrch()

    return (
        <CommandItem onSelect={e => console.log('selected:', e)}>
            {/* {SelectedIcon && <SelectedIcon className="mr-2 h-4 w-4 min-w-[1.5rem] text-indigo-500" />} */}
            <div className="flex flex-col text-xs overflow-hidden">
            <span className="font-medium">
                {findValueLike(item, ['title', 'name', 'username', 'heading'])}
            </span>
            <span className="font-medium">
                {findValueLike(item, ['user', 'id', 'userid', 'email', 'city'])}
            </span>
            <span className="truncate font-light">
                {findValueLike(item, ['company', 'content', 'text', 'body'])}
            </span>
            </div>
        </CommandItem>
    );
  
};






//========================================================================================================================
export const SrchWindow = ({
    placeholder = '`srch`  by  /pratiqdev',
    noSearchComponent,
    noResultsComponent,
}:{
    placeholder?: string;
    noSearchComponent?: ReactNode;
    noResultsComponent?: ReactNode;
}) => {
  const { value, setValue, results, groupedResults, isWindowOpen, toggleWindow, config, groupBy } = useSrch();

    const GroupedResults = () => (
        <>
         {groupedResults?.map(([section, data]:[string, FuseResult<any>[]]) => (
            <CommandGroup key={section} heading={section} hidden={!data.length}>
                {data.map((d, idx) => (
                    <DefaultItem key={idx} type={section} item={d.item} />
                ))}
            </CommandGroup>
        ))}
        </>
    )
    const Results = () => (
        <>
         {results?.map((d, idx) => <DefaultItem key={JSON.stringify({idx, item: d.item})} type={d.item.type} item={d.item} /> )}
        </>
    )

    return (
        <CommandDialog
        open={isWindowOpen}
        onOpenChange={toggleWindow}
        shouldFilter={false}
        
        
        >
        <CommandInput
            placeholder={placeholder}
            value={value}
            onValueChange={setValue}
        />
        <CommandList>
            {(value.length >= config.minMatchCharLength && results.length === 0) && <CommandEmpty>{noResultsComponent ?? "No Results"}</CommandEmpty>}
            {(value.length < config.minMatchCharLength && results.length === 0) && <CommandEmpty>{noSearchComponent ?? "Search for something!"}</CommandEmpty>}
            {groupBy ? <GroupedResults /> : <Results />}
            {/* {results?.map(([section, data]) => (
            <CommandGroup key={section} heading={section} hidden={!data.length}>
                {data.map((d, idx) => (
                <Item key={idx} type={section} item={d.item} />
                ))}
            </CommandGroup>
            ))} */}
        </CommandList>
        </CommandDialog>
    );

};


