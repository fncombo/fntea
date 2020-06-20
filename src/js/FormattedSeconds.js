import React from 'react'
import PropTypes from 'prop-types'

/*
 * Format a number of seconds to a pretty string.
 * e.g.
 * `120` => `2 min` or `2:00`
 * `45` => `45 sec` or `0:45`
 */
export default function FormattedSeconds({ seconds, isShortFormat = false }) {
    if (!seconds) {
        return isShortFormat ? <>0:00</> : <>0 sec</>
    }

    const min = Math.floor(seconds / 60)
    const sec = seconds % 60

    if (isShortFormat) {
        return (
            <>
                {min ? `${min}:` : '0:'}
                {sec ? sec.toString().padStart(2, '0') : '00'}
            </>
        )
    }

    return (
        <>
            {!!min && `${min} min`}
            {!!min && !!sec && ' '}
            {!!sec && `${sec} sec`}
        </>
    )
}

FormattedSeconds.propTypes = {
    seconds: PropTypes.number.isRequired,
    isShortFormat: PropTypes.bool,
}
