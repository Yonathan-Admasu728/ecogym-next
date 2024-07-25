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
      [key: string]: any;
    }
  
    export class Video extends Component<VideoProps> {}
  
    export class Image extends Component<any> {}
    export class Transformation extends Component<any> {}
  }