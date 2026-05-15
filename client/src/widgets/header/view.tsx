import { UserProfile } from "@/entities/identity/user/ui/user-profile"
import { Input } from "@/shared/ui/input"
import { Search } from "lucide-react"
import { Link } from "react-router-dom"

export const Header = () => {
    return(
        <header className="border-b border-border bg-card sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                <Link to='/' className="flex items-center gap-2" >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                        🎻
                    </div>
                    <span className="font-bold text-lg">LearnHub</span>
                </Link>

                <div className="hidden md:flex items-center relative w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="text" placeholder="Поиск курсов..." className="pl-9 bg-muted" />
                </div>

                <div className="flex items-center gap-2">
                    <UserProfile />
                </div>
            </div>
        </header>
    )
}