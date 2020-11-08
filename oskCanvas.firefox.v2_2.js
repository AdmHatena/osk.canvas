// osk.canvas v2.2 //

/* 
 * キー取得部分を修正
 */

// namespace "osk" is a name borrowed from the Fate/GrandOrder character "OsakabeHime Princess".
if(typeof(osk) === 'undefined') osk = {};
osk.canvas = class {
  // ----- variable(private) ----- //
  _fps;
  _canvas;
  _canvasFront;
  _ctx;
  _ctxFront;
  _keyInput;
  _mouseInput;
  _update; // call every frame
  _init; // call before animation
  _frame; // frame cnt
  _loop;
  _animationFrameRequestID;
  _isAnimating; // if true, cannot set other values
  _killContextMenu;
  // ----- constructor ----- //
  constructor(
    canvasDOM = undefined,
    initFunc = undefined,
    updateFunc = undefined,
    originWidth = 1920,
    originHeight = 1080,
    fps = 60,
    isKeyGetFromFullWindow = false,
    killContextMenu = false
    ){
    this._fps = fps;
    this._canvas = document.createElement('canvas');
    this._canvas.width = originWidth;
    this._canvas.height = originHeight;
    this._canvasFront = canvasDOM;
    if(!this._canvas.getContext) throw new Error('cannot get 2d context @ constructor(osk.canvas)');
    this._ctx = this._canvas.getContext('2d');
    if(this._canvasFront){
      if(!this._canvasFront.getContext) throw new SyntaxError('invalid value is set to "canvasDOM" @ constructor(osk.canvas)');
      this._ctxFront = this._canvasFront.getContext('2d');
    }
    this._keyInput = {
      keyCode: undefined,
      key: undefined,
      alt: false,
      ctrl: false,
      shift: false,
      meta: false
    };
    this._mouseInput = {
      x: 0,
      y: 0,
      click: 0, // whenmouseup:-1, mousedown:1
      btn: -1 // -1:none, 0:left, 1:middle, 2:right
    };
    this._update = updateFunc;
    this._init = initFunc;
    this._frame = undefined;
    this._loop = ()=>{
      this._animationFrameRequestID = requestAnimationFrame(this._loop);
      this._frame = Math.floor(performance.now() / 1000 * this._fps);
      if(this._mouseInput.click == -1) this._mouseInput.click = 0;
      if(this._mouseInput.click == -2) this._mouseInput.click = -1;
      this._update(this._frame);
      this._ctxFront.fillStyle = 'black';
      this._ctxFront.fillRect(0, 0, this._canvasFront.width, this._canvasFront.height);
      this._ctxFront.drawImage(this._canvas, 0, 0, this._canvasFront.width, this._canvasFront.height);
      this._ctx.fillStyle = 'black';
      this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
    };
    this._animationFrameRequestID = undefined;
    this._isAnimating = false;
    this._killContextMenu = killContextMenu;
    if(this._canvasFront){
      if(isKeyGetFromFullWindow) var rootDOM = window;
      else var rootDOM = this._canvasFront;
      // key input
      rootDOM.addEventListener('keydown', (event)=>{
        this._keyInput.keyCode[event.keyCode] = true;
        this._keyInput.key[event.key] = true;
        this._keyInput.alt = event.altKey;
        this._keyInput.shift = event.shiftKey;
        this._keyInput.ctrl = event.ctrlKey;
        this._keyInput.meta = event.metaKey;
      });
      rootDOM.addEventListener('keyup', (event)=>{
        this._keyInput.keyCode[event.keyCode] = false;
        this._keyInput.key[event.key] = false;
        this._keyInput.alt = event.altKey;
        this._keyInput.shift = event.shiftKey;
        this._keyInput.ctrl = event.ctrlKey;
        this._keyInput.meta = event.metaKey;
      });
      // mouse input
      rootDOM.addEventListener('mousedown', (event)=>{
        this._mouseInput = {
          x: event.clientX,
          y: event.clientY,
          click: 1,
          btn: event.button
        };
      });
      rootDOM.addEventListener('mouseup', (event)=>{
        this._mouseInput = {
          x: event.clientX,
          y: event.clientY,
          click: -2,
          btn: -1
        };
      });
      rootDOM.addEventListener('mousemove', (event)=>{
        this._mouseInput.x = event.clientX;
        this._mouseInput.y = event.clientY;
      });
      rootDOM.addEventListener('contextmenu', (event)=>{event.preventDefault()});
    }
  }
  // ----- getter / setter ----- //
  get canvas(){return this._canvas}
  get ctx(){return this._ctx}
  get key(){return this._keyInput}
  get mouse(){return this._mouseInput}
  get isAnimating(){return this._isAnimating}
  set update(func){
    if(this._isAnimating) throw new Error('settings cannnot be cnahged during animation @ set update(osk.canvas)');
    if(typeof(func) != 'function') throw new Error('invalid value set to "func" @ set update(osk.canvas)');
    this._update = func;
  }
  set update_force(func){
    console.warn('this setter is deprecated, use "osk.canvas.update" instead @ set update_force(osk.canvas)');
    if(typeof(func) != 'function') throw new Error('invalid value set to "func" @ set update_force(osk.canvas)');
    this._update = func;
  }
  set init(func){
    if(this._isAnimating) throw new Error('settings cannnot be cnahged during animation @ set init(osk.canvas');
    if(typeof(func) != 'function') throw new Error('invalid value set to "func" @ set init(osk.canvas)');
    this._init = func;
  }
  set init_force(func){
    console.warn('this setter is deprecated, use "osk.canvas.init" instead @ set init_force(osk.canvas)');
    if(typeof(func) != 'function') throw new Error('invalid value set to "func" @ set init_force(osk.canvas)');
    this._init = func;
  }
  set canvas(dom){
    if(this._isAnimating) throw new Error('settings cannot be changed during animation @ set canvas(osk.canvas)');
    try{
      this._ctxFront = dom.getContext('2d');
    }catch{
      throw new Error('invalid value is set to "dom" @ set canvas(osk.canvas)');
    }
    this._canvasFront = dom;
  }
  set canvas_force(dom){
    console.warn('this setter is deprected, use "osk.canvas.canvas" instead @ set canvas_force(osk.canvas)');
    try{
      this._ctxFront = dom.getContext('2d');
    }catch{
      throw new Error('invalid value is set to "dom" @ set canvas_force(osk.canvas)');
    }
    this._canvasFront = dom;
  }
  set fps(num){
    if(this._isAnimating) throw new Error('settings cannot be changed during animation @ set fps(osk.canvas)');
    if(typeof(num) != 'number' || num <= 0) throw new Error('invalid value is set to "num" @ set fps(osk.canvas)');
    this._fps = num;
  }
  set fps_force(num){
    console.warn('this setter is depected, use "osk.canvas.fps" instead @ set fps_force(osk.canvas)');
    if(typeof(num) != 'number' || num <= 0) throw new Error('invalid value is set to "num" @ set fps_force(osk.canvas)');
    this._fps = num;
  }
  set originWidth(pix){
    if(this._isAnimating) throw new Error('settings cannot be changed during animation @ set originWidth(osk.canvas)');
    if(typeof(pix) != 'number' || pix <= 0) throw new Error('invalid value is set to "num" @ set originWidth(osk.canvas)');
    this._canvas.width = pix;
  }
  set originWidth_force(pix){
    console.warn('this setter is depected, use "osk.canvas.originWidth" instead @ set originWidth_force(osk.canvas)');
    if(typeof(pix) != 'number' || pix <= 0) throw new Error('invalid value is set to "num" @ set originWidth(osk.canvas)');
    this._canvas.width = pix;
  }
  set originHeight(pix){
    if(this._isAnimating) throw new Error('settings cannot be changed during animation @ set originHeight(osk.canvas)');
    if(typeof(pix) != 'number' || pix <= 0) throw new Error('invalid value is set to "num" @ set originHeight(osk.canvas)');
    this._canvas.height = pix;
  }
  set originHeight_force(pix){
    console.warn('this setter is depected, use "osk.canvas.originheight" instead @ set originheight_force(osk.canvas)');
    if(typeof(pix) != 'number' || pix <= 0) throw new Error('invalid value is set to "num" @ set originHeight(osk.canvas)');
    this._canvas.height = pix;
  }
  set killContextMenu(flag){
    this._killContextMenu = flag;
  }
  // ----- false eventListener ----- //
  addEventListener(type, func){
    this._canvasFront.addEventListener(type, func);
  }
  // ----- function ----- //
  start(){
    if(this._isAnimating) throw new Error('animation has already started @ start(osk.canvas)');
    if(typeof(this._update) != 'function') throw new Error('need to set update function before start animation @ start(osk.canvas)');
    this._isAnimating = true;
    if(typeof(this._init) == 'function') this._init();
    this._loop();
  }
  stop(){
    if(!this._isAnimating) throw new Error('animation hasn\'t started @ stop(osk.canvas)');
    cancelAnimationFrame(this._animationFrameRequestID);
    this._isAnimating = false;
  }
};