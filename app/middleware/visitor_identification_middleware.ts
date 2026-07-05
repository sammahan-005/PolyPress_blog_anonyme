import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import crypto from 'node:crypto'

export default class VisitorIdentificationMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    let visitorToken = ctx.request.cookie('visitor_token')

    if (!visitorToken) {
      visitorToken = crypto.randomUUID()
      // Set visitor_token cookie for 1 year
      ctx.response.cookie('visitor_token', visitorToken, {
        maxAge: '1 year',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })
    }

    if (ctx.view) {
      ctx.view.share({ visitorToken })
    }

    return next()
  }
}
