function displayHelpModal()
{
  $('#game_info_modal').modal('toggle')
}

function resetLevel()
{
  var level = gLevels[gCurrentLevel];
  setBallPosition(level.ballStart.x, level.ballStart.y);
}


function changeSelectedLevel()
{
  var select = document.getElementById("levelSelect");
  var value = select.value;

  var intValue = parseInt(value);

  unloadCurrentLevel();
  gCurrentLevel = intValue - 1;
  loadCurrentLevel();
}

function updateBallFriction()
{
  var value = document.getElementById("ballFriction").value;

  var floatValue = parseFloat(value);

  if(!isNaN(floatValue))
  {
      gBallFrictionCoefficient = 1 - floatValue;
  }
}

function constructCollisionPlanes()
{
  var topPlane = new THREE.Plane(new THREE.Vector3(0.0, -1.0, 0.0));
  topPlane.translate(new THREE.Vector3(0.0, 3.0, 0.0));

  var rightPlane = new THREE.Plane(new THREE.Vector3(-1.0, 0.0, 0.0));
  rightPlane.translate(new THREE.Vector3(5.0, 0.0, 0.0));

  var bottomPlane = new THREE.Plane(new THREE.Vector3(0.0, 1.0, 0.0));
  bottomPlane.translate(new THREE.Vector3(0.0, -3.0, 0.0));

  var leftPlane = new THREE.Plane(new THREE.Vector3(1.0, 0.0, 0.0));
  leftPlane.translate(new THREE.Vector3(-5.0, 0.0, 0.0));
  gCollisionPlanes.push(topPlane);
  gCollisionPlanes.push(rightPlane);
  gCollisionPlanes.push(leftPlane);
  gCollisionPlanes.push(bottomPlane);
}

function levelCompleted(surface)
{
  console.log("level completed!!!!");
  progressLevel();
}

function progressLevel()
{
  //top ball from colliding with win object
  gBall.position.z = -1.0;
  unloadCurrentLevel();
  gCurrentLevel++;
  loadCurrentLevel();
}

function collisionDecrementBallX(surface)
{
  console.log("collisionDecrementBall called!")
  if(surface)
  {
    while(surface.intersectsSphere(collisionSphere))
    {
      gBall.position.x -= 0.1;
      collisionSphere.center.x -= 0.1;
    }

    ballVelocity.x = -ballVelocity.x;
  }else{
    console.log("surface was null!");
  }
}

function collisionIncrementBallX(surface)
{
  while(surface.intersectsSphere(collisionSphere))
  {
    gBall.position.x += 0.1;
    collisionSphere.center.x += 0.1;
  }

  ballVelocity.x = -ballVelocity.x;
}

function collisionIncrementBallY(surface)
{
  while(surface.intersectsSphere(collisionSphere))
  {
    gBall.position.y += 0.1;
    collisionSphere.center.y += 0.1;
  }

  ballVelocity.y = -ballVelocity.y;
}

function collisionDecrementBallY(surface)
{
  while(surface.intersectsSphere(collisionSphere))
  {
    gBall.position.y -= 0.1;
    collisionSphere.center.y -= 0.1;
  }

  ballVelocity.y = -ballVelocity.y;
}


function constructLevels(allLevels)
{

  var level1 = constructLevel(new THREE.Vector3(-0.75, 0.0, 0.0), new THREE.Vector3(2.0, 0.0, 0.0));
  level1 = addLevelObstacle(level1, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.5, 1.0, 0.0));

  var level2 = constructLevel(new THREE.Vector3(-2.5, 1.0, 0.0), new THREE.Vector3(2.5, 1.0, 0.0));
  level2 = addLevelObstacle(level2, new THREE.Vector3(0.0, 1.75, 0.0), new THREE.Vector3(0.125, 2.0, 0.0));

  var level3 = constructLevel(new THREE.Vector3(-2.5, 1.0, 0.0), new THREE.Vector3(3.5, 1.8, 0.0));
  level3 = addLevelObstacle(level3, new THREE.Vector3(-1.0, -2.0, 0.0), new THREE.Vector3(0.125, 2.0, 0.0));
  level3 = addLevelObstacle(level3, new THREE.Vector3(1.0, 2.0, 0.0), new THREE.Vector3(0.125, 2.0, 0.0))

  allLevels.push(level3);
  allLevels.push(level2);
  allLevels.push(level1);
}

function constructLevel(ballStart, goalPos)
{
  var levelObject = {
      ballStart: ballStart,
      levelObjects: [],
      collisionSurfaces: [],
      goalObject: null
  };

  var goalGeometry = new THREE.CircleGeometry(0.2);
  var goalMaterial = new THREE.MeshPhongMaterial({color: 0xff0000})
  var goalObject = new THREE.Mesh(goalGeometry, goalMaterial);
  goalGeometry.computeBoundingSphere();

  goalObject.position.x = goalPos.x;
  goalObject.position.y = goalPos.y;
  goalObject.position.z = 0.1;

  goalGeometry.boundingSphere.center.x = goalObject.position.x;
  goalGeometry.boundingSphere.center.y = goalObject.position.y;

  levelObject.collisionSurfaces.push({
    surface: goalGeometry.boundingSphere,
    correction: levelCompleted
  })

  levelObject.goalObject = goalObject;

  return levelObject;
}

