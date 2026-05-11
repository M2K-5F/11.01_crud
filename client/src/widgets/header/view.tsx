import { useCurrentUser } from "@/entities/identity/user/current-user-provider"
import { UserProfile } from "@/entities/identity/user/ui/user-profile"
import { Button } from "@/shared/ui/button"
import { Plane } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const Header = () => {
    const { user } = useCurrentUser()
    const navigate = useNavigate()

    return(
        <nav className="border-b">
            <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-row">
                    <div onClick={() => {navigate('/')}} className="flex items-center cursor-pointer gap-2">
                        <Plane className="w-8 h-8 text-blue-600" />
                        <span className="text-xl font-bold">Hello</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                {user
                    ?   <UserProfile />
                    :   <Button onClick={() => {navigate('/identity/login')}}>Войти</Button>
                }
                </div>
            </div>
            </div>
        </nav>
)
}