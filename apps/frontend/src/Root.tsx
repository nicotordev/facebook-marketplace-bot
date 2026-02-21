import { Link, Outlet } from 'react-router-dom'
import { TooltipProvider } from './components/ui/tooltip'
import { Toaster } from './components/ui/sonner'

export function Root() {
  return (
    <TooltipProvider>
      <Toaster />
      <nav>
        <Link to="/">Inicio</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </TooltipProvider>
  )
}
