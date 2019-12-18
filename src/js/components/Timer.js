// React
import React, { useContext, useState, useEffect } from 'react'

// Libraries
import ordinal from 'ordinal'
import NoSleep from 'nosleep.js'

// Helpers
import { GlobalState } from 'js/helpers/App'
import { formatSeconds } from 'js/helpers/functions'

// Style
import 'scss/Timer.scss'

// No sleep class to enable during the timer to prevent the user's screen from turning off
const NO_SLEEP = new NoSleep()

/**
 * Timer section for a card.
 */
export default function Timer({ tea, data }) {
    const { activeTimer, setActiveTimer } = useContext(GlobalState)
    const [ currentInfusion, setCurrentInfusion ] = useState(1)
    const [ timerValue, setTimerValue ] = useState(data.duration.base)

    // Whether this particular timer is the active one
    const isTimerActive = activeTimer?.name === tea.name

    // Status of the increment/decrement infusion buttons
    const canDecrement = currentInfusion === 1 || isTimerActive
    const canIncrement = currentInfusion === data.maxInfusions || isTimerActive

    // Update timer value when either duration or infusion data changes
    useEffect(() => {
        // Limit the current infusion number to the maximum
        if (currentInfusion > data.maxInfusions) {
            setCurrentInfusion(data.maxInfusions)

            return
        }

        setTimerValue(data.duration.base + (data.duration.increase * (currentInfusion - 1)))
    }, [ currentInfusion, data.maxInfusions, data.duration.base, data.duration.increase ])

    // Immediately reduce the timer value by 1 second on click to make it feel responsive and
    // reset the timer value when it turns off
    useEffect(() => {
        if (isTimerActive) {
            setTimerValue(currentTimerValue => currentTimerValue - 1)

            return
        }

        setTimerValue(data.duration.base + (data.duration.increase * (currentInfusion - 1)))
    }, [ isTimerActive, data.duration.base, data.duration.increase, currentInfusion ])

    // Start this timer when it becomes active and clear it when it becomes inactive
    useEffect(() => {
        if (!isTimerActive) {
            return undefined
        }

        NO_SLEEP.enable()

        const id = setInterval(() => setTimerValue(currentTimerValue => currentTimerValue - 1), 1000)

        return () => {
            NO_SLEEP.disable()

            clearInterval(id)
        }
    }, [ isTimerActive ])

    // Configure button text depending on timer state and value
    let buttonText = 'Start Brewing Timer'

    if (isTimerActive && timerValue >= 0) {
        buttonText = 'Stop Brewing Timer'
    } else if (isTimerActive && timerValue < 0) {
        buttonText = 'Okay'
    }

    return (
        <div className="timer">
            <div className="timer-section timer-body">
                <div className="timer-control">
                    <button
                        type="button"
                        onClick={() => setCurrentInfusion(currentInfusion - 1)}
                        disabled={canDecrement}
                    >
                        <svg viewBox="0 0 16 16">
                            <polygon points="12,0 4,8 12,16 12,0" />
                        </svg>
                    </button>
                </div>
                <div className="timer-content">
                    <span className="timer-infusion">
                        {ordinal(currentInfusion)} infusion
                    </span>
                    <strong className="timer-clock">
                        {timerValue < 0 ? 'Done' : formatSeconds(timerValue)}
                    </strong>
                </div>
                <div className="timer-control">
                    <button
                        type="button"
                        onClick={() => setCurrentInfusion(currentInfusion + 1)}
                        disabled={canIncrement}
                    >
                        <svg viewBox="0 0 16 16">
                            <polygon points="4,0 12,8 4,16 4,0" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="timer-section">
                <button
                    type="button"
                    className="timer-start"
                    onClick={() => setActiveTimer(isTimerActive ? null : { ...tea, timerValue })}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    )
}
