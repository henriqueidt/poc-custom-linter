// This is a sample JavaScript code block
function greet(name) {
  console.log(`Hello, ${name}!`);
  const scopedVariable = "I'm a scoped variable";
  console.log(scopedVariable);
  function innerFunction() {
    console.log("I'm an inner function");
  }

  innerFunction();
}

const person = {
  name: "John",
  age: 30,
  profession: "Developer",
};

console.log(scopedVariable);

greet(person.name);
greet(person.age);

innerFunction();

console.log(unexistentVariable);
