"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

const SignUpPage = () => {

    const router = useRouter()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSignup = async () => {
        const response = await fetch("/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        })
        const data = await response.json()
        if (response.ok) {
            alert(data.message)
            router.replace("/signin")

        } else {
            alert(data.message)
        }
    }

    return <div>
        <h1>Sign Up </h1>
        <input type="text" placeholder="College Name"
            onChange={(e) => setName(e.target.value)} />
        <br />
        <input type="email" placeholder="email id"
            onChange={(e) => setEmail(e.target.value)} />
        <br />
        <input type="password" placeholder="password"
            onChange={(e) => setPassword(e.target.value)} />
        <br />
        <button onClick={handleSignup}>Sign Up</button>
        <hr />
        <Link href="/signin">Sign In</Link>
    </div>
}

export default SignUpPage