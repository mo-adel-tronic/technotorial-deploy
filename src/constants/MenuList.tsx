import { RoutesName } from "@/constants/RoutesName";
import { Building, Flag, Library, PenBox, User, Users } from "lucide-react";
const APP_MENU = [
    {
      title: "الترحيب",
      icon: <PenBox className="text-app-secondary-on-primary" />,
      href: RoutesName.DASHBOARD,
    },
    {
      title: "القسم العلمي",
      icon: <Building className="text-app-secondary-on-primary" />,
      href: RoutesName.DEPARTMENT,
    },
    {
      title: "أعضاء هيئة التدريس",
      icon: <User className="text-app-secondary-on-primary" />,
      href: RoutesName.TEACHER,
    },
    {
      title: "البرامج الدراسية",
      icon: <Library className="text-app-secondary-on-primary" />,
      href: RoutesName.PROGRAMS,
    },
    {
      title: "الباحثين",
      icon: <Users className="text-app-secondary-on-primary" />,
      href: RoutesName.RESEARCHERS,
    },
    {
      title: "المستويات",
      icon: <Flag className="text-app-secondary-on-primary" />,
      href: RoutesName.SEMESTERS,
    },
  ]

  export default APP_MENU