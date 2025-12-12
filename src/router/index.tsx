import { createBrowserRouter, Navigate } from 'react-router-dom'
import LoginView from '../views/LoginView'
import RegisterView from '../views/RegisterView'
import HomeView from '../views/HomeView'
import GameView from '../views/GameView'
import ProfileView from '../views/ProfileView'
import LeaderboardView from '../views/LeaderboardView'
import { ProtectedRoute } from './ProtectedRoute'
import { GuestRoute } from './GuestRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/home" replace />
  },
  {
    path: '/login',
    element: (
      <GuestRoute>
        <LoginView />
      </GuestRoute>
    )
  },
  {
    path: '/register',
    element: (
      <GuestRoute>
        <RegisterView />
      </GuestRoute>
    )
  },
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <HomeView />
      </ProtectedRoute>
    )
  },
  {
    path: '/game/:mode',
    element: (
      <ProtectedRoute>
        <GameView />
      </ProtectedRoute>
    )
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfileView />
      </ProtectedRoute>
    )
  },
  {
    path: '/leaderboard',
    element: (
      <ProtectedRoute>
        <LeaderboardView />
      </ProtectedRoute>
    )
  }
])

