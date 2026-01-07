import { LoginForm } from '~/components/auth/login-form'
import type { Route } from './+types/login'

export default function Login() {
    return (
        <div className='flex items-center justify-center min-h-screen'>
            <LoginForm />
        </div>
    )
}

export function meta({ }: Route.MetaArgs) {
    return [
        { title: 'React Router App' },
        { name: 'description', content: 'Login page' },
    ]
}