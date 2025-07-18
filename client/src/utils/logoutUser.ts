import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'

export const logoutUser = async () => {
  try {
    await signOut(auth)
    // Force reload to clear all state and redirect to home
    // This will respect the Router basename automatically
    window.location.href = window.location.origin + (import.meta.env.PROD ? '/Genie/' : '/')
  } catch (error) {
    console.error('Failed to log out:', error)
  }
}
