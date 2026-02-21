  import { Outlet } from 'react-router-dom'
import { TooltipProvider } from './components/ui/tooltip'
import { Toaster } from './components/ui/sonner'

export function Root() {
  return (
    <TooltipProvider>
      <Toaster />
      <main>
        <Outlet />
      </main>
    </TooltipProvider>
  )
}
