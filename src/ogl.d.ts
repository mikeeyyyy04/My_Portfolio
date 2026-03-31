declare module 'ogl' {
  export class Renderer {
    constructor(options?: Record<string, unknown>);
    gl: WebGL2RenderingContext & { canvas: HTMLCanvasElement };
    setSize(width: number, height: number): void;
    render(options: { scene: unknown }): void;
  }

  export class Program {
    constructor(gl: WebGL2RenderingContext, options: Record<string, unknown>);
    uniforms: Record<string, { value: unknown }>;
  }

  export class Mesh {
    constructor(gl: WebGL2RenderingContext, options: Record<string, unknown>);
  }

  export class Color {
    constructor(color: string);
    r: number;
    g: number;
    b: number;
  }

  export class Triangle {
    constructor(gl: WebGL2RenderingContext);
    attributes: Record<string, unknown>;
  }
}
