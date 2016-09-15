(function () {
  'use strict';

  /**
   * @ngdoc overview
   * @name ui.grid.fillerRows
   * @description
   *
   * # ui.grid.fillerRows
   *
   * <div class="alert alert-warning" role="alert"><strong>Alpha</strong> This feature is in development. There will almost certainly be breaking api changes, or there are major outstanding bugs.</div>
   *
   * This module provides the ability to have the background of the ui-grid be empty rows, this would be displayed in the case were
   * the grid height is greater then the amount of rows displayed.
   *
   * <div doc-module-components="ui.grid.fillerRows"></div>
   */
  var module = angular.module('ui.grid.fillerRows', ['ui.grid']);

  /**
   *  @ngdoc object
   *  @name uiGridFillerRows
   *  @propertyOf  ui.grid.expandable.api:GridOptions
   *  @description Shows empty rows in the background of the ui-grid, these span
   *  the full height of the ui-grid, so that there won't be blank space below the shown rows.
   *  @example
   *  <pre>
   *  <div ui-grid="gridOptions" class="grid" ui-grid-filler-rows></div>
   *  </pre>
   */
  module.directive('uiGridFillerRows', ['gridUtil', '$templateCache',
    function (gridUtil, $templateCache) {
      return {
        require: '^uiGrid',
        scope: false,
        compile: function ($elm, $attrs) {
          return {
            pre: function ($scope, $elm, $attrs, controllers) {
            },
            post: function ($scope, $elm, $attrs, uiGridCtrl) {
            }
          };
        }
      };
    }]);

  /**
   *  @ngdoc directive
   *  @name ui.grid.expandable.directive:uiGridFillerContainer
   *  @description directive to keep track of the number of fake rows to display
   */
  module.directive('uiGridFillerContainer', ['gridUtil',
    function (gridUtil) {
      return {
        require: '^uiGrid',
        scope: false,
        compile: function ($elm, $attrs) {
          return {
            pre: function ($scope, $elm, $attrs, controllers) {
              $scope.fillerRow = {};

              $scope.fillerRow.fakeRows = [];
            },
            post: function ($scope, $elm, $attrs, uiGridCtrl) {
              var rowHeight = uiGridCtrl.grid.options.rowHeight;
              var renderBodyContainer = uiGridCtrl.grid.renderContainers.body;
              var prevGridHeight = renderBodyContainer.getViewportHeight();

              function setFakeRows() {
                var rows = Math.ceil(prevGridHeight / rowHeight);
                if (rows > 0) {
                  $scope.fillerRow.fakeRows = [];
                  for (var i = 0; i < rows; i++) {
                    $scope.fillerRow.fakeRows.push({});
                  }
                }
              }

              function checkIfHeightChanged() {
                var newGridHeight = renderBodyContainer.getViewportHeight();

                if (newGridHeight !== prevGridHeight) {
                  prevGridHeight = newGridHeight;
                  setFakeRows();
                }
                return;
              }

              uiGridCtrl.grid.registerStyleComputation({
                func: checkIfHeightChanged
              });
            }
          };
        }
      };
    }]);

  /**
   *  @ngdoc directive
   *  @name ui.grid.expandable.directive:uiGridViewport
   *  @description stacks on the uiGridViewport directive to append the filler rows html elements to the
   *  default gridRow template
   */
  module.directive('uiGridViewport',
    ['$compile', 'gridUtil', '$templateCache',
      function ($compile, gridUtil, $templateCache) {
        return {
          priority: -200,
          scope: false,
          compile: function ($elm, $attrs) {

            var rowFillerContainer = $templateCache.get('ui-grid/fillerContainer');
            $elm.prepend(rowFillerContainer);
            return {
              pre: function ($scope, $elm, $attrs, controllers) {
              },
              post: function ($scope, $elm, $attrs, controllers) {
              }
            };
          }
        };
      }]);

})();
