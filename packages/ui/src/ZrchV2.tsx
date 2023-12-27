"use client";

import * as React from "react";
import Fuse, { FuseOptionKey, FuseResult, FuseIndex } from "fuse.js";
import { getProbableKeys, getUniqueStrings, groupArrayBy } from "./utils";
import { Command, CommandDialog, CommandInput, CommandList, CommandItem, CommandEmpty } from "./components/command";
import { cn, useUpdate } from "./utils";
import * as _ from "lodash-es";







type SetState<T> = React.Dispatch<React.SetStateAction<T>>
const voidFn = () => {}
type InferResults<T> = T extends string ? FuseResults : FuseGroupedResults;

type FuseResults = FuseResult<any>[];
type FuseGroupedResults = [string, FuseResult<any>[]][]
const DEFAULT_GROUP = null //'hello' 

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

const SETTERS = {
  setOpen: voidFn as SetState<typeof DEF.open>,
  setSearchValue: voidFn as SetState<typeof DEF.searchValue>,
  setSearchResults: voidFn as SetState<typeof DEF.searchResults>,

  /** Make sure to check for string and fuse.parseIndex to safely parse before setting index? is this step required? */
  setIndex: voidFn as SetState<typeof DEF.index>,
}

const zrchContext = React.createContext<Omit<typeof DEF & typeof SETTERS, 'classNames'>>({ ...DEF, ...SETTERS })

export const useZrch = () => React.useContext(zrchContext)

type ZrchProps = Partial<typeof DEF> & {
  children?: React.ReactNode;
}

/**
 * @example
 * <Zrch 
 *  searchableData={[ 
 *    { name: 'bubble', icon: 'BubbleIcon', content: '...' },
 *    { address: '3', title: 'Oo', text: '...' },
 *    ...
 *  ]}
 * 
 *  // optional controls
 *  open={true} 
 * 
 *  // default values
 *  searchValue='' 
 *  searchResults={[ { item: 'bubble', refIndex: 0 }, ... ]} 
 * >
 * @param {T[]} searchableData - The array of content to search
 * @param {boolean} open - Control the open state of the window
 */
