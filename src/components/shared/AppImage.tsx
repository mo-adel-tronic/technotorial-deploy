'use client';
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import clsx from 'clsx';
import { ImageSrc } from '@/constants/MediaSrc';

type CustomImageProps = ImageProps & {
  fallbackSrc?: string;
  className?: string;
};

export function AppImage({
  src,
  alt,
  fallbackSrc = ImageSrc.FALLBACK, // fallback image in case of error
  className,
  ...props
}: CustomImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc)}
      className={clsx('rounded-md object-cover', className)}
      {...props}
      placeholder="blur"
      blurDataURL={ImageSrc.BLUR_PLACEHOLDER}
      loading="lazy"
    />
  );
}
