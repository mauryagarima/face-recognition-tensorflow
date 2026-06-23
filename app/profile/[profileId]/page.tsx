"use client"
import { Flex, Spin } from "antd"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

const ProfilePage = () => {

    const params = useParams<{ profileId: string }>()
    const [student, setStudent] = useState<{
        _id: string,
        name: string,
        enrollmentNumber: number,
        branch: string,
        semester: number
    }>({
        _id: "",
        name: "",
        enrollmentNumber: 0,
        branch: "",
        semester: 0
    })
    const [loading, setLoading] = useState(false)

    const initialiseUserProfile = async (profileId: string) => {
        setLoading(true)
        const apiRes = await fetch(`/api/students/${profileId}`)
        const apiJson = await apiRes.json()
        setStudent(apiJson)
        setLoading(false)
    }

    useEffect(() => {
        initialiseUserProfile(params.profileId)
    }, [params.profileId])

    return loading ? <Flex
        style={{ height: "100vh", width: "100%" }}
        justify="center"
        align="center">
        <Spin />
    </Flex> : <div>
        <p>Name:{student.name}</p>

    </div>
}

export default ProfilePage