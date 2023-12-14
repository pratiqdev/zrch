"use client"
import { useTheme } from 'next-themes';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import dark from 'react-syntax-highlighter/dist/esm/styles/prism/coldark-dark';
import light from 'react-syntax-highlighter/dist/esm/styles/prism/material-light';
import { useIsSSR } from '@react-aria/ssr';

export const CodeBlock = ({ code }:{ code:string }) => {
    const {theme} = useTheme()
    const isSsr = useIsSSR()
    return (
        <SyntaxHighlighter wrapLines language="jsx" style={isSsr || theme === 'dark' ? dark : light} className="rounded-2xl shadow-2xl dark:border dark:border-gray-800 codeblock !w-full !bg-white/20 dark:!bg-black/30">
            {code.trim()}
        </SyntaxHighlighter>
    );
};

export default CodeBlock