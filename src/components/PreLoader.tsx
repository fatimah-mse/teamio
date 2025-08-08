import { Cardio } from 'ldrs/react'
import 'ldrs/react/Cardio.css'

export default function PreLoader() {
    return (
        <div className="h-screen w-full bg-myPrimary flex justify-center items-center overflow-hidden">
            <Cardio
                size="200"
                stroke="8"
                speed="1.75"
                color="#FBBE37"
            />
        </div>

    )
}