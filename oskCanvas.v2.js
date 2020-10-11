// osk.canvas v2 //

// namespace "osk" is a name borrowed from the Fate/GrandOrder character "OsakabeHime Princess".
if(typeof(osk) === 'undefined') osk = {};
osk.canvas = class {
  // ----- variable(private) ----- //
  #fps;
  #canvas;
  #canvasFront;
  #ctx;
  #ctxFront;
  #keyInput;
  #update; // call every frame
  #init; // call before animation
  #frame; // frame cnt
  #loop;
  #animationFrameRequestID;
  #isAnimating; // if true, cannot set other values
  // ----- constructor ----- //
  constructor(
    canvasDOM = undefined,
    initFunc = undefined,
    updateFunc = undefined,
    originWidth = 1920,
    originHeight = 1080,
    fps = 60,
    isKeyGetFromFullWindow = false
    ){
    this.#fps = fps;
    this.#canvas = document.createElement('canvas');
    this.#canvas.width = originWidth;
    this.#canvas.height = originHeight;
    this.#canvasFront = canvasDOM;
    if(!this.#canvas.getContext) throw new Error('cannot get 2d context @ constructor(osk.canvas)');
    this.#ctx = this.#canvas.getContext('2d');
    if(this.#canvasFront){
      if(!this.#canvasFront.getContext) throw new SyntaxError('invalid value is set to "canvasDOM" @ constructor(osk.canvas)');
      this.#ctxFront = this.#canvasFront.getContext('2d');
    }
    this.#keyInput = {
      KeyCode: undefined,
      alt: false,
      ctrl: false,
      shift: false,
      meta: false
    };
    this.#update = updateFunc;
    this.#init = initFunc;
    this.#frame = undefined;
    this.#loop = ()=>{
      this.#animationFrameRequestID = requestAnimationFrame(this.#loop);
      this.#frame = Math.floor(performance.now() / 1000 * this.#fps);
      this.#update(this.#frame);
      this.#ctxFront.fillStyle = 'black';
      this.#ctxFront.fillRect(0, 0, this.#canvasFront.width, this.#canvasFront.height);
      this.#ctxFront.drawImage(this.#canvas, 0, 0, this.#canvasFront.width, this.#canvasFront.height);
      this.#ctx.fillStyle = 'black';
      this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
    };
    this.#animationFrameRequestID = undefined;
    this.#isAnimating = false;
    if(this.#canvasFront){
      if(isKeyGetFromFullWindow) var rootDOM = window;
      else var rootDOM = this.#canvasFront;
      rootDOM.addEventListener('keydown', (event)=>{
        this.#keyInput = {
          keyCode: event.keyCode,
          alt: event.altKey,
          ctrl: event.ctrlKey,
          shift: event.shiftKey,
          meta: event.metaKey
        };
      });
      rootDOM.addEventListener('keyup', (event)=>{
        this.#keyInput = {
          keyCode: undefined,
          alt: event.altKey,
          ctrl: event.ctrlKey,
          shift: event.shiftKey,
          meta: event.metaKey
        };
      });
    }
  }
  // ----- getter / setter ----- //
  get canvas(){return this.#canvas}
  get ctx(){return this.#ctx}
  get key(){return this.#keyInput}
  get isAnimating(){return this.#isAnimating}
  set update(func){
    if(this.#isAnimating) throw new Error('settings cannnot be cnahged during animation @ set update(osk.canvas)');
    if(typeof(func) != 'function') throw new Error('invalid value set to "func" @ set update(osk.canvas)');
    this.#update = func;
  }
  set update_force(func){
    console.warn('this setter is deprecated, use "osk.canvas.update" instead @ set update_force(osk.canvas)');
    if(typeof(func) != 'function') throw new Error('invalid value set to "func" @ set update_force(osk.canvas)');
    this.#update = func;
  }
  set init(func){
    if(this.#isAnimating) throw new Error('settings cannnot be cnahged during animation @ set init(osk.canvas');
    if(typeof(func) != 'function') throw new Error('invalid value set to "func" @ set init(osk.canvas)');
    this.#init = func;
  }
  set init_force(func){
    console.warn('this setter is deprecated, use "osk.canvas.init" instead @ set init_force(osk.canvas)');
    if(typeof(func) != 'function') throw new Error('invalid value set to "func" @ set init_force(osk.canvas)');
    this.#init = func;
  }
  set canvas(dom){
    if(this.#isAnimating) throw new Error('settings cannot be changed during animation @ set canvas(osk.canvas)');
    try{
      this.#ctxFront = dom.getContext('2d');
    }catch{
      throw new Error('invalid value is set to "dom" @ set canvas(osk.canvas)');
    }
    this.#canvasFront = dom;
  }
  set canvas_force(dom){
    console.warn('this setter is deprected, use "osk.canvas.canvas" instead @ set canvas_force(osk.canvas)');
    try{
      this.#ctxFront = dom.getContext('2d');
    }catch{
      throw new Error('invalid value is set to "dom" @ set canvas_force(osk.canvas)');
    }
    this.#canvasFront = dom;
  }
  set fps(num){
    if(this.#isAnimating) throw new Error('settings cannot be changed during animation @ set fps(osk.canvas)');
    if(typeof(num) != 'number' || num <= 0) throw new Error('invalid value is set to "num" @ set fps(osk.canvas)');
    this.#fps = num;
  }
  set fps_force(num){
    console.warn('this setter is depected, use "osk.canvas.fps" instead @ set fps_force(osk.canvas)');
    if(typeof(num) != 'number' || num <= 0) throw new Error('invalid value is set to "num" @ set fps_force(osk.canvas)');
    this.#fps = num;
  }
  set originWidth(pix){
    if(this.#isAnimating) throw new Error('settings cannot be changed during animation @ set originWidth(osk.canvas)');
    if(typeof(pix) != 'number' || pix <= 0) throw new Error('invalid value is set to "num" @ set originWidth(osk.canvas)');
    this.#canvas.width = pix;
  }
  set originWidth_force(pix){
    console.warn('this setter is depected, use "osk.canvas.originWidth" instead @ set originWidth_force(osk.canvas)');
    if(typeof(pix) != 'number' || pix <= 0) throw new Error('invalid value is set to "num" @ set originWidth(osk.canvas)');
    this.#canvas.width = pix;
  }
  set originHeight(pix){
    if(this.#isAnimating) throw new Error('settings cannot be changed during animation @ set originHeight(osk.canvas)');
    if(typeof(pix) != 'number' || pix <= 0) throw new Error('invalid value is set to "num" @ set originHeight(osk.canvas)');
    this.#canvas.height = pix;
  }
  // ----- function ----- //
  start(){
    if(typeof(this.#update) != 'function') throw new Error('need to set update function before start animation @ start(osk.canvas)');
    this.#isAnimating = true;
    if(typeof(this.#init) == 'function') this.#init();
    this.#loop();
  }
  stop(){
    cancelAnimationFrame(this.#animationFrameRequestID);
    this.#isAnimating = false;
  }
};
