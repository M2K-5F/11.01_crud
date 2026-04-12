import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { registerApi, type RegisterData } from "./api"
import { toast } from "sonner"

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
        mutationFn: (data:RegisterData) => 
            registerApi.register(data)
            .match({
                ok(user) {
                    toast(`Пользователь с именем ${user.name} зарегистрирован.`)
                },
                err(error) {
                    setError('root', {message: error.message})
                },
            })
    })

    const handler = handleSubmit((data) => mutate({name: data.name, password: data.password, talegramLink: data.telegram_link}))

    return {
        errors,
        fields,
        handler,
        isPending
    }
}