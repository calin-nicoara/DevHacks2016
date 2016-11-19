(function () {
  angular.module('eCarrefourWeb').directive('inputNumberFilter', inputNumberDirective);

  function inputNumberDirective() {
    return {
      restrict: 'A',
      link: inputNumberLink
    };

    function inputNumberLink(scope, element, attrs) {

      if(attrs.type && attrs.type === 'number'){
        var excludedKeyCodes = [
          107, //add
          109, //substract
          189, //dash
          187, //equal sign (with shift)
          190, //period
          110 //decimal point
        ];

        var includedKeyCodes = [
          65, 67, 86, 90 //letters a, c, v, z for keyboard shortcuts
        ];

        if (attrs.inputNumberFilter === 'FLOAT') {
          excludedKeyCodes.splice(excludedKeyCodes.indexOf(190),1);
          excludedKeyCodes.splice(excludedKeyCodes.indexOf(110),1);
        }

        element.bind("keydown", function (event) {
          var which = event.which;
          var isLetter = (which >= 65 && which <= 90);
          var isRejected = (isLetter || _.includes(excludedKeyCodes, which)) &&
                           !_.includes(includedKeyCodes, which);

          if (isRejected) {
            event.stopPropagation();
            event.preventDefault();
          }
        });
      }

    }
  }

})();
