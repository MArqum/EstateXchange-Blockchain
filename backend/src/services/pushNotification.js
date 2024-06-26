const axios = require('axios');
const providerUrl = process.env.pushNotificationProviderUrl
const providerKey = `key=${process.env.pushNotificationProviderKey}`;
const config = { headers: { 'Authorization': providerKey } }

const notification = async (deviceToken, notification, data) => {
    try {
        let info = {};
        if(Array.isArray(deviceToken)) {
            info['registration_ids'] = deviceToken;
        } else {
            info['to'] = deviceToken;
        }

        if(data) info['data'] = data;
        info['notification'] = notification;

        await axios.post(providerUrl, info, config);
        return true;
    } catch (err) {
        return false;
    }
};

module.exports = { notification };