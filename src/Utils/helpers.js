import bcrypt from 'bcryptjs';

export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

export const sendResponse = (res, status, message, data) => {
  res.status(status).json({
    status,
    message,
    data,
  });
}

export const validateSchema = (schema) => async(req, res, next) => {
    try {
        await schema.validate(req.body, { abortEarly: false, stripUnknown: true, allowUnknown: true });
        next();
    } catch (error) {
        let errors = [];
        error.inner.forEach((err) => {
            errors.push({ key: err.path, message: err.errors[0] });
        })
        sendResponse(res, 400, errors, null);
    }
}