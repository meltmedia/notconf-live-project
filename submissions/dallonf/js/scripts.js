var track = {
  width: 400,
  height: 300,
  executing: false,
  paused: false,
  startTime: null
};

var car = {
	x: 50,
  y: track.height / 2,
  radius: 10,
  speed: 0,
  angle: 90,

  /*maxSpeed: 200,
  naturalDecel: 100,
  accel: 200,
  brake: 300,*/
  startSpeed: 100 ,
  accel: 0.5,
  turnSpeed: 360
};

var assets = {
  needed: 0,
  ready: 0
};

var input = {
  accel: false,
  brake: false,
  left: false,
  right: false
};

var obstacles = [];

function createObstacle(x, y) {
  return {
    x: x,
    y: y,
    radius: 30
  };
}


var canvas = document.getElementById('track');
var ctx = canvas.getContext('2d');

function loadImgAsset(name, path) {
  var img = new Image();
  img.src = path;
  img.onload = checkStart;
  assets[name] = img;

  assets.needed += 1;
}

loadImgAsset('car', 'images/hat.png');
loadImgAsset('obstacle', 'images/cactus3.png');

function checkStart() {
  assets.ready += 1;
  if (assets.ready >= assets.needed) {
    setInterval(step, 10);
  }
}

$(window).keydown(function(e) {
  //37 - left
  //39 - right

  if (e.which == 37) {
    input.left = true;
  } else if (e.which == 39) {
    input.right = true;
  }
}).keyup(function(e) {
  if (e.which == 37) {
    input.left = false;
  } else if (e.which == 39) {
    input.right = false;
  } else if (e.which == 32) {
    if (!track.executing) {
      start();
    } else {
      track.paused = !track.paused
      $('#message').toggle(track.paused);
    }
  }
});

function start() {
  track.executing = true;
  $('#message').hide();
  car.x = track.width / 2;
  car.y = track.height / 2;
  car.angle = 90;
  car.speed = car.startSpeed;

  obstacles.length = 0;

  var midX = track.width / 2;
  var midY = track.height / 2;
  while(obstacles.length < 5) {
    
    var x = Math.random() * track.width;
    var y = Math.random() * track.width;

    if ((x - midX)*(x - midX) + (y - midY)*(y - midY) > 30*30) {
      obstacles.push(createObstacle(x, y));
    }
    
  }

  track.startTime = new Date();
}

function stop() {
  var now = new Date();

  var seconds = (now - track.startTime) / 1000;

  var name = prompt("You lasted " + seconds.toFixed(1) + " seconds! \n" +
    "Enter your name to post your score:");

  if (name) {
    $.ajax('http://notkart.deploydapp.com/scores', {
      type: "POST",
      contentType: 'applcation/json',
      data: JSON.stringify({
        name: name,
        score: seconds 
      })
    });
  }

  $("#message").show();
  track.executing = false;
  track.paused = false;
}

var lastTime;
function step() {
  if (!lastTime) { lastTime = new Date(); }
  var currentTime = new Date();
  var elapsedTime = (currentTime - lastTime) / 1000;

  if (track.executing && !track.paused) {
    update(elapsedTime);
    draw();
  }  

  lastTime = new Date();
}

function update (elapsedTime) {
  car.speed += car.accel;
  /*if (input.brake) {
    car.speed -= elapsedTime*car.brake;
  } else if (input.accel) {
    car.speed += elapsedTime*car.accel;
  } else {
    car.speed -= elapsedTime*car.naturalDecel;
  }*/

  if (input.left && !input.right) {
    car.angle += elapsedTime*car.turnSpeed;
  } else if (input.right && !input.left) {
    car.angle -= elapsedTime*car.turnSpeed;
  }

  car.x += Math.sin(car.angle / 180 * Math.PI) * elapsedTime*car.speed;
  car.y += Math.cos(car.angle / 180 * Math.PI) * elapsedTime*car.speed;

  var collision = false;

  obstacles.forEach(function(obstacle) { 
    if ((obstacle.x - car.x)*(obstacle.x - car.x) + (obstacle.y - car.y)*(obstacle.y - car.y) < obstacle.radius*obstacle.radius) {
      collision = true;
    }
  });

  if (car.x + car.radius > track.width ||
      car.x - car.radius < 0 ||
      car.y + car.radius > track.height||
      car.y - car.radius < 0 ||
      collision) {
    stop();
  }



  
}

function draw() {
  ctx.fillStyle = '#ffffff';

  ctx.fillRect(0,0,track.width,track.height);

  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.scale(0.35, 0.35);
  ctx.rotate((-car.angle + 90) / 180 * Math.PI);
  ctx.translate(-assets.car.width / 2, -assets.car.height / 2);
  ctx.drawImage(assets.car, 0, 0);
  ctx.restore();

  
  obstacles.forEach(function(obstacle) {
    ctx.save();
    ctx.translate(obstacle.x, obstacle.y);
    ctx.scale(0.35, 0.35);
    ctx.translate(-assets.obstacle.width / 2, -assets.obstacle.height / 2);
    ctx.drawImage(assets.obstacle, 0, 0);
    ctx.restore();
  });

  

}

function updateLeaderboard() {
  var query = {
    $orderby: { score: -1 }
  };
  $.get('http://notkart.deploydapp.com/scores?q=' + JSON.stringify(query), function(result) {
    result = result || [];
    var $leaderboard = $('#leaderboard').empty();
    var place = 0;
    result.forEach(function(score, i) {
      place += 1;
      var $item = $("<li>").text(place + ". " + score.name + " - " + score.score.toFixed(2)  + " seconds");
      $leaderboard.append($item);

      if (i > 10) {
        return;
      }
    });
  });
}

updateLeaderboard();
setInterval(updateLeaderboard, 1000);