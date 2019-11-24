/* eslint-disable no-shadow */
/** Import Database */
/** Import BCrypt */
const bcrypt = require('bcrypt');
// Import JSONWEBTOKEN
const jwt = require('jsonwebtoken');
const db = require('../database/db');

// Routes
const createUser = (req, res, next) => {
  // Check DB If email exists
  db.connect((err, client, done) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Check database credentials',
      });
    }
    client.query('SELECT * FROM users WHERE email=$1', [req.body.email], (selectQueryError, selectQueryResult) => {
      if (selectQueryError) throw err;

      // User Does Not Exist
      if (selectQueryResult.rowCount <= 0) {
        // Create the hash
        bcrypt.hash(req.body.password, 8).then(
          (hash) => {
            // Connect the DB
            db.connect((err, client, done) => {
              if (err) throw err;
              client.query('INSERT INTO public.users ("firstName", "lastName", email, password, gender, "jobRole", department, address) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
                [req.body.firstName, req.body.lastName, req.body.email, `${hash}`, req.body.gender, req.body.jobRole, req.body.department, req.body.address],
                (insertQueryError, insertQueryResult) => {
                  if (insertQueryError) {
                    res.status(500).json({
                      status: 'error',
                      message: 'unable to create user, please try again',
                    });
                  }

                  // If user is successfully created
                  // Generate Token and return payload
                  if (insertQueryResult) {
                    client.query('SELECT * FROM users WHERE password=$1', [hash],
                      (selectQueryError, selectQueryResult) => {
                        if (selectQueryError) {
                          res.status(400).json({
                            status: 'error',
                            message: 'unable to find user',
                          });
                        }
                        if (selectQueryResult) {
                          const data = selectQueryResult.rows;
                          // Generate Token
                          const token = jwt.sign(
                            { userId: data[0].id },
                            'TEAMWORK',
                            { expiresIn: '24h' },
                          );
                          // Provide Response
                          return res.status(200).json({
                            status: 'success',
                            data: {
                              message: 'User account successfully created',
                              token,
                              userId: data[0].id,
                            },
                          });
                        }
                      });
                  }
                  done();
                });
            });
          },
        ).catch((err) => {
          res.status(500).json({
            status: 'error',
            message: 'Unable to create a user',
          });
        });
      }

      // User Exists
      if (selectQueryResult.rowCount > 0) {
        res.status(400).json({
          status: 'error',
          message: 'User exists',
        });
      }
    });
    done();
  });
};

const signIn = (req, res, next) => {
  // Check if email and password is provided
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      status: 'error',
      message: 'Identity verification unavailable',
    });
  }
  // Check DB if email exists
  db.connect((err, client, done) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Check database credentials',
      });
    }
    client.query('SELECT * FROM users WHERE email=$1', [req.body.email], (selectQueryError, selectQueryResult) => {
      if (selectQueryError) throw err;
      // User Does Not Exist
      if (selectQueryResult.rowCount <= 0) {
        res.status(400).json({
          status: 'error',
          message: 'User does not exist',
        });
      }
      // User Exists
      if (selectQueryResult.rowCount > 0) {
        const data = selectQueryResult.rows[0];
        // Compare password with hash in the DB
        bcrypt.compare(req.body.password, data.password).then(
          (valid) => {
            if (!valid) {
              return res.status(400).json({
                status: 'error',
                message: 'Incorrect password',
              });
            }
            // Password is correct
            // Generate Token
            const token = jwt.sign(
              { userId: data.id },
              'TEAMWORK',
              { expiresIn: '24h' },
            );
            res.status(200).json({
              status: 'success',
              data: {
                token,
                userId: data.id,
              },
            });
          },
        ).catch(
          (err) => {
            res.status(500).json({
              status: 'error',
              message: 'Identity verification unavailable',
            });
          },
        );
      }
    });
    done();
  });
};

module.exports = {
  createUser,
  signIn,
};
