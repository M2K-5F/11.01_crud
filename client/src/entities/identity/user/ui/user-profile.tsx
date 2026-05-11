import { Avatar, AvatarFallback } from "@/shared/ui/avatar"
import { Button } from "@/shared/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu"
import { Navigate, useNavigate } from "react-router-dom"
import { useCurrentUser } from "../current-user-provider"
import { Badge } from "@/shared/ui/badge"
import { LogOut, Plane, Shield, User } from "lucide-react"

export const UserProfile = () => {
    const navigate = useNavigate()
    const { user, logout } = useCurrentUser()
    

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }


    if (!user) return <Navigate to='/identity/login' />

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="avatar-fallback text-amber-100">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
                <DropdownMenuLabel className="p-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-blue-100">
                            <AvatarFallback className="bg-blue-500 text-white text-lg font-semibold">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.telegram_link}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {user.roles.map((role) => 
                                    role === 'Student'
                                        ?   <Badge 
                                                key={role} 
                                                variant='destructive'
                                                className="text-xs"
                                            >
                                                <div className="flex items-center gap-1">
                                                    <User className="w-4 h-4" />
                                                    Студент
                                                </div>
                                            </Badge>
                                        :   <Badge 
                                                key={role} 
                                                variant='default'
                                                className="text-xs"
                                            >
                                                <div className="flex items-center gap-1">
                                                    <Shield className="w-4 h-4" /> 
                                                    Преподаватель
                                                </div>
                                            </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem 
                className="cursor-pointer py-3"
                onClick={() => navigate('/user/tickets')}
                >
                    <Plane className="w-4 h-4 mr-2" />
                    <span>Мои бронирования</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                    className="cursor-pointer py-3 text-red-600 focus:text-red-600"
                    onClick={() => logout().tap(() => navigate('/identity/login'))}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Выйти</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}