const express = require("express");
var cors = require("cors");
var mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
app = express();
app.use(express.json());
app.use(cors());
var connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
});



connection.connect();

//get city
app.get("/dropdown", (req, res) => {
  connection.query(
    "select id as value,cityName as cityName from city",
    function (error, results) {
      if (error) {
        console.log(error);
        return res.status(500).send("Error inserting user");
      }
      res.json(results);
    }
  );
});
//get state
app.get("/dropdown1", (req, res) => {
  connection.query(
    "select id as value,stateName as stateName from state",
    function (error, results) {
      if (error) {
        console.log(error);
        return res.status(500).send("Error inserting user");
      }
      res.json(results);
    }
  );
});
//verification token
app.put("/verify", (req, res) => {
  try {
    // console.log(req.body.token,'Verify token');
    const token = req.body.token;

    const verified = jwt.verify(token, "secret");
    console.log("verified", verified);

    if (verified) {
      console.log("verified", verified);

      connection.query(
        "update userTable set isVerified = 1 where email = ?",
        [verified.email],
        function (error, results) {
          if (error) {
            console.log(error);
          } else {
            console.log("results", results);
            res.json("User verified successfully");
          }
        }
      );
    } else {
      return res.send("error");
    }
  } catch (err) {
    return res.send("error");
  }
});

//login
app.post("/login", (req, res) => {
  console.log("---------------------------------");
  const { email, passwords } = req.body;
  console.log(req.body);
  console.log(email);
  connection.query(
    "SELECT email,passwords,isVerified FROM userTable WHERE email = ?",
    [email, passwords],
    function (error, results) {
      if (error) {
        console.log(error);
        return res.json("Error inserting user");
      } else {
        console.log("========================");
        console.log(results);
        if (results.length > 0) {
          console.log("111111111111111111111111111");
          if (results[0].isVerified == 1) {
            if (bcrypt.compareSync(passwords, results[0].passwords)) {
              console.log("0000000000000");
              res.json(results);
            } else {
              res.json("Incorrect password");
            }
          } else {
            res.json("User not verified");
          }
        } else {
          res.json("User not found");
        }
      }
      console.log(results);
    }
  );
});

//insert code
app.post("/insert", (req, res) => {
  console.log(req.body);
  var token = jwt.sign({ email: req.body.email }, "secret");
  console.log(token);
  connection.query(
    "SELECT * FROM userTable WHERE email = ?",
    [req.body.email],
    function (error, results) {
      if (results.length > 0) {
        // console.log("email already exists");
        if (results[0].isVerified == 1) {
          console.log("User already verified");
          res.json("User already verified");
        } else {
          console.log("User not verified");
          sendMail(req.body.email, token);
        }
      } else {
        bcrypt.hash(req.body.passwords, 10, function (err, hash) {
          if (err) {
            console.log(err);
            // return res.status(500).send("Error hashing");
            console.log("Error hashing");
          }
          connection.query(
            "INSERT INTO userTable (email, passwords, userName, address, stateId, cityId) VALUES (?, ?, ?, ?, ?, ?)",
            [
              req.body.email,
              hash,
              req.body.username,
              req.body.address,
              req.body.state,
              req.body.city,
            ],
            function (error, results) {
              if (error) {
                console.log(error);
                // return res.status(500).send("Error inserting user");
                console.log("Error inserting user");
              }
              res.json(results);
              sendMail(req.body.email, token);
            }
          );
        });
      }
    }
  );
});

// mailtrap
function sendMail(mailId, token) {
  console.log("AAAAAAAAAAAAAA", mailId, token);
  return new Promise((resolve, reject) => {
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "b383712716b606",
        pass: "4582315b8c338d",
      },
    });

    var mailOptions = {
      from: "admin@gmail.com",
      to: mailId,
      subject: "Please verify your mail",
      text: "To verify your account",
      html:
        '<html><body><p>To verify your account</p><a href="http://localhost:4200/login?token=' +
        token +
        '">Click here</a></body></html>',
    };

    transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent successfully");
        resolve(true);
      }
    });
  });
}
app.listen(5000, () => {
  console.log("listening on port 5000");
});
//proper code
// app.post('/insert', (req, res) => {
//   connection.query(
//     'SELECT * FROM userTable WHERE email = ?',
//     [req.body.email],
//     function (error, results) {
//       if (results.length > 0) {
//         res.json('email already exists');
//       } else {
//         bcrypt.hash(req.body.passwords, 10, function (err, hash) {
//           if (err) {
//             console.log(err);
//             return res.status(500).send('Error hashing password');
//           }
//           connection.query(
//             'INSERT INTO userTable (email, passwords, userName, address, stateId, cityId) VALUES (?, ?, ?, ?, ?, ?)',
//             [
//               req.body.email,
//               hash,
//               req.body.username,
//               req.body.address,
//               req.body.state,
//               req.body.city,
//             ],
//             function (error, results) {
//               if (error) {
//                 console.log(error);
//                 return res.status(500).send('Error inserting user');
//               }
//               const email = new SendEmail(req.body.email);
//               res.json(results);
//             });
//         });
//       }
//     });
// });

// // personal mail
// class SendEmail {
//   constructor(email) {
//     this.transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'ajithmckumar@gmail.com',
//         pass: 'vtracihrzxnbbhbq',
//       },
//     });
//     this.email = email;
//     this.sendEmail();
//   }

//   generateVerificationCode() {
//     const code = Math.floor(1000 + Math.random() * 9000);
//     return code.toString();
//   }

//   sendEmail() {
//     const emailMessage = {
//       from: 'ajithmckumar@gmail.com',
//       to: this.email,
//       subject: 'Email Verification',
//       html: `<html>
//         <body>
//           <p>To verify your account, please click the link below:</p>
//           <a href="http://localhost:4200/login?token=${this.generateVerificationCode()}">Click here</a>
//         </body>
//       </html>`,
//     };

//     this.transporter.sendMail(emailMessage, (error, info) => {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log('Email sent:', info.response);
//       }
//     });
//   }
// }
// app.listen(5000, () => {
//   console.log("listening on the port 5000");
// });
