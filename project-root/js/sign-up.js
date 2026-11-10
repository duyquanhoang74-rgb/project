// Yêu cầu trang Sign up (theo sheet):
// - Validate email không được để trống, phải đúng định dạng
// - Validate username không được để trống
// - Validate mật khẩu không được để trống, tối thiểu 8 ký tự, có số, có chữ thường và chữ hoa
// - Đăng ký thành công sẽ chuyển hướng về trang đăng nhập kèm thông báo

// B1: Lấy dữ liệu từ local về
let users = getUsers();

// B2: Truy vấn tất cả các phần tử HTML liên quan sang JS
let mainForm = document.getElementById("sign-up-form");
setupEyeIcons(); // con mắt ẩn / hiện mật khẩu (hàm nằm trong common.js)

// B3: Gắn sự kiện cho thẻ form
mainForm.addEventListener("submit", function (e) {
  e.preventDefault(); // không cho trình duyệt tải lại trang

  // B4: Lấy dữ liệu input từ người dùng
  let email = document.getElementById("email").value.trim();
  let username = document.getElementById("username").value.trim();
  let password = document.getElementById("password").value;

  // B5: Validate
  // Regex là "mẫu" để kiểm tra chuỗi: regex.test(chuỗi) trả về true (đúng) hoặc false (sai)
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const regexNumber = /[0-9]/; // có chứa chữ số
  const regexLower = /[a-z]/; // có chứa chữ thường
  const regexUpper = /[A-Z]/; // có chứa chữ hoa
  let errors = []; // danh sách lỗi, ban đầu rỗng

  // Email
  if (email === "") {
    errors.push("Email must not be empty");
  } else if (regexEmail.test(email) === false) {
    errors.push("Email is not in a valid format");
  }

  // Username
  if (username === "") {
    errors.push("Username must not be empty");
  }

  // Password
  if (password === "") {
    errors.push("Password must not be empty");
  } else {
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }
    if (regexNumber.test(password) === false) {
      errors.push("Password must contain a digit");
    }
    if (regexLower.test(password) === false || regexUpper.test(password) === false) {
      errors.push("Password must contain both lowercase and uppercase letters");
    }
  }

  // B5.1: Nếu lỗi thì thông báo lỗi
  if (errors.length > 0) {
    showMessage("sign-up-validation", errors.join("<br>"));
    return;
  }
  if (emailExists(users, email, "")) {
    showMessage("sign-up-error", "Email already exists");
    return;
  }

  // B5.2: Nếu thành công thì tạo mới và đưa lên local. Sau đó chuyển trang signin
  let newUser = {
    usercode: createUserCode(users),
    username: username,
    email: email,
    password: password,
    role: "user",
    birthday: "",
    status: "Active",
    description: "",
  };
  users.push(newUser);
  saveUsers(users);
  sessionStorage.setItem("flash", "Sign up successful! Please sign in.");
  window.location.href = "./sign-in.html";
});
