import { findAncestor } from './utils';

/**
 * Wraps a node in a query plan.
 */
class QpNode {
    constructor (readonly element:Element) {
        if (!this.element) throw new Error('element cannot be null');
        if (this.element.className != 'qp-node') throw new Error('element must have class qp-node');
    }

    /**
     * Gets an array of child nodes.
     */
    get children(): Array<QpNode> {
        return [].slice.call(findAncestor(this.element, 'qp-tr').children[1].children)
            .map(c => new QpNode(c.children[0].children[0]));
    }
}

export { QpNode }