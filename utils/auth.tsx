export const validatePasswordStrength = (password: string) => {
  const minLength = /.{8,}/;
  const hasUpperCase = /[A-Z]/;
  const hasLowerCase = /[a-z]/;
  const hasNumber = /[0-9]/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

  if (!minLength.test(password)) {
    return "Mật khẩu phải có ít nhất 8 ký tự.";
  }
  if (!hasUpperCase.test(password)) {
    return "Mật khẩu phải chứa ít nhất 1 chữ hoa.";
  }
  if (!hasLowerCase.test(password)) {
    return "Mật khẩu phải chứa ít nhất 1 chữ thường.";
  }
  if (!hasNumber.test(password)) {
    return "Mật khẩu phải chứa ít nhất 1 số.";
  }
  if (!hasSpecialChar.test(password)) {
    return "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt.";
  }

  return;
};
export const validateUsername = (username: string) => {
  const minLength = /^.{4,}$/;
  const validChars = /^[a-zA-Z0-9_]+$/;
  const startsWithLetter = /^[a-zA-Z]/;

  if (!minLength.test(username))
    return "Tên đăng nhập phải có ít nhất 4 ký tự.";
  if (!validChars.test(username))
    return "Chỉ cho phép chữ, số và dấu gạch dưới (_).";
  if (!startsWithLetter.test(username))
    return "Tên đăng nhập phải bắt đầu bằng chữ cái.";

  return; // hợp lệ
};
