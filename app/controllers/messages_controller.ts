import { HttpContext } from '@adonisjs/core/http'
import Message from '#models/message'
import Reaction from '#models/reaction'
import { createMessageValidator } from '#validators/message'

export default class MessagesController {
  async index({ request, view }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 20

    const messages = await Message.query()
      .where('isActive', true)
      .preload('reactions')
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)

    messages.baseUrl('/messages')

    return view.render('pages/messages/index', { messages })
  }

  async create({ response, view }: HttpContext) {
    const isClosed = new Date() >= new Date('2026-07-12T23:00:00')
    if (isClosed) {
      return response.redirect().toPath('/')
    }
    return view.render('pages/messages/create')
  }

  async waiting({ view }: HttpContext) {
    return view.render('pages/messages/waiting')
  }

  async store({ request, response, session }: HttpContext) {
    const isClosed = new Date() >= new Date('2026-07-12T23:00:00')
    if (isClosed) {
      session.flash('warning', 'Le confessionnal est définitivement fermé. Merci pour votre participation !')
      return response.redirect().toPath('/')
    }

    const payload = await request.validateUsing(createMessageValidator)

    // Déduplication : rejeter si un message identique a été soumis dans les 2 dernières minutes
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000)
    const duplicate = await Message.query()
      .where('content', payload.content)
      .where('createdAt', '>=', twoMinutesAgo)
      .first()

    if (duplicate) {
      session.flash('warning', 'Ce message a déjà été soumis. Merci de patienter.')
      return response.redirect().toPath('/messages')
    }

    await Message.create({ content: payload.content })
    session.flash('success', 'Votre message a bien été soumis.')
    return response.redirect().toPath('/messages')
  }

  async show({ params, view }: HttpContext) {
    const message = await Message.query()
      .preload('reactions')
      .where('id', params.id)
      .where('isActive', true)
      .firstOrFail()

    return view.render('pages/messages/show', { message })
  }

  async home({ view }: HttpContext) {
    // 1. Nombre total de messages publiés actifs
    const messagesCountResult = await Message.query().where('isActive', true).count('* as total')
    const messagesCount = Number(messagesCountResult[0].$extras.total || 0)

    // 2. Nombre total de réactions générées sur les messages actifs
    const reactionsCountResult = await Reaction.query()
      .whereIn('messageId', Message.query().select('id').where('isActive', true))
      .count('* as total')
    const reactionsCount = Number(reactionsCountResult[0].$extras.total || 0)

    // 3. Nombre de lecteurs uniques (ayant au moins réagi une fois) sur les messages actifs
    const visitorsCountResult = await Reaction.query()
      .whereIn('messageId', Message.query().select('id').where('isActive', true))
      .countDistinct('visitor_token as total')
    const visitorsCount = Number(visitorsCountResult[0].$extras.total || 0)

    return view.render('pages/home', {
      stats: {
        messagesCount,
        reactionsCount,
        visitorsCount
      }
    })
  }
}
