(function () {
  'use strict';

  /**
   * @ngdoc overview
   * @name ui.grid.expandable
   * @description
   *
   * # ui.grid.expandable
   *
   * <div class="alert alert-warning" role="alert"><strong>Alpha</strong> This feature is in development. There will almost certainly be breaking api changes, or there are major outstanding bugs.</div>
   *
   * This module provides the ability to create subgrids with the ability to expand a row
   * to show the subgrid.
   *
   * <div doc-module-components="ui.grid.expandable"></div>
   */
  var module = angular.module('ui.grid.fillerRows', ['ui.grid']);

  /**
   *  @ngdoc object
   *  @name uiGridFillerRows
   *  @propertyOf  ui.grid.expandable.api:GridOptions
   *  @description Show a rowHeader to provide the expandable buttons.  If set to false then implies
   *  you're going to use a custom method for expanding and collapsing the subgrids. Defaults to true.
   *  @example
   *  <pre>
   *    $scope.gridOptions = {
   *      enableExpandableRowHeader: false
   *    }
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
              var prevGridWidth, prevGridHeight;
              var rowHeight = uiGridCtrl.grid.options.rowHeight;

              function getDimensions() {
                prevGridHeight = gridUtil.elementHeight($elm);
                prevGridWidth = gridUtil.elementWidth($elm);
              }

              function setFakeRows() {
                getDimensions();
                var rows = Math.ceil(prevGridHeight / rowHeight);
                if (rows > 0) {
                  $scope.fillerRow.fakeRows = [];
                  for (var i = 0; i < rows; i++) {
                    $scope.fillerRow.fakeRows.push({});
                  }
                }
              }
              setFakeRows();

              var resizeTimeoutId;
              function startTimeout() {
                clearTimeout(resizeTimeoutId);

                resizeTimeoutId = setTimeout(function () {
                  var newGridHeight = gridUtil.elementHeight($elm);
                  var newGridWidth = gridUtil.elementWidth($elm);

                  //uiGridCtrl.grid.api.core.raise.gridDimensionChanged(prevGridHeight, prevGridWidth, newGridHeight, newGridWidth);

                  if (newGridHeight !== prevGridHeight || newGridWidth !== prevGridWidth) {
                    setFakeRows();
                  }
                  else {
                    startTimeout();
                  }
                }, 250);
              }

              startTimeout();

              $scope.$on('$destroy', function() {
                clearTimeout(resizeTimeoutId);
              });
            }
          };
        }
      };
    }]);

  /**
   *  @ngdoc directive
   *  @name ui.grid.expandable.directive:uiGridViewport
   *  @description stacks on the uiGridViewport directive to append the expandable row html elements to the
   *  default gridRow template
   */
  module.directive('uiGridViewport',
    ['$compile', 'gridUtil', '$templateCache',
      function ($compile, gridUtil, $templateCache) {
        return {
          priority: -200,
          scope: false,
          compile: function ($elm, $attrs) {

             //todo: this adds ng-if watchers to each row even if the grid is not using expandable directive
             //      or options.enableExpandable == false
             //      The alternative is to compile the template and append to each row in a uiGridRow directive

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
