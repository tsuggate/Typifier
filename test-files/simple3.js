define([
   'jquery',
   'knockout'
], function($, ko) {

   // Set n to 42
   // Another pointless comment.
   var n = 42; // a
   var a = n / 2; // b

   function myFunc(a1, a2) {
      var b = 2;

      this.n = b;

      return a1 * a2 + b; // return some things.
   }

   var s = this.previewMode() || this.readOnlyMode();
   var d = new Date();
   var myDate = d.getDate();

   myFunc(3, 4);

   return {
      myFunc: myFunc,
      s: s
   };
});
