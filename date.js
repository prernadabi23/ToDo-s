
// console.log(module);
exports.getDate = function() {

  const today = new Date();
  const options = {
    weekday : "long",
    day: "numeric",
    month: "long"
  };

  return today.toLocaleDateString("en-US" , options);

};

exports.getDay = function() {

  const today = new Date();
  const options = {
    weekday : "long",
  };

  return today.toLocaleDateString("en-US" , options);
};

// console.log(module.exports);
