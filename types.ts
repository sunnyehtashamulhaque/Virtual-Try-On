
export enum AppStep {
  PRODUCT_UPLOAD,
  MODEL_UPLOAD,
  GENERATING,
  RESULT,
}

export interface ImageState {
  base64: string;
  mimeType: string;
  previewUrl: string;
}