//adds a level to the specified level object, provided its position and size.
function addLevelObstacle(levelObject, obstaclePos, obstacleSize)
{
  var width = obstacleSize.x;
  var height = obstacleSize.y;

  var boxGeometry = new THREE.BoxGeometry(obstacleSize.x, obstacleSize.y, 1);
  var boxMaterial = new THREE.MeshPhongMaterial({color: 0x00c8ff});
  var box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.position.x = obstaclePos.x;
  box.position.y = obstaclePos.y;

  levelObject = constructCollisionSurfaces(levelObject, box.position, width, height);

  levelObject.levelObjects.push(box);
  console.log("add level obstacle length: "+levelObject.collisionSurfaces.length);
  return levelObject;
}

function addLevelGoal(levelObject, goalPos)
{
  var goalGeometry = new THREE.CircleGeometry(0.2);
  var goalMaterial = new THREE.MeshPhongMaterial({color: 0xff0000})
  var goalObject = new THREE.Mesh(goalGeometry, goalMaterial);
  goalGeometry.computeBoundingSphere();

  goalObject.position.x = goalPos[0];
  goalObject.position.y = goalPos[1];

  goalObject.boundingSphere.center.x = goalObject.position.x;
  goalObject.boundingSphere.center.y = goalObject.position.y;



  levelObject.collisionSurfaces.push({
    surface: goalGeometry.boundingSphere,
    correction: levelCompleted
  })

}

function checkLevelCollisions()
{
  var currentLevel = gLevels[gCurrentLevel];
  //console.log("checkLevelCollisions!")
  if(!currentLevel)
  {
    return;
  }

  for(var i = 0; i < currentLevel.collisionSurfaces.length; i++)
  {
      var collisionObject = currentLevel.collisionSurfaces[i];
      var min = collisionObject.surface.min;
      var max = collisionObject.surface.max;
      //console.log("collisionObject.surface.min: ("+min.x+", "+min.y+", "+min.z+")");
      //console.log("collisionObject.surface.max: ("+max.x+", "+max.y+", "+max.z+")");
      //console.log("collsionObject.collision check: "+collisionObject.surface.intersectsSphere(collisionSphere));
      if(collisionObject.surface.intersectsSphere(collisionSphere))
      {
        console.log("INTERSECTING LEVEL OBJECT");
        collisionObject.correction(collisionObject.surface);
      }
  }

}

//constructs the 4 collision surfaces for a box of the specified dimensions
function constructCollisionSurfaces(levelObject, centerPoint, width, height)
{
  console.log("constructing collisionSurfaces!");
  console.log("centerPoint: "+centerPoint.x+", "+centerPoint.y+", "+centerPoint.z);
  var topBox = new THREE.Box3();
  var topPoint = new THREE.Vector3();
  topPoint.copy(centerPoint);
console.log("y before: "+topPoint.y);
  topPoint.y = (centerPoint.y + height/2.0) - 0.025;
  console.log("y after: "+topPoint.y);
  topBox.setFromCenterAndSize( topPoint, new THREE.Vector3(width, 0.025, 1.1 ) );
  console.log("top box position: ("+topPoint.x+", "+topPoint.y+", "+topPoint.z+")");
  var topHelper = new THREE.Box3Helper( topBox, 0xffff00 );

  //scene.add( topHelper );

  var rightBox = new THREE.Box3();
  var rightPoint = new THREE.Vector3();
  rightPoint.copy(centerPoint);
  rightPoint.x = (centerPoint.x + width/2.0) - 0.025;
  rightBox.setFromCenterAndSize(rightPoint, new THREE.Vector3(0.025, height, 1.1 ) );
  var rightHelper = new THREE.Box3Helper( rightBox, 0xFFFF00);
  //scene.add(rightHelper);

  var bottomBox = new THREE.Box3();
  var bottomPoint = new THREE.Vector3();
  bottomPoint.copy(centerPoint);
  bottomPoint.y = (centerPoint.y - height/2.0) + 0.025;
  bottomBox.setFromCenterAndSize( bottomPoint, new THREE.Vector3(width, 0.025, 1.1));
  var bottomHelper = new THREE.Box3Helper( bottomBox, 0xFFFF00);
  //scene.add(bottomHelper);

  var leftBox = new THREE.Box3();
  var leftPoint = new THREE.Vector3();
  leftPoint.copy(centerPoint);
  leftPoint.x = (centerPoint.x - width/2.0) + 0.025;
  leftBox.setFromCenterAndSize(leftPoint, new THREE.Vector3(0.025, height, 1.1 ) );
  var leftHelper = new THREE.Box3Helper( leftBox, 0xFFFF00);
  //scene.add(leftHelper);

  levelObject.collisionSurfaces.push({
    surface: topBox,
    helper: topHelper,
    correction: collisionIncrementBallY
  })

  levelObject.collisionSurfaces.push({
    surface: rightBox,
    helper: rightHelper,
    correction: collisionIncrementBallX
  })

  levelObject.collisionSurfaces.push({
    surface: bottomBox,
    helper: bottomHelper,
    correction: collisionDecrementBallY
  })

  levelObject.collisionSurfaces.push({
    surface: leftBox,
    helper: leftHelper,
    correction: collisionDecrementBallX
  })

  console.log("done with collision surfaces.");
  console.log("collisionSurfaces.length: "+levelObject.collisionSurfaces.length);
  return levelObject;
}

