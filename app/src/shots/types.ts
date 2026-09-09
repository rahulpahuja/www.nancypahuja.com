export type WatermarkPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface WatermarkConfig {
  enabled: boolean;
  text: string;
  textColor: string;
  logoUrl: string;
  position: WatermarkPosition;
  /** 0 - 1 */
  opacity: number;
}

export interface Shot {
  id: string;
  productId: string;
  title: string;
  videoUrl: string;
  /** epoch millis */
  createdAt: number;
}

export type NewShot = Omit<Shot, 'id' | 'createdAt'>;
