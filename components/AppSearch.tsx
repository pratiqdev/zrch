"use client"
import Srch, { useSrch } from '../srch/Srch'
import { commentData, albumData,  userData, customData } from '@/srch/test-data'
import { ItemRender, ListRender } from '@/srch/customRender'
import { Button } from './ui/button'
import { useRef } from 'react'

const Control = () => {
    const {toggleWindow} = useSrch()
    return <Button onClick={() => toggleWindow(true)}>Search</Button>
}

const Search = () => {
    return (
        <>
        <div id="blap" className="h-auto w-full overflow-hidden">

        </div>
        <Srch<typeof customData[0]>
            classNames={{
                wrapper: 'rounded-xl',
                list: 'min-h-[20rem]'
            }}
            searchable={customData}  
            recommended={[
                {
                    icon: 'Star',
                    title: 'Getting Started',
                    text: 'Take your first steps with `srch`',
                },
                {
                    icon: 'Star',
                    title: 'Another recommendation',
                    text: 'This is a recommendation',
                },
                {
                    icon: 'Link',
                    title: 'Check Out the Examples',
                    text: 'Explore the config and examples',
                }
            ]}
            useDialog={false}
            useAutocomplete={true}
            portalInto='blap'
            groupBy='icon'
            RenderItem={ItemRender} 
        />
        </>
    )
}


export default Search
