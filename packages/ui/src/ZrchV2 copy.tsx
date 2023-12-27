import Fuse, { FuseOptionKey, FuseResult } from "fuse.js";
import * as React from "react";


/*
Docs and comments suggest grouping context values into a single context object
based on when they change, like:

- config values (rarely change, likely updated together)
  - distance
  - threshold
  - keys
  - groupBy
  - includeScore
  - includeMatches
  - minMatchCharLength
  - useExtendedSearch
  - ignoreFieldNorm
  - ignoreLocation
  - fieldNormWeight
  - findAllMatches
  - resultsLength
  - placeholder
  - onSelect
  - enableAutoComplete
  - autoCompleteLength
  - customAutoComplete
  - enableDialog
  - enableWindow
  - portalInto
  - classNames

- component values (rarely change, likely updated together)
  - InitialComponent
  - EmptyComponent
  - FooterComponent
  - RenderItem
  - RenderList

- state values (frequently change)
  - open
  - searchValue
  - searchResults


*/






type SetState<T> = React.Dispatch<React.SetStateAction<T>>
const voidFn = () => {}

type CtxType = {
  searchValue: string;
  searchResults: FuseResult<any>[];
}

const DEFAULTS = {
  searchValue: '',
  searchResults: [] as FuseResult<any>[],
}

type DefaultKeys = keyof typeof DEFAULTS

type ContextMap = Record< DefaultKeys, { ctx: React.Context<any>, useCtx: <T>() => [T, SetState<T>] } >

const CTX_MAP: ContextMap = {} as ContextMap

Object.entries(DEFAULTS).map(([key, value]) => {
  let k = key as DefaultKeys
  CTX_MAP[k] = { 
    ctx: React.createContext([ value, voidFn as SetState<typeof key> ]), 
    useCtx: function<T>(){ return [value as unknown as T, voidFn as SetState<T>] }
  }
  CTX_MAP[k].useCtx = () => React.useContext(CTX_MAP[k].ctx)
})


// const [searchValue, setSearchValue] = CTX_MAP.searchValue.useCtx<typeof DEFAULTS.searchValue>()
//  as [typeof DEFAULTS.searchValue, SetState<typeof DEFAULTS.searchValue>]
// const _searchResults = CTX_MAP.searchResults.useCtx()


export const useZrch = () => {
  // const stateAndSetStates:any = {}

  // Object.entries(CTX_MAP).forEach(([key, mapSection]) => {
  //   const [state, setState] = mapSection.useCtx<typeof DEFAULTS.searchValue>()
  //   stateAndSetStates[`set${key.charAt(0).toUpperCase()}${key.slice(1)}`] = setState as SetState<typeof state>
  //   stateAndSetStates[key] = state
  // })

  const [searchValue, setSearchValue] = CTX_MAP.searchValue.useCtx<typeof DEFAULTS.searchValue>()
  const [searchResults, setSearchResults] = CTX_MAP.searchResults.useCtx<typeof DEFAULTS.searchResults>()


  return {
    searchValue,
    setSearchValue,
    searchResults,
    setSearchResults,
  }
}

type ZrchProps = {
  defaultValue?: string;
  defaultResults?: CtxType["searchResults"]
  children?: React.ReactNode;
};


const Zrch: React.FC<Partial<typeof DEFAULTS> & ZrchProps> = (props) => {
  // console.log('Zrch', props)

  const STATE:Record<string,  [any, React.Dispatch<React.SetStateAction<any>>]>  = {
    searchValue: React.useState<typeof DEFAULTS.searchValue>(props?.searchValue ?? DEFAULTS.searchValue),
    searchResults: React.useState<typeof DEFAULTS.searchResults>(props?.searchResults ?? DEFAULTS.searchResults),
  }

  React.useEffect(() => {
    STATE.searchValue[0]?.length > 5 ? STATE.searchResults[1]([{ item: 'hello' }]) : []
  }, [STATE.searchValue[0] ])

  // const S :Record<string,  [any, React.Dispatch<React.SetStateAction<any>>]> = {}
  // Object.entries(DEFAULTS).forEach(([key, value]) => S[key] = React.useState<typeof value>((props as any)[key] ?? value))


  return (
    <>
      {Object.entries(CTX_MAP).reduce((acc, [key, mapSection]) => (
        <mapSection.ctx.Provider key={key} value={STATE[key]}>
          {/* <div id={`zrch-provider-${key}`} className="p-2 border"> */}
            {acc}
          {/* </div> */}
        </mapSection.ctx.Provider>
      ), <>

          {/* <pre className="text-indigo-500">{JSON.stringify(STATE, null, 2)}</pre> */}
          {props?.children}

      </>)}



    </>
  );
 };

/**
 * 
 * @param {T[]} searchable - The array of content to search
 */
function zrchConfigTest<T extends BaseRecord>({
  // ============= SEARCH
  searchable = [],
  defaultValue,
  defaultResults,
  groupBy,
  // placeholder,
  // onSelect,
  
  // // ============= CONFIG
  // enableAutoComplete,
  // autoCompleteLength,
  // customAutoComplete,

  // includeScore,
  // includeMatches,
  // minMatchCharLength,
  // useExtendedSearch,
  // ignoreFieldNorm,
  // ignoreLocation,
  // distance,
  // fieldNormWeight,
  // findAllMatches,
  // threshold,
  keys,
  
  // // ============= LIMITS
  // resultsLength,

  // // ============= WINDOW
  // open,
  // onOpenChange,
  // enableDialog,
  // enableWindow,
  // portalInto,
  // classNames,

  // // ============= COMPONENTS
  // InitialComponent,
  // EmptyComponent,
  // FooterComponent,
  // RenderItem,
  // RenderList,

  // // ============= PROVIDER
  // children,

}:{
  //// =========== SEARCH
  searchable?: T[];
  defaultValue?: string;
  defaultResults?: T[];
  groupBy?: string;
  
  //// =========== CONFIG
  keys?: FuseOptionKey<T>[];

  //// =========== WINDOW

  //// =========== COMPONENTS




}) {
  // - ONLY provide the minimum required context for usezrch, the window exists in this provider and can use state directly
  // - ALL values should be state driven to allow updating from usezrch
  // - 

  const [_searchable, _setSearchable] = React.useState<T[]>(searchable ?? [])
  const [_value, _setValue] = React.useState<string>(defaultValue ?? '')
  const [_results, _setResults] = React.useState<T[]>(defaultResults ?? [])
  const [_searchKeys, _setSearchKeys] = React.useState<FuseOptionKey<T>[]>(keys ?? [])
  const [_groupResultsBy, _setGroupResultsBy] = React.useState<string>(groupBy ?? '')

  const _fuseMain = React.useMemo(() => new Fuse(_searchable, {

  }), [])

  const _fuseAutoComplete = React.useMemo(() => new Fuse(_searchable, {
    isCaseSensitive: false,
    findAllMatches: true,
    threshold: .5
  }), [])

  return (
    <>

    </>
  )
}


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
  autoComplete: '',
  list: '',
  item: '',
  group: '',
}