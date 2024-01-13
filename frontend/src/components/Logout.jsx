import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

export default function Logout() {

    const Navigate = useNavigate()
    useEffect(() => {
        localStorage.setItem("shopping-cart", JSON.stringify([]))
        sessionStorage.setItem("token", "")
        sessionStorage.setItem("_token", "")
        sessionStorage.setItem("username", "")
        sessionStorage.setItem("isAuth", false)

        Navigate("/login")
    }, [])
  return <></>
}
