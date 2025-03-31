precision highp float;

attribute vec3 aPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float time;

varying vec2 vPos;

void main() {
  vec4 viewModelPosition = uModelViewMatrix * vec4(aPosition, 1.0);

  // viewModelPosition.y += 100.0 * cos(time);
  //viewModelPosition.y += 5.0 * cos(time * 10.0 + viewModelPosition.x * 0.1);

  gl_Position = uProjectionMatrix * viewModelPosition;
  // vPos = (gl_Position.xy / gl_Position.w) * 0.5 + 0.5;
}