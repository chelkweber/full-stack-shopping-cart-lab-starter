var app = angular.module("shoppingCart");
app.controller("cartController", function($scope, cartService) {
    // Start the form off empty on page load.
    $scope.formItem = {};

    // Load the cart data on page load.
    cartService.getAllItems().then(function(items) {
        $scope.items = items;
    });

    // Function on scope called when form is submitted.
    $scope.addItem = function(item) {
        cartService.addItem(item).then(function() {
            // Clear the form.
            $scope.formItem = {};

            // Update the list with the new set of items.
            cartService.getAllItems().then(function(items) {
                $scope.items = items;
            });
        });
    };

    // Function on scope called when clicking Delete for an item.
    $scope.deleteItem = function(item) {
        cartService.deleteItem(item.id).then(function() {
            // Update the list with the new set of items.
            cartService.getAllItems().then(function(items) {
                $scope.items = items;
            });
        });
    };
	
});
