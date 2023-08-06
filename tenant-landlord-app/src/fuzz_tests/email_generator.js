//This file exports the generateRandomEmailInput, which can be used for UI testing

const generateRandomEmailInput = () => {
  const randomLength = Math.floor(Math.random() * 20) + 1;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._%+-@";

  let input = "";
  for (let i = 0; i < randomLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    input += characters.charAt(randomIndex);
  }
  return input;
};

const generateValidEmailInput = () => {
  const generateRandomString = (mode, length) => {
    let characters = "";
    if (mode === "local") {
      characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._%+-";
    } else if (mode === "domain") {
      characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-";
    } else if (mode === "topdomain") {
      characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    }

    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  };

  const localPart = generateRandomString("local", 6); // 6 characters for local-part
  const domainName = generateRandomString("domain", 6); // 6 characters for domain name
  const topLevelDomain = generateRandomString("topdomain", 3); // 3 characters for TLD

  return `${localPart}@${domainName}.${topLevelDomain}`;
};

export { generateRandomEmailInput, generateValidEmailInput };

//////////////////// Commented out section tests the validate function itself//////////////////////

/** 
// Perform fuzz testing  on email with the validate() function in LoginPage.js 

//validate function
const validate = (values) => {
  let errors = {};

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email";
  }

  if (!values.password) {
    errors.password = "Required";
  }

  return errors;
};

const numTests = 20; // Number of tests to run
let failures = 0; // Counter for failed tests

for (let i = 0; i < numTests; i++) {
  const randomEmail = generateRandomEmailInput();
  const values = {
    email: randomEmail,
    password: "",
    hasError: false,
  };
  const validationErrors = validate(values);

  if (validationErrors !== {}) {
    console.log("Test failed with email:", randomEmail);
    failures++;
  }
}

console.log(
  `Fuzz testing completed. ${failures} failures out of ${numTests} tests.`
);
*/
