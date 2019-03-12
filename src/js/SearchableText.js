// Libraries
import FuzzySort from 'fuzzysort'

// React
import React, { PureComponent } from 'react'

// Render text which can be highlighted by a search query
export default class SearchableText extends PureComponent {
    // Highlight the current search in a text string
    highlightSearch() {
        const { text, searchQuery } = this.props

        const result = FuzzySort.single(searchQuery, text)

        return {
            __html: result ? FuzzySort.highlight(result, '<strong>', '</strong>') : text,
        }
    }

    render() {
        const { text, searchQuery } = this.props

        return searchQuery.length ? <span dangerouslySetInnerHTML={this.highlightSearch()} /> : text
    }
}
