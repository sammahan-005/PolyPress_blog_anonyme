import { HttpContext } from '@adonisjs/core/http'
import Message from '#models/message'
import Reaction from '#models/reaction'

export default class MessagesController {
  async index({ view }: HttpContext) {
    const messages = await Message.query()
      .where('isActive', true)
      .preload('reactions')
      .orderBy('createdAt', 'desc')

    return view.render('pages/messages/index', { messages })
  }

  async create({ view }: HttpContext) {
    return view.render('pages/messages/create')
  }

  async store({ request, response }: HttpContext) {
    const content = request.input('content')
    if (!content || content.trim().length === 0) {
      return response.badRequest('Le message ne peut pas être vide')
    }

    await Message.create({ content })
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
