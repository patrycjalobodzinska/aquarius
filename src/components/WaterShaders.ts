// Shadery z three.js webgl_gpgpu_water - symulacja fal w GPGPU.

export const heightmapFragmentShader = /* glsl */ `
  #include <common>

  uniform vec2 mousePos;
  uniform float mouseSize;
  uniform float viscosityConstant;
  uniform float heightCompensation;

  void main() {
    vec2 cellSize = 1.0 / resolution.xy;
    vec2 uv = gl_FragCoord.xy * cellSize;

    vec4 heightmapValue = texture2D(heightmap, uv);

    vec4 north = texture2D(heightmap, uv + vec2(0.0, cellSize.y));
    vec4 south = texture2D(heightmap, uv + vec2(0.0, -cellSize.y));
    vec4 east  = texture2D(heightmap, uv + vec2(cellSize.x, 0.0));
    vec4 west  = texture2D(heightmap, uv + vec2(-cellSize.x, 0.0));

    float newHeight = ((north.x + south.x + east.x + west.x) * 0.5 - heightmapValue.y) * viscosityConstant;

    float mousePhase = clamp(
      length((uv - vec2(0.5)) * BOUNDS - vec2(mousePos.x, -mousePos.y)) * PI / mouseSize,
      0.0,
      PI
    );
    newHeight += (cos(mousePhase) + 1.0) * 0.28;

    heightmapValue.y = heightmapValue.x;
    heightmapValue.x = newHeight;

    gl_FragColor = heightmapValue;
  }
`;

// CustomShaderMaterial injection points: csm_Position, csm_Normal.
// Podmieniamy position z siatki na wysokość z heightmapy i przeliczamy normal.
export const waterVertexShader = /* glsl */ `
  uniform sampler2D heightmap;

  void main() {
    vec2 cellSize = vec2(1.0 / WIDTH);

    vec3 waterNormal = vec3(
      (texture2D(heightmap, uv + vec2(-cellSize.x, 0.0)).x - texture2D(heightmap, uv + vec2(cellSize.x, 0.0)).x) * WIDTH / BOUNDS,
      (texture2D(heightmap, uv + vec2(0.0, -cellSize.y)).x - texture2D(heightmap, uv + vec2(0.0, cellSize.y)).x) * WIDTH / BOUNDS,
      1.0
    );

    float heightValue = texture2D(heightmap, uv).x;

    csm_Position = vec3(position.x, position.y, heightValue);
    csm_Normal = normalize(waterNormal);
  }
`;
