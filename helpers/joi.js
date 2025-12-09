const validateData = (schema, data) => {
    return schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      errors: {
        wrap: {
          label: "",
        },
      },
    });
  };
  
  module.exports = { validateData };