import { Hatch } from 'ldrs/react'
import 'ldrs/react/Hatch.css'

export default function Loader() {
    return (
        <div className="fixed z-50 top-0 left-0 h-screen w-full bg-myPrimary/70 backdrop-blur-sm flex justify-center items-center overflow-hidden">
            <Hatch
                size="60"
                stroke="8"
                speed="3.75"
                color="#FBBE37"
            />
        </div>

    )
}