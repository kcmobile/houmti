'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('socialId',255).nullable().unique()
      table.string('email', 254).nullable().unique()
      table.string('password', 255).nullable()
      table.string('firstName', 80).nullable()
      table.string('lastName', 80).nullable()
      table.string('photo',255).nullable()
      table.string('language',255).nullable()
      table.string('passwordToken', 255).nullable()
      table.string('phoneNumber',255).nullable()
      table.enu('gender',['MALE','FEMALE','OTHER']).nullable().comment('MALE,FEMALE,OTHER')
      table.enu('deviceType',['IOS','ANDROID']).nullable().comment('IOS,ANDROID')
      table.string('deviceToken',255).nullable();
      table.enu('notificationStatus',[1,0]).nullable().defaultTo(1).comment('1=>Active,0=>inactive')
      table.enu('accountStatus',[1,0]).nullable().defaultTo(1).comment('1=>Active,0=>inactive')
      table.enu('accountType',['APPLE','FACEBOOK','GOOGLE','MOBILE']).nullable().comment('APPLE,FACEBOOK,GOOGLE,MOBILE')      
      table.bigInteger('timestamp',255)
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
