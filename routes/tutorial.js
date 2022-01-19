const express = require('express');
const authToken = require('./verifytoken');

const router = express.Router();

const {
  getTutorial,
  postTutorial,
  putTutorial,
  deleteTutorial,
  findTutorial,
  findByTitleTutorial,
  registerUser,
  loginUser,
  forgetPasswordUser,
  resetPasswordUser,
} = require('../controllers/tutorial');

/**
 * @swagger
 * {
    'tags': [
      {
        'name': 'Tutorials',
        'description': 'Everything about managing Tutorials'
      }
    ],
   
     'definitions': {
        'Tutorials': {
          'type': 'object',
          'properties': {
            'title': {
              'type': 'string'
            },
            'description': {
              'type': 'string'
            },
            'published': {
                'type': 'boolean'
            }
          }
        },
         "UsersRegister": {
          "required": [
              "username",
              "email",
              "password"
            ],
          "properties": { 
           "username": {
              "type": "string"
            },
            "email": {
              "type": "string"
            },
            "password": {
              "type": "string"
            }
          }
        },
        "UsersLogin": {
          "required": [
              "email",
              "password"
            ],
          "properties": { 
            "email": {
              "type": "string"
            },
            "password": {
              "type": "string"
            }
          }
        },
        "UsersForgetPass": {
          "required": [
              "email",
             
            ],
          "properties": { 
            "email": {
              "type": "string"
            }
          },
          
        },
        "UsersResetPass": {
            "required": [
              "email",
              "otp",
              "newpassword",
            ],
            "properties": { 
              "email": {
                "type": "string"
              },
              "otp": {
                "type": "string"
              },
              "newpassword": {
                "type": "string"
              }
            }
          },
      },
      components: {
        securitySchemes: {
          Baerer: {
            type: 'apiKey',
            name: 'auth-token',
            in: 'header'
          }
        }
    },
    'paths': {
      '/tutorials': {
        'get': {
          'summary': 'Returns the list of Tutorials',
          'tags': ['Tutorials'],
          'produces': [
              'application/json'
            ],
            'parameters': [
              {
                  'name':'sorting',
                  'in':'query',
                  'description':'sort by [asc,desc]',
                  'required': true,
                  'type':'string',
                  'schema': {
                    'type':'string',
                    'enum':[
                    'asc','desc'
                  ]
                  }

              },
              {
                  'name':'at',
                  'in':'query',
                  'description':'sort by [field name]',
                  'required': true,
                  'type':'string',
                  'schema': {
                    'type':'string',
                    'enum':[
                    'createdAt','updatedAt'
                  ]
                  }

              }
          ],
          security: [{
            Baerer: [],
          }],
          'responses': {
            '200': {
              'description': 'successful operation',
              'schema': {
                '$ref': '#/definitions/Tutorials'
              }
            },
            '400': {
              'description': 'Invalid username supplied'
            },
            '404': {
              'description': 'User not found'
            }
          }
        }
      },
      '/tutorials/{id}': {
        'get': {
          'summary': 'Returns the list of Tutorials by id',
          'tags': ['Tutorials'],
          'produces': [
              'application/json'
            ],
          'parameters': [
              {
                  'name':'id',
                  'in':'path',
                  'description':'id of the tutorial to retrieve',
                  'required': true,
                  'type':'integer',
                  'format':'int64'

              }
          ],
         security: [{
            Baerer: [],
          }],
          'responses': {
            '200': {
              'description': 'successful operation',
              'schema': {
                '$ref': '#/definitions/Tutorials'
              }
            },
            '400': {
              'description': 'Invalid username supplied'
            },
            '404': {
              'description': 'User not found'
            }
          }
        }
      },
      '/tutorials/search/{title}': {
        'get': {
          'summary': 'Returns the list of Tutorials by title/ search by title',
          'tags': ['Tutorials'],
          'produces': [
              'application/json'
            ],
          'parameters': [
              {
                  'name':'title',
                  'in':'path',
                  'description':'title of the tutorial to retrieve',
                  'required': true,
                  'type':'string'
              },
               {
                  'name':'sorting',
                  'in':'query',
                  'description':'sort by [asc,desc]',
                  'required': true,
                  'type':'string',
                  'schema': {
                    'type':'string',
                    'enum':[
                    'asc','desc'
                  ]
                  }

              },
              {
                  'name':'at',
                  'in':'query',
                  'description':'sort by [field name]',
                  'required': true,
                  'type':'string',
                  'schema': {
                    'type':'string',
                    'enum':[
                    'createdAt','updatedAt'
                  ]
                  }

              }
          ],
          security: [{
            Baerer: [],
          }],
          'responses': {
            '200': {
              'description': 'successful operation',
              'schema': {
                '$ref': '#/definitions/Tutorials'
              }
            },
            '400': {
              'description': 'Invalid username supplied'
            },
            '404': {
              'description': 'User not found'
            }
          }
        }
      },
       '/tutorials/post': {
        'post': {
          'summary': 'add the tutorial to the database',
          'tags': ['Tutorials'],

          'requestBody': {
              'required': true,
              'content': {
                'application/json': {
                  'schema': {
                    '$ref': '#/definitions/Tutorials'
                  }
                }
              }
          },
          security: [{
            Baerer: [],
          }],
          'responses': {
            '200': {
              'description': 'successful operation',
              'schema': {
                '$ref': '#/definitions/Tutorials'
              }
            },
            '400': {
              'description': 'some error'
            },
            '500': {
              'description': 'some server error'
            }
          }
        }
      },
        '/tutorials/put/{id}': {
        'put': {
          'summary': 'add the tutorial to the database',
          'tags': ['Tutorials'],
          'parameters': [
              {
                  'name':'id',
                  'in':'path',
                  'description':'id of the tutorial to retrieve',
                  'required': true,
                  'type':'string'
              }
          ],
          'requestBody': {
              'required': true,
              'content': {
                'application/json': {
                  'schema': {
                    '$ref': '#/definitions/Tutorials'
                  }
                }
              }
          },
          security: [{
            Baerer: [],
          }],
          'responses': {
            '200': {
              'description': 'successful operation',
              'schema': {
                '$ref': '#/definitions/Tutorials'
              }
            },
            '400': {
              'description': 'some error'
            },
            '500': {
              'description': 'some server error'
            }
          }
        }
      },
        '/tutorials/delete/{id}': {
        'delete': {
          'summary': 'add the tutorial to the database',
          'tags': ['Tutorials'],
           'parameters': [
              {
                  'name':'id',
                  'in':'path',
                  'description':'id of the tutorial to retrieve',
                  'required': true,
                  'type':'integer',
                  'format':'int64'

              }
          ],
          security: [{
            Baerer: [],
          }],
          'responses': {
            '200': {
              'description': 'successful operation',
              'schema': {
                '$ref': '#/definitions/Tutorials'
              }
            },
            '400': {
              'description': 'some error'
            },
            '500': {
              'description': 'some server error'
            }

          }

        }
      },
      '/tutorials/register/user': {
        'post': {
          'summary': 'add new user',
          'tags': ['User'],

          'requestBody': {
              'required': true,
              'content': {
                'application/json': {
                  'schema': {
                    '$ref': '#/definitions/UsersRegister'
                  }
                }
              }
          },
          // security: [{
          //   Baerer: [],
          // }],
          'responses': {
            '200': {
              'description': 'successful operation',
              'schema': {
                '$ref': '#/definitions/UsersRegister'
              }
            },
            '400': {
              'description': 'some error'
            },
            '500': {
              'description': 'some server error'
            }
          }
        }
      },
      '/tutorials/login/user': {
        'post': {
          'summary': 'user login',
          'tags': ['User'],

          'requestBody': {
              'required': true,
              'content': {
                'application/json': {
                  'schema': {
                    '$ref': '#/definitions/UsersLogin'
                  }
                }
              }
          },
          // security: [{
          //   Baerer: [],
          // }],
          'responses': {
            '200': {
              'description': 'successful operation',
              'schema': {
                '$ref': '#/definitions/UsersLogin'
              }
            },
            '400': {
              'description': 'some error'
            },
            '500': {
              'description': 'some server error'
            }
          }
        }
      },
      '/tutorials/forgetpassword/user': {
        'post': {
          'summary': 'take email from the user, sends the otp to email',
          'tags': ['User'],

          'requestBody': {
              'required': true,
              'content': {
                'application/json': {
                  'schema': {
                    '$ref': '#/definitions/UsersForgetPass'
                  }
                }
              }
          },
          // security: [{
          //   Baerer: [],
          // }],
          'responses': {
            '200': {
              'description': 'successful operation',
              'schema': {
                '$ref': '#/definitions/UsersForgetPass'
              }
            },
            '400': {
              'description': 'some error'
            },
            '500': {
              'description': 'some server error'
            }
          }
        }
      },
      '/tutorials/resetpassword/user': {
        'post': {
          'summary': 'takes email and otp from the user, sets the new password',
          'tags': ['User'],

          'requestBody': {
              'required': true,
              'content': {
                'application/json': {
                  'schema': {
                    '$ref': '#/definitions/UsersResetPass'
                  }
                }
              }
          },
          // security: [{
          //   Baerer: [],
          // }],
          'responses': {
            '200': {
              'description': 'successful operation',
              'schema': {
                '$ref': '#/definitions/UsersResetPass'
              }
            },
            '400': {
              'description': 'some error'
            },
            '500': {
              'description': 'some server error'
            }
          }
        }
      },
    }
  }
*/

// get
router.get('/', authToken, getTutorial);
router.get('/:id', authToken, findTutorial);
router.get('/search/:title', authToken, findByTitleTutorial);
// post
router.post('/post', authToken, postTutorial);
router.post('/register/user', registerUser);
router.post('/login/user', loginUser);
router.post('/forgetpassword/user', forgetPasswordUser);
router.post('/resetpassword/user', resetPasswordUser);
// put
router.put('/put/:id', authToken, putTutorial);
// delete
router.delete('/delete/:id', authToken, deleteTutorial);

module.exports = router;
