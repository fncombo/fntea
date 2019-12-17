/*
 * Format a number of seconds to a pretty string.
 * e.g. 120 => 2 min or 2:00, 45 => 45 sec or 0:45
 */
function formatSeconds(seconds, useShortFormat) {
    if (!seconds) {
        return useShortFormat ? '0:00' : '0 sec'
    }

    const min = Math.floor(seconds / 60)
    const sec = seconds % 60

    if (useShortFormat) {
        return (min ? `${min}:` : '0:') + (sec ? sec.toString().padStart(2, '0') : '00')
    }

    return (min ? `${min} min` : '') + (sec ? `${min ? ' ' : ''}${sec} sec` : '')
}

export {
    // eslint-disable-next-line import/prefer-default-export
    formatSeconds,
}
