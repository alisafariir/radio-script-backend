export enum UserRole {
  SUPER_ADMIN = 'super-admin', // میتواند ادمین بسازد
  ADMIN = 'admin', // میتواند روی همه چیز کنترل داشته باشد اما ادمین نسازد
  EDITOR = 'editor', // میتواند محتوا را مدیریت کند اما حذف نکند
  USER = 'user', // کاربر عادی
}
