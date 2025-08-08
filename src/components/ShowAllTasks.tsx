import { useEffect, useState } from "react"
import axios from "axios"
import Handel from "./Handel"
import Swal from "sweetalert2"
import Loader from "./Loader"
import Slider from "./Slider"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAdd } from "@fortawesome/free-solid-svg-icons"

interface TasksProps {
    filterTerm?: string
    filters?: {
        status?: string
        project?: string
        assignedTo?: string
        dueDate?: string
    }
}

export default function ShowAllTasks({ filterTerm, filters }: TasksProps) {
    const [tasks, setTasks] = useState<any[] | null>(null)
    const [loading, setLoading] = useState(false)
    const role = localStorage.getItem('role')

    useEffect(() => {
        fetchTasks()
    }, [filterTerm, filters])

    const fetchTasks = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            if (token) {
                const params: any = { t: Date.now() }
                if (filters) {
                    if (filters.status) params.status = filters.status
                    if (filters.project) params.project = filters.project
                    if (filters.assignedTo) params.assignedTo = filters.assignedTo
                    if (filters.dueDate) params.dueDate = filters.dueDate
                }

                const response = await axios.get('https://task-manager-apis-t2dp.onrender.com/api/tasks/', {
                    headers: { Authorization: `Bearer ${token}` },
                    params
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

    if (loading) return <Loader />

    return (
        <>
            <span className="block text-sm text-gray-700 font-semibold my-3">Hover over or click a task card to see its details</span>
            {role === 'admin' &&
                <Link to={'/dashboard/add-task'} className="w-10 h-10 rounded-full ms-auto flex justify-center items-center text-gray-700 bg-amber-200 hover:opacity-65 transition-all duration-500 ease-in-out">
                    <FontAwesomeIcon className="text-2xl text-amber-600" icon={faAdd} />
                </Link>
            }
            {!tasks || tasks.length === 0 ?
                <Handel txt="Tasks" />
                :
                <Slider data={tasks} rout="show-task/" task={true} />
            }
        </>
    )
}

