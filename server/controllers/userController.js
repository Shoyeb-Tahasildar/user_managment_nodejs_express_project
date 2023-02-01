const mysql = require("mysql");
//connection pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

//connect to db

//view users
exports.view = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("coonected as ID" + connection.threadId);

    //user the connection
    connection.query(
      "SELECT * FROM user WHERE status = 'active'",
      (err, rows) => {
        //when done with the connection ,release it
        connection.release();
        if (!err) {
          let removeduser  =  req.query.removed;
          res.render("home", { rows,removeduser });
        } else {
          console.log(err);
        }
        console.log("the dataf rom user table :\n ", rows);
      }
    );
  });
};

//find user
exports.find = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("coonected as ID" + connection.threadId);
    let searchTerm = req.body.search;
    console.log(searchTerm);
    //user the connection
    connection.query(
      "SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?",
      ["%" + searchTerm + "%", "%" + searchTerm + "%"],
      (err, rows) => {
        //when done with the connection ,release it
        connection.release();
        if (!err) {
          res.render("home", { rows });
        } else {
          console.log(err);
        }
        console.log("the data rom user table :\n ", rows);
      }
    );
  });
};

exports.form = (req, res) => {
  res.render("adduser");
};

//add new user
exports.create = (req, res) => {
  // res.render("adduser");

  const { first_name, last_name, email, phone, comments } = req.body;
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("coonected as ID" + connection.threadId);
    let searchTerm = req.body.search;
    console.log(searchTerm);
    //user the connection
    connection.query(
      "Insert INTO user SET first_name=?, last_name = ?,email = ?,phone = ? ,comments = ?",
      [first_name, last_name, email, phone, comments],
      (err) => {
        //when done with the connection ,release it
        connection.release();
        if (!err) {
          res.render("adduser", { alert: "User Added successfully." });
        } else {
          console.log(err);
        }
        console.log("the data rom user table :\n ");
      }
    );
  });
};

//edit user
exports.edituser = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("coonected as ID" + connection.threadId);
    //user the connection

    connection.query(
      "SELECT * FROM user WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        //when done with the connection ,release it
        connection.release();
        if (!err) {
          res.render("edituser", { rows });
        } else {
          console.log(err);
        }
        console.log("the data from user table :\n ", rows);
      }
    );
  });
};

//update user
exports.update = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("coonected as ID" + connection.threadId);
    //user the connection
    connection.query(
      "UPDATE user SET first_name = ? , last_name = ?, email = ?,phone = ?,comments = ? where id = ?",
      [first_name, last_name, email, phone, comments, req.params.id],
      (err, rows) => {
        //when done with the connection ,release it
        connection.release();
        if (!err) {
          pool.getConnection((err, connection) => {
            if (err) throw err;
            console.log("coonected as ID" + connection.threadId);
            //user the connection

            connection.query(
              "SELECT * FROM user WHERE id = ?",
              [req.params.id],
              (err, rows) => {
                //when done with the connection ,release it
                connection.release();
                if (!err) {
                  res.render("edituser", {
                    rows,
                    alert: `${first_name} has been updated`,
                  });
                } else {
                  console.log(err);
                }
                console.log("the data from user table :\n ", rows);
              }
            );
          });
        } else {
          console.log(err);
        }
        console.log("the dataf rom user table :\n ", rows);
      }
    );
  });
};

//delete user
exports.delete = (req, res) => {
  // pool.getConnection((err, connection) => {
  //   if (err) throw err;
  //   console.log("coonected as ID" + connection.threadId);
  //   //user the connection

  //   connection.query(
  //     // console.log(req.params.id),
  //     `DELETE FROM user WHERE id = ?`,
  //     [req.params.id],
  //     (err, rows) => {
  //       //when done with the connection ,release it
  //       connection.release();
  //       if (!err) {
  //         res.redirect('/');
  //       } else {
  //         console.log(err);
  //       }
  //       console.log("the data from user table :\n ", rows);
  //     }
  //   );
  // });

  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("coonected as ID" + connection.threadId);
    //user the connection

    connection.query(
      // console.log(req.params.id),
      `UPDATE user SET status = ? WHERE id = ?`,
      ["removed", req.params.id],
      (err, rows) => {
        //when done with the connection ,release it
        connection.release();
        if (!err) {
          let removeduser = encodeURIComponent('User successfully removed.');
          res.redirect(`/?removed=` + removeduser);
        } else {
          console.log(err);
        }
        console.log("the data from user table :\n ", rows);
      }
    );
  });
};

//view detail user page
exports.viewuser = (req, res) => {
  //user the connection
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("coonected as ID" + connection.threadId);
  connection.query(
    "SELECT * FROM user WHERE id = ?",
    [req.params.id],
    (err, rows) => {
      //when done with the connection ,release it
      connection.release();
      if (!err)
      {
        res.render("view-user", { rows });
      } else 
      {
        console.log(err);
      }
      console.log("the data from user table :\n ", rows);
    }
  )});
};
