import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { DateTime } from 'luxon'

export default class SundayRestrictionMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // Cible : Dimanche 12 Juillet 2026 à 08h00 (UTC+1, heure du Cameroun)
    const targetDate = DateTime.fromISO('2026-07-12T08:00:00+01:00')
    const now = DateTime.now()

    if (now < targetDate) {
      return ctx.response.redirect().toPath('/messages/waiting')
    }

    return next()
  }
}
