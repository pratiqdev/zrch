"use client";
import { useTheme } from 'next-themes'
import { Button } from './ui/button';
import { SunIcon, MoonIcon } from 'lucide-react';
import { useIsSSR } from '@react-aria/ssr';
export const ThemeSwitch = () => {
    const {theme, setTheme} = useTheme()
    const isSsr = useIsSSR()
    return (
        <Button size='icon' variant='ghost'  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{isSsr || theme === 'dark' ? <SunIcon /> : <MoonIcon />}</Button>
    )
}