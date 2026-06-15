'use client'

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import "../global.css"

const LoginSignupSwitcher = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(pathname === '/login' ? 'login' : 'signup')
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [startX, setStartX] = useState(0)
const [isTransitioning, setIsTransitioning] = useState(false);



  
  useEffect(() => {
    setActiveTab(pathname === '/login' ? 'login' : 'signup')
  }, [pathname])

const handleTabChange = (tab) => {
  if (tab === activeTab || isTransitioning) return;

  setActiveTab(tab);
  setIsTransitioning(true);

  setTimeout(() => {
    router.push(tab === "login" ? "/login" : "/signup");
  }, 350);
};

  // Mouse/Touch drag handlers
  const handleDragStart = (e) => {
    setIsDragging(true)
    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX
    setStartX(clientX)
    setDragOffset(0)
  }

  const handleDragMove = (e) => {
    if (!isDragging) return
    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX
    let diff = clientX - startX
    
    // Limit the drag distance
    const maxDrag = 60
    diff = Math.max(-maxDrag, Math.min(maxDrag, diff))
    setDragOffset(diff)
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    
    setIsDragging(false)
    
    // Determine if swipe was significant enough (more than 30px)
    if (Math.abs(dragOffset) > 30) {
      if (dragOffset > 0 && activeTab === 'signup') {
        handleTabChange('login')
      } else if (dragOffset < 0 && activeTab === 'login') {
        handleTabChange('signup')
      }
    }
    
    setDragOffset(0)
  }

  // Clean up event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove)
      window.addEventListener('mouseup', handleDragEnd)
      window.addEventListener('touchmove', handleDragMove)
      window.addEventListener('touchend', handleDragEnd)
      
      return () => {
        window.removeEventListener('mousemove', handleDragMove)
        window.removeEventListener('mouseup', handleDragEnd)
        window.removeEventListener('touchmove', handleDragMove)
        window.removeEventListener('touchend', handleDragEnd)
      }
    }
  }, [isDragging, dragOffset])

  // Calculate transform values based on drag direction
  const getSliderTransform = () => {
    if (!isDragging || dragOffset === 0) return 'none'
    
    // Move slider in drag direction, but limited
    if (activeTab === 'signup') {
      // Can only move right (towards login)
      return dragOffset > 0 ? `translateX(${Math.min(dragOffset, 60)}px)` : 'none'
    } else {
      // Can only move left (towards signup)
      return dragOffset < 0 ? `translateX(${Math.max(dragOffset, -60)}px)` : 'none'
    }
  }

  const getTextTransform = (buttonType) => {
    if (!isDragging || dragOffset === 0) return 'none'
    
    if (buttonType === 'signup' && activeTab === 'signup' && dragOffset > 0) {
      // Signup button moving right
      return `translateX(${Math.min(dragOffset, 60)}px)`
    } else if (buttonType === 'login' && activeTab === 'login' && dragOffset < 0) {
      // Login button moving left
      return `translateX(${Math.max(dragOffset, -60)}px)`
    }
    return 'none'
  }

  return (
    <div className="flex w-full items-center justify-between px-6 py-5 md:px-8">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Image 
            src="/spurvance-logo.png" 
            alt="Spurvancelab" 
            width={40}
            height={40}
            className="h-8 w-8 object-contain md:h-10 md:w-10"
            priority
          />
        </Link>
      </div>
      
      <div 
        className="relative flex cursor-grab items-center gap-1 rounded-full bg-[#3b3b3b] px-1 py-1 active:cursor-grabbing"
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        {/* Animated background slider */}
        <div 
          className="absolute rounded-full bg-black"
          style={{
            width: 'calc(50% - 2px)',
            height: 'calc(100% - 4px)',
            top: '2px',
            left: activeTab === 'signup' ? '2px' : 'calc(50% + 2px)',
            transform: getSliderTransform(),
            transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
        
        <button
          onClick={() => handleTabChange('signup')}
          className={`cursor-pointer relative z-10 rounded-full px-3 py-1.5 border  text-xs font-medium transition-colors duration-200 md:px-4 md:text-sm ${
            activeTab === 'signup'
              ? 'text-white border border-white/10' 
              : 'text-[#5a5a5a] hover:text-white border border-[#5a5a5a]/10'
          }`}
          style={{
            transform: getTextTransform('signup'),
            transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          Sign up
        </button>
        <button
          onClick={() => handleTabChange('login')}
          className={` cursor-pointer relative z-10 rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200 md:px-4 md:text-sm ${
            activeTab === 'login'
              ? 'text-white   border border-white/10' 
              : 'text-[#5a5a5a] hover:text-white border border-[#5a5a5a]/10'
          }`}
          style={{
            transform: getTextTransform('login'),
            transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          Sign in
        </button>
      </div>
    </div>
  )
}

export default LoginSignupSwitcher
