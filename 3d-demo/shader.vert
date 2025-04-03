precision highp float;

attribute vec3 aPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float time;
uniform float averageSpeed;

void main() {
  vec4 viewModelPosition = uModelViewMatrix * vec4(aPosition, 1.0);

  float speedMult = step(0.01, averageSpeed);
  float averageSpeedToUse = (speedMult * averageSpeed)* (abs(0.5 - fract(time)) + 0.5);

  viewModelPosition.y += 5.0 * cos(viewModelPosition.x * averageSpeedToUse);

  gl_Position = uProjectionMatrix * viewModelPosition;
}