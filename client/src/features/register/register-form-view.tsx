import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { useRegisterFormMV } from "./register-form-view-model"
import { Label } from "@/shared/ui/label"
import { ErrorMessage } from "@/shared/ui/form-error-message"
import { Spinner } from "@/shared/ui/spinner"

export const RegisterForm = () => {
    const {
        control, 
        onSubmit,
        errors,
        isPending
    } = useRegisterFormMV()

    return(
        <Card className="max-w-md">
            <CardHeader className="text-center">
                <CardTitle>Регистрация</CardTitle>
                <CardDescription>
                    Зарегистрировать новую учетную запись
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="flex flex-col gap-y-4">
                    <div className="grid gap-1">
                        <Label htmlFor="name">Имя пользователя:</Label>
                        <Input {...control.register('name')} /> 
                        <ErrorMessage error={errors.name} />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="telegram_link">Ссылка на телеграм:</Label>
                        <Input {...control.register('telegramLink')}/>
                        <ErrorMessage error={errors.telegramLink} />
                    </div>
            
                    <div className="grid gap-x-2 grid-cols-2 items-baseline">
                    
                        <div className="grid gap-1">
                            <Label>Пароль:</Label>
                            <Input {...control.register('password')} />
                            <ErrorMessage error={errors.password} />
                        </div>
                    
                        <div className="grid gap-1">
                            <Label>Повтор пароля:</Label>
                            <Input {...control.register('passwordRepeat')}/>
                            <ErrorMessage error={errors.passwordRepeat} />
                        </div>
                    
                    </div>
            
                    <Button type="submit" disabled={isPending} >{isPending ? <Spinner /> : "Зарегистрироваться"}</Button>
                    <ErrorMessage error={errors.root} />
            
                </form>
            </CardContent>
        </Card>
    )
}
