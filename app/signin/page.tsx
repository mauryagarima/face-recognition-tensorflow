"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

const SignInPage = () => {
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSignin = async () => {

        const response = await fetch("/api/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        })
        if (response.ok) {
            alert("Sign In successful")
            router.push("/dashboard")
        }
        const data = await response.json()

    }

    return <div>
        <h1>Sign In </h1>
        <input type="email" placeholder="email id"
            onChange={(e) => setEmail(e.target.value)} />
        <br />
        <input type="password" placeholder="password"
            onChange={(e) => setPassword(e.target.value)} />
        <br />
        <button onClick={handleSignin}>Sign In</button>
        <hr />
        <Link href="/signup">Sign Up</Link>

    </div>
}

export default SignInPage