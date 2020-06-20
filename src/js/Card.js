import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'
import color from 'color'
import reactStringReplace from 'react-string-replace'

import BrewingTabs from 'src/js/Brewing'
import { TeaPropTypes, useActiveTimerTea, useCardCentering, useSearchQuery } from 'src/js/utils'

import 'src/scss/Card.scss'

/**
 * Text with the search query highlighted.
 */
function SearchableText({ as: Element = null, children, ...rest }) {
    const searchQuery = useSearchQuery()

    // Callback to replace found search matches with a highlight tag.
    function searchReplacer(match, i) {
        return (
            <strong className="search-highlight" key={match + i}>
                {match}
            </strong>
        )
    }

    const highlightedText = searchQuery ? reactStringReplace(children, searchQuery, searchReplacer) : children

    return Element ? <Element {...rest}>{highlightedText}</Element> : highlightedText
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
    const { type, color: baseColor, isOrganic, name, altName, season, cultivar, origin, rating, link } = tea

    const [activeTimerTea] = useActiveTimerTea()
    const [isExpanded, setIsExpanded] = useState(false)

    const isActiveTimerTea = activeTimerTea?.name === name
    const isTisane = type === 'Tisane'

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
                top: window.pageYOffset + cardRef.current.getBoundingClientRect().top - topOffset,
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

        // Make sure the text colour is readable compared to the background (light text for dark tea colour by default)
        let textColor = teaColor.lighten(2)

        if (teaColor.lightness() < 20 && teaColor.saturationv() > 90) {
            // Very light and de-saturated text for very dark and saturated tea colours
            textColor = teaColor.saturate(-0.5).lighten(4.5)
        } else if (teaColor.isLight()) {
            // Dark text for light tea colour
            textColor = teaColor.darken(0.75)
        }

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
        // @ts-ignore
        <div className={classes} style={style} ref={cardRef}>
            <div className="card-shadow" ref={cardShadowRef} />
            <hgroup onClick={() => setIsExpanded(!isExpanded)}>
                <SearchableText as="h2">{name}</SearchableText>
                {altName && <SearchableText as="h3">{altName}</SearchableText>}
            </hgroup>
            <div className="card-body">
                <SearchableText as="h4">
                    {isOrganic && 'Organic '}
                    {type}
                </SearchableText>
                {!!link && (
                    <a href={link} target="_blank" title="Visit store" rel="noopener noreferrer">
                        <span role="img" aria-label="Cart Icon">
                            🛒
                        </span>
                    </a>
                )}
                {rating ? (
                    <span className="rating" role="img" aria-label={`${rating} Star Icons`}>
                        {Array.from({ length: rating }, () => '⭐')}
                    </span>
                ) : (
                    <span className="rating is-unrated">Unrated</span>
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