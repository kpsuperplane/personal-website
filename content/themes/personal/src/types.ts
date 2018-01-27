declare module '*.png';
declare module '*.svg';
declare module '*.jpg';
declare module '*.mp4';
declare var ghost: any;
declare module 'postscribe';

declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};
