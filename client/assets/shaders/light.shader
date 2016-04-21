// Author Nuño de la Serna.
// Copyrights licensed under the Apache License v2.0.
// See the accompanying LICENSE file for terms.


vertex:

attribute vec3 vertices;
attribute vec3 vertexNormals;
uniform mat4 projection, view, model;
varying vec4 pos;
varying vec3 normal;

void main(void) {
   pos = projection * view * model * vec4(vertices, 1.0);
   normal = normalize(mat3(model) * vertexNormals).xyz;
   gl_Position = projection * view * model * vec4(vertices, 1.0);
}


fragment:

uniform vec3 color;
uniform vec3 ambient;
varying vec4 pos;
varying vec3 normal;

struct directionalLight {
   vec3 color;
   vec3 direction;
   float ambientintensity;
};
uniform directionalLight sunlight;

void main() {
   float diffuseintensity = max( dot( normal, -sunlight.direction ), 0. );

   vec3 light_color = color * sunlight.color *
      (diffuseintensity + sunlight.ambientintensity);

   float distance = pos.z/20.0;
   vec3 pixel = mix(light_color, ambient, min(distance, 1.));

   gl_FragColor = vec4(pixel, 1.0);
}
