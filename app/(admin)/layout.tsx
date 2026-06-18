import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"

const AdminLayout = async ({ children }: {
    children: React.ReactNode
}) => {

    const cookieStore = await cookies()

    const user = cookieStore.has("user")
    if (user) {
        return (
            <div>

                {children}
            </div>
        )
    }
    return redirect("/signin")


}

export default AdminLayout