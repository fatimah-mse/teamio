import { useEffect, useState } from "react"
import axios from "axios"
import ShowAllTasks from "../components/ShowAllTasks"
import Description from "../components/Description"
import TaskStatusPieChart from "../components/TaskStatusPieChart"
import TaskOverviewChart from "../components/TaskOverviewChart"


export default function Tasks() {
    const [status, setStatus] = useState('')
    const [project, setProject] = useState('')
    const [allproject, setallProject] = useState<any[]>([])
    const [assignedTo, setAssignedTo] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [users, setUsers] = useState<any[]>([])
    const role = localStorage.getItem('role')

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, [])

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
        if (role === "admin") {
            fetchUsers()
        }
    }, [])

    return (
        <div>
            <Description
                title="Tasks"
                text={
                    role === 'admin'
                        ? `Here, you can manage and oversee all tasks across your projects — from assigning responsibilities to tracking progress and deadlines.
                    Easily create, update, or review any task to ensure everything stays on schedule.
                    This space gives you full control to lead your team efficiently and keep every detail in check.`
                    :
                    `You can view the tasks assigned to you and clearly track their status. 
                    You are only allowed to update the task status.
                    This space is designed to give you a clear overview of your responsibilities and help you stay on top of your work.`
                }
            />
            <p className="text-myPrimary font-winky-rough font-semibold text-xl capitalize my-4">You can filter tasks based on the following fields: project, assigned user, status, due date, and priority.</p>
            <div className="tasks flex justify-between gap-4 my-8 overflow-scroll">
                <select
                    className="border flex-shrink-0 justify-between border-myPrimary shadow-md font-winky-rough focus:outline-none text-myPrimary px-3 py-2 rounded-md w-[22%] max-768:w-40"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option className="text-sm font-winky-rough font-medium" value="">All Status</option>
                    <option className="text-sm font-winky-rough font-medium" value="pending">Pending</option>
                    <option className="text-sm font-winky-rough font-medium" value="in-progress">In Progress</option>
                    <option className="text-sm font-winky-rough font-medium" value="completed">Completed</option>
                    <option className="text-sm font-winky-rough font-medium" value="postponed">Postponed</option>
                </select>

                <select
                    className="border flex-shrink-0 justify-between border-myPrimary shadow-md font-winky-rough focus:outline-none text-myPrimary px-3 py-2 rounded-md w-[22%] max-768:w-40"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                >
                    <option className="text-sm font-winky-rough font-medium" value="">All Projects</option>
                    {(allproject || []).length > 0 && allproject.map((p) => (
                        <option className="text-sm font-winky-rough font-medium" key={p._id} value={p._id}>
                            {p.name}
                        </option>
                    ))}
                </select>

                {role === 'admin' &&
                    <select
                        className="border flex-shrink-0 justify-between border-myPrimary shadow-md font-winky-rough focus:outline-none text-myPrimary px-4 py-2 rounded-md w-[22%] max-768:w-40"
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                    >
                        <option className="text-sm font-winky-rough font-medium" value="">All Users</option>
                        {(users || []).length > 0 && users.map((user) => (
                            <option className="text-sm font-winky-rough font-medium" key={user._id} value={user._id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                }

                <input
                    type="date"
                    className="border flex-shrink-0 justify-between border-myPrimary shadow-md font-winky-rough focus:outline-none text-myPrimary px-3 py-2 rounded-md w-[22%] max-768:w-40"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
            </div>

            <ShowAllTasks filters={{ status, project, assignedTo, dueDate }} />
            
            <TaskStatusPieChart />

            <TaskOverviewChart />

            {role === 'admin' && <TaskOverviewChart /> }

        </div>
    )
}