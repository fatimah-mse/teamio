import axios from "axios"
import { useEffect, useState } from "react"

interface Ttask {
    type: 'add' | 'edit'
    initialData?: {
        title: string
        description: string
        dueDate: string
        priority: string
        status: string
        assignedTo: { _id: string; name: string; email: string }
        project: { _id: string; name: string; email: string }
    }
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export default function TaskForm(
    { initialData = {
        title: '',
        description: '',
        dueDate: '',
        priority: '',
        status: '',
        assignedTo: { _id: '', name: '', email: '' },
        project: { _id: '', name: '', email: '' }
    }, type, handleSubmit }: Ttask
) {
    const [allproject, setallProject] = useState<any[]>([])
    const [users, setUsers] = useState<any[]>([])
    const role = localStorage.getItem('role')
    const [assignedTo, setAssignedTo] = useState(initialData?.assignedTo?._id || '')
    const [project, setProject] = useState(initialData?.project?._id || '')

    useEffect(() => {
        setAssignedTo(initialData?.assignedTo?._id || '')
        setProject(initialData?.project?._id || '')
    }, [initialData])

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token")
                const response = await axios.get("https://task-manager-apis-t2dp.onrender.com/api/users/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                setUsers(response.data.data)
            } catch (error) {
                console.error("Error fetching users:", error)
            }
        }

        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem("token")
                const response = await axios.get("https://task-manager-apis-t2dp.onrender.com/api/projects/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                setallProject(response.data.data)
            } catch (error) {
                console.error("Error fetching projects:", error)
            }
        }

        fetchProjects()
        fetchUsers()
    }, [])
    return (
        <form method="post" className="flex flex-col gap-2" onSubmit={handleSubmit}>
            {role === 'admin' &&
                <>
                    <label className='text-gray-600 font-bold underline underline-offset-2' htmlFor="title">Task Title :</label>
                    <input defaultValue={initialData.title} className="border mb-4 border-myPrimary focus:outline-none px-4 py-2 rounded-md w-3/5 max-768:w-full" type="text" name="title" id="title" placeholder="Task Title" />
                    <label className='text-gray-600 font-bold underline underline-offset-2' htmlFor="description">Task Description :</label>
                    <textarea defaultValue={initialData.description} className="border mb-4 border-myPrimary focus:outline-none px-4 py-2 rounded-md w-3/5 max-768:w-full" name="description" id="description" placeholder="Task description" />
                    <label className='text-gray-600 font-bold underline underline-offset-2' htmlFor="dueDate">{`${type === 'add' ? '' : 'Change'} Task Due Date :`}</label>
                    <input defaultValue={initialData.dueDate} className="border mb-4 border-myPrimary focus:outline-none px-4 py-2 rounded-md w-3/5 max-768:w-full" type="date" name="dueDate" id="dueDate" />
                    <label className='text-gray-600 font-bold underline underline-offset-2' htmlFor="project">Project :</label>
                    <select
                        name="project" id='project'
                        value={type === 'edit' ? project : undefined}
                        onChange={e => setProject(e.target.value)}
                        className="border mb-4 border-myPrimary focus:outline-none px-3 py-2 rounded-md w-3/5 max-768:w-full"
                    >
                        <option className="text-sm font-winky-rough font-medium" value="">All Projects</option>
                        {allproject.map((p) => (
                            <option className="text-sm font-winky-rough font-medium" key={p._id} value={p._id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                    <label className='text-gray-600 font-bold underline underline-offset-2' htmlFor="assignedTo">Assigned To :</label>
                    <select
                        name="assignedTo" id='assignedTo'
                        value={type === 'edit' ? assignedTo : undefined}
                        onChange={e => setAssignedTo(e.target.value)}
                        className="border mb-4 border-myPrimary focus:outline-none px-3 py-2 rounded-md w-3/5 max-768:w-full"
                    >
                        <option className="text-sm font-winky-rough font-medium" value="">All Users</option>
                        {users.map((user) => (
                            <option className="text-sm font-winky-rough font-medium" key={user._id} value={user._id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                    <label className='text-gray-600 font-bold underline underline-offset-2' htmlFor="priority">Priority :</label>
                    <select
                        name="priority" id='priority' defaultValue={initialData.priority}
                        className="border mb-4 border-myPrimary focus:outline-none px-3 py-2 rounded-md w-3/5 max-768:w-full"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </>
            }
            {type === 'edit'  &&
                <>
                    <label className='text-gray-600 font-bold underline underline-offset-2' htmlFor="project">Status :</label>
                    <select
                        name="status" id='status' defaultValue={initialData.status}
                        className="border mb-4 border-myPrimary focus:outline-none px-4 py-2 rounded-md w-3/5 max-768:w-full"
                    >
                        <option className="text-sm font-winky-rough font-medium" value="">All Status</option>
                        <option className="text-sm font-winky-rough font-medium" value="pending">Pending</option>
                        <option className="text-sm font-winky-rough font-medium" value="in progress">In Progress</option>
                        <option className="text-sm font-winky-rough font-medium" value="completed">Completed</option>
                        <option className="text-sm font-winky-rough font-medium" value="postponed">Postponed</option>
                    </select>
                </>
            }
            <input className="px-6 py-3 block w-max mt-5 font-semibold text-mybg bg-myPrimary rounded-md hover:opacity-75 transition-all duration-500 ease-in-out cursor-pointer" type="submit" value={`${type === 'add' ? 'Add' : 'Edit'} Task`} />
        </form>
    )
}
