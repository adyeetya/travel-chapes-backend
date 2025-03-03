require('../../config/config')
import axios from 'axios';
const SMS_API_KEY = global.gConfig.smsCredentials.SMS_API_KEY;
const SENDER_ID = global.gConfig.smsCredentials.SENDER_ID;
const ENTITY_ID = global.gConfig.smsCredentials.ENTITY_ID;
const TEMPLATE_ID = global.gConfig.smsCredentials.TEMPLATE_ID;
const SERVICE_USER_ID = global.gConfig.smsCredentials.SERVICE_USER_ID;
const sendMobileOtp = async (phoneNumber, generatedOtp) => {
    // const TEXT_MSG = `Dear User, Your one time password for the mobile number verification on YESNMORE is ${generatedOtp}. Please do not share this code with anyone.`;
    const SMS_API =`https://amazesms.in/api/pushsms?user=${SERVICE_USER_ID}&authkey=${SMS_API_KEY}&sender=${SENDER_ID}&mobile=${phoneNumber}&text=Dear User, Your otp for Login/Signup on travel chapes is ${generatedOtp}&entityid=${ENTITY_ID}&templateid=${TEMPLATE_ID}`;

    // console.log(+phoneNumber, generatedOtp);
    try {
        const response = await axios.get(SMS_API);
        // console.log(">>>>>>>>>",response);
        
        if (response.status === 200) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = sendMobileOtp;


//https://amazesms.in/api/pushsms?user=travelchapes&authkey=92Z5BNRsJZz&sender=TRVLCP&mobile=9997028428&text=Dear User, Your otp for Login/Signup on travel chapes is 1234&entityid=1001935047473311510&templateid=1007721353040671028