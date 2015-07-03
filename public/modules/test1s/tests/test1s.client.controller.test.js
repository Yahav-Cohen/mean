'use strict';

(function() {
	// Test1s Controller Spec
	describe('Test1s Controller Tests', function() {
		// Initialize global variables
		var Test1sController,
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

			// Initialize the Test1s controller.
			Test1sController = $controller('Test1sController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Test1 object fetched from XHR', inject(function(Test1s) {
			// Create sample Test1 using the Test1s service
			var sampleTest1 = new Test1s({
				name: 'New Test1'
			});

			// Create a sample Test1s array that includes the new Test1
			var sampleTest1s = [sampleTest1];

			// Set GET response
			$httpBackend.expectGET('test1s').respond(sampleTest1s);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.test1s).toEqualData(sampleTest1s);
		}));

		it('$scope.findOne() should create an array with one Test1 object fetched from XHR using a test1Id URL parameter', inject(function(Test1s) {
			// Define a sample Test1 object
			var sampleTest1 = new Test1s({
				name: 'New Test1'
			});

			// Set the URL parameter
			$stateParams.test1Id = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/test1s\/([0-9a-fA-F]{24})$/).respond(sampleTest1);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.test1).toEqualData(sampleTest1);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Test1s) {
			// Create a sample Test1 object
			var sampleTest1PostData = new Test1s({
				name: 'New Test1'
			});

			// Create a sample Test1 response
			var sampleTest1Response = new Test1s({
				_id: '525cf20451979dea2c000001',
				name: 'New Test1'
			});

			// Fixture mock form input values
			scope.name = 'New Test1';

			// Set POST response
			$httpBackend.expectPOST('test1s', sampleTest1PostData).respond(sampleTest1Response);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Test1 was created
			expect($location.path()).toBe('/test1s/' + sampleTest1Response._id);
		}));

		it('$scope.update() should update a valid Test1', inject(function(Test1s) {
			// Define a sample Test1 put data
			var sampleTest1PutData = new Test1s({
				_id: '525cf20451979dea2c000001',
				name: 'New Test1'
			});

			// Mock Test1 in scope
			scope.test1 = sampleTest1PutData;

			// Set PUT response
			$httpBackend.expectPUT(/test1s\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/test1s/' + sampleTest1PutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid test1Id and remove the Test1 from the scope', inject(function(Test1s) {
			// Create new Test1 object
			var sampleTest1 = new Test1s({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Test1s array and include the Test1
			scope.test1s = [sampleTest1];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/test1s\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTest1);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.test1s.length).toBe(0);
		}));
	});
}());