import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'
import color from 'color'
import reactStringReplace from 'react-string-replace'

import BrewingTabs from 'src/js/Brewing'
import { TeaPropTypes, useActiveTimerTea, useCardCentering, useSearchQuery } from 'src/js/utils'

import 'src/scss/Card.scss'

const STORE_NAME_REGEX = /(?:\/\/|w{3}\.)([a-z0-9-]+\.(?:[a-z.]+))\//
const RATINGS = {
    0: 'Poison',
    1: 'Bongwater',
    2: 'Hold your nose',
    3: 'You can call it tea',
    4: 'Meh',
    5: 'Worth reinfusing',
    6: 'Stashable',
    7: 'A proper session',
    8: 'Recommended',
    9: 'Super high grade',
    10: 'Pinnacle tea',
}

/**
 * Text with the search query highlighted.
 */
function SearchableText({ children }) {
    const searchQuery = useSearchQuery()

    // Callback to replace found search matches with a highlight tag.
    function searchReplacer(match, i) {
        return (
            <strong className="search-highlight" key={match + i}>
                {match}
            </strong>
        )
    }

    return searchQuery ? reactStringReplace(children, searchQuery, searchReplacer) : children
}

SearchableText.propTypes = {
    as: PropTypes.string,
    children: PropTypes.node.isRequired,
}

/**
 * Info item in the card details list. Empty values are replaced with a dash.
 */
function InfoItem({ icon, title, children }) {
    return (
        <li>
            <span role="img" aria-label={`${title} Icon`}>
                {icon}
            </span>
            <div>
                <strong>{title}:</strong> {children ? <SearchableText>{children}</SearchableText> : <>&mdash;</>}
            </div>
        </li>
    )
}

InfoItem.propTypes = {
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.string,
}

/**
 * Card for a tea.
 */
export default function Card({ tea, index, cardsRef }) {
    const {
        type,
        color: baseColor,
        isOrganic,
        name,
        isFancyName,
        altName,
        season,
        cultivar,
        origin,
        rating,
        link,
        temperature,
        key,
    } = tea

    const [activeTimerTea] = useActiveTimerTea()
    const [isExpanded, setIsExpanded] = useState(false)

    const isActiveTimerTea = activeTimerTea?.key === key
    const isTisane = type === 'Tisane'
    const storeName = useMemo(() => STORE_NAME_REGEX.exec(link)?.[1], [link])

    const { cardRef, cardShadowRef } = useCardCentering(isActiveTimerTea, cardsRef, index)

    // Scroll window to the top of the card when it's expanded on mobile
    useEffect(() => {
        if (window.innerWidth < 600 && isExpanded) {
            // @ts-ignore
            const topOffset = window.navigator.standalone ? 10 : 70

            window.scrollTo({
                // Current scroll amount
                // Plus element offset from top of the document
                // Minus spacing for the sticky header
                top: window.pageYOffset + cardRef.current.getBoundingClientRect().top - topOffset - 443 / 4,
                behavior: 'smooth',
            })
        }
    }, [cardRef, isExpanded])

    // Tea colour properties
    const style = useMemo(() => {
        if (!baseColor) {
            return null
        }

        // Base colour
        const teaColor = color(baseColor)

        // Dark text for light tea colour and white text for dark tea colour
        const textColor = teaColor.lightness() >= 40 ? teaColor.darken(0.75) : color.rgb(255, 255, 255)

        // Per-card style which includes unique colours for different UI elements
        return {
            // Background
            '--tea-color': teaColor,
            // Text
            '--text-color': textColor,
            // Bars background
            '--faded-tea-color': teaColor.fade(0.75),
            // Button hover
            '--darker-tea-color': teaColor.darken(0.25),
            // Default shadow
            '--r': teaColor.red(),
            '--g': teaColor.green(),
            '--b': teaColor.blue(),
            // Hover shadow
            '--r-h': teaColor.saturate(1.5).darken(0.5).red(),
            '--g-h': teaColor.saturate(1.5).darken(0.5).green(),
            '--b-h': teaColor.saturate(1.5).darken(0.5).blue(),
        }
    }, [baseColor])

    // Card classes
    const classes = classNames('card', isActiveTimerTea ? 'timer-on' : 'timer-off', {
        'is-expanded': isExpanded,
        'is-colorless': !baseColor,
    })

    return (
        <div
            className={classes}
            // @ts-ignore
            style={style}
            ref={cardRef}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
            onMouseLeave={() => document.activeElement.blur()}
        >
            <div className="card-shadow" ref={cardShadowRef} />
            <hgroup onClick={() => setIsExpanded(!isExpanded)}>
                <h2>
                    {isFancyName && <>&ldquo;</>}
                    <SearchableText>{name}</SearchableText>
                    {isFancyName && <>&rdquo;</>}
                </h2>
                {altName && (
                    <h3>
                        <SearchableText>{altName}</SearchableText>
                    </h3>
                )}
            </hgroup>
            <div className="card-body">
                <h4>
                    {isOrganic && 'Organic '}
                    <SearchableText>{type}</SearchableText>
                </h4>
                {!!link && (
                    <a href={link} target="_blank" title={`Visit store at ${storeName}`} rel="noopener noreferrer">
                        <span role="img" aria-label="Cart Icon">
                            🛒
                        </span>
                    </a>
                )}
                {rating !== null ? (
                    <span className="rating" title={RATINGS[rating]}>
                        {rating}/10
                    </span>
                ) : (
                    <span className="rating" title="Unrated">
                        Unrated
                    </span>
                )}
                <ul className="card-list">
                    <InfoItem icon="📅" title="Season">
                        {season}
                    </InfoItem>
                    <InfoItem icon={isTisane ? '🌿' : '🌱'} title={isTisane ? 'Plant' : 'Cultivar'}>
                        {cultivar}
                    </InfoItem>
                    <InfoItem icon="🌏" title="Origin">
                        {origin}
                    </InfoItem>
                </ul>
                <h4>Brewing Instructions</h4>
                <span className="temperature">{temperature}&deg; C</span>
                <BrewingTabs tea={tea} />
            </div>
        </div>
    )
}

Card.propTypes = {
    tea: TeaPropTypes.tea.isRequired,
    index: PropTypes.number.isRequired,
    cardsRef: PropTypes.object.isRequired,
}
