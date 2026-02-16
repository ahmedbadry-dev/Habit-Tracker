export type AppLanguage = 'en' | 'ar'

export const messages = {
  en: {
    nav: {
      dashboard: 'Dashboard',
      addHabit: 'Add Habit',
      statistics: 'Statistics',
      settings: 'Settings',
    },
    settings: {
      title: 'Settings',
      notifications: 'Notifications',
      pushNotifications: 'Push Notifications',
      pushNotificationsDesc: 'Receive habit reminders and encouragement',
      defaultReminderTime: 'Default Reminder Time',
      defaultReminderTimeDesc: 'Set default time for new habit reminders',
      appearance: 'Appearance',
      darkMode: 'Dark Mode',
      darkModeDesc: 'Use dark theme throughout the app',
      general: 'General',
      language: 'Language',
      languageDesc: 'Choose your preferred language',
      weekStartsOn: 'Week Starts On',
      weekStartsOnDesc: 'First day of the week in calendar',
      english: 'English',
      arabic: 'Arabic',
      monday: 'Monday',
      sunday: 'Sunday',
      saturday: 'Saturday',
    },
  },
  ar: {
    nav: {
      dashboard: 'Al-Raeesiya',
      addHabit: 'Add Habit (AR)',
      statistics: 'Statistics (AR)',
      settings: 'Settings (AR)',
    },
    settings: {
      title: 'Settings (AR)',
      notifications: 'Notifications (AR)',
      pushNotifications: 'Push Notifications (AR)',
      pushNotificationsDesc: 'Receive reminders and nudges (AR)',
      defaultReminderTime: 'Default Reminder Time (AR)',
      defaultReminderTimeDesc: 'Set default reminder time for new habits (AR)',
      appearance: 'Appearance (AR)',
      darkMode: 'Dark Mode (AR)',
      darkModeDesc: 'Use dark theme across the app (AR)',
      general: 'General (AR)',
      language: 'Language (AR)',
      languageDesc: 'Choose preferred language (AR)',
      weekStartsOn: 'Week Starts On (AR)',
      weekStartsOnDesc: 'First day of week in calendar (AR)',
      english: 'English',
      arabic: 'Arabic',
      monday: 'Monday',
      sunday: 'Sunday',
      saturday: 'Saturday',
    },
  },
} as const

export function isRtl(lang: AppLanguage) {
  return lang === 'ar'
}
