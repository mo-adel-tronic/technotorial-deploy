import { ImageSrc } from "@/constants/MediaSrc";
import { AppImage } from "./AppImage";

export default function AppLogo({width, height, white = false}: Readonly<{
  width?: number; height?: number; white?: boolean}>) {
  return (
    <AppImage
        src={white ? ImageSrc.LOGO2 : ImageSrc.LOGO} 
        alt="Logo"
        width={width || 64}
        height={height || 64}
        />
  )
}
