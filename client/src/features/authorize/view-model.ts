import  { useForm } from "react-hook-form"
import { loginFormApi } from "./api"
import { useMutation } from '@tanstack/react-query'
import { api } from "@/shared/api/QueryClient"
import { userApi } from "@/entities/identity/user/api"
import { useCurrentUserStore } from "@/entities/identity/user/store"
import type { ApiError } from "@/shared/errors"
import {useNavigate} from 'react-router-dom'

export type LoginForm = {
    password: string,
    name: string
}

export const useLoginFormVM = () => {
    const currentUserStore = useCurrentUserStore()
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
        mutationFn: (data: LoginForm) => {
            return loginFormApi.login(data)
            .map(({access}) => access)
            .andThen(access => {
                api.setBearer(access)

                return userApi.getCurrent()
            })
            .unwrap()
        },
        onSuccess: user => {
            currentUserStore.setCurrentUser(user)
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