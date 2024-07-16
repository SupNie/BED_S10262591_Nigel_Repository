const Joi = require("joi");

const validateBook = (req, res, next) => 
{
  const schema = Joi.object
  ({
    title: Joi.string().min(3).max(50).required(),
    author: Joi.string().min(3).max(50).required(),
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) 
  {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return; // Terminate middleware execution on validation error
  }

  next(); // If validation passes, allow the requests to proceed to the next route handler
};

//module.exports is a special object that allows you to export values (functions, variables, classes) from your module file to be used in other parts of your application.
module.exports = validateBook;

//schema.validate method performs the validation against the request body (req.body)
//abortEarly: false option ensures that all validation errors are collected before sending a response.