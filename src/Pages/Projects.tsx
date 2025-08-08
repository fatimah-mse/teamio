import { useEffect, useState } from "react"
import ShowAllProjects from "../components/ShowAllProjects"
import Description from "../components/Description"
import ProjectStatusPieChart from "../components/ProjectStatusPieChart"


export default function Projects() {
    const [filterTerm, setFilterTerm] = useState('')
    const role = localStorage.getItem('role')

    useEffect(() => {
    }, [filterTerm])

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, [])

    return (
        <>
            <input
                className="border mb-4 border-myPrimary focus:outline-none px-4 py-2 rounded-md w-3/5 max-768:w-full"
                placeholder="Search for Projects"
                type="search"
                value={filterTerm}
                onChange={(e) => setFilterTerm(e.target.value)}
            />
            <Description
                title= 'Projects '
                text= {role === 'admin' ?
                    `Here, you’ll find all your personal and professional projects gathered in one place — whether they’re ideas in progress, completed works, or future plans.
                    Easily browse, manage, and keep track of everything you’re working on.
                    This space is designed to give you full control, clear organization, and quick access to every step of your creative or productive journey.`
                    :
                    `Here, you can explore all the projects you're involved in.
                    Stay up to date with the latest progress, view project details, and keep track of your contributions.
                    This space is designed to keep you informed and connected to everything that matters to your work.`
                }
            />
            <ShowAllProjects filterTerm={filterTerm} />

            {role === 'admin' && <ProjectStatusPieChart />}
        </>
    )
}
