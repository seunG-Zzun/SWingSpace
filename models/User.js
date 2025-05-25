class User {
  constructor( name, studentId, password, role) {
    this.name = name;
    this.studentId = studentId;
    this.password = password;
    this.role = role;
    this.warningCount = 0;
  }

  addWarning() {
    this.warningCount++;
  }
  isBanned(){
    this.isBanned = false;

  }

  isBanned() {
    return this.warningCount >= 4;
  }
}

module.exports = User;
