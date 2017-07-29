

this.scrollSelectionPosition = ko.pureComputed({
   read: function() {
      return this.scrollPosition();
   },
   write: function(newScrollPosition, userEvent) {
      this.setScrollPosition(newScrollPosition, userEvent);
   },
   owner: this
});

