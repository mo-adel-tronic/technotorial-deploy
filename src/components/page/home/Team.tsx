import { AppImage } from "@/components/shared/AppImage";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ImageSrc } from "@/constants/MediaSrc";

const teamworkData = {
  title: "فريق العمل",
  teams: [
    {
      img: ImageSrc.TEAM_WORK_1,
      alt: "teamwork 1",
      title: "فريق التحليل",
      color: "red",
      assistant: "م.م/ حسام حمدي",
      describtion:
        "تعرف على فريق التحليل الذي قام بتحليل النظام وتحديد متطلباته. هذا الفريق هو العمود الفقري لأي مشروع ناجح، حيث يقوم بجمع المعلومات وفهم احتياجات المستخدمين لضمان أن النظام يلبي توقعاتهم.",
      teammates: [
        {
          doctor: "أ.د/محمد حمدي أحمد",
          students: [
            "مصطفى ياسر عبدالفتاح",
            "عبدالرحمن إبراهيم ابراهيم",
            "محمد صابر عبدالنبي",
            "أحمد إيهاب محمد",
            "الهيثم هشام علي",
          ],
        },
        {
          doctor: "د/ شاكر عبداللطيف",
          students: [
            "سلفانا عماد لبيب",
            "منار محمد أحمد",
            "هبه عطيت الله بركات",
            "سلمى محمد محمد",
            "فاطمة عبدالناصر محمد",
          ],
        },
        {
          doctor: "د/ أمل حسان السيد",
          students: [
            "مهرائيل مجدي",
            "خلود عمر ندا",
            "فريال كمال سعيد",
            "سماح مصطفى توفيق",
            "منار عبدالكريم أنور",
          ],
        },
      ],
    },

    {
      img: ImageSrc.TEAM_WORK_2,
      alt: "teamwork 2",
      title: "فريق التصميم الجرافيكي",
      assistant: "م/ حسام أشرف",
      color: "green",
      describtion:
        "تعرف على فريق التصميم الجرافيكي والذي قام بإنتاج جميع الواجهات واختيار الألوان والخطوط التي تتناسب مع طبيعة المشروع",
      teammates: [
        {
          doctor: "أ.م.د/وليد عبدالحميد",
          students: [
            "أحمد سامي مصطفى",
            "كريم محمد عبدالعظيم",
            "أحمد مجدي أحمد",
            "محمد مجدي عبدالخالق",
            "حسام أسامة جودة",
          ],
        },
        {
          doctor: "د/ جيهان عبدالباسط",
          students: [
            "فاطمة السيد محمود",
            "نادين طلال خليل",
            "رؤي محمد أحمد",
            "بسملة سيد عبده",
            "سها عزالدين عبدالله",
          ],
        },
        {
          doctor: "د/ نها جابر عبدالصمد",
          students: [
            "هبه حسن خليل",
            "سارة محمد عبدالحي",
            "رحاب عاطف شافعي",
            "منه الله طارق مصطفي",
            "ايمان عصام عبدالغفار",
          ],
        },
      ],
    },
    {
      img: ImageSrc.TEAM_WORK_3,
      alt: "teamwork 3",
      title: "فريق البرمجة",
      assistant: "م/ محمد عادل",
      color: "blue",
      describtion:
        "تعرف على الفريق الذي قام بتطوير الواجهات برمجياً وتحويل الرسوم الجرافيكية إلى واجهات حقيقية يمكن للمستخدم التعامل معها",
        teammates: [
          {
            doctor: "أ.م.د/زينب محمد العربي",
            students: [
              "آلاء إبراهيم يوسف",
              "علياء شعبان محمد",
              "شرين عادل قياتى",
              "تقي ياسر تاج الدين",
              "هاجر عماد جلال"
            ]
          },
          {
            doctor: "أ.م.د/ أميرة سمير سعد",
            students: [
              "آلاء أحمد إبراهيم",
              "أمل عزت على",
              "ندى أحمد عبدالسميع",
              "رنا عمرو محمود",
              "اسلام طارق عبدالراضي"
            ]
          },
          {
            doctor: "د/محمد عزت محمد",
            students: [
              "أحمد محمد حسن",
              "اسلام شريف محمد",
              "اسلام طارق محمد",
              "على محمد على",
              "مروان عماد محمد"
            ]
          },
        ],
    },

    {
      img: ImageSrc.TEAM_WORK_4,
      alt: "teamwork 4",
      title: "فريق إدخال البيانات",
      assistant: "م.م/ سميه رفعت",
      color: "orange",
      describtion:
        "تعرف على الفريق الذي قام بتجميع البيانات الخاصة بالنظام وإدخالها داخل النظام بعد تطويره",
        teammates: [
          {
            doctor: "أ.د/هويدا سعيد عبدالحميد",
            students: [
              "رحمة طارق محمود",
              "فايزة سيد محمد",
              "أسماء منصور طه",
              "أميرة على محمد",
              "إيفون حنا ثابت"
            ]
          },
          {
            doctor: "د/ شيماء سعيد محمد",
            students: [
              "فاطمة أحمد محمد",
              "شيماء مختار عبدالله",
              "مريم كمال فخري",
              "نورهان شكري حسني",
              "شهاب خالد نعيم"
            ]
          },
          {
            doctor: "د/شيماء محمد يحي",
            students: [
              "فاطمة حسن محمد",
              "ريهام أنور أحمد",
              "اية أحمد عبدالرحمن",
              "آلاء محمد عبدالمنعم",
              "زينب محمد السيد"
            ]
          },
        ],
    },
  ],
};

