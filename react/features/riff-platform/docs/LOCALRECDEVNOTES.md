## Riff local recording:

The local recording uses [getDisplayMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia) for screen capturing. For getting remote participant`s audio uses [JitsiTrack](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-ljm-api#jitsitrack) streams. 

**LocalRecordingController** is responsible for the local recording.  
**WebmAdapter** is responsible for the recording process using [MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder ) in webm format.  
**AudioStreamsMixer** is helper for managing all sounds. 

### Recording:
In ```WebmAdapter.js```  ```_getAudioStream()``` is called for getting local user`s audio stream. When the media stream is grabbed successfully ```getCombinedStream(participantsStreams)``` helper is called in ``WebmAdapter.js``   (participantsStreams are streams from Jitsi).

Once **getDisplayMedia** has grabbed a media stream successfully:
- mix participant's audio streams and connecting them to the sound destination provided by the [AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) instance (**AudioStreamsMixer** helper);

 - mix video screen track and audio tracks from **AudioStreamsMixer** instance and create a new [MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream );

 - create a new MediaRecorder instance with the MediaRecorder() constructor and pass the stream directly (in ```WebmAdapter.js```  ```_initializeCurrentMediaRecoder(stream)``` is called). This is entry point into using the MediaRecorder API — the stream is now ready to be captured straight into a Blob. 

With [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder ) we can access encoded blob chunks, which means that once the recording is finished we can construct a real file out of them, and then upload or download it.

For **YouTube audio recording** [getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia ) is used for microphone capturing and add this stream to **AudioStreamsMixer** instance.

In the memory exceeded case (approximately is 1GB) the current MediaRecorder instance is stopped,
the recording file is downloaded and the new MediaRecorder instance with the same media stream is initialized.
