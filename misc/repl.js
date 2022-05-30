/**
 * Example REPL server
 * 
 * Take in the word "fizz" and log out "buzz"
 * 
 * REPL module can be used as a replacement of readline module for writing a CLI
 * 
 */

// Dependencies
const repl = require('repl');

// Start the REPL
repl.start({
    'prompt': '>',
    'eval': (str) => {
        // Evaluation function for incoming inputs
        console.log('At the evaluation stage: ', str);

        // If the user said "fizz", say "buzz" back to them
        if (str.indexOf('fizz') > -1) {
            console.log('buzz');
        }
    }
});
