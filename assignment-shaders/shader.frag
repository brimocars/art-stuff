precision highp float;

uniform vec2 position;
uniform vec2 resolution;

void main() {
  vec2 positionAsFloat = position.xy / resolution;
  float dist = distance(positionAsFloat, gl_FragCoord.xy/resolution);

  gl_FragColor = vec4(positionAsFloat.y, 1.0 - dist, positionAsFloat.x, 1);
}