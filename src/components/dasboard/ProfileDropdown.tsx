'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftStartOnRectangleIcon, Cog6ToothIcon, UserIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
const [user, setUser] = useState({
  name: '',
  email: '',
  image: '',
})

useEffect(() => {
  async function fetchUser() {
    try {
      const response = await fetch('/api/auth/me')

      if (!response.ok) return

      const data = await response.json()

      setUser({
        name: data.name,
        email: data.email,
        image: data.image || '',
      })
    } catch (error) {
      toast.error("Failed to load user data");
    }
  }

  fetchUser()
}, [])
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logout = async () => {
    setIsLoggingOut(true);
    
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      toast.success("Logged out successfully");
      router.push('/login');
    } catch (error) {
      toast.error("Logout failed. Please try again");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Image - Click to toggle dropdown */}
      {user.image ? (
        <Image
          src={user.image}
          alt="Profile"
          width={32}
          height={32}
          className="w-8 h-8 rounded-full border border-white/20 cursor-pointer hover:border-blue-400 transition-colors object-cover"
          onClick={() => setIsOpen(!isOpen)}
        />
      ) : (
        <div
          className="w-8 h-8 rounded-full border border-white/20 cursor-pointer hover:border-blue-400 transition-colors bg-zinc-800 flex items-center justify-center text-sm font-semibold text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {(user.name || user.email || '?')[0].toUpperCase()}
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 backdrop-blur-2xl bg-black/90 border border-white/10 rounded-xl shadow-2xl shadow-black/70 py-1 z-50">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-sm font-medium text-white"> {user.name || 'Loading...'}</p>
            <p className="text-[10px] text-gray-400">{user.email || 'Loading...'}</p>
          </div>
          
          <Link
            href="/lms/profile"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <UserIcon className="w-5 h-5 text-gray-400" />
            Profile
          </Link>
          <Link
            href="/lms/settings"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Cog6ToothIcon className="w-5 h-5 text-gray-400" />
            Settings
          </Link>
          
          <div className="border-t border-white/10 my-1"></div>
          
          <button
            onClick={logout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors"
          >
            <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      )}
    </div>
  );
}