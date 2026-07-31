/**
 * Type declarations for mammoth.js
 * Since @types/mammoth doesn't exist on npm registry
 */

declare module 'mammoth' {
  export interface ConvertToHtmlOptions {
    styleMap?: string[];
    convertImage?: (image: ImageElement) => Promise<{ src: string }>;
    ignoreEmptyParagraphs?: boolean;
  }

  export interface ImageElement {
    read(): Promise<ArrayBuffer>;
    contentType: string;
    altText?: string;
  }

  export interface ConvertToHtmlResult {
    value: string;
    messages: Array<{
      type: string;
      message: string;
    }>;
  }

  export interface DocumentInput {
    arrayBuffer: ArrayBuffer;
  }

  export function convertToHtml(
    input: DocumentInput,
    options?: ConvertToHtmlOptions
  ): Promise<ConvertToHtmlResult>;

  export const images: {
    imgElement(func: (image: ImageElement) => Promise<{ src: string }>): (image: ImageElement) => Promise<{ src: string }>;
  };
}
