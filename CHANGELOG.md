# Change Log for @rifflearning/jitsi-meet

## [1.3.0](https://github.com/rifflearning/jitsi-meet/tree/v1.3.0) (2021-11-10)
[Full Changelog](https://github.com/rifflearningjitsi-meet/compare/v1.2.0...v1.3.0)

### Notable changes:

- local recordings should now be able to be navigated
- The latest stable base jitsi code (ver 6433) is included
- A riff configuration setting was created to immediately start presenter mode
  when a user starts screen sharing. Having this enabled is the suspected
  culprit for many observed screen sharing issues, so it is recommended to leave
  this disabled.

There were changes in the base jitsi code to the configuration file, so
deploying this version will require an updated configuration file.

In addition there are other Riff recommended default configuration setting changes.


### Merged pull requests

- [\#120](https://github.com/rifflearning/jitsi-meet/pull/120) Initial support for navigating local recording videos
- [\#125](https://github.com/rifflearning/jitsi-meet/pull/125) Fix LTI roomId generation
- [\#127](https://github.com/rifflearning/jitsi-meet/pull/127) Merge latest stable jitsi-meet ver 6433 with Riff changes (RIFF-711)
- [\#128](https://github.com/rifflearning/jitsi-meet/pull/128) Update google calendar auth scope
- [\#129](https://github.com/rifflearning/jitsi-meet/pull/129) Update riff-metrics pkg (RIFF-711)
- [\#130](https://github.com/rifflearning/jitsi-meet/pull/130) Add a feature flag for starting presenter mode by default


## [1.2.0](https://github.com/rifflearning/jitsi-meet/tree/v1.2.0) (2021-10-18)
[Full Changelog](https://github.com/rifflearningjitsi-meet/compare/v1.1.0...v1.2.0)

### Notable changes:

The major feature added for this release was for LTI authentication and access to group meetings,
and the user's dashboard as well as displaying a shared URL for the Esme simulations in the
said-oxford and mitsapsloan edX courses.


### Merged pull requests

- [\#122](https://github.com/rifflearning/jitsi-meet/pull/122) Update the emotional sensing dev notes
  for clarity and fix links (RIFF-705)
- [\#123](https://github.com/rifflearning/jitsi-meet/pull/123) Add ability to share an Esme simulation
  (RIFF-557), fix existing etherpad issues, 1-on-1 meetings
- [\#124](https://github.com/rifflearning/jitsi-meet/pull/124) Launch via lti with cookies instead of
  URL params (RIFF-639, RIFF-641)


## [1.1.0](https://github.com/rifflearning/jitsi-meet/tree/v1.1.0) (2021-10-12)
[Full Changelog](https://github.com/rifflearningjitsi-meet/compare/v1.0.0...v1.1.0)

### Notable changes:

- The base jitsi-meet code was updated from `stable/jitsi-meet_5963` to `stable/jitsi-meet_6293`
- User's now have the ability to create and use a "personal" room for meetings
- The dashboard was updated to use the dashboard provided by riff-metrics ver `2.1.0` from `1.2.0-dev.1`
  The major UI change was changing the stacked bar graphs to clustered bar graphs. Other than that the
  changes here were mostly for the experimental metrics, and some integration improvements
- A new interesting moments feature is available, but the toolbar button is not being added in default deployments
- A first pass of calendar integration is now available for both Google and Microsoft calendars
- Features are now dynamically configurable, rather than requiring custom code to be built


### Merged pull requests

- [\#98](https://github.com/rifflearning/jitsi-meet/pull/98) Feature/login lti
- [\#103](https://github.com/rifflearning/jitsi-meet/pull/103) add version to import links so that changes are reloaded
- [\#101](https://github.com/rifflearning/jitsi-meet/pull/101) Feature/user personal meeting room
- [\#104](https://github.com/rifflearning/jitsi-meet/pull/104) update riff metrics to version 2.0.0
- [\#105](https://github.com/rifflearning/jitsi-meet/pull/105) change deploy-aws make target to deploy to a production instance configuration
- [\#106](https://github.com/rifflearning/jitsi-meet/pull/106) Metrics Package Experimental Dashboard in Jitsi
- [\#107](https://github.com/rifflearning/jitsi-meet/pull/107) Update riff-metrics package to version 2.1.0
- [\#112](https://github.com/rifflearning/jitsi-meet/pull/112) Update jitsi-meet - 2.0.6293 (RIFF-600, 602)
- [\#113](https://github.com/rifflearning/jitsi-meet/pull/113) Dev/nickolas kyrylyuk/riff 601
- [\#111](https://github.com/rifflearning/jitsi-meet/pull/111) Fixed Footer Links (RIFF-279)
- [\#109](https://github.com/rifflearning/jitsi-meet/pull/109) Interesting moments (updated)
- [\#110](https://github.com/rifflearning/jitsi-meet/pull/110) Feature/calendars integration
- [\#115](https://github.com/rifflearning/jitsi-meet/pull/115) Dev/uliana ostrova/fix theme
- [\#114](https://github.com/rifflearning/jitsi-meet/pull/114) BugFix: End Time Is Now Correct (RIFF-549)
- [\#117](https://github.com/rifflearning/jitsi-meet/pull/117) BugFix: display participant name in low bandwidth sharing mode
- [\#118](https://github.com/rifflearning/jitsi-meet/pull/118) Bug fix in sibilantActions
- [\#116](https://github.com/rifflearning/jitsi-meet/pull/116) Add riff_config.js for custom configuration
  instead of using .env file (RIFF-612)
- [\#119](https://github.com/rifflearning/jitsi-meet/pull/119) Pull in screenshare fix
- [\#121](https://github.com/rifflearning/jitsi-meet/pull/121) Fallback to jitsi premeeting screen design

#### Notes on particularly opaque PR summaries:

- \#113 was "Make pre join screen to look like a previous version"
- \#118 fixes an error introduced in #114 which did not remove an event listener


## [1.0.0](https://github.com/rifflearning/jitsi-meet/tree/v1.0.0) (2021-08-09)
[Full Changelog](https://github.com/rifflearningjitsi-meet/compare/v0.0.0...v1.0.0)

I'm not summarizing the changes, see the merged pull requests, except to note
that the changes in the base jitsi code base through [stable/jitsi-meet_5963](https://github.com/jitsi/jitsi-meet/tree/stable/jitsi-meet_5963)
have been merged into this Riff Analytics version.

This initial version has changes from the start of the Riff jitsi project.
PR #2 was merged on 2020-08-17 and PR #100 was merged on 2021-08-07

### Merged pull requests

- [\#2](https://github.com/rifflearning/jitsi-meet/pull/2) Feature/riff theming
- [\#3](https://github.com/rifflearning/jitsi-meet/pull/3) Feature/capturer
- [\#5](https://github.com/rifflearning/jitsi-meet/pull/5) Feature/metrics page
- [\#6](https://github.com/rifflearning/jitsi-meet/pull/6) Feature/emotions graph
- [\#7](https://github.com/rifflearning/jitsi-meet/pull/7) Feature/metrics page
- [\#8](https://github.com/rifflearning/jitsi-meet/pull/8) style fix, icon connection status
- [\#9](https://github.com/rifflearning/jitsi-meet/pull/9) add deployment script
- [\#10](https://github.com/rifflearning/jitsi-meet/pull/10) Feature/metrics page
- [\#11](https://github.com/rifflearning/jitsi-meet/pull/11) add jitsi theme style overrides for dashboard page
- [\#12](https://github.com/rifflearning/jitsi-meet/pull/12) Feature/riff login page
- [\#13](https://github.com/rifflearning/jitsi-meet/pull/13) Feature/riff meeting mediator
- [\#14](https://github.com/rifflearning/jitsi-meet/pull/14) add draggable MeetinMediator
- [\#15](https://github.com/rifflearning/jitsi-meet/pull/15) Feature/riff login page without firebase
- [\#16](https://github.com/rifflearning/jitsi-meet/pull/16) Feature/only tile view
- [\#17](https://github.com/rifflearning/jitsi-meet/pull/17) deps: lib-jitsi-meet@latest
- [\#18](https://github.com/rifflearning/jitsi-meet/pull/18) Feature/refactor riff services
- [\#19](https://github.com/rifflearning/jitsi-meet/pull/19) Add documentation jitsi-meet deployment in aws
- [\#20](https://github.com/rifflearning/jitsi-meet/pull/20) add browser network stats
- [\#21](https://github.com/rifflearning/jitsi-meet/pull/21) fix
- [\#22](https://github.com/rifflearning/jitsi-meet/pull/22) make meeting medator draggable outside of the viewport
- [\#25](https://github.com/rifflearning/jitsi-meet/pull/25) Feature/showing meeting name
- [\#26](https://github.com/rifflearning/jitsi-meet/pull/26) make meeting mediator collapse
- [\#27](https://github.com/rifflearning/jitsi-meet/pull/27) Feature/recurring meeting form
- [\#28](https://github.com/rifflearning/jitsi-meet/pull/28) Feature/forgot password form
- [\#29](https://github.com/rifflearning/jitsi-meet/pull/29) Feature/recurring meetings improvements
- [\#30](https://github.com/rifflearning/jitsi-meet/pull/30) Feature/groupped meetings
- [\#31](https://github.com/rifflearning/jitsi-meet/pull/31) Feature/recurring meetings improvements
- [\#32](https://github.com/rifflearning/jitsi-meet/pull/32) Feature/filter meetings list
- [\#33](https://github.com/rifflearning/jitsi-meet/pull/33) fix meeting list spacing
- [\#34](https://github.com/rifflearning/jitsi-meet/pull/34) Feature/fix filtering meetings
- [\#35](https://github.com/rifflearning/jitsi-meet/pull/35) fix disabling delete button for separate group
- [\#36](https://github.com/rifflearning/jitsi-meet/pull/36) change tabs text color to white
- [\#37](https://github.com/rifflearning/jitsi-meet/pull/37) Feature/edit meeting
- [\#38](https://github.com/rifflearning/jitsi-meet/pull/38) change multiple rooms meeting logic
- [\#39](https://github.com/rifflearning/jitsi-meet/pull/39) fetchMeetingByRoomId instead of \_id, same link for recurring
- [\#40](https://github.com/rifflearning/jitsi-meet/pull/40) Feature/edit meeting improvements
- [\#41](https://github.com/rifflearning/jitsi-meet/pull/41) maybeExtractIdFromDisplayName for chats and spekerStats
- [\#42](https://github.com/rifflearning/jitsi-meet/pull/42) Feature/edit meeting improvements
- [\#43](https://github.com/rifflearning/jitsi-meet/pull/43) Feature/turn off mediator
- [\#44](https://github.com/rifflearning/jitsi-meet/pull/44) Feature/hide deep linking mobile
- [\#45](https://github.com/rifflearning/jitsi-meet/pull/45) Feature/meeting details
- [\#46](https://github.com/rifflearning/jitsi-meet/pull/46) Feature/show meeting mediator in toolbar
- [\#47](https://github.com/rifflearning/jitsi-meet/pull/47) always turned on top toolbar
- [\#48](https://github.com/rifflearning/jitsi-meet/pull/48) set TileView After YoutubeSharing
- [\#49](https://github.com/rifflearning/jitsi-meet/pull/49) Fix meetings negotiations
- [\#50](https://github.com/rifflearning/jitsi-meet/pull/50) fix mediator visibility
- [\#51](https://github.com/rifflearning/jitsi-meet/pull/51) disabled OK button while deleting
- [\#52](https://github.com/rifflearning/jitsi-meet/pull/52) fix attach sibilant onchange audio input
- [\#53](https://github.com/rifflearning/jitsi-meet/pull/53) Feature/anonymous participant
- [\#54](https://github.com/rifflearning/jitsi-meet/pull/54) Feature/switch room during meeting
- [\#55](https://github.com/rifflearning/jitsi-meet/pull/55) Feature/refactor check meetings functionality
- [\#56](https://github.com/rifflearning/jitsi-meet/pull/56) Feature/linter fixes
- [\#57](https://github.com/rifflearning/jitsi-meet/pull/57) Integration mattermost
- [\#58](https://github.com/rifflearning/jitsi-meet/pull/58) Feature/fix schedule err 'no meeting with ID'
- [\#59](https://github.com/rifflearning/jitsi-meet/pull/59) Feature/bugs with anon user
- [\#60](https://github.com/rifflearning/jitsi-meet/pull/60) Feature/local recorder
- [\#61](https://github.com/rifflearning/jitsi-meet/pull/61) Feature/loc recorder improvements
- [\#62](https://github.com/rifflearning/jitsi-meet/pull/62) minor fix
- [\#63](https://github.com/rifflearning/jitsi-meet/pull/63) Feature/local recording fix
- [\#64](https://github.com/rifflearning/jitsi-meet/pull/64) Feature/local recording fix
- [\#65](https://github.com/rifflearning/jitsi-meet/pull/65) Feature/record youtube audio during local recording
- [\#66](https://github.com/rifflearning/jitsi-meet/pull/66) Feature/local recording dev notes
- [\#68](https://github.com/rifflearning/jitsi-meet/pull/68) if anon user, redirect to login after meeting
- [\#69](https://github.com/rifflearning/jitsi-meet/pull/69) Feature/change meeting mediator initial state
- [\#70](https://github.com/rifflearning/jitsi-meet/pull/70) Feature/email validation
- [\#71](https://github.com/rifflearning/jitsi-meet/pull/71) Feature/waiting room optimization
- [\#72](https://github.com/rifflearning/jitsi-meet/pull/72) fixes
- [\#74](https://github.com/rifflearning/jitsi-meet/pull/74) make anonymous login button smaller
- [\#75](https://github.com/rifflearning/jitsi-meet/pull/75) fix
- [\#76](https://github.com/rifflearning/jitsi-meet/pull/76) No code changes only extra files and Makefile target changes for creating packages for deployment
- [\#77](https://github.com/rifflearning/jitsi-meet/pull/77) Feature/update sibilant lib
- [\#78](https://github.com/rifflearning/jitsi-meet/pull/78) Feature/meeting ended page
- [\#79](https://github.com/rifflearning/jitsi-meet/pull/79) add dev notes
- [\#80](https://github.com/rifflearning/jitsi-meet/pull/80) ODIN-136: add dev notes
- [\#81](https://github.com/rifflearning/jitsi-meet/pull/81) Add a project npm config registry entry for @rifflearning scoped packages
- [\#82](https://github.com/rifflearning/jitsi-meet/pull/82) Feature/fix dst bug
- [\#83](https://github.com/rifflearning/jitsi-meet/pull/83) show participants names by default in video conference
- [\#84](https://github.com/rifflearning/jitsi-meet/pull/84) Feature/enable emotional sensing
- [\#85](https://github.com/rifflearning/jitsi-meet/pull/85) Fix emotions graph
- [\#86](https://github.com/rifflearning/jitsi-meet/pull/86) show presenter video if user used camera before screen sharing
- [\#87](https://github.com/rifflearning/jitsi-meet/pull/87) store the current roomId with the selected room number
- [\#88](https://github.com/rifflearning/jitsi-meet/pull/88) Feature/emotional chart
- [\#89](https://github.com/rifflearning/jitsi-meet/pull/89) Feature/dashboard updates
- [\#90](https://github.com/rifflearning/jitsi-meet/pull/90) Feature/use metrics package
- [\#91](https://github.com/rifflearning/jitsi-meet/pull/91) import MM from @rifflearning/riff-metrics
- [\#92](https://github.com/rifflearning/jitsi-meet/pull/92) Update jitsi-meet version 2.0.5963
- [\#93](https://github.com/rifflearning/jitsi-meet/pull/93) Feature/update dashboard
- [\#94](https://github.com/rifflearning/jitsi-meet/pull/94) Feature/refactor screen local recording
- [\#95](https://github.com/rifflearning/jitsi-meet/pull/95) fix bug when the audio-muted user joins the meeting
- [\#96](https://github.com/rifflearning/jitsi-meet/pull/96) allow anonymous users on by default; rename anonymous as guest
- [\#97](https://github.com/rifflearning/jitsi-meet/pull/97) Update riff metrics pkg to new version w/ updated styles
- [\#99](https://github.com/rifflearning/jitsi-meet/pull/99) Add a .env ENABLE_EXPERIMENTAL_METRICS build config setting
- [\#100](https://github.com/rifflearning/jitsi-meet/pull/100) Changes to support versioning for Riff releases


## [0.0.0](https://github.com/rifflearning/jitsi-meet/tree/v0.0.0) (2020-07-15)

This is version of the open source jitsi-meet project which the original Riff Analytics
custom development changes were based upon.
It is jitsi-meet tagged version [stable/jitsi-meet_4857](https://github.com/jitsi/jitsi-meet/tree/stable/jitsi-meet_4857)

