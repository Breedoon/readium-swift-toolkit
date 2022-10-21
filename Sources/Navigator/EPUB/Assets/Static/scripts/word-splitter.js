allWords = []

document.addEventListener('DOMContentLoaded', function() {
    // allWords = split(document.body)
}, false);

const settings = {
    wordClass: 'word',
    absolute: false,
    tagName: 'span',
    wordSeparator: /([^\w\d\p{L}]+)/g,
}

function split(node) {
    const type = node.nodeType
    // Arrays of split words and characters
    const words = []

    // Only proceed if `node` is an `Element`, `Fragment`, or `Text`
    if (!/(1|3|11)/.test(type)) {
        return words
    }

    // A) IF `node` is TextNode that contains characters other than white space...
    //    Split the text content of the node into words and/or characters
    //    return an object containing the split word and character elements
    if (type === 3) {
        return splitWords(node)
    }

    // B) ELSE `node` is an 'Element'
    //    Iterate through its child nodes, calling the `split` function
    //    recursively for each child node.
    const childNodes = toArray(node.childNodes)

    if (childNodes.length) {
        // we need to set a few styles on nested html elements
        // if (!data.get(node).isRoot) {
        //     node.style.display = 'inline-block'
        //     node.style.position = 'relative'
        //     // To maintain original spacing around nested elements when we are
        //     // splitting text into lines, we need to check if the element should
        //     // have a space before and after, and store that value for later.
        //     // Note: this was necessary to maintain the correct spacing when nested
        //     // elements do not align with word boundaries. For example, a nested
        //     // element only wraps part of a word.
        //     const nextSibling = node.nextSibling
        //     const prevSibling = node.previousSibling
        //     const text = node.textContent || ''
        //     const textAfter = nextSibling ? nextSibling.textContent : ' '
        //     const textBefore = prevSibling ? prevSibling.textContent : ' '
        //     data.set(node, {
        //         isWordEnd: /\s$/.test(text) || /^\s/.test(textAfter),
        //         isWordStart: /^\s/.test(text) || /\s$/.test(textBefore),
        //     })
        // }
    }

    // Iterate through child nodes, calling `split` recursively
    // Returns an object containing all split words and chars
    return childNodes.reduce((result, child) => {
        const words = split(child)
        return [...words, ...result]
    }, words)
}

function splitWords(textNode) {
    // the tag name for split text nodes
    const TAG_NAME = settings.tagName
    // value of the text node
    const VALUE = textNode.nodeValue
    // `splitText` is a wrapper to hold the HTML structure
    const splitText = document.createDocumentFragment()

    // Arrays of split word and character elements
    let words = []

    // if (/^\s/.test(VALUE)) {
    //     splitText.append(' ')
    // }

    // Create an array of wrapped word elements.
    words = toWords(VALUE).reduce((result, WORD, idx, arr) => {
        if (!WORD.length)
            return result
        // Let `wordElement` be the wrapped element for the current word
        let wordElement

        // -> If Splitting Text Into Words...
        //    Create an element to wrap the current word. If we are also
        //    splitting text into characters, the word element will contain the
        //    wrapped character nodes for this word. If not, it will contain the
        //    plain text content (WORD)
        wordElement = createElement(TAG_NAME, {
            class: `${settings.wordClass}`,
            id: `word-${idx}`,
            children: WORD,
        })
        splitText.appendChild(wordElement)
        // If not splitting text into words, we return an empty array
        return result.concat(wordElement)
    }, []) // END LOOP;

    // // Add a trailing white space to maintain word spacing
    // if (/\s$/.test(VALUE)) {
    //     splitText.append(' ')
    // }
    textNode.replaceWith(splitText)
    return words
}

function toWords(value) {
    const string = value ? String(value) : ''
    return string.split(settings.wordSeparator)
}

function createElement(name, attributes) {
    const element = document.createElement(name)

    if (!attributes) {
        // When called without the second argument, its just return the result
        // of `document.createElement`
        return element
    }

    Object.keys(attributes).forEach((attribute) => {
        const rawValue = attributes[attribute]
        const value = rawValue
        // Ignore attribute if the value is `null` or an empty string
        if (value === null || value === '') return
        if (attribute === 'children') {
            // Children can be one or more Elements or DOM strings
            element.append(...toArray(value))
        } else {
            // Handle standard HTML attributes
            element.setAttribute(attribute, value)
        }
    })
    return element
}

function isString(value) {
    return typeof value === 'string'
}

function toArray(value) {
    if (isArray(value)) return value
    if (value == null) return []
    return isArrayLike(value) ? Array.prototype.slice.call(value) : [value]
}

function isArray(value) {
    return Array.isArray(value)
}

function isArrayLike(value) {
    return isObject(value) && isLength(value.length)
}

function isObject(value) {
    return value !== null && typeof value === 'object'
}

function isLength(value) {
    return typeof value === 'number' && value > -1 && value % 1 === 0
}