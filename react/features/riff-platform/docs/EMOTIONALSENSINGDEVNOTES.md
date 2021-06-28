## Emotional Sensing
Jitsi recording components with replaced text are used for emotional sensing.  
Recording translations were overwritten in [```i18next.js```](react/features/base/i18n/i18next.js) file by using translation resources from  [```emotionalSensingTranslations.js```](react/features/riff-platform/emotionalSensingTranslations.js) and  [addResourceBundle](https://www.i18next.com/overview/api#addresourcebundle) api:
```
i18next.addResourceBundle(
    DEFAULT_LANGUAGE,
    'main',
    EMOTIONALSENSING_RESOURCES,
    /* deep */ true,
    /* overwrite */ true);
```