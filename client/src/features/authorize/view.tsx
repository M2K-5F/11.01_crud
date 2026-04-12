import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { useLoginFormVM } from "./view-model";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { ErrorMessage } from "@/shared/ui/form-error-message";
import { Spinner } from "@/shared/ui/spinner";

const LoginForm = () => {
    const {
        errors,
        formFields,
        submitHandler,
        isPending
    } = useLoginFormVM()

    return(
        <Card className="w-full max-w-sm h-fit mb-3.5">
            <form onSubmit={submitHandler}>
                <CardHeader className="text-center">
                    <CardTitle className={'text-center'}>Войти в свой аккаунт</CardTitle>
                    <CardDescription>
                        Войти в аккаунт используя логин и пароль
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="flex flex-col gap-6 mb-4">
                        <div className="grid gap-1">
                            <Label htmlFor="email">Логин</Label>
                            <Input {...formFields.nameField}/>
                            <ErrorMessage error={errors.name} />
                        </div>
                        <div className="grid gap-1">
                            <Label htmlFor="password">Пароль</Label>
                            <Input {...formFields.passwordField}/>
                            <ErrorMessage error={errors.password} />
                        </div>
                    </div>
                </CardContent>

                <CardContent>
                    <Button type="submit" variant='default' disabled={isPending} className="w-full">
                        {isPending ? <Spinner /> : "Войти"}
                    </Button>
                    <ErrorMessage error={errors.root}/>
                </CardContent>
            </form>
        </Card>
    )
}

export default LoginForm