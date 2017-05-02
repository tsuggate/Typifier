define(['jquery', 'knockout'], function($, ko) {

   // Set n to 42
   var n = 42; // a
   var a = n / 2; // b

   /* hello comment */
   function myFunc(a1, a2) { /* hello comment */
      var b = 2;

      return a1 * a2 + b;
   }

   var s = (this.previewMode() || this.readOnlyMode()) && !this.showingFormativeAssessment();
   var d = new Date();
   var myDate = d.getDate();

   myFunc(3, 4);

   return {
      myFunc: myFunc,
      s: s
   };
});

