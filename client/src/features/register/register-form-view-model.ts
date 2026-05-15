import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { ApiError } from "@/shared/errors"
import { userApi } from "@/entities/identity/user/api"


export type RegisterForm = {
    name: string,
    telegram_link: string,
    password: string,
    password_repeat: string
}


export const useRegisterFormMV = () => {
    const {register, handleSubmit, setError, getValues, formState: {errors}} = useForm<RegisterForm>()

    const fields = {
        name: register('name', {
            required: "Это поле обязательно",
            minLength: {value: 8, message: "Слишком короткое имя"},
            maxLength: {value: 32, message: "Слишком длинное имя"}
        }),

        telegramLink: register('telegram_link', {
            required: "Это поле обязательно",
            minLength: {value: 13, message: "Слишком короткая ссылка"}
        }),

        password: register("password", {
            required: "Это поле обязательно",
            minLength: {value: 8, message: "Слишком короткий пароль"}
        }),

        repeatPassword: register('password_repeat', {
            required: "Это поле обязательно",
            minLength: {value: 8, message: "Слишком короткий пароль"},
            validate: (val) => val === getValues('password') || "Пароли не совпадают"
        })
    }


    const {isPending, mutate} = useMutation({
        mutationFn: ({password_repeat, ...data}: RegisterForm) => 
            userApi.register(data),

        onSuccess: (user) => 
            toast(`Пользователь с именем ${user.name} зарегистрирован.`),

        onError: (err: ApiError) => 
            setError("root", {message: err.message})
    })

    const handler = handleSubmit((data) => mutate(data))

    return {
        errors,
        fields,
        handler,
        isPending
    }
}