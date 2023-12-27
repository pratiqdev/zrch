"use client";

import * as React from "react";
import Fuse, { FuseOptionKey, FuseResult, FuseIndex } from "fuse.js";
import { getProbableKeys, getUniqueStrings, groupArrayBy } from "./utils";
import { Command, CommandDialog, CommandInput, CommandList, CommandItem, CommandEmpty } from "./components/command";
import { cn, useUpdate } from "./utils";
import * as _ from "lodash-es";
const log = console.log


const DEFAULT_GROUP = null //'hello' 
const voidFn = () => {}
const DEF = {
  // // ======================================= DOES NOT AFFECT SEARCH RESULTS
  open: false,
  placeholder: '',
  portalInto: (
    typeof window !== 'undefined' 
      ? window?.document?.body ?? document?.body
      : 'body'
  ),
  enableWindow: true,
  enableDialog: true,
  maxProbableKeys: 5,

  // // ======================================= AFFECTS SEARCH RESULTS
  searchableData: [] as any[],
  searchValue: '',
  searchResults: [] as FuseResults,
  groupedResults: [] as FuseGroupedResults,
  groupBy: DEFAULT_GROUP as null | string,
  
  enableAutoComplete: false,
  autoCompleteData: [] as string[],
  autoCompleteResults: [] as FuseResults,
  maxAutoComplete: 5,
  maxResults: 10,
  maxGroups: 3,
  maxItemsPerGroup: 5,
  maxGroupResults: 10,

  isCaseSensitive: false,
  includeScore: false,
  includeMatches: false,
  findAllMatches: false,
  useExtendedSearch: false,
  ignoreFieldNorm: false,
  ignoreLocation: false,
  // getFn: (obj: any, path: string | string[]) => obj[path], // deprecated
  // sortFn: (a:any, b:any) => 0, // deprecated
  location: 0,
  distance: 100,
  fieldNormWeight: 1,
  minMatchCharLength: 1,
  threshold: 0.6,
  keys: [] as FuseOptionKey<any>[],
  index: {} as FuseIndex<any>,

  onSelect: (item: FuseResult<any>) => console.log(item),
  onOpenChange: voidFn as (open: boolean) => void,
  InitialComponent: () => <div>Search for anything</div>,
  EmptyComponent: () => <div>No results</div>,
  FooterComponent: () => <div>By /pratiqdv</div>,
  RenderItem: ({ result, index }:{ result: FuseResult<any>, index: number }) => <div>#{index} {JSON.stringify(result)}</div>,
  RenderList: ({ results, groupedResults, value, onSelect }:{   results: FuseResult<any>[],  groupedResults: [string, FuseResult<any>[]][], value: string, onSelect: (value:any) => void }) => <div>{JSON.stringify(results)}</div>,

  classNames: {} as ClassNames,
}

type ZrchCtx = typeof DEF

export type BaseCtx<T> = {
	ctx: typeof DEF;
	setCtx: React.Dispatch<React.SetStateAction<ZrchCtx>>;
	mergeCtx: (newCtx: Partial<ZrchCtx> | React.SetStateAction<Partial<ZrchCtx>>) => void;
}





type SetState<T> = React.Dispatch<React.SetStateAction<T>>

type InferResults<T> = T extends string ? FuseResults : FuseGroupedResults;

type FuseResults = FuseResult<any>[];
type FuseGroupedResults = [string, FuseResult<any>[]][]






const zrchContext = React.createContext<BaseCtx<any>>({
  ctx: DEF,
  setCtx: () => {},
  mergeCtx: () => {}
})

export const useZrch = () => React.useContext(zrchContext)

type ZrchProps = Partial<typeof DEF> & {
  children?: React.ReactNode;
}


