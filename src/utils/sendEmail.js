const { sendEmail } = require('../helpers/sendEmail.helper');

const sendVerificationEmail = async (user, origin) => {
  const verifyUrl = `${origin}/verify-email?token=${user.verificationToken.token}`;
  const message = `<p>Please click the below link to verify your email address:</p>
                 <p><a href="${verifyUrl}">${verifyUrl}</a></p>`;

  await sendEmail({
    to: user.email,
    subject: 'Starter template nodejs - Verify Email',
    html: `<h4>Verify Email</h4>
             <p>Thanks for registering!</p>
             ${message}`,
  });
};

const sendPasswordResetEmail = async (user, origin) => {
  const resetUrl = `${origin}/reset-password?token=${user.resetPasswordToken.token}`;
  const message = `<p>Vui lòng click đường link bên dưới để cập nhật mật khẩu, link sẽ hết hạn trong vòng 1 ngày:</p>
               <p><a href="${resetUrl}">${resetUrl}</a></p>`;

  await sendEmail({
    to: user.email,
    subject: 'kienthuctnmt.com - Đặt lại mật khẩu',
    html: `<h4>Đặt lại mật khẩu</h4>
             ${message}`,
  });
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
