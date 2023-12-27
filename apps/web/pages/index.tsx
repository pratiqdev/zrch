import Item from '@/components/Item'
import Zrch, { useZrch } from 'ui'
import data from './poke.json'

// const Comp = () => {    
//   const { searchValue, setSearchValue } = useZrch()
//   return (
//     <div className='m-4 p-2  bg-gray-50 border'>
//       <input type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
//       <pre>{searchValue}</pre>
//     </div>
//   )
// }



// const Comp2 = () => {    
//   return (
//     <div className='m-4 p-2  bg-gray-50 border'>
//       {/* <input type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} /> */}
//       <pre>--^^--</pre>
//     </div>
//   )
// }

// const Comp3 = () => {    
//   const { searchResults } = useZrch()
//   return (
//     <div className='m-4 p-2  bg-gray-50 border'>
//       {/* <input type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} /> */}
//       {searchResults.map((result) => <p key={result.item.name}>{result.item.name}</p>)}
//     </div>
//   )
// }

export default function Web() {
  return (
    <div className="bg-diarpu">
      <h1 className="px-2 py-4 text-4xl md:text-5xl">zrch</h1>

      <Zrch 
        // searchValue='hello?' 
        open={true}
        searchable={data.slice(0, 100)}  
        // maxResults={1}
        // keys={['name', 'type']}
      >


        <div className="p-10">

          {/* <Comp />
          <Comp2 />
          <Comp3 /> */}
        </div>
        </Zrch>
      <Item />
    </div>
  )
}
