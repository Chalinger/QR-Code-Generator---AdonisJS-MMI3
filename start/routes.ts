/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home').as('home')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

/**
 * Routes réservées aux utilisateurs connectés. Le middleware auth s'exécute
 * avant le contrôleur : sans session valide, redirection vers /login.
 *
 * router.resource() déclare les 7 routes du CRUD (qr_codes.index,
 * qr_codes.create, qr_codes.store, qr_codes.show, qr_codes.edit,
 * qr_codes.update et qr_codes.destroy) : voir "node ace list:routes".
 */
router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
    router.resource('qr-codes', controllers.QrCodes)
  })
  .use(middleware.auth())
