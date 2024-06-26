const axios = require('axios');

const smsSend = (phone, msg) => {
    if((phone && msg) && phone != 'undefined') {
        let data = {
          userName: "mohaned.taj",
          numbers: phone,
          userSender: "Essaly-OTP",
          apiKey: "9c73ec393b285fb46ccdd7b9cd5c24c6",
          msg: msg,
        };
        return axios.post('https://www.msegat.com/gw/sendsms.php', data)

    }
};

module.exports = { smsSend };

// for production use only **********************

// SMS_API_KEY_Production
// SMS_Sender_Id_Production,
// SMS_URL_Production