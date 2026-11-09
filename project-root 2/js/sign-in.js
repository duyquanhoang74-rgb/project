// Nếu vừa đăng ký xong thì hiện thông báo thành công
let flash = sessionStorage.getItem('flash');
if (flash !== null) {
  sessionStorage.removeItem('flash');
  showMessage('login-toast', flash);
}

getEl('sign-in-form').addEventListener('submit', function (event) {
  event.preventDefault();

  let email = getEl('email').value.trim();
  let password = getEl('password').value;
  let errors = [];

  if (email === '') {
    errors.push('Email must not be empty');
  }
  if (password === '') {
    errors.push('Password must not be empty');
  }
  if (errors.length > 0) {
    showMessage('login-validation', errors.join('<br>'));
    return;
  }

  // Tìm user có đúng email và mật khẩu
  let users = getUsers();
  let found = null;
  for (let i = 0; i < users.length; i++) {
    if (users[i].email.toLowerCase() === email.toLowerCase() && users[i].password === password) {
      found = users[i];
    }
  }
  if (found === null) {
    showMessage('login-error', 'Email or password does not exist');
    return;
  }

  // Ghi nhớ đăng nhập: tick "Remember me" thì lưu lâu dài, không tick thì chỉ lưu đến khi đóng tab
  if (getEl('save-loggin-checkbox').checked) {
    localStorage.setItem('currentUser', found.email);
  } else {
    sessionStorage.setItem('currentUser', found.email);
  }
  showMessage('login-toast', 'Sign in successful!');
  setTimeout(function () {
    window.location.href = './dashboard.html';
  }, 1000);
});
