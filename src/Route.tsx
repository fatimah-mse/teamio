import 'aos/dist/aos.css'
import AOS from 'aos'
import { Outlet } from 'react-router-dom'
import './App.css'
import { useEffect, useState } from 'react'
import PreLoader from './components/PreLoader'

function Route() {

  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])

  useEffect(() => {

    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: false,
      mirror: false
    })

    const timer = setTimeout(() => {
      setShowLoader(false)
    }, 3000)

    return () => clearTimeout(timer)

  }, [])

  return (
    <>
      {showLoader ? <PreLoader /> : null}
      {!showLoader && (
        <Outlet />
      )}
    </>
  )
}

export default Route
