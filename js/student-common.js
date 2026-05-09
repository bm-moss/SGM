// ===== SHARED STUDENT PORTAL UTILITIES =====

// Auth + student record init — call at top of every student page
function initStudentPortal() {
  const user = Auth.getSession();
  if (!user || user.role !== 'student') {
    window.location.href = user ? 'dashboard.html' : 'index.html';
    return null;
  }

  const allStudents = DB.get('students') || [];
  let studentRecord = user.linkedId
    ? allStudents.find(s => s.id === user.linkedId) || null
    : null;

  if (!studentRecord && user.email) {
    studentRecord = allStudents.find(s =>
      s.email && s.email.toLowerCase() === user.email.toLowerCase()
    ) || null;
  }

  if (!studentRecord) {
    document.body.innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f5f6fa;font-family:sans-serif;">
        <div style="background:#fff;border-radius:16px;padding:48px;max-width:420px;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,.08);">
          <div style="font-size:48px;margin-bottom:16px;">🔒</div>
          <h2 style="font-size:18px;font-weight:700;margin-bottom:8px;">Account Not Linked</h2>
          <p style="color:#6b7280;margin-bottom:20px;line-height:1.6;">Your account is not linked to a student record.<br>Contact your administrator.</p>
          <p style="font-size:12px;color:#9ca3af;margin-bottom:20px;">Logged in as: <strong>${user.username}</strong></p>
          <a href="index.html" onclick="Auth.logout()" style="background:#6366f1;color:#fff;padding:10px 24px;border-radius:8px;font-weight:600;font-size:14px;text-decoration:none;">Logout</a>
        </div>
      </div>`;
    return null;
  }

  return { user, studentRecord };
}

// Build the student sidebar — pass the active page key
function buildStudentSidebar(activePage, user, studentRecord) {
  const unread = getStudentUnreadCount(user);

  // Always read fresh permissions from DB so unlock takes effect immediately
  const freshAccount = (DB.get('accounts') || []).find(a => a.id === user.id);
  const permissions = freshAccount ? (freshAccount.permissions || []) : (user.permissions || []);

  document.getElementById('s-avatar').textContent = user.name.charAt(0).toUpperCase();
  document.getElementById('s-name').textContent = user.name;
  document.getElementById('s-class').textContent = 'Class ' + studentRecord.class + ' · ' + studentRecord.studentId;

  const pages = [
    { key: 'result',     href: 'student-result.html',     icon: '📊', label: 'My Result',
      locked: !permissions.includes('result') },
    { key: 'attendance', href: 'student-attendance.html', icon: '📅', label: 'My Attendance' },
    { key: 'complaints', href: 'student-complaints.html', icon: '💬', label: 'Complaints',
      badge: unread > 0 ? `<span class="badge badge-danger" style="margin-left:auto;font-size:10px;">${unread}</span>` : '' },
    { key: 'password',   href: 'student-password.html',   icon: '🔑', label: 'Change Password' },
  ];

  const nav = document.getElementById('s-nav');
  nav.innerHTML = '<div class="nav-section-title">My Portal</div>';
  pages.forEach(p => {
    const a = document.createElement('a');
    a.href = p.locked ? '#' : p.href;
    a.className = 'nav-item' + (activePage === p.key ? ' active' : '');
    if (p.locked) a.style.opacity = '0.45';
    a.innerHTML = `<span class="nav-icon">${p.locked ? '🔒' : p.icon}</span> ${p.label} ${p.badge || ''}`;
    nav.appendChild(a);
  });
}

function getStudentUnreadCount(user) {
  return (DB.get('complaints') || []).filter(c =>
    c.submitterId === user.id &&
    c.messages && c.messages.length > 0 &&
    (!c.readBy || !c.readBy.includes(user.id))
  ).length;
}
