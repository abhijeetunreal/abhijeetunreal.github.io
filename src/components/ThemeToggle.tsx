
import * as React from "react"
import { Moon, Sun } from "lucide-react"

import { Switch } from "@/components/ui/switch"

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  })

  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const handleCheckedChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  }

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-5 w-5" />
      <Switch
        id="theme-toggle"
        checked={theme === 'dark'}
        onCheckedChange={handleCheckedChange}
      />
      <Moon className="h-5 w-5" />
    </div>
  )
}

