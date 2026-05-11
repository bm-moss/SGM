// ===== SCHOOL MANAGEMENT SYSTEM - DATA LAYER =====

const DB = {
  get(key) {
    try { return JSON.parse(localStorage.getItem('sms_' + key)) || null; }
    catch(e) { return null; }
  },
  set(key, val) { localStorage.setItem('sms_' + key, JSON.stringify(val)); },
  remove(key) { localStorage.removeItem('sms_' + key); }
};

// Global ID generator used across all pages
function genId(prefix) {
  return (prefix || 'id') + '_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
}

function initData() {
  if (DB.get('initialized')) return;

  DB.set('departments', [
    { id: 'dep1', name: 'Science', description: 'Natural sciences', head: 'Dr. Robert Brown', status: 'active' },
    { id: 'dep2', name: 'Languages', description: 'Language arts', head: 'Ms. Emily Davis', status: 'active' },
    { id: 'dep3', name: 'Humanities', description: 'Social studies & history', head: 'Mr. James Taylor', status: 'active' },
    { id: 'dep4', name: 'Mathematics', description: 'Pure & applied math', head: 'Mr. John Smith', status: 'active' },
    { id: 'dep5', name: 'Administration', description: 'School administration', head: '', status: 'active' }
  ]);

  DB.set('classes', [
    { id: 'cls1', name: '10A', grade: '10', section: 'A', capacity: 30, classTeacher: 't1', room: 'Room 101' },
    { id: 'cls2', name: '10B', grade: '10', section: 'B', capacity: 30, classTeacher: 't2', room: 'Room 102' },
    { id: 'cls3', name: '11A', grade: '11', section: 'A', capacity: 28, classTeacher: 't3', room: 'Room 201' },
    { id: 'cls4', name: '11B', grade: '11', section: 'B', capacity: 28, classTeacher: 't4', room: 'Room 202' },
    { id: 'cls5', name: '12A', grade: '12', section: 'A', capacity: 25, classTeacher: 't5', room: 'Room 301' }
  ]);

  DB.set('accounts', [
    { id: 'acc_1', username: 'admin', password: 'admin123', name: 'System Administrator', role: 'admin', email: 'admin@school.edu', active: true, createdAt: new Date().toISOString(), permissions: ['dashboard','teachers','students','grades','staff','accounts','reports','attendance','complaints','departments'] },
    { id: 'acc_2', username: 'teacher1', password: 'teacher123', name: 'Mr. John Smith', role: 'teacher', email: 'jsmith@school.edu', active: true, createdAt: new Date().toISOString(), permissions: ['dashboard','students','grades','attendance','complaints'], linkedId: 't1' },
    { id: 'acc_3', username: 'staff1', password: 'staff123', name: 'Ms. Sarah Johnson', role: 'staff', email: 'sjohnson@school.edu', active: true, createdAt: new Date().toISOString(), permissions: ['dashboard','students','attendance'] },
    { id: 'acc_4', username: 'alice', password: 'alice123', name: 'Alice Johnson', role: 'student', email: 'alice@student.edu', active: true, createdAt: new Date().toISOString(), permissions: ['student_portal'], linkedId: 's1' },
    { id: 'acc_5', username: 'bob', password: 'bob123', name: 'Bob Martinez', role: 'student', email: 'bob@student.edu', active: true, createdAt: new Date().toISOString(), permissions: ['student_portal'], linkedId: 's2' }
  ]);

  DB.set('teachers', [
    { id: 't1', name: 'Mr. John Smith', email: 'jsmith@school.edu', phone: '555-0101', subject: 'Mathematics', department: 'Mathematics', qualification: 'M.Sc Mathematics', joinDate: '2020-09-01', status: 'active' },
    { id: 't2', name: 'Ms. Emily Davis', email: 'edavis@school.edu', phone: '555-0102', subject: 'English', department: 'Languages', qualification: 'B.A English Literature', joinDate: '2019-01-15', status: 'active' },
    { id: 't3', name: 'Dr. Robert Brown', email: 'rbrown@school.edu', phone: '555-0103', subject: 'Physics', department: 'Science', qualification: 'Ph.D Physics', joinDate: '2018-08-20', status: 'active' },
    { id: 't4', name: 'Ms. Linda Wilson', email: 'lwilson@school.edu', phone: '555-0104', subject: 'Chemistry', department: 'Science', qualification: 'M.Sc Chemistry', joinDate: '2021-02-10', status: 'active' },
    { id: 't5', name: 'Mr. James Taylor', email: 'jtaylor@school.edu', phone: '555-0105', subject: 'History', department: 'Humanities', qualification: 'M.A History', joinDate: '2017-09-01', status: 'active' }
  ]);

  DB.set('students', [
    { id: 's1', name: 'Alice Johnson', studentId: 'STU001', email: 'alice@student.edu', phone: '555-1001', class: '10A', dob: '2008-03-15', gender: 'Female', guardian: 'Bob Johnson', guardianPhone: '555-2001', address: '123 Main St', enrollDate: '2022-09-01', status: 'active' },
    { id: 's2', name: 'Bob Martinez', studentId: 'STU002', email: 'bob@student.edu', phone: '555-1002', class: '10A', dob: '2008-07-22', gender: 'Male', guardian: 'Maria Martinez', guardianPhone: '555-2002', address: '456 Oak Ave', enrollDate: '2022-09-01', status: 'active' },
    { id: 's3', name: 'Carol White', studentId: 'STU003', email: 'carol@student.edu', phone: '555-1003', class: '10B', dob: '2008-11-05', gender: 'Female', guardian: 'David White', guardianPhone: '555-2003', address: '789 Pine Rd', enrollDate: '2022-09-01', status: 'active' },
    { id: 's4', name: 'David Lee', studentId: 'STU004', email: 'david@student.edu', phone: '555-1004', class: '10B', dob: '2008-01-30', gender: 'Male', guardian: 'Susan Lee', guardianPhone: '555-2004', address: '321 Elm St', enrollDate: '2022-09-01', status: 'active' },
    { id: 's5', name: 'Emma Garcia', studentId: 'STU005', email: 'emma@student.edu', phone: '555-1005', class: '11A', dob: '2007-05-18', gender: 'Female', guardian: 'Carlos Garcia', guardianPhone: '555-2005', address: '654 Maple Dr', enrollDate: '2021-09-01', status: 'active' },
    { id: 's6', name: 'Frank Chen', studentId: 'STU006', email: 'frank@student.edu', phone: '555-1006', class: '11A', dob: '2007-09-12', gender: 'Male', guardian: 'Wei Chen', guardianPhone: '555-2006', address: '987 Cedar Ln', enrollDate: '2021-09-01', status: 'active' }
  ]);

  DB.set('staff', [
    { id: 'st1', name: 'Ms. Sarah Johnson', email: 'sjohnson@school.edu', phone: '555-3001', role: 'Secretary', department: 'Administration', salary: 3200, joinDate: '2019-06-01', status: 'active' },
    { id: 'st2', name: 'Mr. Tom Harris', email: 'tharris@school.edu', phone: '555-3002', role: 'Librarian', department: 'Administration', salary: 2800, joinDate: '2020-01-15', status: 'active' },
    { id: 'st3', name: 'Ms. Nancy Clark', email: 'nclark@school.edu', phone: '555-3003', role: 'Nurse', department: 'Administration', salary: 3500, joinDate: '2018-09-01', status: 'active' },
    { id: 'st4', name: 'Mr. Kevin Moore', email: 'kmoore@school.edu', phone: '555-3004', role: 'IT Technician', department: 'Administration', salary: 3800, joinDate: '2021-03-10', status: 'active' }
  ]);

  DB.set('grades', [
    { id: 'g1', studentId: 's1', studentName: 'Alice Johnson', class: '10A', subject: 'Mathematics', term: 'Term 1', midterm: 88, final: 92, assignment: 95, score: 91.5, grade: 'A', year: '2025' },
    { id: 'g2', studentId: 's1', studentName: 'Alice Johnson', class: '10A', subject: 'English', term: 'Term 1', midterm: 82, final: 85, assignment: 90, score: 85.5, grade: 'B', year: '2025' },
    { id: 'g3', studentId: 's1', studentName: 'Alice Johnson', class: '10A', subject: 'Physics', term: 'Term 1', midterm: 78, final: 80, assignment: 85, score: 80.5, grade: 'B', year: '2025' },
    { id: 'g4', studentId: 's2', studentName: 'Bob Martinez', class: '10A', subject: 'Mathematics', term: 'Term 1', midterm: 72, final: 75, assignment: 70, score: 73.5, grade: 'C', year: '2025' },
    { id: 'g5', studentId: 's2', studentName: 'Bob Martinez', class: '10A', subject: 'English', term: 'Term 1', midterm: 85, final: 88, assignment: 92, score: 88, grade: 'B', year: '2025' },
    { id: 'g6', studentId: 's2', studentName: 'Bob Martinez', class: '10A', subject: 'Physics', term: 'Term 1', midterm: 65, final: 70, assignment: 68, score: 68.5, grade: 'C', year: '2025' },
    { id: 'g7', studentId: 's3', studentName: 'Carol White', class: '10B', subject: 'Mathematics', term: 'Term 1', midterm: 95, final: 97, assignment: 98, score: 96.5, grade: 'A', year: '2025' },
    { id: 'g8', studentId: 's3', studentName: 'Carol White', class: '10B', subject: 'English', term: 'Term 1', midterm: 90, final: 93, assignment: 95, score: 92.5, grade: 'A', year: '2025' },
    { id: 'g9', studentId: 's4', studentName: 'David Lee', class: '10B', subject: 'Mathematics', term: 'Term 1', midterm: 60, final: 58, assignment: 65, score: 61, grade: 'D', year: '2025' },
    { id: 'g10', studentId: 's5', studentName: 'Emma Garcia', class: '11A', subject: 'Chemistry', term: 'Term 1', midterm: 88, final: 91, assignment: 94, score: 91, grade: 'A', year: '2025' },
    { id: 'g11', studentId: 's6', studentName: 'Frank Chen', class: '11A', subject: 'Chemistry', term: 'Term 1', midterm: 76, final: 79, assignment: 82, score: 79, grade: 'C', year: '2025' }
  ]);

  // Seed attendance for last 7 weekdays
  const attendance = [];
  const today = new Date();
  const sids = ['s1','s2','s3','s4','s5','s6'];
  const tids = ['t1','t2','t3','t4','t5'];
  const pool = ['present','present','present','present','absent','late'];
  for (let d = 6; d >= 0; d--) {
    const dt = new Date(today);
    dt.setDate(today.getDate() - d);
    if (dt.getDay() === 0 || dt.getDay() === 6) continue;
    const ds = dt.toISOString().split('T')[0];
    sids.forEach(sid => attendance.push({ id: 'att_' + Date.now() + '_' + sid + '_' + d, type: 'student', personId: sid, date: ds, status: pool[Math.floor(Math.random() * pool.length)], note: '' }));
    tids.forEach(tid => attendance.push({ id: 'att_' + Date.now() + '_' + tid + '_' + d, type: 'teacher', personId: tid, date: ds, status: pool[Math.floor(Math.random() * pool.length)], note: '' }));
  }
  DB.set('attendance', attendance);

  DB.set('complaints', [
    { id: 'cmp1', title: 'Classroom noise issue', description: 'Students in 10B are very noisy during study periods.', submittedBy: 'Mr. John Smith', submitterRole: 'teacher', targetType: 'class', target: '10B', status: 'open', priority: 'medium', createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), response: '' },
    { id: 'cmp2', title: 'Broken projector in Room 201', description: 'The projector in Room 201 has been broken for a week.', submittedBy: 'Dr. Robert Brown', submitterRole: 'teacher', targetType: 'facility', target: 'Room 201', status: 'in-progress', priority: 'high', createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), response: 'Maintenance team has been notified.' }
  ]);

  DB.set('initialized', true);
}

