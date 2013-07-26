// This is a slightly modified version of the todo list demo
// from https://github.com/GoogleCloudPlatform/appengine-angular-gotodos.git.
// That version is a slightly modified version of the Angular.js todo list demo
// from https://angularjs.org/#add-some-control.
// This version uses the resource plugin to talk to the MioEdge backend.

angular.module('todo', ['ngResource', 'ui'])
  .factory('Todo', function($resource, $http) {
    $http.defaults.withCredentials = true;
    return $resource('http://localhost\\:8050/miocon/app/:uri', {uri: 'login'}, {
        create: {method: 'POST', params: {action: 'create', _app: 'todos'}},
        query: {method: 'GET', params: {action: 'query', _app: 'todos'}, isArray: true},
        update: {method: 'POST', params: {uri: ''}},
        archive: {method: 'GET', params: {action: 'archive', _app: 'todos'}}
    });
  })
  .controller('TodoCtrl', function($scope, Todo) {
    $scope.todos = Todo.query();

		$scope.sortableOptions = {
			axis: 'y',
			cursor: 'move',
			placeholder: 'sortable-placeholder',
			opacity: 0.8,
			update: '$scope.updateSortOrder()'
		};
		
    $scope.addTodo = function() {
      var todo = new Todo();
      todo.text = $scope.todoText;
			todo.userId = 2;
      todo.archived = false;
      todo.updating = true;
      todo.done = false;
      todo.$create();
      todo.state = 'saving'
      $scope.todos.push(todo);
      $scope.todoText = '';
    };

    $scope.change = function(todo) {
      todo.$update({'uri': todo.uri});
      todo.state = 'updating';
    };
		
		$scope.updateSortOrder = function () {
			var todoOrder = [];
			angular.forEach($scope.todos, function(todo) {
				todoOrder.push(todo.id);
			});
			todo.$update({'uri': list.sortURI, todoOrder: todoOrder});
		};

    $scope.disabled = function(todo) {
      return todo.state !== undefined
    };

    $scope.remaining = function() {
      var count = 0;
      angular.forEach($scope.todos, function(todo) {
        count += todo.done ? 0 : 1;
      });
      return count;
    };

    $scope.total = function() {
      var count = 0;
      angular.forEach($scope.todos, function(todo) {
        count += todo.archived ? 0 : 1;
      });
      return count;
    };

    $scope.archive = function() {
      Todo.archive(function() {
        angular.forEach($scope.todos, function(todo) {
           if (todo.done === true) {
             todo.archived = true
           }
           return todo;
        });
      });
    };
  });
