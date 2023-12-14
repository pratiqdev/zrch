import { Dispatch,  ReactNode,  SetStateAction } from "react";
import { FuseOptionKey, FuseResult } from "fuse.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export type FuseConfig = {
    includeScore: boolean;
    includeMatches: boolean;
    minMatchCharLength: number;
    useExtendedSearch: boolean;
    ignoreFieldNorm: boolean;
    ignoreLocation: boolean;
    distance: number;
    fieldNormWeight: number;
    findAllMatches: boolean;
    threshold: number;
    keys: FuseOptionKey<any>[]
}

export type MetaConfig = {
    recommendedLength: number;
    autoCompleteLength: number;
    resultsLength: number;
    attributionText: ReactNode;
}

export type SrchCtx<T> = {
	searchValue: string;
	searchResults: FuseResult<T>[];
    recommended: T[];
    autocomplete: string[];
    isWindowOpen: boolean;
    searchable: any[];
    fuseConfig: FuseConfig;
    metaConfig: MetaConfig;
    groupBy: null | string;

	[key:string] : any
}

export type BaseCtx<T> = {
	ctx: SrchCtx<T>;
	setCtx: Dispatch<SetStateAction<SrchCtx<T>>>;
	mergeCtx: (newCtx: Partial<SrchCtx<T>> | SetStateAction<Partial<SrchCtx<T>>>) => void;
}



/*
reusable search component:

dependancies:
React 18+
@pratiq/useKeyboard - register event listeners for open, close and clear events
fuse.js - fast fuzzy search
shadcn/ui - tailwind components
radix-ui - components
cmdk - command dialog


params:
    config:
        - keys: fuseKeyConfig,              FuseOptionKey<any>[]        []                                                              Config object for fuse keys   
        - minMatch: 3,                      number                      0                                                               Number of characters in search string required before performing search
        - extended: true,                   boolean                     false                                                           True to enable extended search features like ! ^ $
        - ignoreFieldNorm: false,           boolean                     false                                                           True to ignore the length of text when determining match
        - fieldNormWeight: .2,              float                       1       
        - findAllMatches: true,             boolean                     false                                                           True to continue searching after complete match found
        - threshold:1,                      float                       1       
        - recommendedLength: 5,             number                      5                                                               Max number of recommendations to show
        - autoCompleteLenth: 5              number                      5                                                               Max number of autocomplete suggestions to show
        
    content:
        - searchable:                       any[]                       []                                                              array of searchable items (type should be inferrred from these)
        - recommended:                      any[]                       []                                                              array of searchable items to render as recommendations
        - autocomplete:                     string[] | false            []                                                              (false to disable, array of custom strings to be used instead of parsing searchable content for unique strings)
    
    display:
        - searchWindowInputPlaceholder      string                      'Search'                                                        Placeholder text for the search window input
        - searchBarInputPlaceholder         string                      'Search'                                                        Placeholder text for the external search input
        - attributionComponent              ReactNode                   <p>By pratiqdev</p>                                             Footer content of search window modal                
        - noResultsComponent                ReactNode                   (ctx) => <p>No Results for {ctx.searchValue}</p>                Component to display when no search results are found
        - noSearchComponent                 ReactNode                   (ctx) => <p>Search for content like {ctx.rec[0].title}</p>      Component to display when search input is empty

    kbd:
        - openKeys: 						string[]		            ['ctrl-k', 'cmd-k']                                             array of keyboard keys or combos that will open the search window
		- closeKeys:						string[]                    ['esc']                                                         Array of keyboard keys or combos that will close the search window
		- clearKeys:						string[]                    ['shift-backspace']                                             Array of keyboard keys or combos that will clear the search value




Exported components or functions:
    <SearchProvider                                     The context wrapper for all other components and hooks
        config={{ ... }} 
        searchable={[ ,,, ]} 
        recommended={[ ,,, ]} 
        autocomplete={[ ,,, ]}
        openKeys={[ '' ]}
        closeKeys={[ '' ]}
    >{children}</SearchProvider>

    <SearchWindow                                       The modal search window
        placeholder=''
        searchIcon={true}
        cmdIcon={true}
        attribution={false ?? <p> By MJ </p>}
        emptySearchContent={false ?? <p> Search! </p>}
        emptyResultsContent={false ?? <p> No Results </p>}
    />

    <SearchBar                                         The external search input
        placeholder='Search!'
        searchIcon={true}
        cmdIcon={true}
        openWindowOnClick={true}
    />

    const {
        value,                              The current search value
        setValue,                           Set the current value. Setting updates the search results, autocomplete, etc.
        results,                            The array of search results
        isWindowOpen,                       True if the search window is open
        setIsWindowOpen,                    Set the search window open state
        setSearchable,                      Set a new searchable collection on the fuse instance
        setRecommended,                     Set a custom searchable[] for recommended items
        setAutocomplete,                    Set a custom string[] for autocomplete text
    } = useSearch()                    

*/