class StudentManager {
  #students = [];
  #marks = [];

  studentsVisible = true;
  get students() {
    return this.#students;
  }

  get marks() {
    return this.#marks;
  }

  addStudent() {
    const form = document.querySelector("form");
    const nameInput = document.getElementById("studentsNameInput");
    const markInputs = document.getElementsByClassName("studentsMarksInput");

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const studentName = nameInput.value;
      this.#students.push(studentName);

      const studentMarks = [];
      for (let i = 0; i < markInputs.length; i++) {
        const studentMark = parseInt(markInputs[i].value, 10);
        studentMarks.push(studentMark);
      }
      this.#marks.push(studentMarks);

      form.reset();
      this.displayStudents();
      this.saveStudentsToSessionStorage();
    });
  }

  sumMarks(marks) {
    let sum = 0;
    for (let i = 0; i < marks.length; i++) {
      sum += marks[i];
    }
    return sum;
  }

  averageMark(marks) {
    if (marks.length === 0) {
      return 0;
    }
    const sum = this.sumMarks(marks);
    return Math.round(sum / marks.length);
  }

  displayStudents() {
    const studentContainer = document.querySelector(".studentContainer");
    studentContainer.innerHTML = "";

    for (let i = 0; i < this.#students.length; i++) {
      const studentDiv = document.createElement("div");
      studentDiv.className = "student";

      const studentDataDiv = document.createElement("div");
      studentDataDiv.className = "studentData";
      studentDataDiv.textContent = `Nombre: ${this.#students[i]}`;

      const marksDataDiv = document.createElement("div");
      marksDataDiv.className = "studentData";
      const marks = Array.isArray(this.#marks[i]) ? this.#marks[i].join(" , ") : this.#marks[i];
      marksDataDiv.textContent = ` Notas: ${marks}`;

      const averageMarkDiv = document.createElement("div");
      averageMarkDiv.className = "studentData";
      averageMarkDiv.textContent = `Promedio: ${this.averageMark(this.#marks[i])}`;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Eliminar Alumno";
      deleteButton.addEventListener("click", () => {
        this.removeStudent(i);
        this.displayStudents();
        this.saveStudentsToSessionStorage();
      });

      studentDiv.appendChild(studentDataDiv);
      studentDiv.appendChild(marksDataDiv);
      studentDiv.appendChild(averageMarkDiv);
      studentDiv.appendChild(deleteButton);
      studentContainer.appendChild(studentDiv);
    }
  }

  removeStudent(index) {
    this.#students.splice(index, 1);
    this.#marks.splice(index, 1);
  }

  saveStudentsToSessionStorage() {
    sessionStorage.setItem("students", JSON.stringify(this.#students));
    sessionStorage.setItem("marks", JSON.stringify(this.#marks));
  }

  loadStudentsFromSessionStorage() {
    const studentData = sessionStorage.getItem("students");
    const marksData = sessionStorage.getItem("marks");

    if (studentData && marksData) {
      this.#students = JSON.parse(studentData);
      this.#marks = JSON.parse(marksData);
    }
  }
}

const manager = new StudentManager();
manager.loadStudentsFromSessionStorage();
manager.displayStudents();
manager.addStudent();