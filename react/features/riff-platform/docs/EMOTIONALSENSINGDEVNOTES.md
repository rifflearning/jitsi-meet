## Emotional Sensing
Jitsi recording components with replaced text are used for emotional sensing.
Recording translations were overwritten in [`i18next.js`](../../base/i18n/i18next.js)
file by using translation resources from  [`emotionalSensingTranslations.js`](../emotionalSensingTranslations.js)
and [addResourceBundle](https://www.i18next.com/overview/api#addresourcebundle) api:

```
i18next.addResourceBundle(
    DEFAULT_LANGUAGE,
    'main',
    EMOTIONALSENSING_RESOURCES,
    /* deep */ true,
    /* overwrite */ true);
```

### Removing the option to start emotional sensing
Taking over the jitsi recording components as specified above means that the jitsi toolbar button for
`recording` will say _Start Emotional sensing_ in the meeting. And to remove this option from the
meeting menu the `recording` entry from the config `toolbarButtons` array should be removed.