export default function TeamWork() {
  return (
    <section id="Team" className="lg-content-padding bg-app-card my-8 py-8">
      <h2 className="text-center text-white text-2xl mb-14">
        {teamworkData.title}
      </h2>
      <div className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-9 text-center">
        {teamworkData.teams.map((team, index) => (
          <div
            key={index}
            className={`border-2 pb-8 bg-white border-gray-400 hover:[&>.img-box:after]:border-y-[170px] hover:[&>.img-box:after]:border-r-[500px] hover:[&>.img-box:after]:border-l-0 ${
              team.color == "red" ? "hover:[&>.more-btn]:bg-red-400" : ""
            } ${
              team.color == "green" ? "hover:[&>.more-btn]:bg-green-400" : ""
            } ${
              team.color == "blue" ? "hover:[&>.more-btn]:bg-blue-400" : ""
            } ${
              team.color == "orange" ? "hover:[&>.more-btn]:bg-orange-400" : ""
            } hover:[&>.more-btn]:text-white`}
          >
            <div
              className={`img-box relative overflow-hidden before:absolute before:right-0 before:-top-[1px] before:w-full before:h-full after:absolute after:bottom-0 after:left-0 after:border-t-0 after:border-b-[170px] after:border-l-[500px] after:border-r-0 after:border-transparent after:border-b-white after:transition-all after:duration-300 ${
                team.color == "red" ? "before:bg-red-400/60" : ""
              } ${team.color == "green" ? "before:bg-green-400/60" : ""} ${
                team.color == "blue" ? "before:bg-blue-400/60" : ""
              } ${team.color == "orange" ? "before:bg-orange-400/60" : ""}`}
            >
              <AppImage
                src={team.img}
                alt={team.alt}
                width={300}
                height={300}
                className="w-full h-[300px]"
              />
            </div>
            <h3
              className={`text-app-foreground after:block after:w-20 font-bold after:border-b-4 after:mx-auto after:my-2 ${
                team.color == "red" ? "after:border-b-red-400" : ""
              } ${team.color == "green" ? "after:border-b-green-400" : ""} ${
                team.color == "blue" ? "after:border-b-blue-400" : ""
              } ${team.color == "orange" ? "after:border-b-orange-400" : ""}`}
            >
              {team.title}
            </h3>
            <p className="font-madani text-sm leading-8 px-2 text-app-text mb-16 font-bold h-[100px]">
              {team.describtion}
            </p>

            <Drawer>
              <DrawerTrigger
                className={`more-btn border-2 px-8 py-2 transition-all duration-300 ${
                  team.color == "red" ? "border-red-400 text-red-400" : ""
                } ${
                  team.color == "green" ? "border-green-400 text-green-400" : ""
                } ${
                  team.color == "blue" ? "border-blue-400 text-blue-400" : ""
                } ${
                  team.color == "orange"
                    ? "border-orange-400 text-orange-400"
                    : ""
                }`}
              >
                تعرف على أعضاء الفريق
              </DrawerTrigger>
              <DrawerContent className="bg-app-background">
                <DrawerHeader className="text-center">
                  <DrawerTitle className="text-app-primary text-xl">
                    {team.title}
                  </DrawerTitle>
                </DrawerHeader>
                <DrawerDescription>
                  <div className="grid grid-cols-3 gap-4 text-center px-8">
                    {
                      team.teammates.map((t, i) => <div key={`${team.alt}-${i}`} className="border rounded-lg p-4 bg-white flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-app-secondary mb-2">مجموعة ({i+1})</h3>
                          <ol className="text-right pr-4">
                            {
                              t.students.map((s, j) => <li key={`${team.alt}-${i}-${j}`} className="font-bold mb-3">
                                👑 {s}
                              </li>)
                            }
                          </ol>
                        </div>
                        <div className="mt-4 border-x-4 border-app-secondary py-3 text-white font-bold bg-app-primary">
                        <h3>عضو هيئة التدريس</h3>
                        <div className="font-bold">{t.doctor}</div>
                      </div>
                      </div>)
                    }
                    <div className="col-span-3 border-x-4 border-app-secondary py-3 text-center font-bold text-white bg-app-primary w-2/3 mx-auto">
                      العضو المعاون: {team.assistant}
                    </div>
                  </div>
                </DrawerDescription>
                <DrawerFooter className="flex justify-center">
                  <DrawerClose className="bg-red-500 text-white px-4 py-2 rounded-md md:w-1/6 mx-auto">
                    إغلاق
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        ))}
      </div>
    </section>
  );
}