function setBallPosition(x, y)
{
  gBall.position.x = x;
  gBall.position.y = y;
  gBall.position.z = 0.0;
  collisionSphere.center.z = 0.0;
  collisionSphere.center.x = x;
  collisionSphere.center.y = y;
  ballVelocity.x = 0.0;
  ballVelocity.y = 0.0;
}

function unloadCurrentLevel()
{
  if(gLevels[gCurrentLevel])
  {
    var level = gLevels[gCurrentLevel];
    scene.remove(level.goalObject);
    for(var i = 0; i < level.levelObjects.length; i++)
    {
      scene.remove(level.levelObjects[i]);
    }
    if(debugModeEnabled)
    {
      for(var i = 0; i < level.collisionSurfaces.length; i++)
      {
        scene.remove(level.collisionSurfaces[i].helper);
      }
    }
  }
}

function loadCurrentLevel()
{
  if(gLevels[gCurrentLevel])
  {
    var level = gLevels[gCurrentLevel];
    setBallPosition(level.ballStart.x, level.ballStart.y);
    if(level.goalObject)
    {
      console.log("goalObject was not null!");
      console.log("pos: ("+level.goalObject.position.x+", "+level.goalObject.position.y+", "+level.goalObject.position.z+")")
    }
    scene.add(level.goalObject);

    console.log("goal object was added!");
    for(var i = 0; i < level.levelObjects.length; i++)
    {
      scene.add(level.levelObjects[i]);
    }
    if(debugModeEnabled)
    {
      for(var i = 0; i < level.collisionSurfaces.length; i++)
      {
        if(level.collisionSurfaces[i].helper)
        {
            scene.add(level.collisionSurfaces[i].helper);
        }
      }
    }
  }else{
    console.log("current level was null!");
  }
}

function isCollidingWithPlanes(sphere)
{
  for(var i = 0; i < gCollisionPlanes.length; i++)
  {
    // if(Math.abs(gCollisionPlanes[i].distanceToSphere(sphere)) < 0.0)
    // {
    //   console.log("true: distance: "+gCollisionPlanes[i].distanceToSphere(sphere));
    //   return true;
    // }
    if(gCollisionPlanes[i].intersectsSphere(sphere) || gCollisionPlanes[i].distanceToSphere(sphere) < 0.0)
    {
      return true;
    }
  }
  return false;
}

function constructFieldPlanes(scene)
{
  //var fieldMaterial = new THREE.MeshBasicMaterial({color: 0x34cceb, side: THREE.DoubleSide});
  var fieldMaterial = new THREE.MeshPhongMaterial({color: 0x34cceb, side: THREE.DoubleSide})
  var topFieldPlane = new THREE.PlaneGeometry(10, 0.5);
  var topPlane = new THREE.Mesh(topFieldPlane, fieldMaterial);
  topPlane.translateY(3.0);
  topPlane.rotateX(Math.PI/2.0);

  bottomFieldPlane = new THREE.PlaneGeometry(10, 0.5);
  var bottomPlane = new THREE.Mesh(bottomFieldPlane, fieldMaterial);
  bottomPlane.translateY(-3.0);
  bottomPlane.rotateX(Math.PI/2.0);
  scene.add(bottomPlane);

  var leftFieldPlane = new THREE.PlaneGeometry(6, 0.5);
  var leftPlane = new THREE.Mesh(leftFieldPlane, fieldMaterial);
  leftPlane.translateX(-5.0)
  leftPlane.rotateZ(Math.PI/2.0);
  leftPlane.rotateX(Math.PI/2.0);

  var rightFieldPlane = new THREE.PlaneGeometry(6, 0.5);
  var rightPlane = new THREE.Mesh(rightFieldPlane, fieldMaterial);
  rightPlane.translateX(5.0);
  rightPlane.rotateZ(Math.PI/2.0);
  rightPlane.rotateX(Math.PI/2.0);

  var floorMaterial = new THREE.MeshPhongMaterial({color: 0x525252, side: THREE.DoubleSide})
  var floorFieldPlane = new THREE.PlaneGeometry(10, 6);
  var floorPlane = new THREE.Mesh(floorFieldPlane, floorMaterial);
  floorPlane.translateZ(-0.25);
  scene.add(floorPlane);

  scene.add(rightPlane);
  scene.add(leftPlane);
  scene.add(topPlane);
}
