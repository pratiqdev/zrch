"use client"
import { SrchProvider, SrchWindow } from '@/components/srch/Srch'
import { FuseResult } from 'fuse.js'
import Image from 'next/image'
import { commentData, albumData,  userData } from '@/components/srch/test-data'


export const ItemRender = ({ result, index }:{ result: FuseResult<any>, index: number}) => {
  const { postId, name, email, body } = result.item

  return (
    <li className="overflow-hidden text-xs p-1 bg-slate-100 rounded">
      <p className="font-medium">{name}</p>
      <p className='truncate font-light'>{body}</p>
    </li>
  )
}

export const ListRender = ({ results, value }:{ results: FuseResult<any>[], value: string}) => (
  <>
    {results.map(res => {
      const { postId, name, email, body } = res.item

      return (
        <li className="overflow-hidden text-xs p-1 bg-slate-100 rounded">
          <p className="font-medium">{name}</p>
          <p className='truncate font-light'>{body}</p>
        </li>
      )
    })}
  </>

)

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center" suppressHydrationWarning>
     

      <div className="relative text-3xl font-bold">
        srch
      </div>



      <SrchProvider 
        searchable={[
          // ...albumData, 
          // ...commentData, 
          ...userData
        ]}  
        // groupBy='email'
        // searchKeys={['name']}
      >
        <SrchWindow 
        //  RenderItem={ItemRender} 
          // RenderList={ListRender}
          noResultsComponent={<p>No Results!!!</p>}
        />
        
      </SrchProvider>





{/* 
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Docs{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Learn{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Templates{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Explore starter templates for Next.js.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Deploy{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div> */}


    </main>
  )
}
