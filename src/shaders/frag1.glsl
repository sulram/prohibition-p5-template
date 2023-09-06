#version 300 es
precision mediump float;

out vec4 fragColor;

uniform vec2 u_resolution;

uniform vec2 noise_offset;
uniform vec2 noise_scale;

uniform float octaves;
uniform float lines_density;

uniform vec3 color_bg;
uniform vec3 color_line;

#include "pnoise.glsl";

float calcTerrain(vec2 st) {

  vec2 uv = st + noise_offset;
  float f = 0.;

  mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
  f  = 0.5000*noise( uv ); uv = m*uv;
  if(octaves>1.) f += 0.2500*noise( uv ); uv = m*uv;
  if(octaves>2.) f += 0.1250*noise( uv ); uv = m*uv;
  if(octaves>3.) f += 0.0625*noise( uv ); uv = m*uv;

  return norm_value(f);
}

void main() {
  
  vec2 st = gl_FragCoord.xy/u_resolution;

  // TERRAIN
  float distortion = 4.;
  float n_color = calcTerrain(st*noise_scale * distortion) / distortion;

  // RESET COLOR
  vec3 color = color_bg;

  // LINES
  float numLines = lines_density;
  float linePos = fract(n_color * numLines);
  float lineWeight = 4.0 * numLines / min(u_resolution.x, u_resolution.y);

  if (linePos < lineWeight) {
      color = color_line;
  }

  // DEBUG show noise
  // color = vec3(n_color);

  fragColor = vec4(color,1.0);
}