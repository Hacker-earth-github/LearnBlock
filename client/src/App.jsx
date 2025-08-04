import "./config/connection"
import { useState } from 'react'

import { Route, Routes } from 'react-router-dom'
import Content from './pages/Content'
import Admin from './pages/Admin'


function App() {
  return (
    <LearnBlockProvider>

        <Routes>
          <Route path="/" element={<Content />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <Admin />
              </ProtectedAdminRoute>
            }
          />
        </Routes>

    </LearnBlockProvider>
  );
}

export default App;