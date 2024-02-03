"use client"
import { useTheme } from 'next-themes';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import dark from 'react-syntax-highlighter/dist/esm/styles/prism/coldark-dark';
import light from 'react-syntax-highlighter/dist/esm/styles/prism/material-light';
import { useIsSSR } from '@react-aria/ssr';
import { cn } from '@/lib/utils';

export const CodeBlock = ({ code , className = '' }:{ code:string, className?: string }) => {
    const {theme} = useTheme()
    const isSsr = useIsSSR()
    return (
        <SyntaxHighlighter wrapLines language="jsx" style={isSsr || theme === 'dark' ? dark : light} className={cn("rounded-2xl shadow-2xl dark:border dark:border-gray-800 codeblock !w-full !bg-white/70 dark:!bg-black/30", className)}>
            {code.trim()}
        </SyntaxHighlighter>
    );
};

export default CodeBlock