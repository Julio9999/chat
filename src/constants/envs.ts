export const Envs = {
    JWT_SECRET: process.env.JWT_SECRET || 'default_secret',
    JWT_DURATION_SECONDS: process.env.JWT_DURATION_SECONDS || 60,
    COOKIE_DURATION: process.env.JWT_DURATION_SECONDS || 60,
    COMMON_DOMAIN: process.env.COMMON_DOMAIN || 'localhost',
}