const Zrch: React.FC<ZrchProps> = (props) => {
  // console.log('Zrch', props)
  // Remove the unused type declaration


  const [open, setOpen] = React.useState<typeof DEF.open>(props?.open ?? DEF.open)
  const [enableDialog, setEnableDialog] = React.useState<typeof DEF.enableDialog>(props?.enableDialog ?? DEF.enableDialog)
  const [enableWindow, setEnableWindow] = React.useState<typeof DEF.enableWindow>(props?.enableWindow ?? DEF.enableWindow)
 
  const [searchableData, setSearchableData] = React.useState<typeof DEF.searchableData>(props?.searchableData ?? DEF.searchableData)
  const [searchValue, setSearchValue] = React.useState<typeof DEF.searchValue>(props?.searchValue ?? DEF.searchValue)
  const [searchResults, setSearchResults] = React.useState<FuseResults>(props?.searchResults ?? DEF.searchResults) 
  const [groupedResults, setGroupedResults] = React.useState<FuseGroupedResults>(props?.groupedResults ?? DEF.groupedResults) 

  const [maxResults, setMaxResults] = React.useState<typeof DEF.maxResults>(props?.maxResults ?? DEF.maxResults)
  const [groupBy, setGroupBy] = React.useState<typeof DEF.groupBy>(props?.groupBy ?? DEF.groupBy)
  const [autoCompleteData, setAutoComplete] = React.useState<typeof DEF.autoCompleteData>(props?.autoCompleteData ?? DEF.autoCompleteData)
  const [autoCompleteResults, setAutoCompleteResults] = React.useState<typeof DEF.autoCompleteResults>(props?.autoCompleteResults ?? DEF.autoCompleteResults)
  const [enableAutoComplete, setEnableAutoComplete] = React.useState<typeof DEF.enableAutoComplete>(props?.enableAutoComplete ?? DEF.enableAutoComplete)
  const [maxAutoComplete, setMaxAutoComplete] = React.useState<typeof DEF.maxAutoComplete>(props?.maxAutoComplete ?? DEF.maxAutoComplete)
  const [maxGroups, setMaxGroups] = React.useState<typeof DEF.maxGroups>(props?.maxGroups ?? DEF.maxGroups)
  const [maxItemsPerGroup, setMaxItemsPerGroup] = React.useState<typeof DEF.maxItemsPerGroup>(props?.maxItemsPerGroup ?? DEF.maxItemsPerGroup)
  const [maxGroupResults, setMaxGroupResults] = React.useState<typeof DEF.maxGroupResults>(props?.maxGroupResults ?? DEF.maxGroupResults)

  const [isCaseSensitive, setIsCaseSensitive] = React.useState<typeof DEF.isCaseSensitive>(props?.isCaseSensitive ?? DEF.isCaseSensitive)
  const [includeScore, setIncludeScore] = React.useState<typeof DEF.includeScore>(props?.includeScore ?? DEF.includeScore)
  const [includeMatches, setIncludeMatches] = React.useState<typeof DEF.includeMatches>(props?.includeMatches ?? DEF.includeMatches)
  const [findAllMatches, setFindAllMatches] = React.useState<typeof DEF.findAllMatches>(props?.findAllMatches ?? DEF.findAllMatches)
  const [useExtendedSearch, setUseExtendedSearch] = React.useState<typeof DEF.useExtendedSearch>(props?.useExtendedSearch ?? DEF.useExtendedSearch)
  const [ignoreFieldNorm, setIgnoreFieldNorm] = React.useState<typeof DEF.ignoreFieldNorm>(props?.ignoreFieldNorm ?? DEF.ignoreFieldNorm)
  const [ignoreLocation, setIgnoreLocation] = React.useState<typeof DEF.ignoreLocation>(props?.ignoreLocation ?? DEF.ignoreLocation)
  const [location, setLocation] = React.useState<typeof DEF.location>(props?.location ?? DEF.location)
  const [distance, setDistance] = React.useState<typeof DEF.distance>(props?.distance ?? DEF.distance)
  const [fieldNormWeight, setFieldNormWeight] = React.useState<typeof DEF.fieldNormWeight>(props?.fieldNormWeight ?? DEF.fieldNormWeight)
  const [minMatchCharLength, setMinMatchCharLength] = React.useState<typeof DEF.minMatchCharLength>(props?.minMatchCharLength ?? DEF.minMatchCharLength)
  const [threshold, setThreshold] = React.useState<typeof DEF.threshold>(props?.threshold ?? DEF.threshold)
  const [keys, setKeys] = React.useState<typeof DEF.keys>(props?.keys ?? DEF.keys)
  const [index, setIndex] = React.useState<typeof DEF.index>(props?.index ?? DEF.index)

  const [placeholder, setPlaceholder] = React.useState<typeof DEF.placeholder>(props?.placeholder ?? DEF.placeholder)
  const [portalInto, setPortalInto] = React.useState<typeof DEF.portalInto>(props?.portalInto ?? DEF.portalInto)

  // const parsedData = React.useMemo(() => ({
  //   probableKeys: getProbableKeys(searchableData),
  //   uniqueStrings: getUniqueStrings(searchableData),
  // }), [searchableData]) 

  const fuseRef = React.useRef<Fuse<any> | null>(null)

  // const onSelect = React.useCallback((item: FuseResult<any>) => props?.onSelect ?? console.log, [props?.onSelect])
  // const onOpenChange = React.useCallback((open: boolean) => props?.onOpenChange ?? console.log, [props?.onOpenChange])
  // const InitialComponent = React.useCallback(props?.InitialComponent ?? DEF.InitialComponent, [props?.InitialComponent])
  // const EmptyComponent = React.useCallback(props?.EmptyComponent ?? DEF.EmptyComponent, [props?.EmptyComponent])
  // const FooterComponent = React.useCallback(props?.FooterComponent ?? DEF.FooterComponent, [props?.FooterComponent])
  // const RenderItem = React.useCallback(props?.RenderItem ?? DEF.RenderItem, [props?.RenderItem])
  // const RenderList = React.useCallback(props?.RenderList ?? DEF.RenderList, [props?.RenderList])


  // const fuse = React.useMemo(() => new Fuse(searchableData, {
  //   isCaseSensitive,
  //   includeScore,
  //   includeMatches,
  //   findAllMatches,
  //   useExtendedSearch,
  //   ignoreFieldNorm,
  //   ignoreLocation,
  //   location,
  //   distance,
  //   fieldNormWeight,
  //   minMatchCharLength,
  //   threshold,
  //   keys: keys?.length ? keys : parsedData?.probableKeys ?? [],
  // }, Object.entries(index)?.length ? index : undefined), [
  //   parsedData,
  //   isCaseSensitive,
  //   includeScore,
  //   includeMatches,
  //   findAllMatches,
  //   useExtendedSearch,
  //   ignoreFieldNorm,
  //   ignoreLocation,
  //   location,
  //   distance,
  //   fieldNormWeight,
  //   minMatchCharLength,
  //   threshold,
  //   keys,
  //   index,
  // ])

  // const fuseAutoComplete = React.useMemo(() => 
  //   !enableAutoComplete 
  //     ? null 
  //     : new Fuse(autoCompleteData ?? getUniqueStrings(searchableData), {
  //         isCaseSensitive,
  //         findAllMatches,
  //         useExtendedSearch,
  //         threshold,
  //         minMatchCharLength,
  //       }), [
  //         searchableData,
  //         isCaseSensitive,
  //         findAllMatches,
  //         useExtendedSearch,
  //         minMatchCharLength,
  //         threshold,
  // ])

  React.useEffect(() => {
    
    let probKeys = getProbableKeys(searchableData).filter(Boolean).slice(0, props?.maxProbableKeys ?? DEF.maxProbableKeys)
    let uniqueStrings = getUniqueStrings(searchableData)
    
    fuseRef.current = new Fuse(searchableData, {
      isCaseSensitive,
      includeScore,
      includeMatches,
      findAllMatches,
      useExtendedSearch,
      ignoreFieldNorm,
      ignoreLocation,
      location,
      distance,
      fieldNormWeight,
      minMatchCharLength,
      threshold,
      keys: keys?.length ? keys : probKeys ?? [],
    }, Object.entries(index)?.length ? index : undefined)
    
    if(fuseRef.current.getIndex() !== index){ setIndex(fuseRef.current.getIndex()) }
    
    console.log('udpated fuse:', {
      probKeys,
      uniqueStrings
    })

  }, [
    props?.maxProbableKeys,
    searchableData,
    isCaseSensitive,
    includeScore,
    includeMatches,
    findAllMatches,
    useExtendedSearch,
    ignoreFieldNorm,
    ignoreLocation,
    location,
    distance,
    fieldNormWeight,
    minMatchCharLength,
    threshold,
    keys
  ])

  const performSearch =  _.throttle((value: string) => {
    console.log('performing search...')
    setSearchResults(searchValue ? fuseRef?.current?.search(searchValue, { limit: maxResults }) ?? [] : [])
  }, 1000, { leading:true, trailing:false });

  React.useEffect(() => {
    // if(fuse.getIndex() !== index){ setIndex(fuse.getIndex()) }
    console.log('attempting search:', searchValue)

    performSearch(searchValue)




    // setSearchResults(searchValue ? fuseRef?.current?.search(searchValue, { limit: maxResults }) ?? [] : [])
    // setGroupedResults(searchValue && groupBy ? groupArrayBy(fuseRef.current.search(searchValue), groupBy, { maxGroups, maxGroupResults: maxGroupResults ?? maxResults, maxItemsPerGroup }) : [])
    // setAutoComplete(searchValue && enableAutoComplete ? fuseAutoComplete?.search(searchValue).filter((v,i) => maxAutoComplete ? i < maxAutoComplete : true).map(v => v.item) ?? [] : [])
  }, [
    searchValue, 
    fuseRef.current,
    groupBy, 
    maxResults,
    // enableAutoComplete,
    // maxAutoComplete, 
    autoCompleteData,
  ])

  const publicContext = {
    open, setOpen,
    enableDialog, setEnableDialog,
    enableWindow, setEnableWindow,
    maxProbableKeys: props?.maxProbableKeys ?? DEF.maxProbableKeys,
    
    searchableData, setSearchableData,
    searchValue, setSearchValue,
    searchResults, setSearchResults,
    maxResults, setMaxResults,
    groupBy, setGroupBy,
    groupedResults, setGroupedResults,
    maxGroups, setMaxGroups,
    maxItemsPerGroup, setMaxItemsPerGroup,
    maxGroupResults, setMaxGroupResults,
    
    enableAutoComplete, setEnableAutoComplete,
    autoCompleteData, setAutoComplete,
    autoCompleteResults, setAutoCompleteResults,
    maxAutoComplete, setMaxAutoComplete,
    isCaseSensitive, setIsCaseSensitive,
    includeScore, setIncludeScore,
    includeMatches, setIncludeMatches,
    findAllMatches, setFindAllMatches,
    useExtendedSearch, setUseExtendedSearch,
    ignoreFieldNorm, setIgnoreFieldNorm,
    ignoreLocation, setIgnoreLocation,
    location, setLocation,
    distance, setDistance,
    fieldNormWeight, setFieldNormWeight,
    minMatchCharLength, setMinMatchCharLength,
    threshold, setThreshold,
    keys, setKeys,
    index, setIndex,
    placeholder, setPlaceholder,
    portalInto, setPortalInto,
    
    onSelect: props?.onSelect ?? console.log,
    onOpenChange: props?.onOpenChange ?? voidFn,
    InitialComponent: props?.InitialComponent ?? DEF.InitialComponent,
    EmptyComponent: props?.EmptyComponent ?? DEF.EmptyComponent,
    FooterComponent: props?.FooterComponent ?? DEF.FooterComponent, 
    RenderItem: props?.RenderItem ?? DEF.RenderItem,  
    RenderList: props?.RenderList ?? DEF.RenderList,
  }


  const Wrapper = enableDialog ? CommandDialog : Command;

  return (
    <>
      {/* <zrchContext.Provider value={publicContext}> */}
        <button onClick={() =>  setOpen(b => !b) }>{open ? 'open:true' : 'open:false'}</button>
          {props?.children}
        <Wrapper
          open={open}
          shouldFilter={false}
          onOpenChange={(open: boolean) => { setOpen(open); props?.onOpenChange?.(open) }}
        >
           <CommandInput
              className={cn("", props?.classNames?.input)}
              placeholder={placeholder}
              value={searchValue}
              onValueChange={setSearchValue}
          />
          <CommandList>

            <CommandEmpty>No results</CommandEmpty>

          {searchResults?.map((d, idx) => 
            <CommandItem key={idx} onSelect={() => publicContext?.onSelect?.(d)}>
              <publicContext.RenderItem result={d} index={idx} />
            </CommandItem>
          // RenderItem &&
          //   <RenderItem key={idx} result={d} index={idx} />
              // : <DefaultItem key={JSON.stringify({idx, item: d.item})} type={d.item.type} item={d.item} /> 
        )}

   

          </CommandList>
        </Wrapper>
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