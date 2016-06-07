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
uniform sampler2D depth;
float qnt = 0.001;

void main(void) {
   float far = pow( texture2D(depth, vtexcoord).r, 60. );
   vec4 rca = texture2D( source, vtexcoord - vec2(-far*qnt, 0.) );
   vec4 gca = texture2D( source, vtexcoord - vec2( .0, .0) );
   vec4 bca = texture2D( source, vtexcoord - vec2(far*qnt, 0.) );
   vec4 aca = texture2D( source, vtexcoord);

   // Combine the offset colors.
   gl_FragColor = vec4(rca.r, gca.g, bca.b, aca.a);
}
    

