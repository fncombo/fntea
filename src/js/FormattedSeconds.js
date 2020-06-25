import React from 'react'
import PropTypes from 'prop-types'

/*
 * Format a number of seconds to a pretty string.
 */
export default function FormattedSeconds({ seconds, isShort = false }) {
    if (!seconds) {
        return isShort ? <>0s</> : <>0 sec</>
    }

    const min = Math.floor(seconds / 60)
    const sec = seconds % 60

    const minText = isShort ? 'm' : ' min'
    const secText = isShort ? 's' : ' sec'

    return (
        <>
            {!!min && `${min}${minText}`}
            {!!min && !!sec && ' '}
            {!!sec && `${sec}${secText}`}
        </>
    )
}

FormattedSeconds.propTypes = {
    seconds: PropTypes.number.isRequired,
    isShort: PropTypes.bool,
}
