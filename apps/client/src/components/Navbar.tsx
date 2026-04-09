import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Menu as MenuIcon, X as XIcon, LogIn as LogInIcon } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router'
import { useSession, signOut } from '../lib/auth-client'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Campgrounds', href: '/campgrounds' },
  { name: 'New Campground', href: '/campgrounds/new' },
]

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? 'bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium'
    : 'text-gray-300 hover:bg-white/5 hover:text-white rounded-md px-3 py-2 text-sm font-medium'

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? 'bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium'
    : 'text-gray-300 hover:bg-white/5 hover:text-white block rounded-md px-3 py-2 text-base font-medium'

export default function Navbar() {
  const { data: session, isPending } = useSession()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => navigate('/login'),
      },
    })
  }

  return (
    <Disclosure as="nav" className="relative bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <MenuIcon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <Link to="/" className="text-white font-bold text-xl tracking-tight">ReactCamp</Link>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    end
                    className={navLinkClass}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {isPending ? (
              <div className="size-8 rounded-full bg-gray-600 animate-pulse" />
            ) : session ? (
              <Menu as="div" className="relative ml-3">
                <MenuButton className="relative flex items-center gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                  <span className="sr-only">Open user menu</span>
                  <div className="flex size-8 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
                    {session.user.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                </MenuButton>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg outline outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                    {session.user.email}
                  </div>
                  <MenuItem>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      Sign out
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1 text-gray-300 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >
                  <LogInIcon className="size-4" />
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-2 text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end
              className={mobileNavLinkClass}
            >
              {({ isActive }) => (
                <DisclosureButton as="span" aria-current={isActive ? 'page' : undefined}>
                  {item.name}
                </DisclosureButton>
              )}
            </NavLink>
          ))}
          {!isPending && !session && (
            <>
              <NavLink to="/login" end className={mobileNavLinkClass}>
                {({ isActive }) => (
                  <DisclosureButton as="span" aria-current={isActive ? 'page' : undefined}>
                    Sign in
                  </DisclosureButton>
                )}
              </NavLink>
              <NavLink to="/register" end className={mobileNavLinkClass}>
                {({ isActive }) => (
                  <DisclosureButton as="span" aria-current={isActive ? 'page' : undefined}>
                    Register
                  </DisclosureButton>
                )}
              </NavLink>
            </>
          )}
          {!isPending && session && (
            <DisclosureButton
              as="button"
              onClick={handleSignOut}
              className="text-gray-300 hover:bg-white/5 hover:text-white block rounded-md px-3 py-2 text-base font-medium w-full text-left"
            >
              Sign out
            </DisclosureButton>
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}