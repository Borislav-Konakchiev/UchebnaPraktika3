import { Link, NavLink, useNavigate, type NavLinkProps } from 'react-router'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '../ui/navigation-menu'
import { useAuth } from '../auth/auth-provider'
import { Button } from '../ui/button'
import { cn } from '~/lib/utils'
import { forwardRef, type ComponentRef } from 'react'
 
export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
 
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
 
  return (
    <header className='border-b bg-background'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        <div className='flex items-center gap-6'>
          <Link to='/' className='text-xl font-bold tracking-tight'>
            React App
          </Link>
          {user && (
            <NavigationMenu>
              <NavigationMenuList>
                {user.role === 'ADMIN' && (
                  <>
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <NavLinkAdapter to='/users'>Потребители</NavLinkAdapter>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <NavLinkAdapter to='/passports'>
                          Паспорти
                        </NavLinkAdapter>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>
 
        <div className='flex items-center gap-4'>
          {user && (
            <>
              <span className='text-sm text-muted-foreground'>
                Добре дошли, {user.fullName}!
              </span>
              <Button onClick={handleLogout} variant='outline' size='sm'>
                Изход
              </Button>
            </>
          )}
 
          {!user && (
            <Button asChild size='sm'>
              <Link to='/login'>Вход</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
 
const NavLinkAdapter = forwardRef<ComponentRef<typeof NavLink>, NavLinkProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <NavLink
        ref={ref}
        className={({ isActive, isPending }) =>
          cn(
            navigationMenuTriggerStyle(),
            'transition-all',
            isPending && 'cursor-wait opacity-60',
            isActive && !isPending && 'bg-accent text-accent-foreground',
            className
          )
        }
        {...props}
      >
        {children}
      </NavLink>
    )
  }
)