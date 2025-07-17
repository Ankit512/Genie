import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'

export const logoutUser = async () => {
  try {
    await signOut(auth)
    // Optionally, you can redirect or reload to clear state
    window.location.href = '/'
  } catch (error) {
    console.error('Failed to log out:', error)
  }
}
