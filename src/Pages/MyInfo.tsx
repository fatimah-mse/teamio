import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClose, faKey, faSignOut } from "@fortawesome/free-solid-svg-icons"
import Swal from "sweetalert2"
import axios from "axios"
import { useEffect, useState } from "react"
import img from '../assets/imgs/bg.webp'
import Loader from "../components/Loader"
import ActivityPieChart from "../components/ActivityLogs"
import { faEdit, faEnvelope, faTrashAlt, faUserCircle } from "@fortawesome/free-regular-svg-icons"
import { useNavigate } from "react-router-dom"
import Handel from '../components/Handel'

export default function MyInfo() {

    const [user, setUser] = useState<{ name: string, email: string } | null>(null)
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [top, setTop] = useState(false)
    const role = localStorage.getItem('role')
    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
        fetchUser()
        fetchAllUser()
    }, [])

    const fetchUser = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            if (token) {
                const response = await axios.get('https://task-manager-apis-t2dp.onrender.com/api/users/me', {
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

    const fetchAllUser = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            if (token) {
                const response = await axios.get('https://task-manager-apis-t2dp.onrender.com/api/users', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { t: Date.now() }
                })
                setUsers(response.data.data)
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

    const handleEdit = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Edit Profile',
            html:
                `<input id="swal-name" class="swal2-input w-full m-0 mb-6" placeholder="Name" value="${user?.name || ''}" />` +
                `<input id="swal-email" class="swal2-input w-full m-0 mb-6" placeholder="Email" value="${user?.email || ''}" />` +
                `<input id="swal-oldPass" type="password" class="swal2-input w-full m-0 mb-6" placeholder="Current Password" />` +
                `<input id="swal-newPass" type="password" class="swal2-input w-full m-0 mb-6" placeholder="New Password (optional)" />`,
            focusConfirm: false,
            confirmButtonText: 'Update',
            confirmButtonColor: '#3754DB',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            cancelButtonColor: '#FBBE37',
            preConfirm: () => {
                const nameVal = (document.getElementById('swal-name') as HTMLInputElement).value.trim()
                const emailVal = (document.getElementById('swal-email') as HTMLInputElement).value.trim()
                const oldPassVal = (document.getElementById('swal-oldPass') as HTMLInputElement).value
                const newPassVal = (document.getElementById('swal-newPass') as HTMLInputElement).value

                const isNameChanged = nameVal && nameVal !== user?.name
                const isEmailChanged = emailVal && emailVal !== user?.email
                const isPassChanged = newPassVal

                const wantsToUpdate = isNameChanged || isEmailChanged || isPassChanged

                if (wantsToUpdate && !oldPassVal) {
                    Swal.showValidationMessage('You must provide your current password to update your profile')
                    return false
                }

                const dataToSend: any = {}
                if (isNameChanged) dataToSend.name = nameVal
                if (isEmailChanged) dataToSend.email = emailVal
                if (isPassChanged) dataToSend.password = newPassVal
                if (wantsToUpdate) dataToSend.oldPassword = oldPassVal

                return dataToSend
            }

        })

        if (formValues) {
            const token = localStorage.getItem('token')
            try {
                setLoading(true)
                const response = await axios.put(
                    'https://task-manager-apis-t2dp.onrender.com/api/users/me',
                    formValues,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                Swal.fire({
                    title: 'Updated',
                    text: response.data.message,
                    icon: 'success',
                    confirmButtonColor: '#3754DB',
                })
                fetchUser()
            } catch (err: any) {
                Swal.fire({
                    title: 'Error',
                    text: err.response?.data?.message,
                    icon: 'error',
                    confirmButtonColor: '#3754DB',
                })
            } finally {
                setLoading(false)
            }
        }
    }

    const handleLogout = async () => {
        const token = localStorage.getItem('token')
        const confirmResult = await Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to log out from your account.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, log me out!',
            confirmButtonColor: '#3754DB',
            cancelButtonText: 'Cancel',
            cancelButtonColor: '#FBBE37'
        })

        if (confirmResult.isConfirmed) {
            try {
                setLoading(true)
                const response = await axios.post("https://task-manager-apis-t2dp.onrender.com/api/auth/logout",
                    {}, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                const successMessage = response.data?.message

                await Swal.fire({
                    title: 'Success!',
                    text: successMessage,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3754DB',
                    cancelButtonColor: '#FBBE37'
                })

                localStorage.removeItem("role")
                localStorage.removeItem("token")
                localStorage.removeItem("userId")
                localStorage.removeItem("username")
                localStorage.removeItem("active")
                localStorage.removeItem("hide")

                navigate("/")
            } catch (err: any) {
                const errorMessage = err.response?.data?.message

                Swal.fire({
                    title: 'Error!',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                    confirmButtonColor: '#3754DB',
                    cancelButtonColor: '#FBBE37'
                })
            }
            finally {
                setLoading(false)
            }
        }
    }

    const handelDeleteUser = async (id : string) => {
        const token = localStorage.getItem('token')
        const confirmResult = await Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this Team Member.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            confirmButtonColor: '#3754DB',
            cancelButtonText: 'Cancel',
            cancelButtonColor: '#FBBE37'
        })

        if (confirmResult.isConfirmed) {
            try {
                setLoading(true)
                const response = await axios.delete(`https://task-manager-apis-t2dp.onrender.com/api/users/user/${id}`,
                    {
                    headers: { Authorization: `Bearer ${token}` }
                })

                const successMessage = response.data?.message

                await Swal.fire({
                    title: 'Success!',
                    text: successMessage,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3754DB',
                    cancelButtonColor: '#FBBE37'
                })
                navigate("/dashboard")

            } catch (err: any) {
                const errorMessage = err.response?.data?.message

                Swal.fire({
                    title: 'Error!',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                    confirmButtonColor: '#3754DB',
                    cancelButtonColor: '#FBBE37'
                })
            }
            finally {
                setLoading(false)
            }
        }
    }

    return (
        <>
            {loading && <Loader />}
            <div className={`${top && 'hidden'} relative w-full p-4 h-36 rounded-lg mb-5 flex items-center`}>
                <img className="absolute rounded-lg w-full h-full top-0 left-0" src={img} alt="img" />
                <FontAwesomeIcon onClick={() => { setTop(true) }} icon={faClose} className="cursor-pointer absolute text-mybg top-4 right-4 text-2xl" />
                <span className="text-mybg relative z-10 text-2xl font-winky-rough font-semibold">Motivation to help you work.</span>
            </div>

            <button onClick={handleLogout} className=' block ms-auto px-3 py-2 rounded-md bg-red-200 font-semibold text-gray-700 hover:opacity-80 transition-all duration-500 ease-in-out'>
                <FontAwesomeIcon className='text-red-500 text-xl' icon={faSignOut} />
            </button>

            <h2 className="text-xl text-myPrimary font-bold underline underline-offset-2 my-3">Account Settings :</h2>

            {user && (
                <>
                    <div className="rounded-md px-4 py-8 bg-white shadow-lg mb-10">
                        <div className="p-3 border-2 border-indigo-200 mb-5 rounded-md flex gap-4 items-center max-576:flex-col">
                            <FontAwesomeIcon className="text-4xl text-indigo-300" icon={faUserCircle} />
                            <p >
                                <span className="text-sm text-gray-500 font-semibold max-576:text-center block">Full Name</span>
                                <span className='font-winky-rough text-xl block text-gray-600 font-bold max-576:text-center'>{user.name}</span>
                            </p>
                        </div>
                        <div className="p-3 border-2 border-indigo-200 mb-5 rounded-md flex gap-4 items-center max-576:flex-col">
                            <FontAwesomeIcon className="text-4xl text-indigo-300" icon={faEnvelope} />
                            <p >
                                <span className="text-sm text-gray-500 font-semibold max-576:text-center block">Your Email</span>
                                <span className='font-winky-rough text-xl block text-gray-600 font-bold max-576:text-center'>{user.email}</span>
                            </p>
                        </div>
                        <div className="p-3 border-2 border-indigo-200 mb-5 rounded-md flex gap-4 items-center max-576:flex-col">
                            <FontAwesomeIcon className="text-4xl text-indigo-300" icon={faKey} />
                            <p >
                                <span className="text-sm text-gray-500 font-semibold max-576:text-center block">Your Role is</span>
                                <span className='font-winky-rough text-xl block text-gray-600 font-bold max-576:text-center'>{role === 'admin' ? 'Manager' : 'Team Member'}</span>
                            </p>
                        </div>
                        <button onClick={handleEdit} className='block ms-auto p-3 rounded-md bg-indigo-200 font-semibold text-gray-700 hover:opacity-80 transition-all duration-500 ease-in-out'>
                            <FontAwesomeIcon className='text-indigo-700 text-xl' icon={faEdit} />
                        </button>
                    </div>
                </>
            )}

            {role == 'admin' &&
                (
                    <>
                        <h2 className="text-xl text-myPrimary font-bold underline underline-offset-2 my-3">Team Members :</h2>
                        {users ?
                            <div className="rounded-md px-4 py-8 bg-white shadow-lg mb-10 chat h-56 overflow-y-scroll">
                                {users.map((u, i) => {
                                    return (
                                        <div key={i} className="p-3 border-2 border-indigo-200 mb-5 rounded-md flex justify-between gap-4 items-center max-576:flex-col">
                                            <p>
                                                <span className="text-gray-500 font-semibold max-576:text-center block">Name: {u.name}</span>
                                                <span className="text-gray-500 font-semibold max-576:text-center block">Email: {u.email}</span>
                                            </p>
                                            <button onClick={() => handelDeleteUser(u._id)} className='px-4 py-2 rounded-md bg-red-200 font-semibold text-mybg hover:opacity-80 transition-all duration-500 ease-in-out'>
                                                <FontAwesomeIcon className='text-red-500 text-xl' icon={faTrashAlt} />
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                            :
                            <Handel txt='Team Members' />
                        }
                    </>
                )
            }
            <ActivityPieChart />

        </>
    )
}
