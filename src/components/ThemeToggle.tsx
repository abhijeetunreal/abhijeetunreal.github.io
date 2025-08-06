
import * as React from "react"

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }
      return 'light' // Default to light mode
    }
    return 'light'
  })

  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const handleToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  return (
    <button
      onClick={handleToggle}
      className="w-6 h-6 rounded-full border-2 border-current transition-colors duration-300 hover:opacity-80"
      style={{
        backgroundColor: theme === 'light' ? '#000' : '#fff',
        color: theme === 'light' ? '#000' : '#fff'
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    />
  )
}

