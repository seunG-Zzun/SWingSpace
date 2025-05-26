class User {
  constructor(name, studentId, password, role, club) {
    this.name = name;
    this.studentId = studentId;
    this.password = password;
    this.role = role;
    this.club = club;
    this.warningCount = 0;
  }

  addWarning() {
    this.warningCount++;
  }

  isBanned() {
    return this.warningCount >= 4;
  }
}

module.exports = User;
