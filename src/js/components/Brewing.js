// React
import React from 'react'

// Helpers
import { formatSeconds } from 'js/helpers/functions'

// Style
import 'scss/Brewing.scss'

/**
 * Fillable bar with section dividers.
 */
const Bars = ({ width, dividers = 5 }) =>
    <div className={`bars is-${dividers}`}>
        <div style={{ width: `${width}%` }} />
    </div>

/**
 * Brewing details section for a card.
 */
export default function Brewing({ data }) {
    return (
        <ul className="brewing">
            <li>
                <strong>Amount</strong>
                <span>{data.amount}g</span>
                <Bars width={(data.amount * 10) * 2} />
            </li>
            <li>
                <strong>Temperature</strong>
                <span>{data.temperature}&deg; C</span>
                <Bars width={(data.temperature - 50) * 2} />
            </li>
            <li>
                <strong>Infusions</strong>
                <span>{data.maxInfusions}</span>
                <Bars width={data.maxInfusions * 10} dividers={10} />
            </li>
            <li>
                <strong>Infusion Time</strong>
                <span>
                    {formatSeconds(data.duration.base)} base, +{formatSeconds(data.duration.increase)} per extra
                </span>
                <Bars width={(data.duration.base / 180) * 100} dividers={3} />
            </li>
        </ul>
    )
}
