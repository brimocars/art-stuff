precision highp float;

uniform vec2 position;
uniform vec2 resolution;

void main() {
  float percent = position.y / resolution.y;
  // uv = uv * 2.0 - 1.0;
  // uv.x *= resolution.x / resolution.y;
  // float r = length(uv);
  // float angle = atan(uv.y, uv.x) + 0.5 * time;

  // float sections = 7.0;
  // angle = mod(angle, 2.0 * 3.14159 / sections);
  // angle = abs(angle - 3.14159 / sections);

  // uv = vec2(cos(angle), sin(angle)) * r;

  // float a = sin(10.0 * exp(r / 5.0) - sin(sin(time * 0.3) * 4.6 * uv.y) * 2.0 * uv.x);
  // float b = tan(10.0 * uv.y + cos(sin(time * 0.1) * 10.0 * r) * 5.0);
  // gl_FragColor = vec4(palette(a + b), 1.0);
  gl_FragColor = vec4(percent, gl_FragCoord.y / resolution.y, distance(position, vec2(gl_FragCoord.x, gl_FragCoord.y)), 1);
  //gl_FragColor = vec4(position.y / gl_FragCoord.y, 0, 0, 1);
}