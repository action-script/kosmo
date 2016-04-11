// Author Nuño de la Serna.
// Copyrights licensed under the Apache License v2.0.
// See the accompanying LICENSE file for terms.


vertex:

attribute vec3 vertices;
uniform mat4 projection, view, model;
varying vec4 pos;

void main(void) {
  pos = projection * view * model * vec4(vertices, 1.0);
  gl_Position = projection * view * model * vec4(vertices, 1.0);
}


fragment:

uniform vec3 color;
varying vec4 pos;

void main() {
  vec3 pixel = color.xyz * (pos.z/10.5);
  gl_FragColor = vec4(pixel, 1.0);
}
