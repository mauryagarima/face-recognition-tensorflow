import Link from "next/link"

const SignUpPage = () => {

    return <div>
        <h1>Sign Up </h1>
        <input type="email" placeholder="email id" />
        <br />
        <input type="password" placeholder="password" />
        <br />
        <button>Sign Up</button>
        <hr/>
        <Link href="/signin">Sign In</Link>
    </div>
}

export default SignUpPage