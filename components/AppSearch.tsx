"use client"
import Srch, { useSrch } from './srch/Srch'
import { commentData, albumData,  userData, customData } from '@/components/srch/test-data'
import { ItemRender, ListRender } from '@/components/srch/customRender'
import { Button } from './ui/button'

const Control = () => {
    const {toggleWindow} = useSrch()
    return <Button onClick={() => toggleWindow(true)}>Search</Button>
}

const Search = () => {
    return (
        <>
        <Srch 
            searchable={[
                // ...albumData, 
            // ...commentData, 
            // ...userData,
            ...customData
        ]}  
            // searchKeys={['name']}
            groupBy='icon'
            RenderItem={ItemRender} 
            // RenderList={ListRender}
            // noResultsComponent={<p>No Results!!!</p>}
        >
            <Control />
        </Srch>
        </>
    )
}


export default Search
