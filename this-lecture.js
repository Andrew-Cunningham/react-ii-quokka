// Let's talk about "this" and context in Javascript.
// Note: this file is meant to be run in quokka in VS Code.
// See: https://quokkajs.com/

// What is "this" in Javascript? A way for functions to refer to the context in which they are run.
// Why do we use this? It's a way to refer to self. For example, in the sentence "If I want to run
// faster, I must eat right and train hard", what is the name of who is speaking? It doesn't matter!
class Employee {
  constructor(name) {
    this.name = name;
    this.position = "Green bean";
    this.salary = "miniscule";
  }

  promote() {
    // We COULD hard-code "joe" here. But then it'd only work for the joe variable.
    joe.position = "Senior Dev";
    joe.salary = this.salary + " and a healthy bump in pay";
    // If we use 'this', it'll work for any variable.
    this.position = "Senior Dev";
    this.salary = this.salary + " and a healthy bump in pay";
  }
}

var joe = new Employee('Joe');
joe.promote();
joe;

// Check it out. If we use "this" above (in our Employee class), instead of joe, we can name
// other variables anything we want.
var tim = new Employee('Tim');
tim.promote();
tim;



// Javascript's "this" is confusing. Yay Javascript! Don't write a letter to Brendan Eich, he's
// already aware.


// Every time you call a function in Javascript, you are actually calling a method on an object.
// Quiz: what is a method?

// This is really obvious when we do:
var obj = {
  count: 0,
  updateCount: function(newCount) {
    this.count = newCount;
  }
};
obj.updateCount(5);
console.log(obj.count);
// Above, it's clear that "this" referred to obj.

// But did you know it's still happening when you do this?:
function setCount(newCount) {
  this.count = newCount;
}
setCount(7);
console.log(this.count);

// How is that possible? Somehow "this" is still referring to some object. What is it?
// Look at end of file for ANSWER1.

// When you call a function in Javascript, it's as if you had typed:
// myFunction.call(someObject, arguments)
// So, the first one above:
var updateCount = obj.updateCount;
updateCount.call(obj, 7);
console.log('obj.count', obj.count);
// The second one is:
updateCount.call(global, 9);
console.log('global.count', global.count);
// Note: Javascript's .call() and .apply() are almost the same. They both invoke functions, allowing you to specify the "this". The difference is, with call, you specify the arguments normally (separated by commas), and with apply, you pass arguments as a single array. One way to remember this is by looking at the first letter and noting that with call, you pass Columns of arguments, and with apply, you pass an Array.

// Javascript's "this" behavior is confusing and doesn't work like most other object oriented
// languages, but is straight-forward to deal with when you look at it that way.

// Let's talk about consequences of the above.
// If you pass a callback, where that function was originally part of another object, the "this" might not refer to what you're expecting!

class Hero {
  constructor(name) {
    this.name = name;
  }

  congratulate() {
    if (this.name === 'Superman') {
      console.log('Wow. So impressive, Mr. invulernable :eyeroll:');
    } else {
      console.log('Truly impressive!');
    }
  }
}

var hero = new Hero('Superman');
function announceAccomplishmentOnTwitter(doAfterAnnouncing) {
  // We could post something on twitter here.
  // ...
  // Then:
  doAfterAnnouncing();
}
// This won't work. Try it.
// announceAccomplishmentOnTwitter(hero.congratulate);

// What's something we could do? How about this? Uncomment to try:
// announceAccomplishmentOnTwitter(function() {
//   hero.congratulate();
// })

// But the best thing is to use the built in bind, like this:
// announceAccomplishmentOnTwitter(hero.congratulate.bind(hero));


// What is bind doing, under the hood? It's calling apply with the right object.
// We could write our own version, like so:
// function bind(obj, method) {
//   return function(args) {
//     method.apply(obj, args);
//   }
// }
// announceAccomplishmentOnTwitter(bind(hero, hero.congratulate));
//
// Note: the real bind allows arbitrary additional arguments that get forwarded to the function. Our
// simple version does not.

// Let's talk about another way to deal with this issue: arrow functions. Arrow functions have a key
// difference from regular functions: they don't create a new scope for "this", therefore the "this"
// stays with the current context where the arrow function is declared.
var x = {
  count: 0,
  f: function() {
    this.count = 10;
    var a = function() {
      this.count = 11;
    }
    a()
    var b = () => {
      this.count = 13;
    }
    b()
  }
}
x.f()
console.log('x.count', x.count);
console.log('global.count', global.count);



// ANSWER1: "this", when in the global context, is the global object. In a browser, it's window, and
// in node (or a quokka process), it's "global". At least, that's the case in non-strict javascript.
// If you are using strict mode, then the default context is undefined.