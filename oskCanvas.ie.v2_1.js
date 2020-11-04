// osk.canvas (no class) //

// namespace "osk" is a name borrowed from the Fate/GrandOrder character "OsakabeHime Princess".
if(typeof(osk) === 'undefined') osk = {};
osk.canvas = {};

osk.canvas.dataObject = {
  // ----- variable (private) ----- //
  _fps: undefined,
  _canvas: undefined,
  _canvasFront: undefined,
  _ctx: undefined,
  _ctxFront: undefined,
  _keyInput: undefined,
  _mouseInput: undefined,
  _update: undefined,
  _init: undefined,
  _frame: undefined,
  _loop: undefined,
  _animationFrameRequestID: undefined,
  _isAnimating: undefined,
  _killContextMenu: undefined,
  _contextMenuKiller: undefined
};

// ----- constructor ----- //
osk.canvas.initCanvas = function(
  canvasObject, // format: osk.canvas.dataObject
  canvasDOM, // default: undefined
  initFunc, // default: undefined
  updateFunc, // default: undefined
  originWidth, // default: 1920
  originHeight, // default: 1080
  fps, // default: 60
  isKeyGetFromFullWindow, // default: false
  killContextMenu // default: false
){
  canvasObject._fps = fps;
  canvasObject._canvas = document.createElement('canvas');
  canvasObject._canvas.width = originWidth;
  canvasObject._canvas.height = originHeight;
  canvasObject._canvasFront = canvasDOM;
  if(!canvasObject._canvas.getContext) throw new Error('cannot get 2d context @ constructor(osk.canvas)');
  canvasObject._ctx = canvasObject._canvas.getContext('2d');
  if(canvasObject._canvasFront){
    if(!canvasObject._canvasFront.getContext) throw new SyntaxError('invalid value is set to "canvasDOM" @ constructor(osk.canvas)');
    canvasObject._ctxFront = canvasObject._canvasFront.getContext('2d');
  }
  canvasObject._keyInput = {
    keyCode: undefined,
    key: undefined,
    alt: false,
    ctrl: false,
    shift: false,
    meta: false
  };
  canvasObject._mouseInput = {
    x: 0,
    y: 0,
    click: 0, // whenMouseUp:-1, mousedown:1
    btn: -1 // -1:none, 0:left, 1:middle, 2:right
  };
  canvasObject._update = updateFunc;
  canvasObject._init = initFunc;
  canvasObject._frame = undefined;
  canvasObject._loop = function(){
    canvasObject._animationFrameRequestID = requestAnimationFrame(canvasObject._loop);
    canvasObject._frame = Math.floor(performance.now() / 1000 * canvasObject._fps);
    if(canvasObject._mouseInput.click == -1) canvasObject._mouseInput.click = 0;
    if(canvasObject._mouseInput.click == -2) canvasObject._mouseInput.click = -1;
    canvasObject._update(canvasObject._frame);
    canvasObject._ctxFront.fillStyle = 'black';
    canvasObject._ctxFront.fillRect(0, 0, canvasObject._canvasFront.width, canvasObject._canvasFront.height);
    canvasObject._ctxFront.drawImage(canvasObject._canvas, 0, 0, canvasObject._canvasFront.width, canvasObject._canvasFront.height);
    canvasObject._ctx.fillStyle = 'black';
    canvasObject._ctx.fillRect(0, 0, canvasObject._canvas.width, canvasObject._canvas.height);
  };
  canvasObject._animationFrameRequestID = undefined;
  canvasObject._isAnimating = false;
  canvasObject._killContextMenu = killContextMenu;
  canvasObject._contextMenuKiller = function(event){
    event.preventDefault();
  };
  if(canvasObject._canvasFront){
    if(isKeyGetFromFullWindow) var rootDOM = window;
    else var rootDOM = canvasObject._canvasFront;
    // key input
    if(rootDOM.addEventListener){
      // use addEventListener
      rootDOM.addEventListener('keydown', function(event){
        canvasObject._keyInput = {
          keyCode: event.keyCode,
          key: event.key,
          alt: event.altKKey,
          ctrl: event.ctrlKey,
          shift: event.shiftKey,
          meta: event.metaKey
        };
      });
      rootDOM.addEventListener('keyup', function(event){
        canvasObject._keyInput = {
          keyCode: undefined,
          key: undefined,
          alt: event.altKKey,
          ctrl: event.ctrlKey,
          shift: event.shiftKey,
          meta: event.metaKey
        };
      });
      rootDOM.addEventListener('mousedown', function(event){
        canvasObject._mouseInput = {
          x: event.clientX,
          y: event.clientY,
          click: 1,
          btn: event.button
        };
      });
      rootDOM.addEventListener('mouseup', function(event){
        canvasObject._mouseInput = {
          x: event.clientX,
          y: event.clientY,
          click: -2,
          btn: -1
        };
      });
      rootDOM.addEventListener('mousemove', function(event){
        canvasObject._mouseInput.x = event.clientX;
        canvasObject._mouseInput.y = event.clientY;
      });
      if(canvasObject._killContextMenu) rootDOM.addEventListener('contextmenu', canvasObject._contextMenuKiller);
    } else{
      // use attachEvent
      rootDOM.attachEvent('keydown', function(event){
        canvasObject._keyInput = {
          keyCode: event.keyCode,
          key: event.key,
          alt: event.altKKey,
          ctrl: event.ctrlKey,
          shift: event.shiftKey,
          meta: event.metaKey
        };
      });
      rootDOM.attachEvent('keyup', function(event){
        canvasObject._keyInput = {
          keyCode: undefined,
          key: undefined,
          alt: event.altKKey,
          ctrl: event.ctrlKey,
          shift: event.shiftKey,
          meta: event.metaKey
        };
      });
      rootDOM.attachEvent('mousedown', function(event){
        canvasObject._mouseInput = {
          x: event.clientX,
          y: event.clientY,
          click: 1,
          btn: event.button
        };
      });
      rootDOM.attachEvent('mouseup', function(event){
        canvasObject._mouseInput = {
          x: event.clientX,
          y: event.clientY,
          click: -2,
          btn: -1
        };
      });
      rootDOM.attachEvent('mousemove', function(event){
        canvasObject._mouseInput.x = event.clientX;
        canvasObject._mouseInput.y = event.clientY;
      });
      if(canvasObject._killContextMenu) rootDOM.attachEvent('contextmenu', canvasObject._contextMenuKiller);
    }
  }
};

