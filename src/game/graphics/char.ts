import { ReadonlyVec4, vec3, Vec3 } from 'munum';
import { SpritesRenderer } from '../../core';
import { frame, HIT_COLOR, WEAPON_OFFSET } from '../config';

const tmpV3 = vec3.create();

export class CharacterSprite {
  public readonly position: Vec3 = [0, 0, 0];
  public faceForward: boolean = true;
  public isWalking: boolean = false;
  public isBlocking: boolean = false;
  public isDead: boolean = false;
  public isFullyDead: boolean = false;
  public isAttacking: number = 0;
  public isHit: number = 0;
  private lastTime: number = 0;
  private alpha: number = 1;

  public constructor(
    public readonly body: ReadonlyVec4,
    public weapon: ReadonlyVec4 | null = null,
    public shield: ReadonlyVec4 | null = null,
    public armor: ReadonlyVec4 | null = null,
    public cape: ReadonlyVec4 | null = null
  ) {
  }

  public render(renderer: SpritesRenderer, t: number = 0): void {
    if (!this.lastTime) {
      this.lastTime = t;
    }
    const dt = t - this.lastTime;

    if (this.isDead) {
      if (this.alpha - dt <= 0) {
        this.isFullyDead = true;
      }
      this.alpha = Math.max(0.001, this.alpha - dt);
    }

    const dir = (this.faceForward ? 1 : -1);
    const color: ReadonlyVec4 | undefined = this.isHit ? [...HIT_COLOR, this.isHit * 2] : undefined;
    const body = (this.isWalking && !this.isDead) ? frame(this.body, t * 5) : this.body;

    renderer.submit(body, this.position, dir, this.alpha, color);
    this.armor && renderer.submit(this.armor, this.position, dir, this.alpha, color);
    this.cape && renderer.submit(this.cape, this.position, dir, this.alpha, color);

    const posWeapon = vec3.add(this.position, vec3.scale(WEAPON_OFFSET, dir, tmpV3), tmpV3);
    this.weapon && renderer.submit(frame(this.weapon, this.isAttacking > 0.2 ? 1 : 0), posWeapon, dir, this.alpha, color);
    this.shield && renderer.submit(frame(this.shield, this.isBlocking ? 1 : 0), posWeapon, dir, this.alpha, color);

    this.isAttacking = Math.max(0, this.isAttacking - dt);
    this.isHit = Math.max(0, this.isHit - dt);
    this.lastTime = t;
  }

  public hit(): void {
    this.isHit = 0.5;
  }

  public attack(): void {
    this.isAttacking = 0.5;
  }
}
