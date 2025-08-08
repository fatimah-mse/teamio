import { useEffect, useState } from 'react'
import axios from 'axios'
import { VictoryPie, VictoryTooltip } from 'victory'
import Loader from './Loader'
import Swal from 'sweetalert2'

const activityColors: Record<string, string> = {
    'login': 'rgba(245, 158, 11, 0.65)',
    'create project': 'rgba(76, 175, 80, 0.65)',
    'update task': 'rgba(103, 58, 183, 0.65)',
    'add note': 'rgba(55, 84, 219, 0.85)',
    'unknown': 'rgba(158, 158, 158, 0.65)',
}

type LogItem = {
    type: string
    count: number
    details: any[]
}

export default function ActivityPieChart() {
    const [logs, setLogs] = useState<LogItem[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const [isLargeScreen, setIsLargeScreen] = useState(true)
    const role = localStorage.getItem('role')

    useEffect(() => {
        const checkScreen = () => {
            setIsLargeScreen(window.innerWidth > 768)
        }

        checkScreen()
        window.addEventListener("resize", checkScreen)

        return () => window.removeEventListener("resize", checkScreen)
    }, [])

    const normalizeType = (type: string) => type.toLowerCase()

    const groupLogsByType = (logs: any[]): LogItem[] => {
        const grouped: { [type: string]: LogItem } = {}

        logs.forEach((log) => {
            const rawType = log.type || 'unknown'
            const normalizedType = normalizeType(rawType)

            if (!grouped[normalizedType]) {
                grouped[normalizedType] = {
                    type: normalizedType,
                    count: 1,
                    details: [log]
                }
            } else {
                grouped[normalizedType].count += 1
                grouped[normalizedType].details.push(log)
            }
        })

        return Object.values(grouped)
    }

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true)
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get('https://task-manager-apis-t2dp.onrender.com/api/activityLogs/', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { t: Date.now() }
                })
                setLogs(groupLogsByType(response.data.data))
            } catch (err: any) {
                Swal.fire({
                    title: "Error!",
                    text: err.response?.data?.message || err.message,
                    icon: "error",
                    confirmButtonText: 'Try Again',
                    confirmButtonColor: '#3754DB'
                })
            } finally {
                setLoading(false)
            }
        }

        fetchLogs()
    }, [])

    const getColor = (type: string) => activityColors[normalizeType(type)] || activityColors.unknown

    // لتحويل أول حرف لكل كلمة إلى كبير في العرض
    const formatTypeLabel = (type: string) =>
        type.replace(/\b\w/g, (c) => c.toUpperCase())

    return (
        <>
            {loading && <Loader />}
            <div className="">
                <h2 className="text-xl text-myPrimary font-bold underline underline-offset-2 mb-3">
                    {role === 'admin' ? 'All ' : 'Your '} Activities :
                </h2>
                <div className='flex max-768:items-start gap-4 items-end max-768:flex-col'>
                    <div className='w-2/5 max-w-96 max-768:!w-full md:py-14 pt-4 pb-10'>
                        <VictoryPie
                            padding={0}
                            innerRadius={0}
                            data={logs}
                            x="type"
                            y="count"
                            labels={({ datum }) => `${formatTypeLabel(datum.type)}\nCount: ${datum.count}`}
                            colorScale={Array.from(new Set(logs.map((log) => getColor(log.type))))}
                            events={[
                                {
                                    target: 'data',
                                    eventHandlers: {
                                        onClick: (_, props) => {
                                            const clicked = logs[props.index]
                                            setSelectedType(clicked.type === selectedType ? null : clicked.type)
                                            return []
                                        }
                                    }
                                }
                            ]}
                            style={{
                                data: {
                                    cursor: 'pointer',
                                    stroke: '#fff',
                                    strokeWidth: 1
                                }
                            }}
                            labelComponent={
                                isLargeScreen ? (
                                    <VictoryTooltip
                                        style={{ fontSize: 18, fill: "#3754DB", lineHeight: 1.2 }}
                                        flyoutStyle={{ fill: "white" }}
                                    />
                                ) : undefined
                            }
                        />
                    </div>
                    <div className="grid max-576:grid-cols-1 grid-cols-2 2xl:!grid-cols-3 max-768:gap-x-8 gap-3 text-sm md:mb-14">
                        {logs.map((log) => {
                            const total = logs.reduce((sum, l) => sum + l.count, 0)
                            const percentage = ((log.count / total) * 100).toFixed(1)
                            const isSelected = selectedType === log.type
                            return (
                                <div
                                    key={log.type}
                                    onClick={() => setSelectedType(isSelected ? null : log.type)}
                                    className={`flex items-center space-x-2 cursor-pointer font-medium`}
                                    style={{
                                        color: isSelected ? getColor(log.type) : undefined
                                    }}
                                >
                                    <span
                                        className="inline-block w-4 h-4 rounded-full"
                                        style={{ backgroundColor: getColor(log.type) }}
                                    />
                                    <span>{formatTypeLabel(log.type)} ({percentage}%)</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
                {selectedType && (
                    <div className="mt-8">
                        <h3 className="text-lg text-gray-700 font-bold mb-3">
                            Details: <span className="text-indigo-600">{formatTypeLabel(selectedType)}</span>
                        </h3>
                        <ul className="border shadow-md rounded-md p-4 max-h-64 overflow-y-auto space-y-2 text-sm bg-white">
                            {logs
                                .find((log) => log.type === selectedType)
                                ?.details.map((log, idx) => (
                                    <li key={idx} className="border-b border-gray-400 py-2 text-gray-600 font-bold">
                                        <p><strong className='text-indigo-600 underline underline-offset-2'>User :</strong> {log.user?.name}</p>
                                        <p><strong className='text-indigo-600 underline underline-offset-2'>Description :</strong> {log.description}</p>
                                        <p><strong className='text-indigo-600 underline underline-offset-2'>Time :</strong> {new Date(log.createdAt).toLocaleString()}</p>
                                    </li>
                                ))}
                        </ul>
                    </div>
                )}
            </div>
        </>
    )
}

