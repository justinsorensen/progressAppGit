//This is the example config.js file. Rename yours "config.js"
module.exports = {
	development: {
		fb: {
			appId: 'APPIDHERE',
			appSecret: 'APPSECRETHERE',
			url: 'http://yoururlhere.com'
			//url: 'http://localhost:5000/'
			//url: 'http://10.0.2.2:5000/'				//android emulator path, must change app settings to match
		},
		dbUrl: 'mongodb://localhost/LOCALMONGODBINSTANCENAME'
	}
}