const Zrch: React.FC<ZrchProps> = (props) => {
  const [ctx, setCtx] = React.useState<BaseCtx<any>["ctx"]>({
    ...DEF,
    ...props
  })
  const [results, setResults] = React.useState<FuseResults>([])
  const [searchValue, setSearchValue] = React.useState<string>('')

  const mergeCtx = (
    newCtx: Partial<ZrchCtx> | React.SetStateAction<Partial<ZrchCtx>>
  ) => { 
    try {
      // log(`Merging new ctx:`, newCtx);
      setCtx((x) =>
        typeof newCtx === "function"
          ? ((newCtx(x) as ZrchCtx) ?? x)
          : { ...x, ...newCtx }
      );
    } catch (err) {
      log("Context merge error:", err);
    }
  };

  // const fuseRef = React.useRef<Fuse<any> | null>(null)

  // React.useEffect(() => {
    
  //   let probKeys = getProbableKeys(ctx.searchableData).filter(Boolean).slice(0, props?.maxProbableKeys ?? DEF.maxProbableKeys)
  //   let uniqueStrings = getUniqueStrings(ctx.searchableData)
    
  //   fuseRef.current = new Fuse(ctx.searchableData, {
  //     isCaseSensitive: ctx.isCaseSensitive,
  //     includeScore: ctx.includeScore,
  //     includeMatches: ctx.includeMatches,
  //     findAllMatches: ctx.findAllMatches,
  //     useExtendedSearch: ctx.useExtendedSearch,
  //     ignoreFieldNorm: ctx.ignoreFieldNorm,
  //     ignoreLocation: ctx.ignoreLocation,
  //     location: ctx.location,
  //     distance: ctx.distance,
  //     fieldNormWeight: ctx.fieldNormWeight,
  //     minMatchCharLength: ctx.minMatchCharLength,
  //     threshold: ctx.threshold,
  //     keys: ctx.keys?.length ? ctx.keys : probKeys ?? [],
  //   }, Object.entries(ctx?.index ?? {})?.length ? ctx.index : undefined)
    
  //   // if(fuseRef.current.getIndex() !== ctx.index){ mergeCtx({ index: fuseRef.current.getIndex() }) }
    
  //   console.log('udpated fuse:', {
  //     probKeys,
  //     uniqueStrings,
  //     fuse: fuseRef.current,
  //   })

  //   return () => {
  //     fuseRef.current = null
  //   }

  // }, [
  //   ctx.searchableData,
  //   ctx.autoCompleteData,
  //   ctx.distance,
  //   ctx.fieldNormWeight,
  //   ctx.findAllMatches,
  //   ctx.groupBy,
  //   ctx.ignoreFieldNorm,
  //   ctx.ignoreLocation,
  //   ctx.includeMatches,
  //   ctx.includeScore,
  //   // ctx.index,
  //   ctx.isCaseSensitive,
  //   ctx.keys,
  //   ctx.location,
  //   ctx.maxAutoComplete,
  //   ctx.maxGroupResults,

  // ])

  const memoizedFuse = React.useMemo(() => {
    console.log('CREATING FUSE INSTANCE')
    let probKeys = getProbableKeys(ctx.searchableData).filter(Boolean).slice(0, props?.maxProbableKeys ?? DEF.maxProbableKeys);
    let uniqueStrings = getUniqueStrings(ctx.searchableData);

    return new Fuse(ctx.searchableData, {
      isCaseSensitive: ctx.isCaseSensitive,
      includeScore: ctx.includeScore,
      includeMatches: ctx.includeMatches,
      findAllMatches: ctx.findAllMatches,
      useExtendedSearch: ctx.useExtendedSearch,
      ignoreFieldNorm: ctx.ignoreFieldNorm,
      ignoreLocation: ctx.ignoreLocation,
      location: ctx.location,
      distance: ctx.distance,
      fieldNormWeight: ctx.fieldNormWeight,
      minMatchCharLength: ctx.minMatchCharLength,
      threshold: ctx.threshold,
      keys: ctx.keys?.length ? ctx.keys : probKeys ?? [],
    }, Object.entries(ctx?.index ?? {})?.length ? ctx.index : undefined);
  }, [ctx]);
  
  useUpdate(() => {
    console.log('searching:', searchValue)
    const results = searchValue ? memoizedFuse?.search(searchValue, { limit: ctx.maxResults }) ?? [] : []
    console.log('search results:', results)
    setResults(results)
    // mergeCtx({ searchResults: results })
    // mergeCtx({ searchResults: ctx.searchValue ? memoizedFuse?.search(ctx.searchValue, { limit: ctx.maxResults }) ?? [] : [] })
  }, [searchValue])





  return (
    <>
      {/* <zrchContext.Provider value={{ ctx, setCtx, mergeCtx }}> */}
        <CommandDialog
          open={ctx.open}
          shouldFilter={false}
          onOpenChange={(open: boolean) =>  mergeCtx({ open }) }
        >
           <CommandInput
              className={cn("", props?.classNames?.input)}
              placeholder={ctx.placeholder}
              value={searchValue}
              onValueChange={(searchValue: string) => setSearchValue(searchValue ?? '') }
          />
          <CommandList>

             <CommandEmpty>No results</CommandEmpty>
             

              {results?.map((d, idx) => 
                <CommandItem key={idx} onSelect={() => ctx?.onSelect?.(d)}>
                  <ctx.RenderItem result={d} index={idx} />
                </CommandItem>
              )}

          </CommandList>


        </CommandDialog>
        <button onClick={() =>  mergeCtx({ open: !ctx.open }) }>{ctx.open ? 'open:true' : 'open:false'}</button>
          {props?.children}
      {/* </zrchContext.Provider> */}

    </>
  );
};






export default Zrch

////////////////////////////////////////////////////////////////////////////////////////////
type BaseRecord = Record<string| number | symbol, any>

type ClassNames = {
  wrapper: '',
  input: {
    wrapper: '',
    icon: '',
    element: ''
  },
  autoCompleteData: '',
  list: '',
  item: '',
  group: '',
}