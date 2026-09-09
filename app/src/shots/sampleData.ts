import { Shot, WatermarkConfig } from './types';

export const DEFAULT_WATERMARK: WatermarkConfig = {
  enabled: true,
  text: 'NANCY PAHUJA',
  textColor: '#ffffff',
  logoUrl: '/brand/nancy-pahuja-logo.png',
  position: 'bottom-right',
  opacity: 0.8,
};

/**
 * Public sample clips (Google's open test bucket) used only for the demo until
 * real product-video storage is connected. They are seeded once and remain
 * editable/removable by the admin like any other shot.
 */
export const SAMPLE_SHOTS: Shot[] = [
  {
    id: 'sample-ethereal-1',
    productId: 'ethereal-bloom',
    title: 'Drape & movement',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    createdAt: 1_700_000_000_000,
  },
  {
    id: 'sample-ethereal-2',
    productId: 'ethereal-bloom',
    title: 'Embroidery close-up',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    createdAt: 1_700_000_100_000,
  },
  {
    id: 'sample-orchid-1',
    productId: 'orchid-suit',
    title: 'Studio walkthrough',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    createdAt: 1_700_000_200_000,
  },
  {
    id: 'sample-gulab-1',
    productId: 'gulab-suit',
    title: 'Fabric in daylight',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    createdAt: 1_700_000_300_000,
  },
];
