document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fetchUsersBtn').addEventListener('click', () => fetchUsers());
});

let currentPage = 1;
const limit = 10;

// 모든 회원 정보 조회
async function fetchUsers(page = 1) {
    currentPage = page;
    try {
        const response = await fetch(`http://localhost:4000/admin/users?page=${page}&limit=${limit}`); // 서버 주소 확인
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        const users = data.users;
        const tbody = document.querySelector('#allUsersTable tbody');
        tbody.innerHTML = '';

        users.forEach((user, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${(page - 1) * limit + index + 1}</td>
                <td>${user.userid}</td>
                <td>${user.name}</td>
                <td>${user.hp}</td>
                <td>${user.email}</td>
                <td>${user.ssn}</td>
                <td>${user.address}</td>                
            `;
            row.addEventListener('click', () => populateForm(user));
            tbody.appendChild(row);
        });

        setupPagination(data.totalPages, data.currentPage);
    } catch (err) {
        console.error('Failed to fetch users:', err);
    }
}

function setupPagination(totalPages, currentPage) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        if (i === currentPage) {
            pageButton.disabled = true;
        }
        pageButton.addEventListener('click', () => fetchUsers(i));
        pagination.appendChild(pageButton);
    }
}

// 특정 회원 정보 조회
async function searchUser() {
    const userid = document.getElementById('useridSearch').value;
    if (!userid) {
        alert('회원 ID를 입력하세요.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/admin/users/${userid}`);
        if (!response.ok) throw new Error('User not found');
        const user = await response.json();
        populateForm(user);
    } catch (err) {
        alert(err.message);
    }
}

function populateForm(user) {
    document.getElementById('userid').value = user.userid || '';
    document.getElementById('userpw').value = user.userpw || '';
    document.getElementById('name').value = user.name || '';
    document.getElementById('hp').value = user.hp || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('ssn').value = user.ssn || '';
    document.getElementById('address').value = user.address || '';    
}

// 회원 정보 추가
async function addUser() {
    const user = {
        userid: document.getElementById('newUserId').value,
        userpw: document.getElementById('newUserPw').value,
        name: document.getElementById('newUserName').value,
        hp: document.getElementById('newUserHp').value,
        email: document.getElementById('newUserEmail').value,
        ssn: document.getElementById('newUserSsn').value,
        address: document.getElementById('newUserAddress').value        
    };

    console.log('Adding user:', user); // 콘솔에 추가하려는 사용자 정보를 출력

    try {
        const response = await fetch('http://localhost:4000/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        if (!response.ok) throw new Error('Failed to add user');
        alert('회원이 추가되었습니다.');
        fetchUsers();
    } catch (err) {
        alert(err.message);
    }
}

// 회원 추가 폼 닫기
function closeAddUserForm() {
    document.getElementById('addUserForm').style.display = 'none';
}

function showAddUserForm() {
    document.getElementById('addUserForm').style.display = 'block';
}

// 회원 정보 수정
async function updateUser() {
    const userid = document.getElementById('userid').value;
    if (!userid) {
        alert('회원 ID를 먼저 검색하세요.');
        return;
    }

    const user = {
        userpw: document.getElementById('userpw').value,
        name: document.getElementById('name').value,
        hp: document.getElementById('hp').value,
        email: document.getElementById('email').value,
        ssn: document.getElementById('ssn').value,
        address: document.getElementById('address').value        
    };

    try {
        const response = await fetch(`http://localhost:4000/admin/users/${userid}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        if (!response.ok) throw new Error('Failed to update user');
        const updatedUser = await response.json();
        alert('회원 정보가 수정되었습니다.');
        fetchUsers();
    } catch (err) {
        alert(err.message);
    }
}

// 회원 정보 삭제
async function deleteUser() {
    const userid = document.getElementById('userid').value;
    if (!userid) {
        alert('회원 ID를 먼저 검색하세요.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/admin/users/${userid}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete user');
        alert('회원이 삭제되었습니다.');
        fetchUsers();
    } catch (err) {
        alert(err.message);
    }
}

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // 로그인 검증 로직 추가 필요
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-section').style.display = 'block';
});

function showSection(sectionId) {
    document.querySelectorAll('.management-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// 지우기 버튼 기능 추가
function clearUserForm() {
    document.getElementById('userid').value = '';
    document.getElementById('userpw').value = '';
    document.getElementById('name').value = '';
    document.getElementById('hp').value = '';
    document.getElementById('email').value = '';
    document.getElementById('ssn').value = '';
    document.getElementById('address').value = '';    
}


function showSection(sectionId, fetchBooksFlag = false) {
    document.querySelectorAll('.management-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';

    if (fetchBooksFlag) {
        fetchBooks();
    }
}

 // 도서 관리 스크립트
 async function fetchBooks() {
    try {
      const response = await fetch('/api/books');
      if (!response.ok) {
        if (response.status === 404) {
          console.error('Error: Resource not found (404)');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return;
      }
      const books = await response.json();
      console.log(books);
      const bookTableBody = document.getElementById('bookTableBody');
      bookTableBody.innerHTML = '';
  
      books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${book._id}</td>
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.publisher}</td>
          <td>${new Date(book.updatedAt).toLocaleString()}</td>
          <td>${book.available ? '가능' : '불가능'}</td>
        `;
        bookTableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  }
  

async function searchBook() {
    const query = document.getElementById('bookSearch').value;

    console.log(`Searching for book with query: ${query}`); // 검색어 로그

    try {
        const response = await fetch(`/api/books/search?query=${encodeURIComponent(query)}`);
        console.log(`Response status: ${response.status}`); // 응답 상태 로그
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const books = await response.json();
        console.log('Books found:', books); // 검색 결과 로그

        renderBooks(books, 1);
        setupPagination(books);

        // 검색 기록을 서버로 전송
        const historyResponse = await fetch('/api/search-history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: 'currentUserId', query: query }), // currentUserId를 실제 사용자 ID로 대체
        });

        console.log(`History response status: ${historyResponse.status}`); // 검색 기록 응답 상태 로그
        if (!historyResponse.ok) {
            throw new Error(`Error logging search history: ${historyResponse.statusText}`);
        }
    } catch (error) {
        console.error('Error searching book:', error);
    }
}

function renderBooks(books, page) {
    const bookTableBody = document.getElementById('bookTableBody');
    bookTableBody.innerHTML = '';
    const start = (page - 1) * booksPerPage;
    const end = start + booksPerPage;
    const paginatedBooks = books.slice(start, end);

    paginatedBooks.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book._id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.publisher}</td>
            <td>${new Date(book.updatedAt).toLocaleString()}</td>
            <td>${book.available ? '가능' : '불가능'}</td>
        `;
        bookTableBody.appendChild(row);
    });
}

function setupPagination(books) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    const pageCount = Math.ceil(books.length / booksPerPage);

    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.classList.add('page-button');
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            currentPage = i;
            renderBooks(books, currentPage);
            document.querySelector('.page-button.active').classList.remove('active');
            button.classList.add('active');
        });
        pagination.appendChild(button);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        login();
    });

    // Show the book management section by default
    showSection('book-management', true);
});

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'password') {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('admin-section').style.display = 'block';
    } else {
        alert('로그인 정보가 올바르지 않습니다.');
    }
}

function showSection(sectionId, fetchBooksFlag = false) {
    document.querySelectorAll('.management-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';

    if (fetchBooksFlag) {
        fetchBooks();
    }
}