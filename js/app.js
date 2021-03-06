"use strict";

var commentsUrl = 'https://api.parse.com/1/classes/comments';

angular.module('CommentApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'ZRsLMEwjAWRHCIwnd2lghAaJvmmE3MtvRSstEvmV';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'rfmnXFHbxjZruRgkge0Z4mglQ51amCFMwkdnnZ11';
    })

    .controller('CommentsController', function($scope, $http) {
	    $scope.refreshComments = function() {
        	$http.get(commentsUrl + "?order=-score")
            	.success(function (data) {
                    $scope.comments = data.results;
            	});
    	};
        $scope.refreshComments();

        //adds comments to parse
        $scope.addComment = function() {
            $scope.inserting = true;        
            $http.post(commentsUrl, $scope.newComment)
                .success(function(responseData) {
                    $scope.newComment.objectId = responseData.objectId;
                    $scope.comments.push($scope.newComment);
                    $scope.newComment = {done: false};
                })
                .finally(function() {
                    $scope.inserting = false;
                });
        };

        //updates the comments
        $scope.updateTask = function(comment) {
            $http.put(commentsUrl + '/' + comment.objectId, comment)
                .success(function() {
					console.log("Comments updated")	
                });
        };

        //updates and increments the scores on each review
        $scope.incrementScore = function(comment, amount) {
            var postData = {
                score: {
                    __op: "Increment",
                    amount: amount
                }
            };
            $scope.updating = true;
            $http.put(commentsUrl + '/' + comment.objectId, postData)
            	.success(function(respData) {
            		comment.score = respData.score;
            	})
            	.error(function(err) {
            		console.log(err);
            	})
            	.finally(function() {
                    $scope.updating = false;
            	});
		};

		//deletes a comment when the checkbox is clicked
		$scope.deleteComment = function(comment) {
			$http.delete(commentsUrl + '/' + comment.objectId, comment)
				.success(function() {
					console.log("The comment has been deleted");
					$scope.refreshComments();
				});
		};
	});



