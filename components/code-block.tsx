"use client"
import { useTheme } from 'next-themes';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import dark from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus';
import light from 'react-syntax-highlighter/dist/esm/styles/prism/material-light';

export const CodeBlock = ({ code }:{ code:string }) => {
    const {theme} = useTheme()
    return (
            <SyntaxHighlighter wrapLines language="jsx" style={theme === 'dark' ? dark : light} className="rounded-xl shadow-2xl dark:border dark:border-gray-600 codeblock">
                {code.trim()}
            </SyntaxHighlighter>
    );
};