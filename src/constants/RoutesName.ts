export enum RoutesName {
    HOME = '/',
    LOGIN = '/login',
    FORBIDDEN = '/forbidden',
    DASHBOARD = '/dashboard',
    DEPARTMENT = RoutesName.DASHBOARD + '/department',
    DEPARTMENT_CREATE = RoutesName.DEPARTMENT + '/create',
    TEACHER = RoutesName.DASHBOARD + '/teacher',
    TEACHER_CREATE = RoutesName.TEACHER + '/create',
    PROGRAMS = RoutesName.DASHBOARD + '/programs',
    PROGRAMS_CREATE = RoutesName.PROGRAMS + '/create',
    REQUIREMENTS = '/requirements',
    SUBJECTS = '/subjects',
    RESEARCHERS = RoutesName.DASHBOARD + '/researchers',
    RESEARCHERS_CREATE = RoutesName.RESEARCHERS + '/create', 
    SEMESTERS = RoutesName.DASHBOARD + '/semesters',
    SEMESTERS_CREATE = RoutesName.SEMESTERS + '/create', 
    CLASS_TABLE = '/classtable',
    CLASS_TABLE_CREATE = RoutesName.CLASS_TABLE + '/create',

    API_REVALIDATE = '/api/revalidate'
  }