import { VideoSrc } from '@/constants/MediaSrc';
import { BadgeCheck } from 'lucide-react';
export default function Instructions() {
  return (
    <section id='INSTRUCTIONS' className="flex lg-content-padding items-center justify-between [@media(max-width:700px)]:flex-col [@media(max-width:700px)]:justify-center my-8 scroll-my-20">
        <div className="grow w-1/2 [@media(max-width:700px)]:w-full [@media(max-width:700px)]:grow-0">
            <h2 className="text-app-foreground text-2xl leading-10 mb-3">
            يرجي من المستخدمين اتباع التعليمات التالية: 
            </h2>
            <ul className='font-madani'>
                <li className='text-app-text flex gap-x-4 mb-4'>
                <BadgeCheck className='text-app-secondary w-[10%]' />
                <div className='w-[90%]'>
                تسجيل الدخول باستخدام البريد الإلكتروني الرسمي وكلمة المرور.
                </div>
                </li>

                <li className='text-app-text flex gap-x-4 mb-4'>
                <BadgeCheck className='text-app-secondary w-[10%]' />
                <div className='w-[90%]'>
                تحديث بياناتك الشخصية بشكل دوري.
                </div>
                </li>

                <li className='text-app-text flex gap-x-4 mb-4'>
                <BadgeCheck className='text-app-secondary w-[10%]' />
                <div className='w-[90%]'>
                التزم بسياسات الاستخدام لضمان أمان المعلومات وجودة الخدمة
                </div>
                </li>
            </ul>
        </div>
        <div className="grow w-1/2 [@media(max-width:700px)]:w-full [@media(max-width:700px)]:grow-0">
          <video src={VideoSrc.INSTRUCTIONS} controls></video>
        </div>
    </section>
  )
}
