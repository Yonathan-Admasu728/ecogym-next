// app/cloudinary-react.d.ts

declare module 'cloudinary-react' {
    import { Component, ReactNode } from 'react';
  
    export interface CloudinaryContextProps {
      cloudName: string;
      children: ReactNode;
    }
  
    export class CloudinaryContext extends Component<CloudinaryContextProps> {}
  
    export interface VideoProps {
      publicId: string;
      width?: string | number;
      height?: string | number;
      controls?: boolean;
      [key: string]: string | number | boolean | undefined;
    }
  
    export class Video extends Component<VideoProps> {}
  
    export interface ImageProps {
      publicId: string;
      width?: string | number;
      height?: string | number;
      crop?: string;
      quality?: string | number;
      format?: string;
      secure?: boolean;
      [key: string]: string | number | boolean | undefined;
    }

    export interface TransformationProps {
      width?: string | number;
      height?: string | number;
      crop?: string;
      quality?: string | number;
      format?: string;
      effect?: string;
      angle?: string | number;
      opacity?: string | number;
      border?: string;
      background?: string;
      radius?: string | number;
      [key: string]: string | number | undefined;
    }

    export class Image extends Component<ImageProps> {}
    export class Transformation extends Component<TransformationProps> {}
  }
