/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
*  Name: Akshar Jigneshkumar Pastagia     Student ID: 186241238     Date: 04/03/2025
*  Online (Vercel) Link: https://your-web700-app.vercel.app
********************************************************************************/

const express = require("express");
const path = require("path");
const collegeData = require("./collegeData");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Set EJS as the View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => res.render("home"));
app.get("/about", (req, res) => res.render("about"));
app.get("/htmlDemo", (req, res) => res.render("htmlDemo"));
app.get("/students/add", (req, res) => res.render("addStudent"));

// All Students
app.get("/students", (req, res) => {
    collegeData.getAllStudents()
        .then(data => res.render("students", { students: data }))
        .catch(() => res.render("students", { message: "No Students Found" }));
});

// Students by Course (Fixed Route)
// Students by Course
app.get("/studentsByCourse", (req, res) => {
    const courseCode = req.query.courseCode;

    if (!courseCode) {
        return res.render("students", { message: "Course code not provided." });
    }

    collegeData.getStudentsByCourse(courseCode)
        .then((students) => {
            if (students && students.length > 0) {
                res.render("students", { students: students }); // Properly send 'students' to students.ejs
            } else {
                res.render("students", { message: `No students found for course: ${courseCode}` });
            }
        })
        .catch((err) => {
            console.error("Error retrieving students by course: ", err);
            res.render("students", { message: "An error occurred while retrieving the course." });
        });
});



// Single Student by Student Number (Fixed Route)
app.get("/studentByNum", (req, res) => {
    const studentNum = req.query.studentNum;
    if (!studentNum) {
        return res.render("student", { message: "Student Number is required" });
    }
    collegeData.getStudentByNum(studentNum)
        .then(data => res.render("student", { student: data }))
        .catch(() => res.render("student", { message: "No Student Found" }));
});

// Teaching Assistants
app.get("/tas", (req, res) => {
    collegeData.getTAs()
        .then(data => res.render("students", { students: data }))
        .catch(() => res.render("students", { message: "No TAs Found" }));
});

// All Courses
app.get("/courses", (req, res) => {
    collegeData.getCourses()
        .then(data => res.render("courses", { courses: data }))
        .catch(() => res.render("courses", { message: "No Courses Found" }));
});

// Add Student (POST)
app.post('/students/add', (req, res) => {
    collegeData.addStudent(req.body)
        .then(() => res.redirect('/students'))
        .catch(() => res.status(500).send("Error adding student."));
});

// Update Student (POST)
app.post("/student/update", (req, res) => {
    collegeData.updateStudent(req.body)
        .then(() => res.redirect("/students"))
        .catch(() => res.status(500).send("Error updating student."));
});

// 404 Error
app.use((req, res) => res.status(404).send("Page Not Found"));

// Start Server
collegeData.initialize().then(() => {
    app.listen(HTTP_PORT, () => console.log(`Server running on port ${HTTP_PORT}`));
}).catch(err => console.log(err));
