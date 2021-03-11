# Freeze Ping

## Introduction

Chrome states that their vision is to be able to suspend background tabs completely. This work is being done in order to achieve significant power usage improvements and better memory consumption as browser will be able to optimize and purge memory knowing that the main thread is suspended and DOM interactions are not possible until page is foregrounded again.

Since Chrome 57 budget-based timer throttling were added, placing an additional limit on background timer CPU usage. It works as follows:

* Each background tab has a time budget (in seconds) for running timers in the background.
* A page is subjected to time budget limitations after 10 seconds in the background.
* A timer task is allowed to run only when the time budget is non-negative.
* After a timer has executed, its run time is subtracted from the budget.
* The budget continuously regenerates with time (this rate is tweaking from release to release).

These are exemptions from this throttling:

* Applications playing audio are considered foreground and aren’t throttled (playing silent audio is not sufficient to opt-out the page -- Chrome checks whether the audio is truly audible).
* Applications with real-time connections (WebSockets and WebRTC - page has an RTCPeerConnection with an 'open' RTCDataChannel or a 'live' MediaStreamTrack), to avoid closing these connections by timeout. The run-timers-once-a-second rule is still applied in these cases.

Here is an article about [Background tabs & offscreen frames](https://docs.google.com/document/d/18_sX-KGRaHcV3xe5Xk_l6NNwXoxm-23IOepgMx4OlE4/pub) future plans. Long story short, from 2020 they want to remove possible opt-outs and pause all background pages once they’re ensured that the web platform provides the APIs needed for major use cases. Also, if there is a long tasks in the background, application can be throttled for a very long period of time - up to 100 times the duration of the task.

*Note*: Tab freezing behaviour was tested in Zoom, Google Meets and our dev environment, only in Google Meets we haven’t found any issues.

Here is more details on those policies: [Tab throttling and more performance improvements in Chrome M87](https://blog.chromium.org/2020/11/tab-throttling-and-more-performance.html), [Summary of Intensive Wake Up Throttling for Web Developers](https://docs.google.com/document/d/11FhKHRcABGS4SWPFGwoL6g0ALMqrFKapCk5ZTKKupEk/view#), [Background Tabs in Chrome 57](https://developers.google.com/web/updates/2017/03/background_tabs).

## Page Visibility API

We are using [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event) in order to understand that user has switched the tab and browser limitations for background processes could be applied, so performance will suffer. In this case we can send a notification to the user to return to the tab every 5 minutes or so when application is in the background.

Example:

```js
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // do something
    }

    if (document.visibilityState === 'hidden') {
        // do something else
    }
});
```
