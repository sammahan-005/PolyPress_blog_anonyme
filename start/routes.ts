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

router.get('/', [controllers.Messages, 'home']).as('home')

router.get('messages', [controllers.Messages, 'index']).as('messages.index')
router.get('messages/create', [controllers.Messages, 'create']).as('messages.create')
router.post('messages', [controllers.Messages, 'store']).as('messages.store')
router.get('messages/:id', [controllers.Messages, 'show']).as('messages.show')
router.post('messages/:id/react', [controllers.Reactions, 'toggle']).as('messages.react')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    // router.get('login', [controllers.Session, 'create'])
    // router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])

    router.get('admin', [controllers.Admin, 'index']).as('admin.index')
    router.post('admin/messages/:id/toggle-active', [controllers.Admin, 'toggleActive']).as('admin.messages.toggleActive')
    // router.post('admin/messages/:id/delete', [controllers.Admin, 'destroy']).as('admin.messages.delete')
  })
  .use(middleware.auth())
