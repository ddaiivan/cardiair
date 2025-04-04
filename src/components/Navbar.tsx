import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, UserPlus, LogOut, User, Wrench, ArrowUpCircle } from 'lucide-react'; // Wrench might be unused now
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
// Removed UpgradePlanDialog import

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  // Removed isUpgradeDialogOpen state
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth(); // Removed level
  const navigate = useNavigate();
  const { toast } = useToast();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Screening', path: '/screening' },
    { name: 'Monitoring', path: '/monitoring' },
    { name: 'Education', path: '/education' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    setIsOpen(false); // Close mobile menu on location change
  }, [location]);

  const handleLogout = () => {
    logout();
  };

  // Removed handleUpgradeClick function

  return (
    // Removed Fragment wrapper as Dialog is gone
    <header className="fixed top-0 left-0 right-0 z-50 bg-cardiair-white shadow-md py-3">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="font-heading font-semibold text-lg text-cardiair-red">
            CardiAIR
          </Link>

          {/* Desktop Navigation - Added justify-between and flex-grow */}
          <nav className="hidden md:flex items-center justify-between flex-grow ml-6"> {/* Added justify-between, flex-grow, and some margin */}
            {/* Main navLinks group */}
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`transition-colors duration-300 hover:text-cardiair-red ${
                    location.pathname === link.path
                      ? 'text-cardiair-red font-medium'
                      : 'text-cardiair-gray-medium'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Auth section group - Removed ml-8 as justify-between handles spacing */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* Removed direct Tools link */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 text-cardiair-gray-medium hover:text-cardiair-red">
                        <User className="h-5 w-5" />
                        <span>User</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {/* Removed commented out Upgrade Plan item */}
                      <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-cardiair-red focus:text-cardiair-red focus:bg-red-50">
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                /* Login button */
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 border-cardiair-red text-cardiair-red hover:bg-cardiair-red hover:text-cardiair-white">
                      <LogIn className="h-5 w-5" />
                      <span>Login</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/signin" className="flex items-center gap-2 cursor-pointer text-cardiair-gray-medium hover:text-cardiair-red">
                        <LogIn className="h-4 w-4" />
                        <span>Sign In</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/signup" className="flex items-center gap-2 cursor-pointer text-cardiair-gray-medium hover:text-cardiair-red">
                        <UserPlus className="h-4 w-4" />
                        <span>Sign Up</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div> {/* End of auth group */}
          </nav> {/* End of nav */}

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
             {/* Removed Tools icon link for mobile */}
            <button
              className="text-cardiair-gray-medium"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="md:hidden bg-cardiair-white px-4 py-4 shadow-md animate-fade-in">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`transition-colors duration-300 block py-2 hover:text-cardiair-red ${
                  location.pathname === link.path
                    ? 'text-cardiair-red font-medium'
                    : 'text-cardiair-gray-medium'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Auth Links (Mobile) */}
            <div className="pt-4 border-t border-cardiair-gray-light">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="text-sm text-cardiair-gray-medium px-2">Signed in as {user?.email || 'User'}</div>
                  {/* Removed commented out Upgrade Plan button */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-left py-2 text-cardiair-red hover:bg-red-50 hover:text-cardiair-red"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                /* Mobile Login/Register */
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-cardiair-gray-medium hover:text-cardiair-red">
                    <span className="flex items-center gap-2">
                      <LogIn className="h-5 w-5" />
                      <span>Login / Register</span>
                    </span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 space-y-2">
                    <Link
                      to="/signin"
                      className="flex items-center gap-2 py-2 text-sm text-cardiair-gray-medium hover:text-cardiair-red"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      to="/signup"
                      className="flex items-center gap-2 py-2 text-sm text-cardiair-gray-medium hover:text-cardiair-red"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Sign Up</span>
                    </Link>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
    // Removed UpgradePlanDialog instance
  );
};

export default Navbar;
