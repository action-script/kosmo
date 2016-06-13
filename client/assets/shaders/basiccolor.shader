// Author Nuño de la Serna.
// Copyrights licensed under the Apache License v2.0.
// See the accompanying LICENSE file for terms.


vertex:

attribute vec3 vertices;
uniform mat4 projection, view, model;

void main(void) {
   gl_Position = projection * view * model * vec4(vertices, 1.0);
}


fragment:

uniform vec3 color;

void main() {
   gl_FragColor = vec4(color/255., 1.0);
}
