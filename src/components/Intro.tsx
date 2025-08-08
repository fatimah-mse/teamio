import Swal from 'sweetalert2'
import Loader from './Loader'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function Intro() {

    const [user, setUser] = useState<{ name: string, email: string } | null>(null)
    const [loading, setLoading] = useState(false)
    const [hide, setHide] = useState<boolean>(() => {
        const stored = localStorage.getItem('hide')
        return stored === 'true'
    })

    function handleHide(a: boolean) {
        setHide(a)
        localStorage.setItem('hide', a.toString())
    }

    useEffect(() => {
        const stored = localStorage.getItem('hide')
        if (stored !== null) {
            setHide(stored === 'true')
        }
    }, [hide])

    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUser = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            if (token) {
                const response = await axios.get('http://localhost:4000/api/users/me', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { t: Date.now() }
                })
                setUser(response.data.data)
            }
        } catch (err: any) {
            Swal.fire({
                title: "Error!",
                text: err.response?.data?.message,
                icon: "error",
                confirmButtonText: 'Try Again',
                confirmButtonColor: '#3754DB'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>  {loading && <Loader />}
            <section className={`${hide && '!bg-transparent -translate-y-full transition-all duration-700 ease-in-out'} p-5 w-full h-screen fixed z-50 flex justify-center items-center bg-myPrimary/40 backdrop-blur-sm`}>
                {user && (
                    <div className={`relative w-max px-8 py-14 rounded-lg flex flex-col justify-center items-center gap-5 bg-myPrimary`}>
                        <p className="flex flex-col gap-5 text-center">
                            <span className="text-gray-50 font-winky-rough text-5xl max-768:text-2xl uppercase font-semibold">
                                👋 HI {user.name} !!
                            </span>
                            <span className="md:text-xl font-winky-rough font-semibold text-gray-50">
                                Wecome to Teamio Task Management
                            </span>
                        </p>
                        <p className='text-gray-50 text-center md:text-xl font-semibold font-winky-rough'>A new journey begins — let’s achieve amazing things together! 🚀</p>
                        <button onClick={() => handleHide(true)} className='px-6 py-2 mt-5 rounded-md bg-mySecondary text-gray-700 font-semibold font-winky-rough hover:opacity-75 transition-all duration-500 ease-in-out'>Get Started</button>
                    </div>
                )}
            </section>
        </>
    )
}
