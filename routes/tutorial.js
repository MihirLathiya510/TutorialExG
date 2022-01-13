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
      }
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
// put
router.put('/put/:id', authToken, putTutorial);
// delete
router.delete('/delete/:id', authToken, deleteTutorial);

module.exports = router;
