import { useAuth } from '@/hooks/useAuth'
import { Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { logoutUser } from '@/utils/logoutUser'

export function ProfilePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="space-y-2">
        <p><span className="font-medium">Email:</span> {user.email}</p>
        {user.displayName && <p><span className="font-medium">Name:</span> {user.displayName}</p>}
        {user.phoneNumber && <p><span className="font-medium">Phone:</span> {user.phoneNumber}</p>}
        {user.photoURL && (
          <img src={user.photoURL} alt="Avatar" className="w-24 h-24 rounded-full" />
        )}
      </div>

      <Button className="mt-6" onClick={logoutUser}>Log out</Button>
    </div>
  )
}
