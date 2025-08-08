import { useEffect, useState } from 'react'
import axios from 'axios'
import { VictoryPie, VictoryTooltip } from 'victory'
import Loader from './Loader'
import Swal from 'sweetalert2'

const statusColors: Record<string, string> = {
    "In Progress": "rgba(55, 84, 219, 0.65)",
    "Pending": "rgba(245, 158, 11, 0.65)",
    "Completed": "rgba(34, 197, 94, 0.65)",
    "Postponed": "rgba(239, 68, 68, 0.65)",
    "Unknown": "rgba(158, 158, 158, 0.65)"
}

type TaskStatusGroup = {
    status: string
    count: number
    tasks: any[]
}

export default function TaskStatusPieChart() {
    const [groupedTasks, setGroupedTasks] = useState<TaskStatusGroup[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
    const [hasTasks, setHasTasks] = useState(true)

    const formatStatus = (status: string): string => {
        return status
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    const groupByStatus = (tasks: any[]): TaskStatusGroup[] => {
        const grouped: Record<string, TaskStatusGroup> = {}

        tasks.forEach(task => {
            const assignedToName = (task.assignedTo && typeof task.assignedTo === 'object')
                ? task.assignedTo.name || 'Unknown'
                : 'Unassigned'

            const rawStatus = task.status || 'unknown'
            const status = formatStatus(rawStatus)

            const taskWithAssignedName = { ...task, assignedToName }

            if (!grouped[status]) {
                grouped[status] = { status, count: 1, tasks: [taskWithAssignedName] }
            } else {
                grouped[status].count++
                grouped[status].tasks.push(taskWithAssignedName)
            }
        })

        return Object.values(grouped)
    }

    const fetchTasks = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const response = await axios.get('https://task-manager-apis-t2dp.onrender.com/api/tasks/', {
                headers: { Authorization: `Bearer ${token}` },
                params: { t: Date.now() }
            })

            const tasks = response.data.data || []
            if (tasks.length === 0) {
                setHasTasks(false) 
                setGroupedTasks([])
                setSelectedStatus(null)
            } else {
                setHasTasks(true)
                const grouped = groupByStatus(tasks)
                setGroupedTasks(grouped)
            }
        } catch (err: any) {
            Swal.fire({
                title: 'Error!',
                text: err.response?.data?.message || err.message || 'Something went wrong',
                icon: 'error',
                confirmButtonText: 'Try Again',
                confirmButtonColor: '#3754DB'
            })
            setHasTasks(false)
            setGroupedTasks([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTasks()
    }, [])

    const getColor = (status: string) => statusColors[status] || statusColors.Unknown

    if (loading) return <Loader />

    return (
        <>
            {(!hasTasks && groupedTasks.length > 0) &&
                <div className="my-8">
                    <h2 className="text-xl text-myPrimary font-bold underline underline-offset-2 mb-4">Task Status Overview</h2>
                    <div className='flex max-768:items-start gap-4 items-end max-768:flex-col'>
                        <div className='w-2/5 max-w-96 max-768:!w-full md:py-14 pt-4 pb-10'>
                            <VictoryPie
                                data={groupedTasks}
                                x="status"
                                y="count"
                                innerRadius={0}
                                padding={40}
                                labels={({ datum }) => `${datum.status}\n${datum.count} tasks`}
                                colorScale={groupedTasks.map(g => getColor(g.status))}
                                labelComponent={
                                    <VictoryTooltip
                                        style={{ fontSize: 18, fill: "#3754DB", lineHeight: 1.2 }}
                                        flyoutStyle={{ fill: "white" }}
                                    />
                                }
                                events={[{
                                    target: "data",
                                    eventHandlers: {
                                        onClick: (_, props) => {
                                            const clicked = groupedTasks[props.index]
                                            setSelectedStatus(clicked.status === selectedStatus ? null : clicked.status)
                                            return []
                                        }
                                    }
                                }]}
                                style={{
                                    data: { stroke: "#fff", strokeWidth: 1, cursor: "pointer" }
                                }}
                            />
                        </div>
                        <div className="grid max-576:grid-cols-1 grid-cols-2 xl:!grid-cols-3 max-768:gap-x-8 gap-3 text-sm md:mb-14">
                            {groupedTasks.map((g) => {
                                const total = groupedTasks.reduce((sum, x) => sum + x.count, 0)
                                const percentage = ((g.count / total) * 100).toFixed(1)
                                const isSelected = selectedStatus === g.status

                                return (
                                    <div
                                        key={g.status}
                                        onClick={() => setSelectedStatus(isSelected ? null : g.status)}
                                        className={`flex w-full items-center space-x-2 cursor-pointer font-medium`}
                                        style={{
                                            color: isSelected ? getColor(g.status) : undefined
                                        }}
                                    >
                                        <span
                                            className="inline-block w-4 h-4 rounded-full"
                                            style={{ backgroundColor: getColor(g.status) }}
                                        />
                                        <span>{g.status} ({percentage}%)</span>
                                    </div>
                                )
                            })}

                        </div>
                    </div>

                    {selectedStatus && (
                        <div className="mt-6">
                            <h3 className="text-md text-gray-700 font-semibold mb-2">
                                Tasks with status: <span className="text-indigo-600">{selectedStatus}</span>
                            </h3>
                            <ul className="border shadow-sm bg-white p-4 rounded-md text-sm max-h-64 overflow-y-auto space-y-2">
                                {groupedTasks.find(g => g.status === selectedStatus)?.tasks?.map((task, idx) => (
                                    <li key={idx} className="border-b border-gray-400 py-2 text-gray-600 font-bold">
                                        <p><strong className='text-indigo-600 underline underline-offset-2'>Title :</strong> {task.title}</p>
                                        <p><strong className='text-indigo-600 underline underline-offset-2'>Assigned To:</strong> {task.assignedToName}</p>
                                        <p><strong className='text-indigo-600 underline underline-offset-2'>Due :</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            }
        </>
    )
}

