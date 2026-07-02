'use client'

import React, { useState, useEffect, useCallback } from 'react'
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

  const handleTabChange = (tab: 'login' | 'signup') => {
    if (tab === activeTab || isTransitioning) return;

    setActiveTab(tab);
    setIsTransitioning(true);

    setTimeout(() => {
      router.push(tab === "login" ? "/login" : "/signup");
    }, 350);
  };

  // Mouse/Touch drag handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    const clientX = e.type === 'mousedown' ? (e as React.MouseEvent).clientX : (e as React.TouchEvent).touches[0].clientX
    setStartX(clientX)
    setDragOffset(0)
  }

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return
    const clientX = e.type === 'mousemove' ? (e as MouseEvent).clientX : (e as TouchEvent).touches[0].clientX
    let diff = clientX - startX
    
    // Limit the drag distance
    const maxDrag = 60
    diff = Math.max(-maxDrag, Math.min(maxDrag, diff))
    setDragOffset(diff)
  }, [isDragging, startX])

  const handleDragEnd = useCallback(() => {
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
  }, [isDragging, dragOffset, activeTab]) // eslint-disable-line react-hooks/exhaustive-deps

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
  }, [isDragging, handleDragMove, handleDragEnd])

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

  const getTextTransform = (buttonType: 'login' | 'signup') => {
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
    <div className="switcher-compact flex w-full items-center justify-between px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
      {/* Logo Section - Responsive */}
      <div className="switcher-gap flex items-center gap-2 sm:gap-2.5 md:gap-3">
        <Link href="/" className="flex-shrink-0">
          <Image 
            src="/spurvance-logo.png" 
            alt="Spurvancelab" 
            width={32}
            height={32}
            className="switcher-logo h-6 w-6 object-contain sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-10 lg:w-10"
            priority
          />
        </Link>
        <span className='switcher-brand text-sm font-semibold sm:text-base md:text-[18px] lg:text-xl xl:text-2xl whitespace-nowrap'>
          Spurvancelab
        </span>
      </div>
      
      {/* Toggle Switcher - Responsive */}
      <div 
        className="relative flex cursor-grab items-center gap-0.5 sm:gap-1 rounded-full bg-[#3b3b3b] px-1 py-1 active:cursor-grabbing"
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
          className={`switcher-btn cursor-pointer relative z-10 rounded-full px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 lg:px-4 border text-[10px] sm:text-xs md:text-xs lg:text-sm font-medium transition-colors duration-200 ${
            activeTab === 'signup'
              ? 'text-white border border-white/10' 
              : 'text-[#5a5a5a] hover:text-white border border-[#5a5a5a]/10'
          }`}
          style={{
            transform: getTextTransform('signup'),
            transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <span className="hidden xs:inline">Sign up</span>
          <span className="xs:hidden">Sign up</span>
        </button>
        
        <button
          onClick={() => handleTabChange('login')}
          className={`switcher-btn cursor-pointer relative z-10 rounded-full px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 lg:px-4 border text-[10px] sm:text-xs md:text-xs lg:text-sm font-medium transition-colors duration-200 ${
            activeTab === 'login'
              ? 'text-white border border-white/10' 
              : 'text-[#5a5a5a] hover:text-white border border-[#5a5a5a]/10'
          }`}
          style={{
            transform: getTextTransform('login'),
            transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <span className="hidden xs:inline">Sign in</span>
          <span className="xs:hidden">Sign in</span>
        </button>
      </div>
    </div>
  )
}

export default LoginSignupSwitcher