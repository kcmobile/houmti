'use strict'
var apn = require('apn');
var FCM = require('fcm-push');
const Env = use('Env')
const ANDROID_SERVER_KEY = Env.get('ANDROID_SERVER_KEY')
const P8_KEY_ID = Env.get('P8_KEY_ID')
const P8_TEAM_ID = Env.get('P8_TEAM_ID')
class NotificationLibrary {


	// async addNotification(data) {
	// 	var uuidv4 = uuid();
	// 	const notification = new Notification()
	// 	notification.id = uuidv4;
	// 	notification.title = data.title;
	// 	notification.description = data.description;
	// 	notification.rel_id = data.rel_id;
	// 	notification.type = data.type;
	// 	return await notification.save();
	// }

	async sendIosPush(data) {
		var options = {
			token: {
				key: "./AuthKey_77R373JH9D.p8",
				keyId: P8_KEY_ID,
				teamId: P8_TEAM_ID
			},
			production: false
		}
		var apnProvider = new apn.Provider(options);
		var note = new apn.Notification();
		let deviceTokens = data.to;
		note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
		note.badge = 0;
		if (data.priority != 0)
			note.sound = "ping.aiff";
		note.alert = data.alert;
		note.title = data.title;
		note.type = data.type;
		note.payload = { data: data.body };
		note.topic = "com.audio.reader";
		var res = await apnProvider.send(note, deviceTokens);
		return res;
	}

	async sendAndroidPush(data) {
		try {
			var fcm = new FCM(ANDROID_SERVER_KEY);
			var res = await fcm.send(data);
			return res;
		} catch (error) {
			return error;
		}
	}
}

let respObj = new NotificationLibrary();
module.exports = respObj;