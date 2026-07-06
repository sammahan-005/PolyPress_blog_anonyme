import vine from '@vinejs/vine'

/**
 * Validator utilisé lors de la soumission d'un message anonyme.
 */
export const createMessageValidator = vine.create({
    content: vine.string().trim().minLength(2).maxLength(2000),
  })
