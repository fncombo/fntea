// React
import React, { useContext } from 'react'

// Libraries
import reactStringReplace from 'react-string-replace'

// Helpers
import { GlobalState } from 'js/helpers/App'

// Style
import 'scss/SearchableText.scss'

/**
 * Callback to replace found search matches with a highlight tag.
 */
const searchReplacer = (match, i) =>
    <strong className="search-highlight" key={match + i}>
        {match}
    </strong>

/**
 * Text with the search query highlighted.
 */
export default function SearchableText({ as: Element = null, children: text, ...rest }) {
    const { searchQuery } = useContext(GlobalState)

    const highlightedText = searchQuery
        ? reactStringReplace(text, searchQuery, searchReplacer)
        : text

    return Element ? <Element {...rest}>{highlightedText}</Element> : highlightedText
}
