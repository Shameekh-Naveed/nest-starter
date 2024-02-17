export enum UserRole {
  OWNER = 'superAdmin-owner',
  ADMIN = 'superAdmin-admin', // ! should Not be using this in assigning becuase only owner can make admins
  STUDENT = 'student',
  UNIMOD = 'university-mod',
  COMPANYMOD = 'company-mod',
}
