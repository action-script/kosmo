// Author Nuño de la Serna.
// Copyrights licensed under the Apache License v2.0.
// See the accompanying LICENSE file for terms.


vertex:

attribute vec3 vertices;
attribute vec2 textures;
varying vec2 vtexcoord;

void main(void) {
   gl_Position = vec4(vertices, 1.0);
   vtexcoord = textures;
}


fragment:

varying vec2 vtexcoord;
uniform sampler2D source;

void main(void) {
   vec4 src = texture2D(source, vtexcoord);
   gl_FragColor = vec4(src.rgba);
}
