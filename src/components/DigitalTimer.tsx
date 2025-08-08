import { useState, useEffect } from "react"

function DigitalTimer({ initialSeconds }: { initialSeconds: number }) {
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds)

    useEffect(() => {
        if (secondsLeft <= 0) return
        const interval = setInterval(() => {
            setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)

        return () => clearInterval(interval)
    }, [secondsLeft])

    const formatTime = (totalSeconds: number): string[] => {
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, "0")
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0")
        const seconds = (totalSeconds % 60).toString().padStart(2, "0")
        return `${hours}:${minutes}:${seconds}`.split("")
    }

    return (
        <div className="flex gap-1 font-winky-rough text-2xl font-semibold w-max">
            {formatTime(secondsLeft).map((char: string, index: number) =>
                char === ":" ? (
                    <span key={index} className="text-indigo-600">
                        {char}
                    </span>
                ) : (
                    <span
                        className="py-1 px-2 bg-indigo-100 text-indigo-600 w-8 rounded-md"
                        key={index}
                    >
                        {char}
                    </span>
                )
            )}
        </div>
    )
}

export default DigitalTimer