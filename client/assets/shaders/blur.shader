// Author Nuño de la Serna.
// Copyrights licensed under the Apache License v2.0.
// See the accompanying LICENSE file for terms.

vertex:

attribute vec3 vertices;
//attribute vec2 textures;
//varying vec2 vtexcoord;

void main(void) {
   gl_Position = vec4(vertices, 1.0);
//   vtexcoord = textures;
}


fragment:

//varying vec2 vtexcoord;
uniform sampler2D source;
uniform vec2 resolution, axis;

void main(void) {
   vec2 uv = vec2(gl_FragCoord.xy / resolution.xy);
   vec4 color = vec4(0.0);

   vec2 off1 = vec2(1.411764705882353) * axis;
   vec2 off2 = vec2(3.2941176470588234) * axis;
   vec2 off3 = vec2(5.176470588235294) * axis;
   color += texture2D(source, uv) * 0.1964825501511404;
   color += texture2D(source, uv + (off1 / resolution.xy)) * 0.2969069646728344;
   color += texture2D(source, uv - (off1 / resolution.xy)) * 0.2969069646728344;
   color += texture2D(source, uv + (off2 / resolution.xy)) * 0.09447039785044732;
   color += texture2D(source, uv - (off2 / resolution.xy)) * 0.09447039785044732;
   color += texture2D(source, uv + (off3 / resolution.xy)) * 0.010381362401148057;
   color += texture2D(source, uv - (off3 / resolution.xy)) * 0.010381362401148057;
   gl_FragColor = color;
}

