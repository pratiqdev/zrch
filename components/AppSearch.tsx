"use client"
import Srch, { useSrch } from '@/srch/Srch'
import { commentData, albumData,  userData, customData } from '@/srch/test-data'
import { ItemRender, ListRender } from '@/srch/customRender'
import { Button } from './ui/button'
import { useRef } from 'react'
import * as LucideIcons from 'lucide-react'

const Control = () => {
    const {toggleWindow} = useSrch()
    return <Button onClick={() => toggleWindow(true)}>Search</Button>
}
type WelcomeData = {
    section: 'Getting Started' | 'Options' | 'Advanced' | 'Examples' | 'About' | 'Hooks'
    icon: keyof typeof LucideIcons;
    title: string;
    default?: string;
    type?: string;
    text: string;
    href: string;
}
LucideIcons.ActivityIcon
export const welcomeData:WelcomeData[] = [
    {
        section: 'About',
        icon: 'TestTube',
        title: 'Beta Testing',
        text: 'Browse or create issues to contribute',
        href: 'https://github.com/pratiqdev/srch'
    },
    //==========================================================================================
    //==========================================================================================
    //==========================================================================================
    //==========================================================================================

    {
        section: 'Getting Started',
        icon: 'Clock3',
        title: 'Getting Started',
        text: 'Install, setup and get searching in ~5 minutes',
        href: '/docs#getting-started'
    },
    {
        section: 'Getting Started',
        icon: 'Search',
        title: 'Usage Examples',
        text: 'View some example setups, from common to advanced',
        href: '/examples'
    },
    //==========================================================================================
    //==========================================================================================
    //==========================================================================================

    {
        section: 'Advanced',
        icon: 'Clock',
        title: 'Advanced Config',
        text: 'Use custom comfig and components to control the features and appearance',
        href: '/advanced#getting-started'
    },
    //==========================================================================================
    //==========================================================================================
    //==========================================================================================
    //==========================================================================================
    //==========================================================================================
    {
        section: 'Options',
        icon: 'Settings',
        title: 'useWindow',
        type: 'boolean',
        default: 'true',
        text: 'Toggle rendering of the search window. Useful if you will render your own results',
        href: '/advanced#getting-started'
    },
    {
        section: 'Options',
        icon: 'Settings',
        title: 'useAutocomplete',
        default: 'true',
        type: 'boolean',
        text: 'Toggle parsing and rendering of autocomplete text list',
        href: ''
    },
    {
        section: 'Options',
        icon: 'Settings',
        title: 'useDialog',
        type: 'boolean',
        default: 'true',
        text: '',
        href: ''
    },
    {
        section: 'Options',
        icon: 'Settings',
        title: 'portalInto',
        type: 'string',
        default: 'null',
        text: 'A string selector to portal into when rendering the search window without the dialog (modal)',
        href: ''
    },
    {
        section: 'Options',
        icon: 'Settings',
        title: 'groupBy',
        type: 'string',
        default: 'null',
        text: 'Group results by this key and render under group headings',
        href: ''
    },
    {
        section: 'Options',
        icon: 'Settings',
        title: 'searchKeys',
        type: 'FuseOptionKey[]',
        default: '[]',
        text: 'Custom key and weight config for searching and scoring results',
        href: ''
    },
    {
        section: 'Options',
        icon: 'Activity',
        title: 'onSelect',
        type: '(result) => void',
        default: 'console.log',
        text: 'Handle actions like clicks or keyboard interactions on your items',
        href: ''
    },
    
    //==========================================================================================
    //==========================================================================================
    //==========================================================================================
    //==========================================================================================
    //==========================================================================================
    {
        section: 'Hooks',
        icon: 'Webhook',
        title: 'useSrch',
        text: 'Access and update internal state with helper methods provided in the `useSrch` hook',
        href: '/use-srch#getting-started'
    },
]


const Search = () => {
    return (
        <>
        <div id="blap" className="h-auto w-full flex justify-center items-center min-h-[20rem]">
            </div>
        <Srch
            classNames={{
                    wrapper: 'rounded-xl z-50 shadow-2xl dark:border dark:border-gray-800',
                list: 'min-h-[20rem]'
            }}
            searchable={welcomeData}  
            NoSearchComponent={() => {
                return <div className="text-center tracking-wide">
                    <p>Find your content</p>
                    <p className='font-light text-lg underline'>wihtout teh headahce</p>
                    <p className='text-md font-light tracking-wider text-gray-500'>without the headache?</p>
                </div>
            }}
            recommended={welcomeData.slice(0, 3)}
            useDialog={false}
            useAutocomplete={true}
            portalInto='blap'
            groupBy='section'
            RenderItem={ItemRender} 
        />
        </>
    )
}


export default Search
