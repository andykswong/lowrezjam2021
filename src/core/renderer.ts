import { AddressMode, BlendFactor, Buffer, CompareFunc, FilterMode, MinFilterMode, Pipeline, ReadonlyColor, RenderingDevice, RenderPass, ShaderType, Texture, UniformFormat, UniformType, Usage, VertexFormat } from 'mugl';
import { array, ReadonlyMat4, ReadonlyVec3, ReadonlyVec4 } from 'munum';
import { toVertices, Quad } from './model';
import { SPRITE_FS, SPRITE_VS } from './shaders';

const COLOR_NONE: ReadonlyColor = [0, 0, 0, 0];
const QUAT_VERT = toVertices(Quad);

export const COMPONENTS_PER_SPRITE = 12;

export class SpritesRenderer {
  private pipeline: Pipeline | null = null;
  private pass: RenderPass | null = null;
  private buffer: Buffer | null = null;
  private instBuffer: Buffer | null = null;
  private tex: Texture | null = null;
  private _init = false;
  private data: Float32Array;
  protected i = 0;

  public constructor(
    private readonly device: RenderingDevice,
    private writeDepth = false,
    private clearColor: ReadonlyVec4 | null = null,
    private max = 8 * 8 * 5
  ) {
    this.data = new Float32Array(COMPONENTS_PER_SPRITE * max);
  }
  
  public init(): void {
    if (this._init) {
      return;
    }
    this._init = true;

    this.buffer = this.device.buffer({
      size: QUAT_VERT.byteLength
    }).data(QUAT_VERT);
    
    this.instBuffer = this.device.buffer({
      usage: Usage.Stream,
      size: this.data.byteLength
    });

    this.tex = this.device.texture({
      width: 128,
      height: 64
    }, {
      wrapU: AddressMode.Clamp,
      wrapV: AddressMode.Clamp,
      minFilter: MinFilterMode.Nearest,
      magFilter: FilterMode.Nearest
    }).data({
      image: document.getElementById('sprites') as TexImageSource
    });

    const vert = this.device.shader({ type: ShaderType.Vertex, source: SPRITE_VS });
    const frag = this.device.shader({ type: ShaderType.Fragment, source: SPRITE_FS });

    this.pipeline = this.device.pipeline({
      vert,
      frag,
      buffers: [{
        attrs: [
          { name: 'qpos', format: VertexFormat.Float2 },
          { name: 'uv', format: VertexFormat.Float2 }
        ]
      }, {
        attrs: [
          { name: 'quad', format: VertexFormat.Float4 },
          { name: 'position', format: VertexFormat.Float3 },
          { name: 'dirAlpha', format: VertexFormat.Float },
          { name: 'color', format: VertexFormat.Float4 }
        ],
        instanced: true
      }],
      uniforms: [
        { name: 'vp', valueFormat: UniformFormat.Mat4 },
        { name: 'tex', type: UniformType.Tex, texType: this.tex!.props.type },
        { name: 'texSize', valueFormat: UniformFormat.Vec2 },
      ],
      depth: this.writeDepth ? {
        write: true,
        compare: CompareFunc.LEqual
      } : null,
      blend: {
        srcFactorRGB: BlendFactor.SrcAlpha,
        dstFactorRGB: BlendFactor.OneMinusSrcAlpha,
        srcFactorAlpha: BlendFactor.One,
        dstFactorAlpha: BlendFactor.OneMinusSrcAlpha,
      }
    })

    vert.destroy();
    frag.destroy();

    this.pass = this.device.pass({
      clearColor: this.clearColor,
      clearDepth: this.clearColor ? 1 : NaN
    });
  }

  public submit(quad: ReadonlyVec4, pos: ReadonlyVec3, rotation: number = 1, alpha: number = 1, color: ReadonlyColor = COLOR_NONE): void {
    if (this.i + COMPONENTS_PER_SPRITE >= this.max * COMPONENTS_PER_SPRITE) {
      console.error('Buffer overflow');
    }
    array.copy(quad, this.data, 0, this.i, 4); this.i += 4;
    array.copy(pos, this.data, 0, this.i, 3); this.i += 3;
    this.data[this.i++] = Math.sign(rotation) * (alpha || 0.001);
    array.copy(color, this.data, 0, this.i, 4); this.i += 4;
  }

  public render(viewProj: ReadonlyMat4): void {
    if (!this.i) {
      return;
    }

    this.instBuffer!.data(this.data);
    this.device.render(this.pass!)
      .pipeline(this.pipeline!)
      .vertex(0, this.buffer!)
      .vertex(1, this.instBuffer!)
      .uniforms([
        { name: 'vp', values: viewProj },
        { name: 'tex', tex: this.tex },
        { name: 'texSize', values: [this.tex!.props.width, this.tex!.props.height] },
      ])
      .draw(Quad.positions!.length, this.i / COMPONENTS_PER_SPRITE)
      .end();
    this.i = 0;
  }
}
