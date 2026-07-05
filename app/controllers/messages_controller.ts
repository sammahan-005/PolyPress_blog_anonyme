import { HttpContext } from '@adonisjs/core/http'
import Message from '#models/message'

export default class MessagesController {
  async index({ view }: HttpContext) {
    const messages = await Message.query()
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
    return response.redirect().toRoute('messages.index')
  }
}