// ----- getter / setter ----- //
osk.canvas.getCanvas = function(canvasObject){
  return canvasObject._canvas;
}
osk.canvas.getCtx = function(canvasObject){
  return canvasObject._ctx;
}
osk.canvas.getKey = function(canvasObject){
  return canvasObject._keyInput;
}
osk.canvas.getMouse = function(canvasObject){
  return canvasObject._mouseInput;
}
osk.canvas.isAnimating = function(canvasObject){
  return canvasObject._isAnimating;
}
osk.canvas.setUpdate = function(canvasObject, func){
  if(canvasObject._isAnimating) throw new Error('settings cannnot be cnahged during animation @ setUpdate(osk.canvas)');
  if(typeof(func) != 'function') throw new Error('invalid value set to "func" @ setUpdate(osk.canvas)');
  canvasObject._update = func;
}
osk.canvas.setUpdate_force = function(canvasObject, func){
  console.warn('this setter is deprecated, use "osk.canvas.setUpdate" instead @ setUpdate_force(osk.canvas)');
  if(typeof(func) != 'function') throw new Error('invalid value set to "func" @ setUpdate(osk.canvas)');
  canvasObject._update = func;
}
osk.canvas.setInit = function(canvasObject, func){
  if(canvasObject._isAnimating) throw new Error('settings cannnot be cnahged during animation @ setInit(osk.canvas)');
  if(typeof(func) != 'function') throw new Error('invalid value set to "func" @ setInit(osk.canvas)');
  canvasObject._init = func;
}
osk.canvas.setInit_force = function(canvasObject, func){
  console.warn('this setter is deprecated, use "osk.canvas.setInit" instead @ setInit_force(osk.canvas)');
  if(typeof(func) != 'function') throw new Error('invalid value set to "func" @ setInit(osk.canvas)');
  canvasObject._init = func;
}
osk.canvas.setCanvas = function(canvasObject, dom){
  //
}