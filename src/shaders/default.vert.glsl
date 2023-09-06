#version 300 es
precision mediump float;

in vec3 aPosition;
out vec2   v_texcoord;

void main() { 
  v_texcoord = aPosition.xy;
  v_texcoord.y = 1.0-v_texcoord.y;
  gl_Position = vec4(aPosition * 2.0 - 1.0, 1.0); 
}