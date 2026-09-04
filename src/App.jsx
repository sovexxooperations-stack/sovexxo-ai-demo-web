import { Navigate, Route, Routes } from 'react-router-dom'
import DemoPage from './pages/DemoPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/demo/prelada" replace />} />
      <Route path="/demo/:demoId" element={<DemoPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
