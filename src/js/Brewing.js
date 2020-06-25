import React, { useState } from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'

import FormattedSeconds from 'src/js/FormattedSeconds'
import Timer from 'src/js/Timer'
import { TeaPropTypes, useActiveTimerTea } from 'src/js/utils'

import 'src/scss/Brewing.scss'

/**
 * Fillable bar with section dividers.
 */
function Bars({ width, dividers = 5 }) {
    return (
        <div className={`bars is-${dividers}`}>
            <div style={{ width: `${width}%` }} />
        </div>
    )
}

Bars.propTypes = {
    width: PropTypes.number.isRequired,
    dividers: PropTypes.number,
}

/**
 * List item in the brewing details grid.
 */
function ListItem({ title, subtitle, children }) {
    return (
        <li>
            <strong>{title}</strong>
            <span>{subtitle}</span>
            {children}
        </li>
    )
}

ListItem.propTypes = {
    title: PropTypes.node.isRequired,
    subtitle: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
}

/**
 * Infusion full timing text.
 */
function Duration({ brewingDuration: { base, increase } }) {
    return (
        <>
            <FormattedSeconds seconds={base} isShort />, +<FormattedSeconds seconds={increase} isShort />
        </>
    )
}

Duration.propTypes = {
    brewingDuration: TeaPropTypes.brewingDuration,
}

/**
 * Details section about a brewing method.
 */
function Brewing({ brewingMethod: { amount, maxInfusions, duration } }) {
    return (
        <ul className="brewing">
            <ListItem title="Amount" subtitle={`${amount}g`}>
                <Bars width={amount * 10 * 2} />
            </ListItem>
            <ListItem title="Infusions" subtitle={maxInfusions}>
                <Bars width={maxInfusions * 10} dividers={10} />
            </ListItem>
            <ListItem title="Duration" subtitle={<Duration brewingDuration={duration} />}>
                <Bars width={(duration.base / 180) * 100} dividers={3} />
            </ListItem>
        </ul>
    )
}

Brewing.propTypes = {
    brewingMethod: TeaPropTypes.brewingMethod,
}

/**
 * Switchable tabs to toggle between the different brewing methods.
 */
export default function BrewingTabs({ tea }) {
    const [activeTimerTea] = useActiveTimerTea()
    const [currentBrewing, setCurrentBrewing] = useState(0)

    return (
        <>
            <ul className="card-tabs">
                {tea.brewing.map(({ name }, i) => (
                    <li
                        className={classNames({ 'is-active': currentBrewing === i })}
                        onClick={activeTimerTea ? undefined : () => setCurrentBrewing(i)}
                        key={name}
                    >
                        {name}
                    </li>
                ))}
            </ul>
            <div className="card-tabs-content">
                <Brewing brewingMethod={tea.brewing[currentBrewing]} />
                <Timer tea={tea} currentBrewing={currentBrewing} />
            </div>
        </>
    )
}

BrewingTabs.propTypes = {
    tea: TeaPropTypes.tea.isRequired,
}
