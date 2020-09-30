'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {

    return { greeting: 'Hello world in JSON' }
})

Route.on('/').render('welcome')

/****************************************MOBILE ROUTES**************************************************/

Route.group(() => {


    /****************************************** AUTHENTICATION ROUTES **************************************/
    Route.post('/signUp', 'AuthController.signUp')
    Route.post('/login', 'AuthController.login')
    Route.post('/forgetPassword', 'AuthController.forgetPassword')
    Route.post('/resetPassword', 'AuthController.resetPassword')
    Route.post('/socialLogin', 'AuthController.socialLogin')

}).prefix('api/mobile');