import AppLayout from './Components/Layout/AppLayout'
import Dashboard from './Pages/Dashboard'
import Vehicles from './Pages/Vehicles'
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
      </Routes>
    </HashRouter>
  )
}

export default App
