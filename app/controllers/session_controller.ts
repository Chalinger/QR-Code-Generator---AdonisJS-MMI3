import User from '#models/user'
import { loginValidator } from '#validators/user'
import { errors } from '@adonisjs/auth'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * SessionController handles user authentication and session management.
 * It provides methods for displaying the login page, authenticating users,
 * and logging out.
 */
export default class SessionController {
  /**
   * Display the login page
   */
  async create({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  /**
   * Authenticate user credentials and create a new session
   */
  async store({ request, auth, session, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    /**
     * verifyCredentials() lève E_INVALID_CREDENTIALS avec un message en
     * anglais. On n'intercepte que cette erreur, pour afficher un message
     * en français et conserver l'e-mail saisi ; toute autre erreur est
     * relancée.
     */
    let user: User
    try {
      user = await User.verifyCredentials(email, password)
    } catch (error) {
      if (error instanceof errors.E_INVALID_CREDENTIALS) {
        session.flashExcept(['_csrf', '_method', 'password'])
        session.flash('error', 'Adresse e-mail ou mot de passe incorrect.')
        return response.redirect().toRoute('session.create')
      }
      throw error
    }

    await auth.use('web').login(user)
    response.redirect().toRoute('qr_codes.index')
  }

  /**
   * Log out the current user and destroy their session
   */
  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    response.redirect().toRoute('session.create')
  }
}
