/**
 * Author: RAVI DEV SHARMA
 * Created on : 29 SEPTEMBER 2020
 */
'use strict'
const User = use("App/Models/User");
const Token = use("App/Models/Token");
const Database = use("Database");
const Hash = use("Hash");
const Email = use("./EmailController");
const _RL = use('App/Helpers/ResponseLibrary');
const Logger = use('Logger')
const Antl = use('Antl')

class AuthController {

    //User signup with login
    //Ravi Dev Sharma
    //29 September 2020
    async signUp({ request, auth, response }) {
        const email = request.input("email");       
        let userCheck = await User.findBy("email", email);
    
        if (userCheck) {
            return _RL.existConflict(response,Antl.formatMessage('messages.userExists'));
        }
    
        let user = new User();
        user.firstName = request.input("firstName");
        user.lastName = request.input("lastName");
        user.email = email;
        user.password = request.input("password");;    
        user.accountType = request.input("accountType");    
        user.deviceToken = request.input('deviceToken');   
    
        let user1 = await user.save();
        let thisuser = await User.findBy("email", email);
        let accessToken = await auth.generate(thisuser);
        let tokenStore = new Token();
        tokenStore.user_id = thisuser.id;
        tokenStore.token = accessToken.token;
        tokenStore.type = accessToken.type;
        tokenStore = await tokenStore.save();
    
        let data = {
          user: user,
          accessToken: accessToken
        };
        return _RL.recordCreated(response,Antl.formatMessage('messages.register'),data);
      }


      //Email login via mobile app
      //Ravi Dev Sharma
      //29 September 2020
      async login({ request, auth, response }) {
        const email = request.input("email");
        const password = request.input("password");
        try {
          if (await auth.authenticator("user").attempt(email, password)) {
            let user = await User.findBy("email", email);
            let accessToken = await auth.generate(user);
            let data = {
              user: user,
              accessToken: accessToken
            };
            return _RL.apiResponseOk(response,Antl.formatMessage('messages.login'),data);
          }
        } catch (e) {
          console.log(e);
          return _RL.apiBadRequest(response,Antl.formatMessage('messages.Invalid'));
        }
      }

      //Forget password for mobile app
      async forgetPassword({auth,request,response}){
        try{
            let userDetails=await User.findBy('email',request.body.email);
            let buffer = require('crypto').randomBytes(24);
            let token = buffer.toString('hex');
            userDetails.passwordToken = token;
            await userDetails.save();

            Email.sendEmail(request.body.email,token,userDetails.id);
            return _RL.apiResponseOk(response,Antl.formatMessage('messages.emailSent'));      
        }
        catch(e){
            console.log(e);
            return _RL.notFound(response,Antl.formatMessage('messages.accountNotFound'));
        }
        
      }


      //socialLogin
      //Facebook, Google login
      async socialLogin({ request, auth, response }) {

        let userCheck = await User.findBy("socialId", request.body.socialId);
    
        if (userCheck){
            let accessToken = await auth.generate(userCheck)
            let data = {
                user: userCheck,
                accessToken: accessToken
            };
            return _RL.apiResponseOk(response,Antl.formatMessage('messages.login'),data);
        }else{
            let user = new User();
            user.firstName = request.body.firstName;
            user.lastName = request.body.lastName;
            user.email = request.body.email;
            user.socialId = request.body.socialId;
            user.gender = request.body.gender
            user.deviceType = request.body.deviceType
            user.accountType = request.body.accountType
            user.deviceToken = request.body.deviceToken
            if(request.body.photo){
              user.photo = request.body.photo
            } else {
              user.photo="https://icons-for-free.com/iconfiles/png/512/avatar+person+profile+user+icon-1320166578424287581.png";
            }
            await user.save();
            let userData = await User.findBy("socialId", socialId);
            let accessToken = await auth.generate(userData);
            let tokenStore = new Token();
            tokenStore.user_id = userData.id;
            tokenStore.token = accessToken.token;
            tokenStore.type = accessToken.type;
            await tokenStore.save();
            let data = {
                 user: user,
                 accessToken: accessToken
            };
            return _RL.recordCreated(response,Antl.formatMessage('messages.login'),data);
        }
    }

    //Api calling from web page of reset password
    async resetPassword({auth,request,response}){
        try{
            // let password = await Hash.make(request.body.newPassword);
            let userDetails=await User.find(request.body.id);
            if(request.body.token && userDetails.passwordToken == request.body.token){
                userDetails.password = request.body.newPassword;
                userDetails.passwordToken = null;
                await userDetails.save();
                return _RL.apiResponseOk(response,Antl.formatMessage('messages.passwordReset'));
            }
            else{
                return _RL.unauthorized(response,Antl.formatMessage('messages.unauthorized'));
            }    
        }
        catch(e){
            console.log(e)
            return _RL.unauthorized(response,Antl.formatMessage('messages.unauthorized'));
        }    
    }
}

module.exports = AuthController
