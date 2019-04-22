var FormApp = angular.module("FormApp", ['ngRoute']);

FormApp.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl: "FormManagement.html",
        controller: "FormManagementController"
    })
    .when("/forms/:formName", {
        templateUrl: "FormDisplay.html",
        controller: "FormDisplayController"
    });
});

FormApp.directive("createNewForm", function() {
    return {
        template : "<h3>Create New Form</h3>"
    };
});

FormApp.controller("FormManagementController", function ($scope) {
    $scope.Forms = [];
    $scope.CurrentForm = {};
    $scope.ShowError = false;
    $scope.IsNew = false;
    $scope.DataTypes = [
        { key: "STRING", value: "text" },
        { key: "NUMBER", value: "number" }
    ];

    function updateLocalStorage(key, value) {
        localStorage.removeItem(key);
        localStorage.setItem(key, JSON.stringify(value));
    }

    $scope.init = function () {
        var data = JSON.parse(localStorage.getItem("Forms"));
        $scope.Forms = data ? data : [];
    };

    $scope.SetCurrentForm = function(form) {
        if(form) {
            $scope.CurrentForm = form;
            $scope.IsNew = false;
        }
        else {
            $scope.CurrentForm = {
                fields: [{name: "", dataType:"", required: false}]
            };
            $scope.IsNew = true;
        }
    };

    $scope.DisplayForm = function(index) {
        localStorage.index = JSON.stringify(index);
        window.location = "#!forms/" + $scope.Forms[index].name;
    };

    $scope.SaveForm = function (IsValid) {
        if (!IsValid) {
            $scope.ShowError = true;
        }
        else {
            if ($scope.IsNew) {
                $scope.CurrentForm.createdAt = new Date();
                $scope.Forms.push($scope.CurrentForm);
            }
            else {
                for (i = 0; i < $scope.Forms.length && $scope.Forms[i].name === $scope.CurrentForm.name; i++) {
                    $scope.Forms[i] = $scope.CurrentForm;
                    break;
                }
            }

            $('#formModal').modal('hide');
            updateLocalStorage("Forms", $scope.Forms);
        }
    };

    $scope.AddField = function(index) {
        $scope.CurrentForm.fields.splice(index+1, 0, {});
    };

    $scope.DeleteField = function(index) {
        $scope.CurrentForm.fields.splice(index, 1);
        if ($scope.CurrentForm.fields.length === 0)
            $scope.CurrentForm.fields[0] = {};
    };

    $scope.DeleteForm = function(index) {
        $scope.Forms.splice(index, 1);
        updateLocalStorage("Forms", $scope.Forms);
    };
});

FormApp.controller("FormDisplayController", function($scope) {
    $scope.Form = {};

    $scope.init = function() {   
        var index = localStorage.index ? localStorage.index : 0;

        $scope.Form = JSON.parse(localStorage.getItem("Forms"))[index];
    };
});