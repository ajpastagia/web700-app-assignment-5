const fs = require("fs");
const path = require("path");

// ✅ Define paths for JSON files
const studentsFilePath = path.join(__dirname, "data", "students.json");
const coursesFilePath = path.join(__dirname, "data", "courses.json");

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

// ✅ Initialize Data (Read JSON Files)
function initialize() {
    return new Promise((resolve, reject) => {
        fs.readFile(coursesFilePath, "utf8", (err, courseData) => {
            if (err) {
                console.error("❌ Error reading courses.json:", err);
                return reject("Unable to load courses");
            }

            fs.readFile(studentsFilePath, "utf8", (err, studentData) => {
                if (err) {
                    console.error("❌ Error reading students.json:", err);
                    return reject("Unable to load students");
                }

                // ✅ Load students and courses into memory
                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                console.log("✅ Data successfully loaded.");
                resolve();
            });
        });
    });
}

// ✅ Save Students Data to JSON File
function saveStudentsToFile() {
    return new Promise((resolve, reject) => {
        fs.writeFile(studentsFilePath, JSON.stringify(dataCollection.students, null, 4), (err) => {
            if (err) {
                console.error("❌ Error saving students data:", err);
                reject("Error saving students data");
            } else {
                console.log("✅ Students data successfully saved.");
                resolve();
            }
        });
    });
}

// ✅ Export functions properly
module.exports = {
    initialize,
    
    getAllStudents: function () {
        return new Promise((resolve, reject) => {
            if (!dataCollection) {
                reject("Data not initialized");
                return;
            }
            resolve(dataCollection.students);
        });
    },

    getTAs: function () {
        return new Promise((resolve, reject) => {
            if (!dataCollection) {
                reject("Data not initialized");
                return;
            }
            resolve(dataCollection.students.filter(student => student.TA === true));
        });
    },

    getCourses: function () {
        return new Promise((resolve, reject) => {
            if (!dataCollection) {
                reject("Data not initialized");
                return;
            }
            resolve(dataCollection.courses);
        });
    },

    getStudentByNum: function (num) {
        return new Promise((resolve, reject) => {
            if (!dataCollection) {
                reject("Data not initialized");
                return;
            }
            const student = dataCollection.students.find(student => student.studentNum == num);
            if (student) resolve(student);
            else reject("Student Not Found");
        });
    },

    updateStudent: function (studentData) {
        return new Promise((resolve, reject) => {
            if (!dataCollection) {
                reject("Data not initialized");
                return;
            }

            const studentIndex = dataCollection.students.findIndex(student => student.studentNum == studentData.studentNum);
            if (studentIndex === -1) {
                reject("Student Not Found");
                return;
            }

            // ✅ Update the student data with new fields
            dataCollection.students[studentIndex] = {
                ...dataCollection.students[studentIndex],
                firstName: studentData.firstName,
                lastName: studentData.lastName,
                email: studentData.email,
                course: studentData.course,
                TA: studentData.TA === 'on',
                status: studentData.status,
                addressStreet: studentData.addressStreet,
                addressCity: studentData.addressCity,
                addressProvince: studentData.addressProvince
            };

            // ✅ Save the updated data to students.json
            saveStudentsToFile()
                .then(() => resolve())
                .catch(err => reject(err));
        });
    },

    // ✅ Get Students by Course
    getStudentsByCourse: function (courseCode) {
        return new Promise((resolve, reject) => {
            console.log(courseCode)
            if (!dataCollection) {
                console.log("Data is not getting initiailzied")
                reject("Data not initialized");
                return;
            }
            const filteredStudents = dataCollection.students.filter(student => student.course === courseCode);
            console.log("Filtered Students for course:", courseCode, filteredStudents); // Debugging log

            if (filteredStudents.length > 0) {
                resolve(filteredStudents);
            } else {
                reject("No Students Found for the specified Course.");
            }
        });
    },

    // ✅ Get Managers
    getManagers: function () {
        return new Promise((resolve, reject) => {
            if (!dataCollection) {
                reject("Data not initialized");
                return;
            }
            const managers = dataCollection.students.filter(student => student.TA === true && student.status === "Full Time");
            if (managers.length > 0) {
                resolve(managers);
            } else {
                reject("No Managers Found.");
            }
        });
    }
};
