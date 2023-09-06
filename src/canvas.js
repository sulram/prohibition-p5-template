import { calculateFeatures } from './params'
import vertSource from './shaders/default.vert.glsl'
import frag1 from './shaders/frag1.glsl'

// Calculate FEATURES
const FEATURES = calculateFeatures(tokenData, true)
const { PARAMS, PALETTE, FXRAND } = FEATURES;

delete FEATURES.PARAMS
delete FEATURES.PALETTE
delete FEATURES.FXRAND

const debugParams = document.getElementById("debug--params")
const debugTraits = document.getElementById("debug--traits")
if(debugParams && debugTraits){
  debugTraits.innerText = JSON.stringify({FEATURES}, null, 2)
  debugParams.innerText = JSON.stringify({PARAMS}, null, 2);
  // for batch export
  if(window){
    window.PARAMS = PARAMS
  }
}

const WIDTH = 1488;
const HEIGHT = 2104;

let shader1;
let canvas, glContext;

// WEBGL 2 hack

p5.RendererGL.prototype._initContext = function() {
  try {
    this.drawingContext =
      this.canvas.getContext('webgl2', this._pInst._glAttributes) ||
      this.canvas.getContext('experimental-webgl', this._pInst._glAttributes);
    if (this.drawingContext === null) {
      throw new Error('Error creating webgl context');
    } else {
      const gl = this.drawingContext;
      // gl.enable(gl.DEPTH_TEST);
      gl.disable(gl.DEPTH_TEST);
      // gl.depthFunc(gl.LEQUAL);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      this._viewport = this.drawingContext.getParameter(
        this.drawingContext.VIEWPORT
      );
    }
  } catch (er) {
    throw er;
  }
};

new window.p5(function (p5) {

  p5.setup = function () {
    canvas = p5.createCanvas(WIDTH, HEIGHT, p5.WEBGL);
    glContext = canvas.GL;

    p5.pixelDensity(2);
    p5.background(0);
    
    p5.applyShader()

    p5.windowResized()

  }

  // p5.clearBuffers = function(){
  //   glContext.clear(glContext.COLOR_BUFFER_BIT);
  // }

  p5.applyShader = function() {

    // ┏━━━━━━━━━━━━━━┓
    // ┃ SHADER 01    ┃
    // ┗━━━━━━━━━━━━━━┛

    shader1 = p5.createShader(vertSource, frag1);

    p5.shader(shader1);

    shader1.setUniform("u_resolution", [WIDTH, HEIGHT]);
    shader1.setUniform("octaves", PARAMS.octaves);

    shader1.setUniform("noise_offset", [PARAMS.offset.x, PARAMS.offset.y]);
    shader1.setUniform("noise_scale", [PARAMS.scale.x, PARAMS.scale.y]);

    shader1.setUniform("color_bg", PALETTE[0]);
    shader1.setUniform("color_line", PALETTE[1]);
    shader1.setUniform("lines_density", PARAMS.lines_density);

    p5.quad(-1, -1, 1, -1, 1, 1, -1, 1);

    // buffer0 = p5.get();

  }

  // Resize canvas
  p5.windowResized = function(){
    const debugTraits = document.getElementById("debug--traits")
    let canvas = document.getElementById('defaultCanvas0');
    if (canvas && !debugTraits) {
      const w = document.body.clientWidth;
      const h = document.body.clientHeight;
      
      if(w/h > WIDTH/HEIGHT){
        canvas.style.setProperty('width', 'auto', 'important');
        canvas.style.setProperty('height', '100%', 'important');
      } else {
        canvas.style.setProperty('width', '100%', 'important');
        canvas.style.setProperty('height', 'auto', 'important');
      }
    }
  }

  // Press D for download
  p5.keyPressed = function(){
    if(p5.keyCode === 68){
      const canvas = document.getElementById("defaultCanvas0");
      canvas.toBlob((blob)=>{
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = `${tokenData.hash}.png`
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 'image/png')
    }
  }


}, "canvas");
