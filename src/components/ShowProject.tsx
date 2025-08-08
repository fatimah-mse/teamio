import { Link, useNavigate, useParams } from 'react-router-dom'
import Loader from './Loader'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import Handel from './Handel'
import control from '../assets/imgs/Control.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faEye, faTrashAlt } from '@fortawesome/free-regular-svg-icons'

export default function ShowProject() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [project, setProject] = useState<any | null>(null)
    const [tasks, setTasks] = useState<any | null>(null)
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const role = localStorage.getItem('role')
    const [dateRange, setDateRange] = useState<[Date, Date]>([new Date(), new Date()])

    useEffect(() => {
        if (project?.totalTasks && project.totalTasks > 0) {
            const percent = Math.round((project.completedTasks / project.totalTasks) * 100)
            setProgress(percent)
        } else {
            setProgress(0)
        }
    }, [project])


    useEffect(() => {
        fetchProject()
        fetchTasksByProjectId()
    }, [id])

    const handelDelete = async () => {
        const confirmResult = await Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to Delete this Project.',
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
                const token = localStorage.getItem('token')
                if (token) {
                    const response = await axios.delete(`https://task-manager-apis-t2dp.onrender.com/api/projects/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { t: Date.now() }
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
                    navigate('/dashboard')
                }

            }
            catch (err: any) {
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

    }

    const fetchProject = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            if (token) {
                const response = await axios.get(`https://task-manager-apis-t2dp.onrender.com/api/projects/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { t: Date.now() }
                })
                setProject(response.data.data)

                if (response.data.data?.startDate && response.data.data?.endDate) {
                    setDateRange([
                        new Date(response.data.data.startDate),
                        new Date(response.data.data.endDate)
                    ])
                }
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

    const fetchTasksByProjectId = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            if (token) {
                const response = await axios.get(`https://task-manager-apis-t2dp.onrender.com/api/tasks`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        project: id,
                        t: Date.now()
                    }
                })

                setTasks(response.data.data)
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

    const MakeReport = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            if (token) {
                const response = await axios.get(`https://task-manager-apis-t2dp.onrender.com/api/report/projects/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                const fileURL = response.data.data

                const link = document.createElement('a')
                link.href = fileURL
                link.download = `project-report-${id}.pdf`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            }
        } catch (err: any) {
            Swal.fire({
                title: "Error!",
                text: err.message,
                icon: "error",
                confirmButtonText: 'Try Again',
                confirmButtonColor: '#3754DB'
            })
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <Loader />
    if (!project) return <Handel txt='Project' />

    const [startDate, endDate] = dateRange
    const today = new Date()

    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const passedDays = Math.max(0, Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
    const remainingDays = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))

    return (
        <>
            <Link to={'/dashboard'}><img className='mb-2' src={control} alt="control" /></Link>
            {role === 'admin' &&
                <div className='flex justify-end gap-2 mb-8'>
                    <Link to={`/dashboard/edit-project/${id}`} className='p-3 rounded-md bg-indigo-200 font-semibold text-gray-700 hover:opacity-80 transition-all duration-500 ease-in-out'>
                        <FontAwesomeIcon className='text-indigo-700 text-xl' icon={faEdit} />
                    </Link>
                    <button onClick={handelDelete} className='px-4 py-2 rounded-md bg-red-200 font-semibold text-mybg hover:opacity-80 transition-all duration-500 ease-in-out'>
                        <FontAwesomeIcon className='text-red-500 text-xl' icon={faTrashAlt} />
                    </button>
                </div>
            }
            <div className="flex flex-wrap justify-between items-center h-full gap-5">
                <div className='md:w-[45%] w-full'>
                    <span className='text-gray-600 font-bold underline underline-offset-2'>Project Name :</span>
                    <h1 className="text-2xl font-bold mb-8 font-winky-rough text-myPrimary">
                        {project.name}
                    </h1>

                    <span className='text-gray-600 font-bold underline underline-offset-2'>Project Description :</span>
                    <p className="font-bold text-gray-800 mb-8">{project.description}</p>

                    {project.totalTasks !== undefined && (
                        <div className="w-full my-5">
                            <div className="flex justify-between mb-1 text-sm font-medium text-gray-700">
                                <span>Completed</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-white rounded-full h-3 shadow-lg">
                                <span
                                    className="block bg-mySecondary h-3 rounded-full transition-all duration-500 ease-in-out"
                                    style={{ width: `${progress}%` }}
                                ></span>
                            </div>
                        </div>
                    )}

                    <p className="text-gray-800 font-semibold mb-3">
                        Total Duration: <span className="text-myPrimary">{totalDays}</span> days
                    </p>
                    <p className="text-green-600 font-semibold mb-3">
                        Days Passed: <span>{passedDays}</span> days
                    </p>
                    <p className="text-red-600 font-semibold mb-3">
                        Days Remaining: <span>{remainingDays}</span> days
                    </p>
                    <h2 className="text-gray-600 font-bold underline underline-offset-2 mb-2 mt-10">Project Tasks</h2>
                    {tasks?.length > 0 ? (
                        tasks.map((task: any) => (
                            <div
                                key={task._id}
                                className="w-full group rounded-md px-4 py-3 mb-4 shadow-md bg-white relative overflow-hidden"
                            >
                                <div className="bg-myPrimary/80 z-10 absolute top-0 left-0 w-full h-full 
                                    transform -translate-y-full group-hover:translate-y-0 
                                    transition-all duration-500 ease-in-out 
                                    rounded-md flex justify-center items-center overflow-visible">
                                    <Link to={`/dashboard/show-task/${task._id}`}>
                                        <FontAwesomeIcon
                                            className="text-mySecondary font-extrabold text-4xl cursor-pointer"
                                            icon={faEye}
                                        />
                                    </Link>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <h3 className="text-xl font-bold font-winky-rough text-myPrimary">{task.title}</h3>
                                    <span className={`
                                        font-extrabold text-sm px-1.5 py-1 rounded-md
                                        ${task.status === 'pending' && 'text-mySecondary bg-yellow-100'}
                                        ${task.status === 'in progress' && 'text-myPrimary bg-blue-100'}
                                        ${task.status === 'completed' && 'text-green-500 bg-green-100'}
                                        ${task.status === 'postponed' && '!text-red-500 bg-red-100'}
                                    `}>
                                        {task.status}
                                    </span>
                                </div>

                                <p className="text-sm font-semibold text-gray-600 mb-2">
                                    Assigned to: <span className="font-bold">{task.assignedTo?.name || 'Unassigned'}</span>
                                </p>
                            </div>
                        ))
                    ) : (
                        <Handel txt='Tasks' />
                    )}
                </div>
                <Calendar
                    selectRange={false}
                    value={dateRange}
                    className="border-0 md:ms-auto max-w-72 md:w-[45%] max-576:w-full rounded-md bg-mybg"
                    tileClassName="hover:bg-myPrimary/50"
                />
            </div>

            {role === 'admin' &&
                <button onClick={MakeReport} className='mt-10 px-8 py-2 bg-myPrimary text-mybg rounded-md hover:opacity-80 transition-all duration-500 ease-in-out'>Generate a Report</button>
            }
        </>
    )
}

