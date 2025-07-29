import { createMiddleware } from 'hono/factory'

export const authMiddleware = createMiddleware(async (c, next) => {

 
  await next()
})