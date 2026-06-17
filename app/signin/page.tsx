import Link from "next/link"

const SignInPage = () => {

    return <div>
        <h1>Sign In </h1>
        <input type="email" placeholder="email id" />
        <br />
        <input type="password" placeholder="password" />
        <br />
        <button>Sign In</button>
        <hr/>
        <Link href="/signup">Sign Up</Link>

    </div>
}

export default SignInPage