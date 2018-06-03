module.exports = function(conditionFunc, errorMessage = 'Įvyko klaida') {
  return (hook) => {
    return new Promise((resolve, reject) => {
      Promise.resolve(conditionFunc(hook))
        .then((response) => {
          if (response === false) {
            throw new Error(errorMessage);
          }
          resolve(hook);
        })
        .catch(error => {
          // overwrites other libraries' hook errors with custom one (errorMessage)
          error.message = errorMessage;
          reject(error);
        })
    })
  }
};
