import { HttpContext } from '@adonisjs/core/http'
import Message from '#models/message'

export default class AdminController {
  /**
   * Render the admin dashboard showing messages with status and stats.
   * Can be filtered to show only disliked messages.
   */
  async index({ request, view }: HttpContext) {
    const filter = request.input('filter', 'all')

    // Fetch statistics for the dashboard cards
    const totalResult = await Message.query().count('* as total')
    const activeResult = await Message.query().where('isActive', true).count('* as total')
    const inactiveResult = await Message.query().where('isActive', false).count('* as total')
    const dislikedResult = await Message.query()
      .whereHas('reactions', (q) => q.where('type', 'dislike'))
      .count('* as total')

    const stats = {
      total: Number(totalResult[0].$extras.total || 0),
      active: Number(activeResult[0].$extras.total || 0),
      inactive: Number(inactiveResult[0].$extras.total || 0),
      disliked: Number(dislikedResult[0].$extras.total || 0),
    }

    const query = Message.query().preload('reactions')

    if (filter === 'disliked') {
      // Find messages that have at least one reaction of type 'dislike'
      query.whereHas('reactions', (q) => {
        q.where('type', 'dislike')
      })
    }

    const messages = await query.orderBy('createdAt', 'desc')

    return view.render('pages/admin/index', { messages, filter, stats })
  }

  /**
   * Toggle the isActive status of a message.
   */
  async toggleActive({ params, response, session }: HttpContext) {
    const message = await Message.findOrFail(params.id)
    message.isActive = !message.isActive
    await message.save()

    const statusText = message.isActive ? 'réactivé' : 'désactivé'
    session.flash('success', `Le message #${message.id} a été ${statusText} avec succès.`)
    return response.redirect().back()
  }

  /**
   * Delete a message.
   */
  // async destroy({ params, response, session }: HttpContext) {
  //   const message = await Message.findOrFail(params.id)
  //   await message.delete()

  //   session.flash('success', `Le message #${message.id} a été définitivement supprimé.`)
  //   return response.redirect().back()
  // }
}
