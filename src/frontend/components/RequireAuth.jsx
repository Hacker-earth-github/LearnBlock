import React from 'react';
import { Navigate } from 'react-router-dom';
import authStore from '../stores/authStore';

export default function RequireAuth({ element }) {
  const s = authStore();

  if (!s.loggedIn) return <Navigate to="/login" />;

  return <>{element}</>;
}
