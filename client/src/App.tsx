import { Outlet } from "react-router-dom"
import { Navbar } from "./components/Navbar"

function App() {

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div>
        <Navbar />
      </div>
      <Outlet />
    </div>
  )
}

export default App
