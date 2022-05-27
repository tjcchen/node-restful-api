/**
 * Example VM
 * Running some arbitrary commands
 * 
 * The vm module enables compiling and running code within V8 Virtual Machine contexts.
 * The vm module is not a security mechanism. Do not use it to run untrusted code.
 * 
 */

// Dependencies
const vm = require('vm');

// Define a context for the script to run in
const context = {
    'foo': 25
};

// Define the script
const script = new vm.Script(`
    
    foo = foo * 2;

    // declare with var and let are different
    var bar = foo + 1;
    var fizz = 52;

`);

// Run the script
script.runInNewContext(context);
console.log(context); // { foo: 50, bar: 51, fizz: 52 }