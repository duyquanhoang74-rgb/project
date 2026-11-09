checkLogin();
setupEyeIcons();

// Lấy user code từ địa chỉ trang: edit-user.html?usercode=U001
let params = new URLSearchParams(window.location.search);
let code = params.get('usercode');

// Tìm user cần sửa
let users = getUsers();
let user = null;
for (let i = 0; i < users.length; i++) {
  if (users[i].usercode === code) {
    user = users[i];
  }
}

if (user === null) {
  window.location.href = './dashboard.html'; // không tìm thấy thì quay về
} else {
  // Điền thông tin cũ vào form
  getEl('usercode').value = user.usercode;
  getEl('email').value = user.email;
  getEl('username').value = user.username;
  getEl('password').value = user.password;
  getEl('role').value = user.role;
  getEl('birthday').value = user.birthday;
  getEl('description').value = user.description;
  if (user.fullname !== undefined) {
    getEl('fullname').value = user.fullname;
  }
  if (user.status === 'Active') {
    getEl('st-active').checked = true;
  } else {
    getEl('st-deactive').checked = true;
  }
}

getEl('edit-user-form').addEventListener('submit', function (event) {
  event.preventDefault();

  let allUsers = getUsers();
  let data = getFormData();
  let errors = checkUserForm(data, allUsers, code);

  if (errors.length > 0) {
    showFormErrors('edit-error', errors);
    return;
  }

  // Tìm lại user trong danh sách mới nhất và cập nhật từng thông tin
  for (let j = 0; j < allUsers.length; j++) {
    if (allUsers[j].usercode === code) {
      allUsers[j].fullname = data.fullname;
      allUsers[j].email = data.email;
      allUsers[j].username = data.username;
      allUsers[j].password = data.password;
      allUsers[j].role = data.role;
      allUsers[j].birthday = data.birthday;
      allUsers[j].status = data.status;
      allUsers[j].description = data.description;
    }
  }
  saveUsers(allUsers);
  showMessage('edit-toast', 'User updated successfully');
  setTimeout(function () {
    window.location.href = './dashboard.html';
  }, 1000);
});

getEl('back-btn').addEventListener('click', function () {
  window.location.href = './dashboard.html';
});
getEl('sign-out').addEventListener('click', signOut);
