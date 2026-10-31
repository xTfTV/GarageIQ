import AppLayout from './Components/Layout/AppLayout'
import Dashboard from './Pages/Dashboard'
import Maintenance from './Pages/Maintenance'
import Vehicles from './Pages/Vehicles'
import Reminder from './Pages/Reminders'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Reports from './Pages/Reports'

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

        <Route
          element={
            <AppLayout>
              <Vehicles />
            </AppLayout>
          }
          path="/Vehicles"
        ></Route>

        <Route
          element={
            <AppLayout>
              <Maintenance />
            </AppLayout>
          }
          path="/Maintenance"
        ></Route>

        <Route
          element={
            <AppLayout>
              <Reminder />
            </AppLayout>
          }
          path="/Reminder"
        ></Route>

        <Route
          element={
            <AppLayout>
              <Reports />
            </AppLayout>
          }
          path="/Reports"
        ></Route>
      </Routes>
    </HashRouter>
  )
}

export default App
