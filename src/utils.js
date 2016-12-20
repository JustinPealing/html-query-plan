function findAncestor(element, className) {
    if (element === null) {
        return null;
    }
    while ((element = element.parentElement) && element && !hasClass(element, className));
    return element;
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

module.exports.findAncestor = findAncestor;
module.exports.hasClass = hasClass;