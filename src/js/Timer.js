import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import NoSleep from 'nosleep.js'
import ordinal from 'ordinal'

import FormattedSeconds from 'src/js/FormattedSeconds'
import { TeaPropTypes, useActiveTimerTea } from 'src/js/utils'

import 'src/scss/Timer.scss'

const NO_SLEEP = new NoSleep()

/**
 * Timer section for a card.
 */
export default function Timer({ tea, currentBrewing }) {
    const {
        maxInfusions,
        duration: { base, increase },
    } = tea.brewing[currentBrewing]

    const [activeTimerTea, setActiveTimerTea] = useActiveTimerTea()
    const [currentInfusion, setCurrentInfusion] = useState(1)
    const [timerValue, setTimerValue] = useState(base)

    // Whether this particular timer is the active one
    const isActiveTimer = activeTimerTea?.name === tea.name

    // Status of the increment/decrement infusion buttons
    const canDecrement = currentInfusion === 1 || isActiveTimer
    const canIncrement = currentInfusion === maxInfusions || isActiveTimer

    // Update timer value when either duration or infusion data changes
    useEffect(() => {
        // Limit the current infusion number to the maximum
        if (currentInfusion > maxInfusions) {
            setCurrentInfusion(maxInfusions)

            return
        }

        setTimerValue(base + increase * (currentInfusion - 1))
    }, [currentInfusion, maxInfusions, base, increase])

    // Reset the timer value when it turns off
    useEffect(() => {
        if (!isActiveTimer) {
            setTimerValue(base + increase * (currentInfusion - 1))
        }
    }, [isActiveTimer, base, increase, currentInfusion])

    // Start this timer when it becomes active and clear it when it becomes inactive
    useEffect(() => {
        if (!isActiveTimer) {
            return undefined
        }

        const id = setInterval(() => setTimerValue((currentTimerValue) => currentTimerValue - 1), 1000)

        return () => {
            clearInterval(id)
        }
    }, [isActiveTimer])

    const toggleTimer = () => {
        setActiveTimerTea(isActiveTimer ? null : { ...tea, timerValue })

        if (isActiveTimer) {
            NO_SLEEP.disable()
        } else {
            NO_SLEEP.enable()
        }
    }

    // Configure button text depending on timer state and value
    let buttonText = 'Start Brewing Timer'

    if (isActiveTimer) {
        buttonText = timerValue > 0 ? 'Stop Brewing Timer' : 'Okay'
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
                    <span className="timer-infusion">{ordinal(currentInfusion)} infusion</span>
                    <strong className="timer-clock">
                        {timerValue > 0 ? <FormattedSeconds seconds={timerValue} /> : 'Done'}
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
                <button type="button" className="timer-start" onClick={toggleTimer}>
                    {buttonText}
                </button>
            </div>
        </div>
    )
}

Timer.propTypes = {
    tea: TeaPropTypes.tea.isRequired,
    currentBrewing: PropTypes.number.isRequired,
}
