const transporter = require('../../config/transporter');

const sendEmail = async ({ to, subject, text, html }) => {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    text,
    // html
  });
};

const sendVerificationEmail = async (user, verifyMethod, token, otp) => {
  const emailOptions = {
    to: user.email,
    subject: 'Verify your email',
    text:
      verifyMethod === 'link'
        ? `Click this link to verify your email: ${process.env.FRONTEND_URL}/api/v1/verify-email?token${token}$email=${user.email}`
        : `Your OTP for email verification is: ${otp}`,
  };

  await sendEmail(emailOptions);
};

module.exports = { sendVerificationEmail };
