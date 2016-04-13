// Author Nuño de la Serna.
// Copyrights licensed under the Apache License v2.0.
// See the accompanying LICENSE file for terms.


vertex:

attribute vec3 vertices;

void main(void) {
  gl_Position = vec4(vertices, 1.0);
}


fragment:

uniform vec2 resolution;
uniform vec3 ambient;

void main() {
   vec2 uv = gl_FragCoord.xy / resolution.xy;

   vec3 sky = ambient;
   vec3 ground = ambient * 1.2;
   vec3 col = mix(ground, sky, uv.y);

   gl_FragColor = vec4(col, 1.0);
}

