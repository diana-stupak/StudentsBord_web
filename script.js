const studentsTable = document.getElementById("students-table");
const notificationButton = document.getElementById("notifications-button");
const userElement = document.getElementById("user");
const profileInfoElement = document.getElementById("profile-info");
const addStudentButton = document.getElementById("add-student-btn");
const addStudentModalWrapper = document.getElementById("add-student");
const addStudentForm = document.getElementById("add-student-form");
const cancelAddStudentButton = document.getElementById("add-student-btn-close");
let editingStudent = null;

function show(element) {
    element.classList.remove("hidden");
}

function hide(element) {
    element.classList.add("hidden");
}

function showAddStudentModal() {
    show(addStudentModalWrapper);
    editingStudent = null;
}

function showEditStudentModal() {
    show(addStudentModalWrapper, "Edit Student");
}

userElement.addEventListener("mouseover", function () {
    profileInfoElement.classList.remove("hidden");
});

userElement.addEventListener("mouseout", function () {
    profileInfoElement.classList.add("hidden");
});

document.addEventListener("DOMContentLoaded", function () {
    const bell = document.querySelector(".bell");
    const bellPopup = document.querySelector("#bell-popup");

    bell.addEventListener("click", function () {
        bellPopup.classList.toggle("hidden");
    });

    document.addEventListener("click", function (event) {
        if (!bell.contains(event.target)) {
            bellPopup.classList.add("hidden");
        }
    });
});

function addStudent({ group, name, surname, gender, birthday }) {
    const tr = document.createElement("tr");
    const checkboxTd = document.createElement("td");
    const groupTd = document.createElement("td");
    const nameSurnameTd = document.createElement("td");
    const genderTd = document.createElement("td");
    const birthdayTd = document.createElement("td");
    const statusTd = document.createElement("td");
    const actionsContainer = document.createElement("td");

    const checkbox = document.createElement("input");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    checkbox.type = "checkbox";
    checkbox.id = "checkbox-status";
    checkboxTd.appendChild(checkbox);
    groupTd.textContent = group;
    nameSurnameTd.textContent = `${name} ${surname}`;
    genderTd.textContent = gender;
    birthdayTd.textContent = birthday;

    statusTd.innerHTML = '<i class="fa fa-circle status" style="color: #d8d8d8;"></i>';
    editButton.classList.add("student__btn");
    editButton.innerHTML = '<i class="fa fa-pencil btn__icon" aria-hidden="true"></i>';
    deleteButton.classList.add("student__btn");
    deleteButton.innerHTML = '<i class="fa fa-trash btn__icon" aria-hidden="true"></i>';

    editButton.addEventListener("click", (event) => {
        editingStudent = event.target.closest("tr");
        const cells = editingStudent.querySelectorAll("td");
        const groupCell = cells[1].textContent;
        const fullName = cells[2].textContent.split(" ");
        const nameCell = fullName[0];
        const surnameCell = fullName[1];
        const genderCell = cells[3].textContent;
        const birthdayCell = cells[4].textContent;
    
        document.getElementById("group").value = groupCell;
        document.getElementById("name").value = nameCell;
        document.getElementById("surname").value = surnameCell;
        document.getElementById("gender").value = genderCell;
        document.getElementById("birthday").value = birthdayCell;
    
        showEditStudentModal();
        console.log(JSON.stringify({ group: groupCell, name: nameCell, surname: surnameCell, gender: genderCell, birthday: birthdayCell }));
    });
    


    checkbox.onclick = () => {
        const row = tr.querySelector('.status');
        if (checkbox.checked) {
            row.style.color = "green";
        } else {
            row.style.color = "#d8d8d8";
        }
    };

    deleteButton.addEventListener("click", (element) => {
        show(document.getElementById("delete-warn-student"));
        const cancelModalButton = document.getElementById("cancel-modal-btn");
        const deleteModalButton = document.getElementById("delete-modal-btn");

        cancelModalButton.onclick = () => {
            hide(document.getElementById("delete-warn-student"));
        }

        deleteModalButton.onclick = () => {
            currentStudent.remove();
            hide(document.getElementById("delete-warn-student"));
        };
        currentStudent = element.target.closest("tr"); /*знаходить рядок таблиці, який містить кнопку видалення, 
        і зберігає його в змінній currentStudent.*/
    });


    
    actionsContainer.classList.add("table_buttons");
    actionsContainer.appendChild(editButton);
    actionsContainer.appendChild(deleteButton);

    tr.appendChild(checkboxTd);
    tr.appendChild(groupTd);
    tr.appendChild(nameSurnameTd);
    tr.appendChild(genderTd);
    tr.appendChild(birthdayTd);
    tr.appendChild(statusTd);
    tr.appendChild(actionsContainer);

    studentsTable.appendChild(tr);
}

addStudentButton.onclick = () => {
    showAddStudentModal();
};

addStudentForm.onsubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const studentData = Object.fromEntries(formData);
    
    if (editingStudent) {
        updateStudent(editingStudent, studentData);
    } else {
        addStudent(studentData);
    }
    
    hide(addStudentModalWrapper);
};

cancelAddStudentButton.onclick = () => {
    hide(addStudentModalWrapper);
    editingStudent = null;
};

function updateStudent(studentRow, studentData) {
    const cells = studentRow.querySelectorAll("td");
    cells[1].textContent = studentData.group;
    cells[2].textContent = `${studentData.name} ${studentData.surname}`;
    cells[3].textContent = studentData.gender;
    cells[4].textContent = studentData.birthday;
}
addStudentForm.onsubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const studentData = Object.fromEntries(formData);

    const validStudentData = validateAndModifyStudentData(studentData);

    if (validStudentData) {
        try {
            const response = await fetch('http://localhost:5010/saveStudent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(validStudentData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            console.log(responseData);
            
            if (editingStudent) {
                updateStudent(editingStudent, validStudentData);
            } else {
                addStudent(validStudentData);
            }

            hide(addStudentModalWrapper);
        } catch (error) {
            console.error('Error:', error);
            alert('Помилка при спробі зберегти дані.');
        }
    } else {
        alert("Некоректно введені дані.");
    }
};

function validateAndModifyStudentData(studentData) {
    const modifiedStudentData = { ...studentData };

    if (modifiedStudentData.name) {
        modifiedStudentData.name = modifiedStudentData.name.charAt(0).toUpperCase() + modifiedStudentData.name.slice(1).toLowerCase();
        if (!/^[A-Za-z]+$/.test(modifiedStudentData.name)) {
            return null; // Ім'я містить не тільки букви
        }
    }

    if (modifiedStudentData.surname) {
        modifiedStudentData.surname = modifiedStudentData.surname.charAt(0).toUpperCase() + modifiedStudentData.surname.slice(1).toLowerCase();
        if (!/^[A-Za-z]+$/.test(modifiedStudentData.surname)) {
            return null; // Прізвище містить не тільки букви
        }
    }

    if (!modifiedStudentData.name || !modifiedStudentData.surname || !modifiedStudentData.group || !modifiedStudentData.gender || !modifiedStudentData.birthday) {
        return null; // Один або декілька обов'язкових полів відсутні
    }

    const birthdayRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!birthdayRegex.test(modifiedStudentData.birthday)) {
        return null; // Неправильний формат дати народження
    }

    return modifiedStudentData;
}

 
