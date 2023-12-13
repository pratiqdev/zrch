import Image from "next/image";
import AppSearch from "@/components/AppSearch";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { CopyIcon, GithubIcon } from "lucide-react";

export default function Home() {
  return (
    <main
      className="flex min-h-screen flex-col items-center max-w-[700px] mx-auto"
      suppressHydrationWarning
    >

      <div className="absolute top-4 right-4">
       <ThemeSwitch />
      </div>
      
      <section className="min-h-screen w-full flex flex-col items-center justify-center">
        <div className="flex items-center justify-between w-full px-4 pb-16">
          <div>
            <h1 className="text-5xl font-bold tracking-wide">srch</h1>
            <p className="text-xl text-gray-500 dark:text-gray-300 tracking-wide">
              Drop-in, feature-rich, search for React
            </p>
         
          </div>
          <div className="flex flex-col items-end gap-2 font-regular">
            <Button
              variant="secondary"
              className="w-full flex items-center gap-2 px-2"
            >
              npm install srch
              <div className="rounded-full bg-gray-200 text-gray-900 h-6 w-6 flex items-center justify-center text-center overflow-hidden p-1">
                <CopyIcon />
              </div>
            </Button>

            <Button
              variant="ghost"
              className="w-full flex items-center gap-2 px-2"
            >
              <div className="rounded-full bg-gray-900 text-gray-100 h-6 w-6 flex items-center justify-center text-center overflow-hidden p-1">
                <GithubIcon />
              </div>
              pratiqdev/srch
            </Button>
          </div>
        </div>

        <AppSearch />

        {/* <p className="text-xl text-gray-500 dark:text-gray-300 tracking-wide">
              More bells and whistles than a Whovillian
        </p> */}
      </section>

     

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
  );
}
