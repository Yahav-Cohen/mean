'use strict';

(function() {
	// Newmodules Controller Spec
	describe('Newmodules Controller Tests', function() {
		// Initialize global variables
		var NewmodulesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Newmodules controller.
			NewmodulesController = $controller('NewmodulesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Newmodule object fetched from XHR', inject(function(Newmodules) {
			// Create sample Newmodule using the Newmodules service
			var sampleNewmodule = new Newmodules({
				name: 'New Newmodule'
			});

			// Create a sample Newmodules array that includes the new Newmodule
			var sampleNewmodules = [sampleNewmodule];

			// Set GET response
			$httpBackend.expectGET('newmodules').respond(sampleNewmodules);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.newmodules).toEqualData(sampleNewmodules);
		}));

		it('$scope.findOne() should create an array with one Newmodule object fetched from XHR using a newmoduleId URL parameter', inject(function(Newmodules) {
			// Define a sample Newmodule object
			var sampleNewmodule = new Newmodules({
				name: 'New Newmodule'
			});

			// Set the URL parameter
			$stateParams.newmoduleId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/newmodules\/([0-9a-fA-F]{24})$/).respond(sampleNewmodule);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.newmodule).toEqualData(sampleNewmodule);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Newmodules) {
			// Create a sample Newmodule object
			var sampleNewmodulePostData = new Newmodules({
				name: 'New Newmodule'
			});

			// Create a sample Newmodule response
			var sampleNewmoduleResponse = new Newmodules({
				_id: '525cf20451979dea2c000001',
				name: 'New Newmodule'
			});

			// Fixture mock form input values
			scope.name = 'New Newmodule';

			// Set POST response
			$httpBackend.expectPOST('newmodules', sampleNewmodulePostData).respond(sampleNewmoduleResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Newmodule was created
			expect($location.path()).toBe('/newmodules/' + sampleNewmoduleResponse._id);
		}));

		it('$scope.update() should update a valid Newmodule', inject(function(Newmodules) {
			// Define a sample Newmodule put data
			var sampleNewmodulePutData = new Newmodules({
				_id: '525cf20451979dea2c000001',
				name: 'New Newmodule'
			});

			// Mock Newmodule in scope
			scope.newmodule = sampleNewmodulePutData;

			// Set PUT response
			$httpBackend.expectPUT(/newmodules\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/newmodules/' + sampleNewmodulePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid newmoduleId and remove the Newmodule from the scope', inject(function(Newmodules) {
			// Create new Newmodule object
			var sampleNewmodule = new Newmodules({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Newmodules array and include the Newmodule
			scope.newmodules = [sampleNewmodule];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/newmodules\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleNewmodule);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.newmodules.length).toBe(0);
		}));
	});
}());