import { qrCodeValidator } from '#validators/qr_code'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * QrCodesController gère le CRUD des QR codes de l'utilisateur connecté.
 *
 * Règle de sécurité : on ne cherche jamais un QR code avec QrCode.find(),
 * qui chercherait parmi ceux de tout le monde. On passe toujours par la
 * relation user.related('qrCodes') : l'id d'un QR code appartenant à
 * quelqu'un d'autre ne trouve rien et firstOrFail() répond par une 404.
 */
export default class QrCodesController {
  /**
   * Historique de l'utilisateur, du plus récent au plus ancien
   */
  async index({ auth, view }: HttpContext) {
    const user = auth.getUserOrFail()

    const qrCodes = await user
      .related('qrCodes')
      .query()
      .orderBy('created_at', 'desc')
      .orderBy('id', 'desc')

    return view.render('pages/qr_codes/index', { qrCodes })
  }

  /**
   * Formulaire de création
   */
  async create({ view }: HttpContext) {
    return view.render('pages/qr_codes/create')
  }

  /**
   * Valide puis enregistre un nouveau QR code
   */
  async store({ request, auth, session, response }: HttpContext) {
    const payload = await request.validateUsing(qrCodeValidator)

    // Passer par la relation remplit user_id avec l'utilisateur connecté :
    // on ne fait jamais confiance à un user_id venu du formulaire.
    const user = auth.getUserOrFail()
    const qrCode = await user.related('qrCodes').create(payload)

    session.flash('success', 'QR code créé.')
    return response.redirect().toRoute('qr_codes.show', [qrCode.id])
  }

  /**
   * Affiche un QR code en grand
   */
  async show({ params, auth, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const qrCode = await user.related('qrCodes').query().where('id', params.id).firstOrFail()

    return view.render('pages/qr_codes/show', { qrCode })
  }

  /**
   * Formulaire de modification prérempli
   */
  async edit({ params, auth, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const qrCode = await user.related('qrCodes').query().where('id', params.id).firstOrFail()

    return view.render('pages/qr_codes/edit', { qrCode })
  }

  /**
   * Valide puis enregistre les modifications
   */
  async update({ params, request, auth, session, response }: HttpContext) {
    // On cherche le QR code AVANT de valider : l'id d'un autre utilisateur
    // donne une 404 même si les données envoyées sont invalides.
    const user = auth.getUserOrFail()
    const qrCode = await user.related('qrCodes').query().where('id', params.id).firstOrFail()

    const payload = await request.validateUsing(qrCodeValidator)
    await qrCode.merge(payload).save()

    session.flash('success', 'QR code modifié.')
    return response.redirect().toRoute('qr_codes.show', [qrCode.id])
  }

  /**
   * Supprime le QR code
   */
  async destroy({ params, auth, session, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const qrCode = await user.related('qrCodes').query().where('id', params.id).firstOrFail()

    await qrCode.delete()

    session.flash('success', 'QR code supprimé.')
    return response.redirect().toRoute('qr_codes.index')
  }
}
