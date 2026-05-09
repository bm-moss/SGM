// ===== AUTH MODULE =====

const Auth = {
  currentUser: null,

  login(username, password) {
    const accounts = DB.get('accounts') || [];
    const user = accounts.find(a => a.username === username && a.password === password && a.active);
    if (user) {
      this.currentUser = user;
      sessionStorage.setItem('sms_session', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: 'Invalid username or password.' };
  },

  logout() {
    this.currentUser = null;
    sessionStorage.removeItem('sms_session');
    window.location.href = 'index.html';
  },

  getSession() {
    if (this.currentUser) return this.currentUser;
    const s = sessionStorage.getItem('sms_session');
    if (s) { this.currentUser = JSON.parse(s); return this.currentUser; }
    return null;
  },

  requireAuth() {
    const user = this.getSession();
    if (!user) { window.location.href = 'index.html'; return null; }
    return user;
  },

  // Redirect students to their portal, others to dashboard
  requireAuthRedirect() {
    const user = this.getSession();
    if (!user) { window.location.href = 'index.html'; return null; }
    if (user.role === 'student') { window.location.href = 'student-portal.html'; return null; }
    return user;
  },

  hasPermission(perm) {
    const user = this.getSession();
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.permissions && user.permissions.includes(perm);
  },

  isAdmin() {
    const user = this.getSession();
    return user && user.role === 'admin';
  },

  isTeacher() {
    const user = this.getSession();
    return user && user.role === 'teacher';
  },

  isStudent() {
    const user = this.getSession();
    return user && user.role === 'student';
  },

  // Get the linked student/teacher record for the logged-in user
  getLinkedRecord() {
    const user = this.getSession();
    if (!user || !user.linkedId) return null;
    if (user.role === 'student') {
      return (DB.get('students') || []).find(s => s.id === user.linkedId) || null;
    }
    if (user.role === 'teacher') {
      return (DB.get('teachers') || []).find(t => t.id === user.linkedId) || null;
    }
    return null;
  }
};
