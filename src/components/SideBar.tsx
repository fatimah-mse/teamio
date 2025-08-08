import { faBars, faClose, faUserCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"


export default function SideBar() {

    const [showSideBar, setshowSideBar] = useState(false)
    const [isActive, setisActive] = useState(localStorage.getItem('active') || '/')

    function handleActive(a: string) {
        setisActive(a)
        localStorage.setItem('active', a)
        setshowSideBar(false)
    }

    useEffect(() => {
        const stored = localStorage.getItem('active')
        if (stored) {
            setisActive(stored)
        }
    }, [])

    return (
        <>
            {showSideBar && (
                <div
                    className="fixed inset-0 bg-myPrimary/30 backdrop-blur-sm z-10 md:hidden"
                />
            )}
            <section className={`w-1/4 h-screen z-40 flex flex-col justify-between items-center bg-myPrimary fixed top-0 left-0 p-6 max-768:px-4 max-768:py-10 max-768:w-4/5 ${showSideBar ? 'max-768:translate-x-0' : 'max-768:-translate-x-[88%]'} transition-all duration-700 ease-in-out`}>
                <FontAwesomeIcon onClick={() => setshowSideBar(!showSideBar)} className="p-2 rounded-full bg-mybg text-myPrimary text-3xl absolute -right-4 cursor-pointer md:hidden" icon={showSideBar ? faClose : faBars} />
                <div className="flex flex-col gap-5">
                    <h1 className='font-winky-rough mb-10 text-mybg font-extrabold text-4xl uppercase'>Teamio</h1>
                    <Link className={
                        `py-2.5 2xl:py-3.5 px-5 font-semibold text-center text-mybg md:text-lg 
                    ${isActive === '/' ? '!text-myPrimary bg-mybg rounded-lg' : ''} 
                    transition-all duration-500 ease-in-out`}
                        to={'/dashboard'}
                        onClick={() =>
                            handleActive("/")
                        }
                    >
                        Projects
                    </Link>
                    <Link className={
                        `py-2.5 2xl:py-3.5 px-5 font-semibold text-center text-mybg md:text-lg
                    ${isActive === '/tasks' ? '!text-myPrimary bg-mybg rounded-lg' : ''} 
                    transition-all duration-500 ease-in-out`}
                        to={'tasks'}
                        onClick={() =>
                            handleActive("/tasks")
                        }
                    >
                        Tasks
                    </Link>
                    <Link className={
                        `py-2.5 2xl:py-3.5 px-5 font-semibold text-center text-mybg md:text-lg
                    ${isActive === '/notes' ? '!text-myPrimary bg-mybg rounded-lg' : ''} 
                    transition-all duration-500 ease-in-out`}
                        to={'notes'}
                        onClick={() =>
                            handleActive("/notes")}
                    >
                        Notes
                    </Link>
                </div>

                <Link to={'me'}
                    onClick={() =>
                        handleActive("/me")
                    }
                    className={`${isActive === '/me' && 'border-b border-mySecondary !text-mySecondary'} text-mybg md:text-lg font-extrabold`}
                >
                    <FontAwesomeIcon className="me-2" icon={faUserCircle} />
                    Your Profile
                </Link>

            </section>
        </>

    )
}
