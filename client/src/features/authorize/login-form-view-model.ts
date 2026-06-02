import  { useForm } from "react-hook-form"
import { useMutation } from '@tanstack/react-query'
import { api } from "@/shared/api/query-client"
import type { ApiError } from "@/shared/errors"
import {useNavigate} from 'react-router-dom'
import { useCurrentUser } from "@/entities/identity/user/current-user-provider"
import { userApi } from "@/entities/identity/user/api"

export type LoginForm = {
    password: string,
    name: string
}

export const useLoginFormVM = () => {
    const { fetchCurrentUser } = useCurrentUser()
    const navigate = useNavigate()


    const {
        register, 
        handleSubmit, 
        formState: {errors}, 
        setError
    } = useForm<LoginForm>()


    const {
        mutate, 
        isPending
    } = useMutation({
        mutationFn: (data: LoginForm) => 
            userApi.login(data)
                .map (({access}) => access)
                .tap (access => api.setBearer(access))
                .andThen (() => fetchCurrentUser())
        ,
        onSuccess: () => {
            navigate('/')
        },
        onError: (err: ApiError)  => {
            if (err.status === 400) {
                setError('root' , {message: 'Неверный логин или пароль'})
            } else {
                setError('root', { message: 'Что-то пошло не так, попробуйте позже' })
            }
        }
    })


    const formFields = {
        nameField: register('name', {
            required: 'Это поле обязательно',
            maxLength: {value: 32, message: "Слишком длинное имя"}, 
            minLength: {value: 8, message: "Слишком которкое имя"},
        }),

        passwordField: register('password', {
            minLength: {value: 8, message: "Слишком короткий пароль"},
            required: "Это поле обязательно",
        }),
    }


    const handler = handleSubmit(form => mutate(form))

    return {
        formFields,
        submitHandler: handler,
        errors,
        isPending
    }
}