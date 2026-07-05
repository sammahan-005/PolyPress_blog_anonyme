import { HttpContext } from '@adonisjs/core/http'
import Reaction from '#models/reaction'
import Message from '#models/message'

export default class ReactionsController {
  async toggle({ request, response, params }: HttpContext) {
    const visitorToken = request.cookie('visitor_token')
    if (!visitorToken) {
      return response.badRequest({ error: 'Visiteur non identifié' })
    }

    const messageId = params.id
    const { type } = request.only(['type'])

    const allowedTypes = ['like', 'dislike', 'laugh', 'love', 'fire']
    if (!allowedTypes.includes(type)) {
      return response.badRequest({ error: 'Type de réaction invalide' })
    }

    // Vérifier si le message existe
    const message = await Message.find(messageId)
    if (!message) {
      return response.notFound({ error: 'Message introuvable' })
    }

    // Rechercher une réaction existante pour ce visiteur et ce message
    const existingReaction = await Reaction.query()
      .where('messageId', messageId)
      .where('visitorToken', visitorToken)
      .first()

    let action: 'created' | 'updated' | 'removed'

    if (!existingReaction) {
      // Cas 1 : Nouvelle réaction
      await Reaction.create({
        messageId,
        visitorToken,
        type,
      })
      action = 'created'
    } else if (existingReaction.type === type) {
      // Cas 2 : Même réaction cliquée -> On l'enlève
      await existingReaction.delete()
      action = 'removed'
    } else {
      // Cas 3 : Type de réaction différent -> Mise à jour
      existingReaction.type = type
      await existingReaction.save()
      action = 'updated'
    }

    // Récupérer les nouveaux comptes de réactions pour ce message
    const reactions = await Reaction.query().where('messageId', messageId)

    const counts = allowedTypes.reduce(
      (acc, currentType) => {
        acc[currentType] = reactions.filter((r) => r.type === currentType).length
        return acc
      },
      {} as Record<string, number>
    )

    // Trouver l'état actuel de la réaction de ce visiteur
    const userReaction = reactions.find((r) => r.visitorToken === visitorToken)?.type || null

    return response.ok({
      action,
      counts,
      userReaction,
    })
  }
}
