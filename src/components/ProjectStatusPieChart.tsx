import { useEffect, useState } from 'react'
import axios from 'axios'
import { VictoryPie, VictoryTooltip } from 'victory'
import Loader from './Loader'
import Swal from 'sweetalert2'

const statusLabels: Record<string, string> = {
    notStarted: 'Not Started',
    active: 'Active',
    completed: 'Completed',
    delayed: 'Delayed',
    completedThisMonth: 'Completed This Month',
}

const statusColors: Record<string, string> = {
    'Not Started': 'rgba(245, 158, 11, 0.65)',
    'Active': 'rgba(55, 84, 219, 0.65)',
    'Completed': 'rgba(34, 197, 94, 0.65)',
    'Delayed': 'rgba(239, 68, 68, 0.65)',
    'Completed This Month': 'rgba(0, 105, 92, 0.65)',
    'Unknown': 'rgba(120, 120, 120, 0.4)',
}

type ProjectStatus = {
    status: string
    count: number
}

export default function ProjectStatusPieChart() {
    const [data, setData] = useState<ProjectStatus[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

    const fetchProjectStatus = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const response = await axios.get('https://task-manager-apis-t2dp.onrender.com/api/projects/status', {
                headers: { Authorization: `Bearer ${token}` },
                params: { t: Date.now() }
            })

            const raw = response.data.data

            const formatted: ProjectStatus[] = Object.entries(raw)
                .map(([key, value]) => ({
                    status: statusLabels[key] || key,
                    count: value as number
                }))
                .filter(item => item.count > 0)

            setData(formatted)
        } catch (err: any) {
            Swal.fire({
                title: 'Error!',
                text: err.response?.data?.message || 'Failed to load project statuses.',
                icon: 'error',
                confirmButtonText: 'Try Again',
                confirmButtonColor: '#3754DB'
            })
        } finally {
            setLoading(false)
        }
    }

    const getColor = (status: string) => statusColors[status] || statusColors.Unknown

    useEffect(() => {
        fetchProjectStatus()
    }, [])

    return (
        <>
            {loading && <Loader />}
            {data.length > 0 &&
                <div className="my-8">
                    <h2 className="text-xl text-myPrimary font-bold underline underline-offset-2 mb-4">Project Status Overview</h2>
                    <div className='flex max-768:items-start gap-4 items-end max-768:flex-col'>
                        <div className='w-2/5 max-w-96 max-768:!w-full md:py-14 pt-4 pb-10'>
                            <VictoryPie
                                data={data}
                                x="status"
                                y="count"
                                innerRadius={0}
                                padding={40}
                                labels={({ datum }) => `${datum.status}\n${datum.count} projects`}
                                colorScale={data.map(g => getColor(g.status))}
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
                                            const clicked = data[props.index]
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
                            {data.map((g) => {
                                const total = data.reduce((sum, x) => sum + x.count, 0)
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
                        <div className="mt-6 text-sm text-gray-600">
                            <p>
                                Showing <strong>{data.find(d => d.status === selectedStatus)?.count}</strong> projects with status: <span className="text-indigo-600 font-semibold">{selectedStatus}</span>
                            </p>
                        </div>
                    )}
                </div>
            }
        </>
    )
}
