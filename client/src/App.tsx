import { Home } from "./components/Home"
import { Navbar } from "./components/Navbar"

function App() {

  return (
    <div className="w-[80%] mx-auto">
      <div>
        <Navbar />
      </div>
      <Home />
    </div>
  )
}

export default App
