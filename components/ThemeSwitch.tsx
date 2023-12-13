"use client";
import { useTheme } from 'next-themes'
import { Button } from './ui/button';
import { SunIcon, MoonIcon } from 'lucide-react';

export const ThemeSwitch = () => {
    const {theme, setTheme} = useTheme()
    return (
        <Button size='icon' variant='ghost'  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <SunIcon /> : <MoonIcon />}</Button>
    )
}