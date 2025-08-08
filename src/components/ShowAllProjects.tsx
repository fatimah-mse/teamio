import { useEffect, useState } from "react"
import axios from "axios"
import Handel from "./Handel"
import Swal from "sweetalert2"
import Loader from "./Loader"
import Slider from "./Slider"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAdd } from "@fortawesome/free-solid-svg-icons"

interface ProjectsProps {
    filterTerm: string
}

export default function ShowAllProjects({ filterTerm }: ProjectsProps) {
    const [projects, setProjects] = useState<any[] | null>(null)
    const [loading, setLoading] = useState(false)
    const role = localStorage.getItem('role')

    useEffect(() => {
        fetchMyProjects()
    }, [filterTerm])

    const fetchMyProjects = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            if (token) {
                const isDate = /^\d{4}-\d{2}-\d{2}$/.test(filterTerm)
                const params = isDate
                    ? { fromDate: filterTerm, toDate: filterTerm }
                    : { search: filterTerm }

                const response = await axios.get('https://task-manager-apis-t2dp.onrender.com/api/projects/', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { ...params, t: Date.now() }
                })
                setProjects(response.data.data)
            }
        } catch (err: any) {
            Swal.fire({
                title: "Error!",
                text: err.response?.data?.message || "Failed to fetch projects.",
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
            <span className="block text-sm text-gray-700 font-semibold my-3">Hover over or click a project card to see its details</span>
            {role === 'admin' &&
                <Link to={'/dashboard/add-project'} className="w-10 h-10 rounded-full ms-auto flex justify-center items-center text-gray-700 bg-amber-200 hover:opacity-65 transition-all duration-500 ease-in-out">
                    <FontAwesomeIcon className="text-2xl text-amber-600" icon={faAdd} />
                </Link>
            }
            {!projects || projects.length === 0 ? 
                <Handel txt="Projects" />
                : 
                <Slider data={projects} rout="show-project/" task={false} />
            }
            
        </>
    )
}