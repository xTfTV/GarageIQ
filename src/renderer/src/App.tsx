import AppLayout from './Components/Layout/AppLayout'
import Dashboard from './Pages/Dashboard'
import Maintenance from './Pages/Maintenance'
import Vehicles from './Pages/Vehicles'
import Reminder from './Pages/Reminders'
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
      </Routes>
    </HashRouter>
  )
}

export default App
