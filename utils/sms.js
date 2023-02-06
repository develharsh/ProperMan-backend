const AWS = require("aws-sdk");
const awsCredentials = {
  accessKeyId: process.env.NODE_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NODE_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.NODE_APP_AWS_REGION,
};
AWS.config.update(awsCredentials);

const sendOtp = (data, otp) => {
  const sns = new AWS.SNS();
  var message =
    "Hi\nThe OTP for verification on ProperMan is " +
    otp;
  var params = {
    PhoneNumber: data.phone_number,
    Message: message,
  };

  sns.publish(params, (err, data) => {
    if (err) console.log(err);
    else console.log(data);
  });
};

module.exports = { sendOtp };