// ── HEADER BG ON SCROLL ──
const header = document.getElementById('mainHeader');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
    scrollTopBtn.classList.add('visible');
  } else {
    header.classList.remove('scrolled');
    scrollTopBtn.classList.remove('visible');
  }
});

// ── SCROLL TO TOP ──
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── BURGER MENU ──
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileNav.classList.toggle('open');
  document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.mobile-close').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── MULTISELECT FILTER ──
const filterTags = document.querySelectorAll('#filterTags .ms-tag');
const menuCards = document.querySelectorAll('#menuGrid .menu-card');
let activeFilters = new Set(['all']);

filterTags.forEach(tag => {
  tag.addEventListener('click', () => {
    const cat = tag.dataset.cat;

    if (cat === 'all') {
      activeFilters.clear();
      activeFilters.add('all');
      filterTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
    } else {
      activeFilters.delete('all');
      document.querySelector('[data-cat="all"]').classList.remove('active');
      tag.classList.toggle('active');
      if (tag.classList.contains('active')) {
        activeFilters.add(cat);
      } else {
        activeFilters.delete(cat);
      }
      if (activeFilters.size === 0) {
        activeFilters.add('all');
        document.querySelector('[data-cat="all"]').classList.add('active');
      }
    }

    menuCards.forEach(card => {
      if (activeFilters.has('all') || activeFilters.has(card.dataset.cat)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ── TO-DO LIST ──
let todoId = 10;
const todoInput = document.getElementById('todoInput');
const todoAdd = document.getElementById('todoAdd');
const todoList = document.getElementById('todoList');

function addTodoItem(text) {
  if (!text.trim()) return;
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.dataset.id = ++todoId;
  li.innerHTML = `<input type="checkbox" /><span>${text.trim()}</span><button class="todo-delete">✕</button>`;

  li.querySelector('input').addEventListener('change', e => {
    li.classList.toggle('done', e.target.checked);
  });

  li.querySelector('.todo-delete').addEventListener('click', () => {
    li.style.opacity = '0';
    li.style.transform = 'translateX(20px)';
    li.style.transition = 'all 0.3s ease';
    setTimeout(() => li.remove(), 300);
  });

  todoList.appendChild(li);
  todoInput.value = '';
}

todoAdd.addEventListener('click', () => addTodoItem(todoInput.value));
todoInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTodoItem(todoInput.value);
});

// Wire pre-existing todo items
document.querySelectorAll('.todo-delete').forEach(btn => {
  btn.addEventListener('click', () => {
    const li = btn.closest('.todo-item');
    li.style.opacity = '0';
    li.style.transform = 'translateX(20px)';
    li.style.transition = 'all 0.3s ease';
    setTimeout(() => li.remove(), 300);
  });
});

document.querySelectorAll('.todo-item input[type=checkbox]').forEach(cb => {
  cb.addEventListener('change', e => {
    cb.closest('.todo-item').classList.toggle('done', e.target.checked);
  });
});

// ── FETCH FUNCTION ──
const fetchBtn = document.getElementById('fetchBtn');
const recipesGrid = document.getElementById('recipesGrid');
const fetchLoader = document.getElementById('fetchLoader');

const recipeIcons = ['🥦','🍋','🧄','🌶','🍅','🫐','🥕','🧅','🌿','🍃','🥑','🫚'];
const recipeTags = [
  ['Quick', 'Vegan'],
  ['Prep 15 min', 'Gluten-free'],
  ['Seasonal', 'Chef Pick'],
  ['High Protein', 'Meal Prep'],
  ['Low Cal', 'Vegetarian'],
  ['Comfort Food', 'Family']
];

fetchBtn.addEventListener('click', async () => {
  fetchLoader.style.display = 'block';
  recipesGrid.style.display = 'none';
  fetchBtn.disabled = true;
  fetchBtn.textContent = 'Loading...';

  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=6');
    const data = await res.json();

    recipesGrid.innerHTML = '';
    data.forEach((post, i) => {
      const icon = recipeIcons[i % recipeIcons.length];
      const tags = recipeTags[i % recipeTags.length];
      const card = document.createElement('article');
      card.className = 'recipe-card reveal';
      card.innerHTML = `
        <h4>${icon} ${post.title.charAt(0).toUpperCase() + post.title.slice(0, 38)}...</h4>
        <p>${post.body.slice(0, 100)}...</p>
        <div class="recipe-meta">
          ${tags.map(t => `<span class="recipe-tag">${t}</span>`).join('')}
        </div>
      `;
      recipesGrid.appendChild(card);
      setTimeout(() => card.classList.add('visible'), 50 * i);
    });

    fetchLoader.style.display = 'none';
    recipesGrid.style.display = 'grid';
    fetchBtn.textContent = '🔄 Refresh Tips';
    fetchBtn.disabled = false;
  } catch (err) {
    fetchLoader.textContent = '⚠️ Failed to load. Check your connection.';
    fetchBtn.textContent = '🔄 Try Again';
    fetchBtn.disabled = false;
  }
});

// ── PASSWORD SHOW / HIDE ──
function setupPwToggle(toggleId, inputId) {
  const toggle = document.getElementById(toggleId);
  const input = document.getElementById(inputId);
  toggle.addEventListener('click', () => {
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    toggle.textContent = isHidden ? '🙈' : '👁';
  });
}
setupPwToggle('pwToggle1', 'regPw');
setupPwToggle('pwToggle2', 'regPwConfirm');

// ── REGISTER FORM ──
document.getElementById('regSubmit').addEventListener('click', () => {
  const first = document.getElementById('regFirst').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pw    = document.getElementById('regPw').value;
  const pw2   = document.getElementById('regPwConfirm').value;
  const plan  = document.getElementById('regPlan').value;

  if (!first || !email || !pw || !plan) {
    alert('Please fill in all required fields.');
    return;
  }
  if (!email.includes('@')) {
    alert('Please enter a valid email address.');
    return;
  }
  if (pw.length < 6) {
    alert('Password must be at least 6 characters.');
    return;
  }
  if (pw !== pw2) {
    alert('Passwords do not match.');
    return;
  }

  document.getElementById('registerFormWrap').style.display = 'none';
  document.getElementById('formSuccess').style.display = 'block';
});

// ── COOKIE BANNER ──
const cookie = document.getElementById('cookie');

if (!localStorage.getItem('vk_cookie')) {
  setTimeout(() => cookie.classList.add('show'), 1500);
}

document.getElementById('cookieAccept').addEventListener('click', () => {
  localStorage.setItem('vk_cookie', 'accepted');
  cookie.classList.add('hide');
  cookie.classList.remove('show');
});

document.getElementById('cookieDecline').addEventListener('click', () => {
  localStorage.setItem('vk_cookie', 'declined');
  cookie.classList.add('hide');
  cookie.classList.remove('show');
});

// ── SECTION REVEAL ANIMATION ──
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));
