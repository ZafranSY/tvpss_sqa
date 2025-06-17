import { Inertia } from '@inertiajs/inertia'; // Import Inertia
import { CheckCircle, ChevronDown, Home, LogOut, Users } from 'lucide-react';
import { useState } from 'react';
import { router } from '@inertiajs/react';

const StudentNavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Local state for profileName and icNum
  const [profileName, setProfileName] = useState("John Doe"); // Example dynamic value
  const [icNum, setIcNum] = useState('020404010271'); // Example dynamic value

  const getInitials = (name) => {
    return name.split(" ").map((part) => part[0].toUpperCase()).join("");
  };

  const handleLogout = () => {
    router.post(route('student.logout'), {}, {
      onSuccess: () => {
        window.location.href = '/';  // Ensure redirection to the main page
      },
      onError: (error) => {
        console.error('Logout failed', error);
      },
    });
  };
  
  // Inline NavButton Component
  const NavButton = ({ href, icon, text }) => (
    <a
      href={href}
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
    >
      {icon}
      <span className="ml-2">{text}</span>
    </a>
  );

  return (
    <nav className="bg-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img
              src="/assets/TVPSSLogo3.jpg"
              alt="Logo"
              className="h-12 w-auto"
            />
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:flex sm:space-x-8 items-center">
            <NavButton href="/studentPage" icon={<Home size={18} />} text="Utama" />
            <NavButton href="/applyCrew" icon={<Users size={18} />} text="Permohonan Krew" />
            {/* Dynamically inserting icNum into the URL */}
            <NavButton 
              href={`/resultApply/${icNum}`} 
              icon={<CheckCircle size={18} />} 
              text="Keputusan Permohonan" 
            />
          </div>

          {/* Profile Dropdown */}
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 focus:outline-none p-2 rounded-lg transition-colors duration-200"
              >
                <div className="bg-[#4158A6] text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm">
                  {getInitials(profileName)}
                </div>
                <span className="font-medium">{profileName}</span>
                <ChevronDown
                  size={16}
                  className={`transform transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-in-out transform origin-top-right ${isDropdownOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}
              >
                <button
                  onClick={handleLogout} // Call logout function
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StudentNavBar;
