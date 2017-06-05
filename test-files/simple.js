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
   function myFunc(a1, a2) { /* hello comment */
      var b = 2;

      this.n = b;

      return a1 * a2 + b; // return some things.
   }

   var s = (this.previewMode() || this.readOnlyMode()) && !this.showingFormativeAssessment();
   var d = new Date();
   var myDate = d.getDate();

   myFunc(3, 4);
   myFunc(true, 'hey');

   return {
      myFunc: myFunc,
      s: s
   };
});

myFunc(3, 4);