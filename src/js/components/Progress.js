// React
import React, { useContext } from 'react'

// Libraries
import color from 'color'

// Helpers
import { GlobalState } from 'js/helpers/App'

// Style
import 'scss/Progress.scss'

/**
 * Brewing progress full page overlay gradient using the current tea's colour.
 */
export default function Progress() {
    const { activeTimer } = useContext(GlobalState)

    if (!activeTimer) {
        return null
    }

    const teaColor = color(activeTimer.color)

    const colorStops = [
        teaColor.lighten(0.25).fade(0.5),
        teaColor.fade(0.5),
        teaColor.saturate(1.5).darken(0.5).fade(0.5),
    ]

    const style = {
        animationDuration: `${activeTimer.timerValue}s`,
        backgroundImage: `linear-gradient(to bottom, ${colorStops.join(', ')})`,
    }

    return <div className="progress" style={style} />
}
