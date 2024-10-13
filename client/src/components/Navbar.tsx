import { Link } from "react-router-dom"
import { Button } from "./ui/button"

export const Navbar = () => {
  return (
    <div className="bg-black text-white p-4 rounded-lg flex justify-between">
      <Link to={"/"}>
        <div className="flex gap-x-2 items-center">
          <img
            className="backdrop-invert w-10"
            src="/terminal.png"
            alt="logo" />
          <p className="font-bold">Code Runner</p>
        </div>
      </Link>
      <div>
        <Link to={"/all-submissions"}>
          <Button
            className="text-white"
            variant={"link"}
            size={"lg"}
          >All Submissiosn</Button>
        </Link>
      </div>
    </div >
  )
}