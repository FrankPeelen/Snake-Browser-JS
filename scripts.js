"use strict"

$(document).ready(function() {

	// CONSTANTS
	const ROWS = 20;
	const COLUMNS = 20;
	const $GAME = $('#game');

	// CLASSES
	function Coords(x, y) {
		this.x = x;
		this.y = y;
	};

	// VARIABLES
	var gameNum = 0;
	var snake;
	var direction;
	var food;

	function initialize() {
		$GAME.empty();

		for (let i = 1; i <= ROWS; i++) {
			var row = $('<div class="row' + i + '"></div>');

			for (let j = 1; j <= COLUMNS; j++) {
				$(row).append('<div class="box' + j + '"></div>');
			};

			$GAME.append(row);
		};

		direction = 'right';
		gameNum += 1;
		$('h5').text('The game has started. Use your keyboard keys to control the snake');
		snake = [new Coords(10, 10)];
		while (!createFood()) {	};
	};

	function random() {
		return Math.floor((Math.random() * 20) + 1);
	};

	function $getBox(coords) {
		return $('.row' + coords.y + ' .box' + coords.x);
	};

	function createFood() {
		$('.food').removeClass('food');
		var coords = new Coords(random(), random());
		var valid = true;
		_.each(snake, function(s) {
			if (s.x === coords.x && s.y === coords.y) {
				valid = false;
				return;
			};
		}, coords);

		if (!valid) return false;

		food = coords;
		$getBox(food).addClass('food');
		return true;
	};

	function status(text) {
		var $p = $('p');

		$p.empty();
		$p.text(text);
	};

	function displaySnake() {
		$('.snake').removeClass('snake');
		_.each(snake, function(coords) {
			$getBox(coords).addClass('snake');
		});
		status('Slippery Snake is currently going ' + direction);
	};

	function sameGame(g) {
		return g === gameNum;
	}

	function gameOver(coords) {
		if (coords.x > 20 || coords.x < 1 || coords.y < 1 || coords.y > 20) {
			$('h5').text('You crashed into the wall!');
			return true;
		};

		var gameOver = false;
		
		_.each(snake, function(s) {
			if (s.x === coords.x && s.y === coords.y) {

				gameOver = true;
				return;
			};
		});

		if (gameOver) $('h5').text('You ate yourself!');
		return gameOver;
	};

	function updateSnake(g) {
		var newHead = newSnakeHead();
		if (gameOver(newHead)) {
			return false;
		};

		snake.push(newHead);
		if (newHead.x === food.x && newHead.y === food.y) {
			createFood();
		} else {
			snake.splice(0, 1);
		};

		return true;
	};

	function newSnakeHead() {
		var head = snake[snake.length - 1];
		var x = head.x;
		var y = head.y;

		switch (direction) {
			case 'right':
				x += 1;
				break;
			case 'left':
				x -= 1;
				break;
			case 'up':
				y -= 1;
				break;
			case 'down':
				y += 1;
				break;
		}

		return new Coords(x, y);
	};

	function move(game) {
		setTimeout(function(g) {
					if (sameGame(g)) {
						if (updateSnake()) {
							displaySnake();
							move(g);
						} else {
							status("Game Over!");
						};
					};
		}, 100, game);
	};

	$(document).keydown(function(e) {
		switch (e.which) {
			case 37: // left
				direction = 'left';
        break;
      case 38: // up
				direction = 'up';
        break;
      case 39: // right
				direction = 'right';
        break;
      case 40: // down
				direction = 'down';
        break;
      default:
      	return; // exit this handler for other keys
		}
		e.preventDefault(); // prevent the default action (scroll / move caret)
	});


	$('#initialize').on('click', function() {
		initialize();
		displaySnake();
		move(gameNum);
	});

});
