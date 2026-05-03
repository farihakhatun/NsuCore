import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../modules/auth/LoginPage';
import { EditorPage } from '../modules/profile/EditorPage';
import { PublicProfilePage } from '../modules/profile/PublicProfilePage';
import { WorkspacePage } from '../modules/vibe-builder/pages/WorkspacePage';
import { BuilderPage } from '../modules/vibe-builder/pages/BuilderPage';
import { LiveSitePage } from '../modules/vibe-builder/pages/LiveSitePage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('access_token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile/:userId" element={<PublicProfilePage />} />
      <Route path="/site/:siteSlug" element={<LiveSitePage />} />
      <Route path="/site/:siteSlug/:pageSlug" element={<LiveSitePage />} />
      <Route path="/editor" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
      <Route path="/app" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
      <Route path="/app/sites/:siteId/pages/:pageId" element={<ProtectedRoute><BuilderPage /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}