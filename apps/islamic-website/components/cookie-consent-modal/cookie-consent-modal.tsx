'use client';
import { useEffect } from 'react';
import 'vanilla-cookieconsent';

const analyticsCookieTable = [
  {
    col1: '^_ga',
    col2: 'google.com',
    col3: '2 years',
    is_regex: true,
  },
  {
    col1: '_gid',
    col2: 'google.com',
    col3: '1 day',
    is_regex: false,
  },
  {
    col1: '_fbp',
    col2: 'facebook.com',
    col3: '1 day',
    is_regex: false,
  },
  {
    col1: '^ph_.*',
    col2: 'posthog.com',
    col3: '6 months',
    is_regex: true,
  },
];

const pluginConfig: UserConfig = {
  autorun: true,
  autoclear_cookies: true,
  page_scripts: true,
  auto_language: 'document',
  revision: 0,
  gui_options: {
    consent_modal: {
      layout: 'cloud',
      position: 'bottom center',
      transition: 'slide',
      swap_buttons: false,
    },
    settings_modal: {
      layout: 'box',
      transition: 'slide',
    },
  },

  languages: {
    en: {
      consent_modal: {
        title: 'We use cookies!',
        description:
          'Hi, this website uses essential cookies to ensure its proper operation and tracking cookies to understand how you interact with it. The latter will be set only after consent. <button type="button" data-cc="c-settings" class="cc-link">Let me choose</button>.',
        primary_btn: {
          text: 'Accept all',
          role: 'accept_all',
        },
        secondary_btn: {
          text: 'Reject all',
          role: 'accept_necessary',
        },
      },
      settings_modal: {
        title: 'Cookie Settings',
        save_settings_btn: 'Save settings',
        accept_all_btn: 'Accept all',
        reject_all_btn: 'Reject all',
        close_btn_label: 'Close',
        cookie_table_headers: [
          { col1: 'Name' },
          { col2: 'Domain' },
          { col3: 'Expiration' },
        ],
        blocks: [
          {
            title: 'Cookie usage',
            description:
              'We use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want.',
          },
          {
            title: 'Performance and Analytics cookies',
            description:
              'These cookies allow the website to remember the choices you have made in the past',
            toggle: {
              value: 'analytics',
              enabled: false,
              readonly: false,
            },
            cookie_table: analyticsCookieTable,
          },
        ],
      },
    },
    ar: {
      consent_modal: {
        title: 'نحن نستخدم ملفات تعريف الارتباط!',
        description:
          'مرحباً، يستخدم هذا الموقع ملفات تعريف ارتباط مهمة للحفاظ على سلاسة تشغيل الموقع كما ويستخدم ملفات تعريف ارتباط لتتبع تفاعلك معه، يتم تفعيلها بعد موافقتك عليها فقط. <button type="button" data-cc="c-settings" class="cc-link">دعني أختار</button>',
        primary_btn: {
          text: 'قبولها',
          role: 'accept_all',
        },
        secondary_btn: {
          text: 'رفضها',
          role: 'accept_necessary',
        },
      },
      settings_modal: {
        title: 'إعدادات ملفات تعريف الارتباط',
        save_settings_btn: 'حفظ الإعدادات',
        accept_all_btn: 'قبولها',
        reject_all_btn: 'رفضها',
        close_btn_label: 'إغلاق',
        cookie_table_headers: [
          { col1: 'اسم' },
          { col2: 'اسم النطاق' },
          { col3: 'انتهاء' },
        ],
        blocks: [
          {
            title: 'استخدام ملفات تعريف الارتباط',
            description:
              'استخدم ملفات تعريف الارتباط لحفاظ على الوظائف الأساسية للموقع وتحسين تجربتك عليه. يمكنك اختيار الاشتراك او عدم الاشتراك لكل فئة وقتما تشاء. لمزيد من التفاصيل المتعلقة بملفات تعريف الارتباط وغيرها من المعلومات الحساسة يرجى قراءة كامل سياسة الخصوصية.',
          },
          {
            title: 'ملفات تعريف الارتباط الخاصة بالأداء والتحليل',
            description:
              'تسمح ملفات تعريف الارتباط هذه للموقع أن يتذكر الخيارات التي قمت بها في السابق ',
            toggle: {
              value: 'التحليلات',
              enabled: false,
              readonly: false,
            },
            cookie_table: analyticsCookieTable,
          },
        ],
      },
    },
  },
};

export function CookieConsentModal() {
  useEffect(() => {
    const cookieConsentApi = window.initCookieConsent();
    cookieConsentApi.run(pluginConfig);
  }, []);

  return null;
}
