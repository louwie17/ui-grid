(function () {
  'use strict';

  /**
   * @ngdoc overview
   * @name ui.grid.emptyBaseLayer
   * @description
   *
   * # ui.grid.emptyBaseLayer
   *
   * <div class="alert alert-warning" role="alert"><strong>Alpha</strong> This feature is in development. There will almost certainly be breaking api changes, or there are major outstanding bugs.</div>
   *
   * This module provides the ability to have the background of the ui-grid be empty rows, this would be displayed in the case were
   * the grid height is greater then the amount of rows displayed.
   *
   * <div doc-module-components="ui.grid.emptyBaseLayer"></div>
   */
  var module = angular.module('ui.grid.emptyBaseLayer', ['ui.grid']);

  /**
   *  @ngdoc object
   *  @name ui.grid.emptyBaseLayer.directive:uiGridEmptyBaseLayer
   *  @description Shows empty rows in the background of the ui-grid, these span
   *  the full height of the ui-grid, so that there won't be blank space below the shown rows.
   *  @example
   *  <pre>
   *  <div ui-grid="gridOptions" class="grid" ui-grid-empty-base-layer></div>
   *  </pre>
   */
  module.directive('uiGridEmptyBaseLayer', ['gridUtil', '$templateCache',
    function (gridUtil, $templateCache) {
      return {
        require: '^uiGrid',
        scope: false,
        compile: function ($elm, $attrs) {
          return {
            pre: function ($scope, $elm, $attrs, controllers) {
            },
            post: function ($scope, $elm, $attrs, uiGridCtrl) {
              var gridOptions = uiGridCtrl.grid.options;
              //default option to true unless it was explicitly set to false
              /**
               *  @ngdoc object
               *  @name ui.grid.emptyBaseLayer.api:GridOptions
               *
               *  @description GridOptions for emptyBaseLayer feature, these are available to be
               *  set using the ui-grid {@link ui.grid.class:GridOptions gridOptions}
               */

              /**
               *  @ngdoc object
               *  @name enableEmptyGridBaseLayer
               *  @propertyOf  ui.grid.emptyBaseLayer.api:GridOptions
               *  @description Enable empty base layer, which shows empty rows as background on the entire grid
               *  <br/>Defaults to true, if the directive is used.
               */
              gridOptions.enableEmptyGridBaseLayer = gridOptions.enableEmptyGridBaseLayer !== false;
            }
          };
        }
      };
    }]);

  /**
   *  @ngdoc directive
   *  @name ui.grid.emptyBaseLayer.directive:uiGridBaseLayerContainer
   *  @description directive to keep track of the number of fake rows to display
   */
  module.directive('uiGridBaseLayerContainer', ['gridUtil',
    function (gridUtil) {
      return {
        require: '^uiGrid',
        scope: false,
        compile: function ($elm, $attrs) {
          return {
            pre: function ($scope, $elm, $attrs, controllers) {
              $scope.baseLayer = {};

              $scope.baseLayer.emptyRows = [];
            },
            post: function ($scope, $elm, $attrs, uiGridCtrl) {
              if (!uiGridCtrl.grid.options.enableEmptyGridBaseLayer) {
                return; // do nothing
              }

              var rowHeight = uiGridCtrl.grid.options.rowHeight;
              var renderBodyContainer = uiGridCtrl.grid.renderContainers.body;
              var prevGridHeight = renderBodyContainer.getViewportHeight();

              function setFakeRows() {
                var rows = Math.ceil(prevGridHeight / rowHeight);
                if (rows > 0) {
                  $scope.baseLayer.emptyRows = [];
                  for (var i = 0; i < rows; i++) {
                    $scope.baseLayer.emptyRows.push({});
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
   *  @name ui.grid.emptyBaseLayer.directive:uiGridViewport
   *  @description stacks on the uiGridViewport directive to append the empty grid base layer html elements to the
   *  default gridRow template
   */
  module.directive('uiGridViewport',
    ['$compile', 'gridUtil', '$templateCache',
      function ($compile, gridUtil, $templateCache) {
        return {
          priority: -200,
          scope: false,
          compile: function ($elm, $attrs) {

            var emptyBaseLayerContainer = $templateCache.get('ui-grid/emptyBaseLayerContainer');
            $elm.prepend(emptyBaseLayerContainer);
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
