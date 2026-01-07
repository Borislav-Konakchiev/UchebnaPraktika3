import {
type RouteConfig,
index,
layout,
prefix,
route,
} from '@react-router/dev/routes'

export default [
route('/login', 'routes/login.tsx'),
route("/register", "routes/register.tsx"),
layout('components/auth/protected-layout.tsx', [
index('routes/dashboard.tsx'),
// Users 
...prefix('users', [index('routes/users/users.tsx')]), 
// Passports 
...prefix('passports', [ 
index('routes/passports/passports.tsx'), 
route('/:passportId', 'routes/passports/passport-details.tsx'), 
route('/create', 'routes/passports/passport-create.tsx'), 
route('/:passportId/edit', 'routes/passports/passport-edit.tsx'), 
]),
]),
] satisfies RouteConfig
