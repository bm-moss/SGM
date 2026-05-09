// ===== SHARED APP UTILITIES =====

function toast(msg, type = '') {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.className = 'toast ' + type;
  setTimeout(() => el.classList.add('show'), 10);
  setTimeout(() => el.classList.remove('show'), 3200);
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

function confirmDelete(msg, cb) {
  if (confirm(msg || 'Are you sure you want to delete this record?')) cb();
}

// Build sidebar nav based on permissions
function buildSidebar(activePage) {
  const user = Auth.getSession();
  if (!user) return;

  document.getElementById('sidebar-user-name').textContent = user.name;
  document.getElementById('sidebar-user-role').textContent = user.role;
  document.getElementById('sidebar-user-avatar').textContent = user.name.charAt(0).toUpperCase();

  const navItems = [
    { page: 'dashboard',    icon: '🏠', label: 'Dashboard',         href: 'dashboard.html',    perm: 'dashboard' },
    { page: 'teachers',     icon: '👨‍🏫', label: 'Teachers',          href: 'teachers.html',     perm: 'teachers' },
    { page: 'students',     icon: '🎓', label: 'Students',           href: 'students.html',     perm: 'students' },
    { page: 'grades',       icon: '📊', label: 'Grades & Ranks',     href: 'grades.html',       perm: 'grades' },
    { page: 'attendance',   icon: '📅', label: 'Attendance',         href: 'attendance.html',   perm: 'attendance' },
    { page: 'staff',        icon: '👥', label: 'Staff',              href: 'staff.html',        perm: 'staff' },
    { page: 'departments',  icon: '🏢', label: 'Departments & Classes', href: 'departments.html', perm: 'departments' },
    { page: 'complaints',   icon: '📣', label: 'Complaints',         href: 'complaints.html',   perm: 'complaints' },
    { page: 'reports',      icon: '📋', label: 'Reports',            href: 'reports.html',      perm: 'reports' },
    { page: 'accounts',     icon: '🔐', label: 'Accounts',           href: 'accounts.html',     perm: 'accounts' },
  ];

  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = '<div class="nav-section-title">Navigation</div>';

  navItems.forEach(item => {
    if (!Auth.hasPermission(item.perm)) return;
    const a = document.createElement('a');
    a.href = item.href;
    a.className = 'nav-item' + (activePage === item.page ? ' active' : '');
    a.innerHTML = `<span class="nav-icon">${item.icon}</span> ${item.label}`;
    nav.appendChild(a);
  });
}

// Tab switching
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.group;
      const target = btn.dataset.tab;
      document.querySelectorAll(`.tab-btn[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
      document.querySelectorAll(`.tab-content[data-group="${group}"]`).forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(target).classList.add('active');
    });
  });
}

// Close modal on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});

// Reset all data (for dev/testing)
function resetAllData() {
  if (confirm('Reset ALL data to defaults? This cannot be undone.')) {
    localStorage.clear();
    location.reload();
  }
}
