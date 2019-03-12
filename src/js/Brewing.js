// Libraries
import NoSleep from './NoSleep.js'
import Ordinal from 'ordinal'

// React
import React, { PureComponent } from 'react'

// Brewing instructions tab with a configurable timer
export default class Brewing extends PureComponent {
    constructor() {
        super()

        this.state = {
            timer: false,
            infusion: 1,
            timeoutId: false,
            noSleep: undefined,
        }

        this.decreaseInfusion = this.decreaseInfusion.bind(this)
        this.increaseInfusion = this.increaseInfusion.bind(this)
        this.toggleTimer = this.toggleTimer.bind(this)
        this.runTimer = this.runTimer.bind(this)
    }

    // Format a number of seconds to a pretty string
    // e.g. 120 => 2 min or 2:00, 45 => 45 sec or 0:45
    formatTime(seconds, shortFormat) {
        const min = Math.floor(seconds / 60)
        const sec = seconds % 60

        if (shortFormat) {
            return (min ? `${min}:` : '0:') + (sec ? (sec + '').padStart(2, '0') : '00')
        }

        return (min ? `${min} min` : '') + (sec ? (min ? ' ' : '') + `${sec} sec` : '')
    }

    // When the brewing tab changes
    componentDidUpdate(prevProps) {
        const { data, brewingType } = this.props
        const { timer, infusion } = this.state

        if (brewingType !== prevProps.brewingType) {

            // If the timer is running, stop it
            if (timer) {
                this.toggleTimer()
            }

            // Cap the maximum infusion number to max possible
            if (infusion > data.infusions) {
                this.setState({
                    infusion: data.infusions,
                })
            }
        }
    }

    // Decrease infustion to a minimum of 1
    decreaseInfusion() {
        const { infusion } = this.state

        if (infusion === 1) {
            return
        }

        this.setState({
            infusion: infusion - 1,
        })
    }

    // Increase infusion to a maximum for this tea
    increaseInfusion() {
        const { infusion } = this.state
        const { data } = this.props

        if (infusion === data.infusions) {
            return
        }

        this.setState({
            infusion: infusion + 1,
        })
    }

    // Turn the timer on or off based on whether it's running
    toggleTimer() {
        const { timer, infusion, timeoutId } = this.state
        const { data, timerToggleCallback } = this.props

        // Stop the timer if it is runing
        if (timer) {
            window.clearTimeout(timeoutId)

            this.state.noSleep.disable()

            this.setState({
                timer: false,
                noSleep: undefined,
            })

            // Tell the parent that the timer is off
            timerToggleCallback(false)

            return
        }

        // Start no sleep to prevent phone screen from turning off while timer is running
        const noSleep = new NoSleep()
        noSleep.enable()

        // Start the initial timer
        this.setState({
            timer: data.baseDuration + (data.durationIncrease * (infusion - 1)),
            noSleep: noSleep,
        }, this.runTimer)

        // Tell the parent that the timer is on
        timerToggleCallback(true)
    }

    // Timer loop to decremenet each second
    runTimer() {
        const { infusion, timer } = this.state
        const { name, timerToggleCallback } = this.props

        // Decrement the current timer value
        this.setState({
            timer: timer - 1 === 0 ? false : timer - 1,
        }, () => {
            // Check if the timer is done
            if (!this.state.timer) {
                this.state.noSleep.disable()

                this.setState({
                    timer: false,
                    noSleep: undefined,
                })

                // Tiny delay to let the page unpate the text to 0:00
                window.setTimeout(() => {
                    alert(`Timer for ${Ordinal(infusion)} infusion of ${name} done.`)
                }, 100)

                timerToggleCallback(false)

                return
            }

            // Schdeule update timeout loop
            const timeoutId = window.setTimeout(this.runTimer, 1000)

            // Save the timeout ID for manual cancel by button
            this.setState({
                timeoutId: timeoutId,
            })
        })
    }

    render() {
        const { data } = this.props
        const { timer, infusion } = this.state

        return (
            <div className="card-tabs-content">
                <ul className="brewing-data">
                    <li>
                        <strong>Amount</strong>
                        <span>{data.amount}g &#8725; 100ml</span>
                        <div className="bar bar-5">
                            <div style={{ width: `${(data.amount * 10) * 2}%` }} />
                        </div>
                    </li>
                    <li>
                        <strong>Temperature</strong>
                        <span>{data.temperature}&deg; C</span>
                        <div />
                        <div className="bar bar-5">
                            <div style={{ width: `${(data.temperature - 50) * 2}%` }}></div>
                        </div>
                    </li>
                    <li>
                        <strong>Infusions</strong>
                        <span>{data.infusions}</span>
                        <div className="bar bar-10">
                            <div style={{ width: `${data.infusions * 10}%` }}></div>
                        </div>
                    </li>
                    <li>
                        <strong>Infusion Time</strong>
                        <span>{this.formatTime(data.baseDuration)} base, +{this.formatTime(data.durationIncrease)} per extra</span>
                        <div className="bar bar-3">
                            <div style={{ width: `${(data.baseDuration / 180) * 100}%` }}></div>
                        </div>
                    </li>
                </ul>
                <div className="timer">
                    <div className="timer-section timer-body">
                        <div className="timer-control">
                            <button
                                className="timer-duration decrease"
                                onClick={this.decreaseInfusion}
                                disabled={infusion === 1 || !!timer}
                                aria-label="Decrease Infusion Number"
                            />
                        </div>
                        <div className="timer-content">
                            <span className="timer-infusion">{Ordinal(infusion)} Infusion</span>
                            <strong className="timer-clock">
                                {timer ?
                                    this.formatTime(timer, true) :
                                    this.formatTime(data.baseDuration + (data.durationIncrease * (infusion - 1)), true)
                                }
                            </strong>
                        </div>
                        <div className="timer-control">
                            <button
                                className="timer-duration increase"
                                onClick={this.increaseInfusion}
                                disabled={infusion === data.infusions || !!timer}
                                aria-label="Increase Infusion Number"
                            />
                        </div>
                    </div>
                    <div className="timer-section">
                        <button className="timer-start" onClick={this.toggleTimer} aria-label="Start Timer">
                            {timer ? 'Stop' : 'Start'} Brewing Timer
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}
