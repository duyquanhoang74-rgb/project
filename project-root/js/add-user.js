checkLogin();
setupEyeIcons();

// Hiện sẵn user code mới (ô này chỉ đọc)
getEl('usercode').value = createUserCode(getUsers());

getEl('add-new-user-form').addEventListener('submit', function (event) {
  event.preventDefault();

  let users = getUsers();
  let data = getFormData();
  let errors = checkUserForm(data, users, '');

  if (errors.length > 0) {
    showFormErrors('add-error', errors);
    return;
  }

  data.usercode = createUserCode(users);
  users.push(data);
  saveUsers(users);
  showMessage('add-toast', 'User added successfully');
  setTimeout(function () {
    window.location.href = './dashboard.html';
  }, 1000);
});

getEl('back-btn').addEventListener('click', function () {
  window.location.href = './dashboard.html';
});
getEl('sign-out').addEventListener('click', signOut);
