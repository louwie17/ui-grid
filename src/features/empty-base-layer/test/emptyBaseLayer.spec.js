fdescribe('ui.grid.emptyBaseLayer', function () {

  var scope, element, timeout;

  beforeEach(module('ui.grid.emptyBaseLayer'));

  beforeEach(inject(function (_$compile_, $rootScope, $timeout, $httpBackend) {

    var $compile = _$compile_;
    scope = $rootScope;
    timeout = $timeout;

    scope.gridOptions = {};
    scope.gridOptions.data = [
      { col1: 'col1', col2: 'col2' }
    ];
    scope.gridOptions.onRegisterApi = function (gridApi) {
      scope.gridApi = gridApi;
      scope.grid = gridApi.grid;
    };

    //$httpBackend.when('GET', 'expandableRowTemplate.html').respond("<div class='test'></div>");
    element = angular.element('<div class="col-md-5" ui-grid="gridOptions" ui-grid-empty-base-layer></div>');

    $timeout(function () {
      $compile(element)(scope);
    });
    $timeout.flush();
  }));

  it('emptyBaseLayerContainer should be added to the viewport html', function () {
    expect(element.find('.ui-grid-empty-base-layer-container').length).toBe(1);
  });
});
