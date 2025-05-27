let isEditing = false;
let editStudentId = null
const addRecord = document.getElementById('addRecord')
const form = document.getElementsByTagName('form')
const studentName = document.getElementById('name');
const id = document.getElementById('id')
const email = document.getElementById('email')
const phone = document.getElementById('phone')
const labels = document.getElementsByTagName('label')
const formContainer = document.getElementById('formDiv')
const table = document.getElementsByTagName('table')
const tableBody = document.getElementsByTagName('tbody')
const tableContainer = document.getElementById('tableContainer')

let new_p = document.createElement('p')


// get students data from local storage
let students = JSON.parse(localStorage.getItem('students')) || [];
displayStudents(students)

//Add scroll bar dynamically
if(tableContainer.scrollHeight > tableContainer.clientHeight) {
        console.log('yes')
        tableContainer.style.overflowY = 'auto';
    }

// Form submission code
form[0].addEventListener('submit', function (e) {

    e.preventDefault();
    new_p.textContent = ''

    // Check input values are not empty.
    if (!studentName.value || !id.value || !email.value || !phone.value) {
        displayMessage('All fields are mandatory', true, 5000)
        return;
    }

    // Check student name contain only alphabets
    if (studentName.value) {
        for (let i = 0; i < studentName.value.length; i++) {
            const Ascii_code = studentName.value.charCodeAt(i)
            console.log('Ascii_code::::::::::::::::::::::::::::', Ascii_code)
            if (!(Ascii_code >= 65 && Ascii_code <= 90) && !(Ascii_code >= 97 && Ascii_code <= 122) && !(Ascii_code === 32)) {
                displayMessage('Name should contain alphabets only', true, 5000)
                return;
            }
        }
    }

    // Validate ID
    if(!validateNumber(id.value)) {
        displayMessage('ID is not a valid number', true, 5000)
        return;
    }

    // Check if email is valid
    if (!validateEmail(email.value)) {
        displayMessage('Email is not valid', true, 5000)
        return;
    }

    // Validate Phone
    if( !validateNumber(phone.value) ) {
        displayMessage('Phone number is not a valid number', true, 5000)
        return;
    }

    const studentData = {
        name: studentName.value,
        id: id.value,
        email: email.value,
        phone: phone.value
    }

    // Edit record code
    if (isEditing) {
        console.log('editing')
        //update that record only where id matches, rest return as it is.
        students = students.map((student) => {
            if (parseInt(student.id) === parseInt(id.value)) {
                return studentData
            }
            else {
                return student
            }
        })

        isEditing = false;
        editStudentId = null;
        id.disabled = false;
        addRecord.value = 'ADD'
        localStorage.setItem('students', JSON.stringify(students))
        displayStudents(students)
        displayMessage('Record Updated Successfully', false, 2000)
    }
    else {
        //Check if ID is unique.
        const isStudentIdInUse = students.filter((student) => {
            if (student.id === id.value) {
                return student
            }
            else {
                return
            }
        })
        // If Id is not unique return with appropriate message.
        if (isStudentIdInUse.length > 0) {
            new_p.innerHTML = 'ID is in use, Please enter different ID.'
            new_p.classList.remove('text-white')
            new_p.classList.add('text-red-600', 'text-center', 'text-xl', 'font-bold')
            formContainer.insertBefore(new_p, form[0])
            // Hide Record created message after 2 seconds.
            setTimeout(() => {
                new_p.innerHTML = ''
                formContainer.insertBefore(new_p, form[0])
            }, 5000)
            return;
        }
        //push new record to local storage.
        students.push(studentData)
        localStorage.setItem('students', JSON.stringify(students))
        displayStudents(students)
        displayMessage('Record Added Successfully', false, 2000)
    }

    // Empty the input fields.
    form[0].reset();
})

function displayMessage(msg, isErrorMsg, timeout) {
    new_p.innerHTML = msg;
    if(isErrorMsg) {
         new_p.classList.remove('text-green-500')
        new_p.classList.add('text-center', 'text-2xl', 'font-bold', 'text-red-600')
    }
    else {
        new_p.classList.remove('text-red-600')
        new_p.classList.add('text-center', 'text-2xl', 'font-bold', 'text-green-500')
    }
    formContainer.insertBefore(new_p, form[0])
    
    // After defined timeout remove the message.
    setTimeout(() => {
        new_p.innerHTML = ''
        formContainer.insertBefore(new_p, form[0])
    }, timeout)
}

function displayStudents(students) {
    tableBody[0].innerHTML = ``
    // For each student create new table row and append student data into td tag and append the table row to tbod
    students.forEach((student) => {
        const tr = document.createElement('tr')
        tr.innerHTML = ` <td> ${student.name} </td> <td>${student.id}</td> <td>${student.email}</td> <td>${student.phone}</td> <td> <button onclick="updateRecord(${student.id})" class = 'text-white px-4 py-1 rounded-[8px] bg-green-500 hover:bg-green-800 border-2'
        > <a href="#mainContainer"> Edit</a> </button >  <button onclick="deleteRecord(${student.id})" class="delBtn text-white px-4 py-1 rounded-[8px] bg-red-500 hover:bg-red-800 border-2 ml-3 mt-2 lg:mt-0"> Delete </button> </td>`
        tableBody[0].appendChild(tr)
    })
}

function updateRecord(studentId) {
    const record = students.find((student) => parseInt(student.id) === parseInt(studentId))
    // Fill the student detail in input fields and change the value of add button to update.
    studentName.value = record.name
    id.value = studentId
    email.value = record.email
    phone.value = record.phone

    isEditing = true;
    editStudentId = studentId;

    id.disabled = true;
    addRecord.value = 'Update'
}

function deleteRecord(id) {
    // filter out the deleted student data from the students array and set the updated students array to local storage.
    students = students.filter((student) => {
        if (parseInt(student.id) !== parseInt(id)) {
            return student;
        }

    })

    localStorage.setItem('students', JSON.stringify(students))
    displayStudents(students)
}

function validateEmail(email) {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
}

function validateNumber(num) {
    const pattern = /^\d+$/
    console.log(pattern.test(num))
    return pattern.test(num)
}

