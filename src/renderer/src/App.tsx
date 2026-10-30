import AppLayout from './Components/Layout/AppLayout'
import Dashboard from './Pages/Dashboard'
import { HashRouter, Route, Routes } from 'react-router-dom'

function App(): React.JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
          path="/"
        />
      </Routes>
    </HashRouter>
  )
}

export default App
