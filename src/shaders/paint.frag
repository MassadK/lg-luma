uniform sampler2D u_texture;
uniform float u_aa;
uniform vec4 u_edge_fade;
uniform vec4 u_edge_fade_x;
uniform vec3 u_app_top;
uniform vec3 u_app_bottom;
uniform bool u_app;
// Liquid Glass: [body, shine, opacity]; body < 0 is off.
uniform vec3 u_glass;
varying PAINT_PRECISION vec2 v_uv;
varying PAINT_PRECISION vec4 v_color;
varying PAINT_PRECISION vec4 v_shape;
varying PAINT_PRECISION vec2 v_params;
varying PAINT_PRECISION float v_logical_y;
varying PAINT_PRECISION float v_logical_x;
float edge_coverage() {
    float edge = 1.0;
    if (u_edge_fade.y > u_edge_fade.x)
        edge = smoothstep(u_edge_fade.x, u_edge_fade.y, v_logical_y) *
            (1.0 - smoothstep(u_edge_fade.z, u_edge_fade.w, v_logical_y));
    if (u_edge_fade_x.y > u_edge_fade_x.x)
        edge *= smoothstep(u_edge_fade_x.x, u_edge_fade_x.y, v_logical_x);
    if (u_edge_fade_x.w > u_edge_fade_x.z)
        edge *= 1.0 - smoothstep(u_edge_fade_x.z, u_edge_fade_x.w, v_logical_x);
    return edge;
}
void main() {
    if (v_params.x < 0.0) {
        vec4 color = texture2D(u_texture, v_uv) * v_color;
        // -2: wallpaper with folded full-screen fills, p * m + k (k in v_shape).
        if (v_params.x < -1.5)
            color.rgb += v_shape.rgb;
        gl_FragColor = color * vec4(1.0, 1.0, 1.0, edge_coverage());
        return;
    }
    float blur = max(-v_params.y, 0.0);
    vec2 half_size = v_shape.zw - vec2(blur);
    float radius = min(v_params.x, min(half_size.x, half_size.y));
    vec2 q = abs(v_shape.xy) - half_size + vec2(radius);
    float d = length(max(q, vec2(0.0))) + min(max(q.x, q.y), 0.0) - radius;
    // Box-filtered coverage of one drawable pixel (u_aa) centred on the edge: an edge on a
    // pixel boundary stays one crisp step, and a one-pixel border is fully opaque.
    float alpha = clamp(0.5 - d / u_aa, 0.0, 1.0);
    if (blur > 0.0) {
        alpha = 1.0 - smoothstep(-blur, blur, d);
    }
    if (v_params.y > 0.0) {
        alpha *= clamp(0.5 + (d + v_params.y) / u_aa, 0.0, 1.0);
    }
    if (u_glass.x >= 0.0) {
        // Outward normal of the rounded rectangle and depth into it, in logical pixels.
        vec2 qp = max(q, vec2(0.0));
        vec2 n = (qp.x > 0.0 || qp.y > 0.0) ? normalize(qp + 1e-4)
            : (q.x > q.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0));
        n *= sign(v_shape.xy + 1e-4);
        float inside = max(-d, 0.0);
        float bezel = max(min(radius * 0.85, min(half_size.x, half_size.y) * 0.8), 6.0);
        float t = clamp(inside / bezel, 0.0, 1.0);
        // A convex lens rim: light from beyond the edge bends inwards, steepest at the rim.
        float bend = (1.0 - t) * (1.0 - t) * min(bezel * 1.1, 34.0);
        vec2 px = vec2(1.0 / 1920.0, 1.0 / 1080.0);
        vec2 shift = n * bend * px;
        vec3 bg = vec3(
            texture2D(u_texture, v_uv + shift * 1.10).r,
            texture2D(u_texture, v_uv + shift).g,
            texture2D(u_texture, v_uv + shift * 0.90).b);
        // Vibrancy: glass lifts and saturates what it shows.
        float luma = dot(bg, vec3(0.2126, 0.7152, 0.0722));
        bg = clamp(mix(vec3(luma), bg, 1.35) * 1.02 + 0.01, 0.0, 1.0);
        bg = mix(bg, v_color.rgb, v_color.a);
        // Specular rim: one continuous hairline whose brightness follows a smooth diagonal
        // gradient across the whole shape (lit upper left, a softer echo lower right), so it
        // never jumps where straight sides meet the corners.
        vec2 light = normalize(vec2(-0.55, -0.83));
        vec2 across = v_shape.xy / max(half_size, vec2(1.0));
        float g = dot(across, light) / 1.38;
        float lit = smoothstep(0.0, 1.0, g);
        float back = smoothstep(0.0, 1.0, -g);
        float line = 1.0 - smoothstep(0.0, 1.5 + u_aa * 1.5, inside);
        float sheen_band = 1.0 - smoothstep(0.0, 7.0, inside);
        float spec = line * (0.11 + 0.55 * lit + 0.24 * back)
            + sheen_band * (0.025 + 0.05 * lit);
        spec *= u_glass.y;
        // A faint sheen over the top half of the body.
        float y = v_shape.y / (2.0 * half_size.y) + 0.5;
        float sheen = 0.05 * (1.0 - smoothstep(0.0, 0.55, y)) * u_glass.y;
        vec3 body = clamp(bg + vec3(spec + sheen), 0.0, 1.0);
        float rim_alpha = clamp(spec * 1.1, 0.0, 1.0);
        vec4 glass = mix(vec4(1.0, 1.0, 1.0, rim_alpha), vec4(body, 1.0), u_glass.x);
        gl_FragColor = vec4(glass.rgb, glass.a * alpha * u_glass.z * edge_coverage());
        return;
    }
    vec4 color = texture2D(u_texture, v_uv);
    if (u_app) {
        float y = v_shape.y / (2.0 * half_size.y) + 0.5;
        vec3 background = mix(u_app_top, u_app_bottom, y);
        float inside = step(0.0, v_uv.x) * step(v_uv.x, 1.0) *
            step(0.0, v_uv.y) * step(v_uv.y, 1.0);
        color = vec4(mix(background, color.rgb, color.a * inside), 1.0);
    }
    gl_FragColor = color * v_color * vec4(1.0, 1.0, 1.0, alpha * edge_coverage());
}
