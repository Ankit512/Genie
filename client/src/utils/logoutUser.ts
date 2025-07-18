import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'

export const logoutUser = async () => {
  try {
    await signOut(auth)
    // Redirect to the correct base path for GitHub Pages
    const basePath = import.meta.env.PROD ? '/Genie/' : '/'
    window.location.href = basePath
  } catch (error) {
    console.error('Failed to log out:', error)
  }
}
