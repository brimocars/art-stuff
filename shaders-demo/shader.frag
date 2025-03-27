precision highp float;

varying vec2 vPos;

uniform float time;
uniform vec2 resolution;

vec3 palette(float t) {
  vec3 colorA = vec3(0.8, 0.9, 0.8);
  vec3 colorB = vec3(0.1, 0.8, 0.8);
  vec3 colorC = vec3(0.8, 0.5, 0.7);
  vec3 colorD = vec3(0.4, 0.4, 0.6);

  float cycle = fract(t * 0.25);

  if(cycle < 0.25) {
    return mix(colorA, colorB, cycle / 0.25);
  } else if(cycle < 0.5) {
    return mix(colorB, colorC, (cycle - 0.25) / 0.25);
  } else if(cycle < 0.75) {
    return mix(colorC, colorD, (cycle - 0.5) / 0.25);
  } else {
    return mix(colorD, colorA, (cycle - 0.75) / 0.25);
  }
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= resolution.x / resolution.y;
  float r = length(uv);
  float angle = atan(uv.y, uv.x) + 0.5 * time;

  float sections = 7.0;
  angle = mod(angle, 2.0 * 3.14159 / sections);
  angle = abs(angle - 3.14159 / sections);

  uv = vec2(cos(angle), sin(angle)) * r;

  float a = sin(10.0 * exp(r / 5.0) - sin(sin(time * 0.3) * 4.6 * uv.y) * 2.0 * uv.x);
  float b = tan(10.0 * uv.y + cos(sin(time * 0.1) * 10.0 * r) * 5.0);

  gl_FragColor = vec4(palette(a + b), 1.0);
}