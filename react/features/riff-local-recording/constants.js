/**
 * XMPP command for signaling the start of local recording to all clients.
 * Should be sent by the moderator only.
 */
const COMMAND_START = 'localRecStart';

/**
 * XMPP command for signaling the stop of local recording to all clients.
 * Should be sent by the moderator only.
 */
const COMMAND_STOP = 'localRecStop';

/**
 * One-time command used to trigger the moderator to resend the commands.
 * This is a workaround for newly-joined clients to receive remote presence.
 */
const COMMAND_PING = 'localRecPing';

/**
 * One-time command sent upon receiving a {@code COMMAND_PING}.
 * Only the moderator sends this command.
 * This command does not carry any information itself, but rather forces the
 * XMPP server to resend the remote presence.
 */
const COMMAND_PONG = 'localRecPong';

/**
 * Participant property key for local recording stats.
 */
const PROPERTY_STATS = 'localRecStats';

/**
 * Supported recording formats.
 */
const RECORDING_FORMATS = new Set([ 'webm' ]);

/**
 * Default recording format.
 */
const DEFAULT_RECORDING_FORMAT = 'webm';

/**
 * The argument slices the recording into chunks, calling dataavailable every defined seconds.
 */
const MEDIARECORDER_TIMESLICE = 180000;

/**
 * Defined max size for blob(MB).
 */
const MEDIARECORDER_MAX_SIZE = 950;


export {
    COMMAND_START,
    COMMAND_STOP,
    COMMAND_PING,
    COMMAND_PONG,
    PROPERTY_STATS,
    RECORDING_FORMATS,
    DEFAULT_RECORDING_FORMAT,
    MEDIARECORDER_TIMESLICE,
    MEDIARECORDER_MAX_SIZE
};

