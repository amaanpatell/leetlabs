import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useLocation } from "react-router-dom"
import { ModeToggle } from "@/components/mode-toggle"

// Route to title mapping
const routeTitleMap = {
  '/': 'Problems',
  '/dashboard': 'Dashboard',
  '/explore': 'Explore',
  '/interview': 'Interview',
  '/analytics': 'Analytics',
  '/add-problem': 'Create Problem',
}

export function SiteHeader() {
  const location = useLocation()
  
  // Get page title based on current route
  const pageTitle = routeTitleMap[location.pathname] || 'Problems'

  return (
    <header
      className=" sticky top-0 z-50 group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b rounded-t-xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">{pageTitle}</h1>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}