const express = require("express");
const path = require("path");
const app = express();
const port = 5000;

// In-memory storage for user data
const users = [];

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Serve the HTML form
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// Handle form submission
app.post("/post", (req, res) => {
    const { 
        name, 
        email, 
        phone, 
        dob, 
        gender, 
        class: userClass, 
        emergency, 
        activities, 
        bloodGroup, 
        address, 
        parentGuidelines 
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !dob || !gender || !userClass || !emergency || !activities || !bloodGroup || !address || !parentGuidelines) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Create a new user object
    const user = {
        name,
        email,
        phone,
        dob,
        gender,
        class: userClass,
        emergency,
        activities,
        bloodGroup,
        address,
        parentGuidelines
    };

    // Add the user to the in-memory storage
    users.push(user);

    // Log the user data to the console
    console.table(user);
    
    // Redirect to the users page to display the saved data
    res.redirect("/users");
});

// New route to display user data in a table
app.get("/users", (req, res) => {
    let html = `
        <html>
        <head>
            <title>User Data</title>
            <style>
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid black;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
            </style>
        </head>
        <body>
            <h1>User Data</h1>
            <table>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Date of Birth</th>
                    <th>Gender</th>
                    <th>Class</th>
                    <th>Emergency Contact</th>
                    <th>Activities</th>
                    <th>Blood Group</th>
                    <th>Address</th>
                    <th>Parent Guidelines</th>
                </tr>`;

    // Populate the table with user data
    users.forEach(user => {
        html += `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.dob}</td>
                <td>${user.gender}</td>
                <td>${user.class}</td>
                <td>${user.emergency}</td>
                <td>${user.activities}</td>
                <td>${user.bloodGroup}</td>
                <td>${user.address}</td>
                <td>${user.parentGuidelines}</td>
            </tr>`;
    });

    html += `
            </table>
            <br>
            <a href="/">Go Back to Form</a>
        </body>
        </html>`;

    res.send(html);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});