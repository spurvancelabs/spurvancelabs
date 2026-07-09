'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) { router.push('/login'); return }
        const user = await res.json()
        setName(user.name || '')
        setImage(user.image || '')
      } catch {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload failed')
      const { url } = await res.json()
      setImage(url)
      toast.success('Avatar uploaded! Save to confirm')
    } catch {
      toast.error('Failed to upload avatar')
    } finally {
      setUploading(false)
    }
  }

  const save = async () => {
    if (!name.trim()) { toast.error('Name is required'); return }
    if (newPassword && !currentPassword) { toast.error('Current password is required'); return }
    if (newPassword && newPassword !== confirmPassword) { toast.error('Passwords do not match'); return }
    if (newPassword && newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return }

    setSaving(true)
    try {
      const body: any = { name: name.trim(), image }
      if (newPassword) { body.currentPassword = currentPassword; body.password = newPassword }

      const res = await fetch('/api/lms/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save')
      }
      toast.success('Settings saved!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      toast.error(err.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
      <p className="text-gray-400 text-sm mb-8">Manage your account settings</p>

      <div className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] divide-y divide-white/[0.06]">
        {/* Avatar */}
        <div className="p-6">
          <label className="block text-sm text-gray-400 mb-3">Avatar</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-white/[0.06]">
              {image ? (
                <img src={image} alt="" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-gray-300 text-sm rounded-xl transition-all border border-white/[0.06]"
            >
              {uploading ? 'Uploading...' : 'Upload Avatar'}
            </button>
          </div>
        </div>

        {/* Display Name */}
        <div className="p-6">
          <label className="block text-sm text-gray-400 mb-2">Display Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            className="w-full bg-zinc-800 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        {/* Change Password */}
        <div className="p-6 space-y-4">
          <label className="block text-sm text-gray-400">Change Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            placeholder="Current password"
            className="w-full bg-zinc-800 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
          />
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="New password"
            className="w-full bg-zinc-800 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full bg-zinc-800 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        {/* Save */}
        <div className="p-6 flex items-center gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-xl text-sm transition-all"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
