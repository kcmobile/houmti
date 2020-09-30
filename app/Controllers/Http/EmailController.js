'use strict'
const AWS = require('aws-sdk')
const Env = use('Env')

class EmailController {

    static async sendEmail(toEmail, token, id) {
		console.log(toEmail, ',', token, ',', id);
        let url = `${Env.get('RESET_PASSWORD_LINK')}?token=${token}&id=${id}`;
      
		AWS.config.update({
            	accessKeyId: Env.get('AWS_ACCESS_KEY'),
            	secretAccessKey: Env.get('AWS_SECRET_KEY'),
            	region:Env.get('AWS_REGION'),
            });
		const ses = new AWS.SES({ apiVersion: '2010-12-01' });
		const params = {
			Destination: {
				ToAddresses: [toEmail], // Email address/addresses that you want to send your email
			},
			//ConfigurationSetName: <<ConfigurationSetName>>,
			Message: {
				Body: {
					Html: {
						// HTML Format of the email
						Charset: 'UTF-8',
						Data: `			  
							<!-- start body -->
							<table border="0" cellpadding="0" cellspacing="0" width="100%">						  
							  <!-- start hero -->
							  <tr>
								<td align="center" bgcolor="#e9ecef">
								  <!--[if (gte mso 9)|(IE)]>
								  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
								  <tr>
								  <td align="center" valign="top" width="600">
								  <![endif]-->
								  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
									<tr>
									  <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
										<h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Reset Your Password</h1>
									  </td>
									</tr>
								  </table>
								  <!--[if (gte mso 9)|(IE)]>
								  </td>
								  </tr>
								  </table>
								  <![endif]-->
								</td>
							  </tr>
							  <!-- end hero -->						  
							  <!-- start copy block -->
							  <tr>
								<td align="center" bgcolor="#e9ecef">
								  <!--[if (gte mso 9)|(IE)]>
								  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
								  <tr>
								  <td align="center" valign="top" width="600">
								  <![endif]-->
								  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
						  
									<!-- start copy -->
									<tr>
									  <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
										<p style="margin: 0;">Tap the button below to reset your customer account password. If you didn't request a new password, you can safely delete this email.</p>
									  </td>
									</tr>
									<!-- end copy -->
						  
									<!-- start button -->
									<tr>
									  <td align="left" bgcolor="#ffffff">
										<table border="0" cellpadding="0" cellspacing="0" width="100%">
										  <tr>
											<td align="center" bgcolor="#ffffff" style="padding: 12px;">
											  <table border="0" cellpadding="0" cellspacing="0">
												<tr>
												  <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
													<a href="${url}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Do Something Sweet</a>
												  </td>
												</tr>
											  </table>
											</td>
										  </tr>
										</table>
									  </td>
									</tr>
									<!-- end button -->      
						  
								  </table>
								  <!--[if (gte mso 9)|(IE)]>
								  </td>
								  </tr>
								  </table>
								  <![endif]-->
								</td>
							  </tr>
							  <!-- end copy block -->					  
							</table>
							<!-- end body -->`,
					},
					// Text: {
					// 	Charset: 'UTF-8',
					// 	Data: 'Hello Charith Sample description time 1517831318946',
					// },
				},
				Subject: {
					Charset: 'UTF-8',
					Data: 'Reset Your Houmti App Password.',
				},
			},
			Source: 'support@abobaguide.com',
		};
       // console.log(params.Message.Body.Html.Data)
		const sendEmail = ses.sendEmail(params).promise();

		sendEmail
			.then(data => {
				console.log('email submitted to SES', data);
			})
			.catch(error => {
				console.log(error);
			});
	}
}

module.exports = EmailController
