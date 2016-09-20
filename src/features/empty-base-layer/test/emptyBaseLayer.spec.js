fdescribe('ui.grid.emptyBaseLayer', function () {

  var scope, element, timeout, viewportHeight, emptyBaseLayerContainer;

  beforeEach(module('ui.grid.emptyBaseLayer'));

  beforeEach(inject(function (_$compile_, $rootScope, $timeout, $httpBackend) {

    var $compile = _$compile_;
    scope = $rootScope;
    timeout = $timeout;

    viewportHeight = "100";
    scope.gridOptions = {};
    scope.gridOptions.data = [
      { col1: 'col1', col2: 'col2' }
    ];
    scope.gridOptions.onRegisterApi = function (gridApi) {
      scope.gridApi = gridApi;
      scope.grid = gridApi.grid;
      var renderBodyContainer = scope.grid.renderContainers.body;
      spyOn(renderBodyContainer, 'getViewportHeight').and.callFake(function() {
        return viewportHeight;
      });
    };

    //$httpBackend.when('GET', 'expandableRowTemplate.html').respond("<div class='test'></div>");
    element = angular.element('<div class="col-md-5" ui-grid="gridOptions" ui-grid-empty-base-layer></div>');

    $timeout(function () {
      $compile(element)(scope);
    });
    $timeout.flush();

    emptyBaseLayerContainer = angular.element(element.find('.ui-grid-empty-base-layer-container')[0]);
    //scope.grid.buildStyles
  }));

  it('should add emptyBaseLayerContainer to the viewport html', function () {
    expect(element.find('.ui-grid-empty-base-layer-container').length).toBe(1);
  });

  it('should add fake rows to the empty base layer container, on building styles', function() {
    expect(emptyBaseLayerContainer.children().length).toBe(4);
  });

  it('should increase in rows if viewport height increased', function() {
    viewportHeight = "150";
    scope.grid.buildStyles();
    scope.$digest();
    expect(emptyBaseLayerContainer.children().length).toBe(5);
  });
});
