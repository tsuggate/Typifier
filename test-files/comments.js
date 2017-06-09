define([
   'jquery',
   'knockout'
   //'knockback'
], function($, ko) {

   // Set n to 42
   // Another pointless comment.
   var n = 42; // a
   var a = n / 2; // b

   /* hello comment */
   function myFunc(a1, a2) { /* hello comment 2 */
      var b = 2;

      return a1 * a2 + b; // return some things.
   }

   var map = {
      one: 1, // one
      two: 2, // two
      three: 3, // three

      fun: function(x) {
         // some code here
         var sqr = x * x;

         sqr++; // magic tweak

         return sqr;
      }
   };

   var t = [
      'hello' // hello2
   ];

   myFunc(3, 4);
   myFunc(true, 'hey');

   return {
      myFunc: myFunc,
      map: map
   };
});

myFunc(3, 4);