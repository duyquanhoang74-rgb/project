checkLogin();

let PAGE_SIZE = 5; // 5 user mỗi trang
let currentPage = 1;
let keyword = '';

// Lấy danh sách user phù hợp với từ khoá tìm kiếm
function getFilteredUsers() {
  let users = getUsers();
  let result = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].username.toLowerCase().indexOf(keyword) !== -1) {
      result.push(users[i]);
    }
  }
  return result;
}

// Vẽ các dòng của bảng cho trang hiện tại
function showTable(list) {
  let start = (currentPage - 1) * PAGE_SIZE;
  let html = '';
  for (let i = start; i < start + PAGE_SIZE && i < list.length; i++) {
    let u = list[i];
    html = html + '<tr>';
    html = html + '<td>' + escapeHtml(u.usercode) + '</td>';
    html = html + '<td>' + escapeHtml(u.username) + '</td>';
    html = html + '<td>' + escapeHtml(u.email) + '</td>';
    html = html + '<td class="uppercase">' + escapeHtml(u.role) + '</td>';
    html = html + '<td><span class="status-cell ' + u.status.toLowerCase() + '"><span class="dot"></span>' + escapeHtml(u.status) + '</span></td>';
    html = html + '<td>';
    html = html + '<i class="fa-solid fa-trash" onclick="deleteUser(\'' + u.usercode + '\')"></i>';
    html = html + '<i class="fa-solid fa-pen" onclick="editUser(\'' + u.usercode + '\')"></i>';
    html = html + '</td></tr>';
  }
  if (html === '') {
    html = '<tr><td colspan="6">No users found</td></tr>';
  }
  getEl('user-tbody').innerHTML = html;
}

// Vẽ dãy số trang 1, 2, 3...
function showPagination(totalPages) {
  let html = '';
  for (let p = 1; p <= totalPages; p++) {
    let extra = '';
    if (p === currentPage) {
      extra = ' highlight';
    }
    html = html + '<li class="pagination-element' + extra + '" onclick="goToPage(' + p + ')">' + p + '</li>';
  }
  getEl('pagination-list').innerHTML = html;

  // Trang đầu thì ẩn nút lùi, trang cuối thì ẩn nút tiến
  if (currentPage === 1) {
    getEl('prev-page').classList.add('hidden');
  } else {
    getEl('prev-page').classList.remove('hidden');
  }
  if (currentPage === totalPages) {
    getEl('next-page').classList.add('hidden');
  } else {
    getEl('next-page').classList.remove('hidden');
  }
}

// Vẽ lại toàn bộ (bảng + phân trang)
function render() {
  let list = getFilteredUsers();
  let totalPages = Math.ceil(list.length / PAGE_SIZE);
  if (totalPages === 0) {
    totalPages = 1;
  }
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }
  showTable(list);
  showPagination(totalPages);
}

function goToPage(page) {
  currentPage = page;
  render();
}

function deleteUser(code) {
  if (!confirm('Delete user ' + code + '?')) {
    return;
  }
  let users = getUsers();
  let remaining = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].usercode !== code) {
      remaining.push(users[i]);
    }
  }
  saveUsers(remaining);
  render();
}

function editUser(code) {
  window.location.href = './edit-user.html?usercode=' + code;
}

function searchUsers() {
  keyword = getEl('search-box').value.trim().toLowerCase();
  currentPage = 1;
  render();
}

getEl('prev-page').addEventListener('click', function () {
  goToPage(currentPage - 1);
});
getEl('next-page').addEventListener('click', function () {
  goToPage(currentPage + 1);
});
getEl('search-box').addEventListener('input', searchUsers);
getEl('search-btn').addEventListener('click', searchUsers);
getEl('sign-out').addEventListener('click', signOut);

render();
