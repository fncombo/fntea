// React
import React, { useContext } from 'react'

// Libraries
import reactStringReplace from 'react-string-replace'

// Helpers
import { GlobalState } from 'js/helpers/App'

// Style
import 'scss/SearchableText.scss'

/**
 * Text with the search query highlighted.
 */
export default function SearchableText({ as: Element = 'span', children: text, ...rest }) {
    const { searchQuery } = useContext(GlobalState)

    return (
        <Element {...rest}>
            {searchQuery
                ? reactStringReplace(text, searchQuery, (match, i) =>
                    <strong className="search-highlight" key={match + i}>{match}</strong>
                )
                : text
            }
        </Element>
    )
}
