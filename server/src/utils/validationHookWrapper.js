module.exports = function(conditionFunc, errorMessage = 'Įvyko klaida') {
  return (hook) => {
    return new Promise((resolve, reject) => {
      conditionFunc()
        .then((response) => {
          if (response === false) {
            throw new Error(errorMessage);
          }
          resolve(hook);
        })
        .catch(error => {
          reject(error);
        })
    })
  }
};