// ===== GRADE HELPERS =====
const GradeCalc = {
  calcScore(midterm, final, assignment) {
    return Math.round(((midterm * 0.3) + (final * 0.5) + (assignment * 0.2)) * 10) / 10;
  },
  getGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  },
  getGradeClass(grade) {
    return { A: 'grade-a', B: 'grade-b', C: 'grade-c', D: 'grade-d', F: 'grade-f' }[grade] || '';
  },
  getAverage(scores) {
    if (!scores.length) return 0;
    return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
  },
  getRankings(students, grades, classFilter, termFilter, yearFilter) {
    return students
      .filter(s => !classFilter || s.class === classFilter)
      .map(s => {
        const sg = grades.filter(g =>
          g.studentId === s.id &&
          (!termFilter || g.term === termFilter) &&
          (!yearFilter || g.year === yearFilter)
        );
        const avg = sg.length ? GradeCalc.getAverage(sg.map(g => g.score)) : 0;
        return { ...s, average: avg, gradeCount: sg.length };
      })
      .sort((a, b) => b.average - a.average)
      .map((s, i) => ({ ...s, rank: i + 1 }));
  }
};

initData();

// ensure subjects exist
if(!DB.get('subjects')){DB.set('subjects',['Mathematics','English','Physics','Chemistry','Biology','History','Geography','Computer Science','Arabic','Islamic Studies','Literature','Economics','Art','Physical Education']);}
