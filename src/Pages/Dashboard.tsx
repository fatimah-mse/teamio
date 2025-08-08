import { Outlet } from "react-router-dom"
import SideBar from "../components/SideBar"
import Intro from "../components/Intro"
import Chat from "../components/Chat"
import { useEffect } from "react"
import Notification from "../components/Notification"

export default function Dashboard() {

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, [])

    return (
        <>
            <Intro />
            <Notification />
            <SideBar />
            <section className="w-3/4 bg-mybg min-h-screen ms-auto py-6 px-4 md:px-8 max-768:w-full max-768:ps-[calc(10%+16px)] max-768:py-8 ">
                <Outlet />
                <Chat />
            </section>
        </>
    )
}
