// ===== Các hàm dùng chung cho mọi trang =====

// Lấy phần tử HTML theo id (viết tắt cho đỡ gõ dài)
function getEl(id) {
  return document.getElementById(id);
}

// ---------- Đọc / ghi danh sách user trong localStorage ----------
function getUsers() {
  let data = localStorage.getItem('userList');
  if (data === null) {
    return [];
  }
  return JSON.parse(data); // chuỗi JSON -> mảng
}

function saveUsers(users) {
  localStorage.setItem('userList', JSON.stringify(users)); // mảng -> chuỗi JSON
}

// ---------- Tạo user code mới (U001, U002...) ----------
function createUserCode(users) {
  let max = 0;
  for (let i = 0; i < users.length; i++) {
    let number = Number(users[i].usercode.substring(1)); // 'U007' -> 7
    if (number > max) {
      max = number;
    }
  }
  let next = String(max + 1);
  while (next.length < 3) {
    next = '0' + next; // 8 -> '008'
  }
  return 'U' + next;
}

// ---------- Kiểm tra dữ liệu (regex.test(chuỗi) trả về true / false) ----------
function isValidEmail(email) {
  let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regexEmail.test(email);
}

// Trả về danh sách lỗi của mật khẩu (dùng cho trang Add / Edit user)
function checkPassword(password) {
  let errors = [];
  if (password === '') {
    errors.push('Password must not be empty');
  } else if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  return errors;
}

// Email đã có người dùng chưa? (ignoreCode: bỏ qua chính user đang sửa)
function emailExists(users, email, ignoreCode) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].usercode !== ignoreCode && users[i].email.toLowerCase() === email.toLowerCase()) {
      return true;
    }
  }
  return false;
}

// Chống chèn mã HTML vào bảng
function escapeHtml(text) {
  text = String(text);
  text = text.replace(/&/g, '&amp;');
  text = text.replace(/</g, '&lt;');
  text = text.replace(/>/g, '&gt;');
  text = text.replace(/"/g, '&quot;');
  return text;
}

// ---------- Thông báo (khung #msg) ----------
let hideTimer;

function showMessage(boxId, content) {
  let msg = getEl('msg');
  // 1. Ẩn tất cả các khối thông báo
  for (let i = 0; i < msg.children.length; i++) {
    msg.children[i].classList.add('hidden');
  }
  // 2. Hiện khối cần dùng và ghi nội dung vào
  let box = getEl(boxId);
  box.classList.remove('hidden');
  let contentEl = box.querySelector('[data-content]');
  if (contentEl !== null) {
    contentEl.innerHTML = content;
  } else {
    box.innerHTML = content;
  }
  // 3. Thêm class "show" để CSS trượt khung vào, 3 giây sau tự ẩn
  msg.classList.add('show');
  clearTimeout(hideTimer);
  hideTimer = setTimeout(hideMessage, 3000);
}

function hideMessage() {
  getEl('msg').classList.remove('show');
}

// Nút đóng (X) thông báo, nếu trang có
let closeButton = document.querySelector('.close-btn, .fa-circle-xmark');
if (closeButton !== null) {
  closeButton.addEventListener('click', hideMessage);
}

// ---------- Ẩn / hiện mật khẩu ----------
function setupEyeIcons() {
  let eye = document.querySelector('.fa-eye');
  let eyeSlash = document.querySelector('.fa-eye-slash');
  let input = getEl('password');

  eye.addEventListener('click', function () {
    input.type = 'text';
    eye.style.display = 'none';
    eyeSlash.style.display = 'block';
  });
  eyeSlash.addEventListener('click', function () {
    input.type = 'password';
    eyeSlash.style.display = 'none';
    eye.style.display = 'block';
  });
}

// ---------- Đăng nhập / đăng xuất ----------
function checkLogin() {
  let a = localStorage.getItem('currentUser');
  let b = sessionStorage.getItem('currentUser');
  if (a === null && b === null) {
    window.location.href = './sign-in.html'; // chưa đăng nhập thì đưa về trang Sign in
  }
}

function signOut() {
  localStorage.removeItem('currentUser');
  sessionStorage.removeItem('currentUser');
  window.location.href = './sign-in.html';
}

// ---------- Form Add / Edit user dùng chung ----------
function getFormData() {
  return {
    fullname: getEl('fullname').value.trim(),
    email: getEl('email').value.trim(),
    username: getEl('username').value.trim(),
    password: getEl('password').value,
    role: getEl('role').value,
    birthday: getEl('birthday').value,
    status: document.querySelector('input[name="status"]:checked').value,
    description: getEl('description').value.trim()
  };
}

// currentCode: user code đang sửa ('' nếu là thêm mới)
function checkUserForm(data, users, currentCode) {
  let errors = [];
  if (data.fullname === '') {
    errors.push('Full name must not be empty');
  }
  if (data.email === '') {
    errors.push('Email must not be empty');
  } else if (!isValidEmail(data.email)) {
    errors.push('Email is not in a valid format');
  } else if (emailExists(users, data.email, currentCode)) {
    errors.push('Email already exists');
  }
  if (data.username === '') {
    errors.push('Username must not be empty');
  }
  let passwordErrors = checkPassword(data.password);
  for (let i = 0; i < passwordErrors.length; i++) {
    errors.push(passwordErrors[i]);
  }
  return errors;
}

function showFormErrors(boxId, errors) {
  let html = '';
  for (let i = 0; i < errors.length; i++) {
    html = html + '<div><i class="fa-solid fa-circle-exclamation"></i>' + errors[i] + '</div>';
  }
  showMessage(boxId, html);
}
