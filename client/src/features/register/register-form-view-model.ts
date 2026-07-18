import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { ApiError } from "@/shared/errors"
import { userApi } from "@/entities/identity/api"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import type { UserRead } from "@contracts"


const registerForm = z.object({
    name: z.string()
        .nonempty("Это поле обязательно")
        .min(8, "Слишком короткое имя")
        .max(32, "Слишком длинное имя"),

    telegramLink: z.string()
        .nonempty("Это поле обязательно")
        .min(13, "Слишком короткая ссылка"),

    password: z.string()
        .nonempty("Это поле обязательно")
        .min(8, "Слишком короткий пароль"),

    passwordRepeat: z.string()
        .nonempty("Это поле обязательно")
        .min(8, "Слишком короткий пароль")
})
.refine(data=>data.password === data.passwordRepeat, {
    error: "Пароли не совпадают",
    path: ['passwordRepeat']
})


type RegisterForm = z.infer<typeof registerForm>


export const useRegisterFormMV = () => {
    const {control, formState: {errors}} = useForm({
        resolver: zodResolver(registerForm)
    })


    const {isPending, mutate} = useMutation<UserRead, ApiError, RegisterForm>({
        mutationFn: ({passwordRepeat, ...data}) =>
            userApi.register(data),

        onSuccess: user =>
            toast(`Пользователь с именем ${user.username} зарегистрирован.`),

        onError: err =>
            control.setError("root", {message: err.message})
    })

    const onSubmit = control.handleSubmit((data) => mutate(data))

    return {
        errors,
        onSubmit,
        control,
        isPending
    }
}