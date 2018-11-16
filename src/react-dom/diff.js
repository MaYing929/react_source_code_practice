import { Componet } from '../react'
import { setAttribute } from './dom'

/**
 * @param {HTMLElement} dom 真实DOM
 * @param {vnode} vnode 虚拟DOM
 * @param {HTMLElement} container 容器
 * @returns {HTMLElement} 更新后的DOM
 */
export function diff( dom, vnode, container ) {

    const ret = diffNode( dom, vnode );

    if ( container && ret.parentNode !== container ) {
        container.appendChild( ret );
    }

    return ret;

}
// 对比
function diffNode( dom, vnode ) {

    let out = dom;

    if ( vnode === undefined || vnode === null || typeof vnode === 'boolean' ) vnode = '';

    if ( typeof vnode === 'number' ) vnode = String( vnode );

    // diff text node 对比文本节点
    if ( typeof vnode === 'string' ) {

        // 如果当前的DOM就是文本节点，则直接更新内容
        if ( dom && dom.nodeType === 3 ) {    // nodeType: https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType
            if ( dom.textContent !== vnode ) {
                dom.textContent = vnode;
            }
        // 如果DOM不是文本节点，则新建一个文本节点DOM，并移除掉原来的
        } else {
            out = document.createTextNode( vnode );
            if ( dom && dom.parentNode ) {
                dom.parentNode.replaceChild( out, dom );
            }
        }

        return out;
    }
    // 如果是组件 那就对比组件
    if ( typeof vnode.tag === 'function' ) {
        return diffComponent( dom, vnode );
    }
    // 对比非文本Dom节点
    //判断节点的类型是否一致 如果不一致那就新建一个Dom元素  将原来的子节点（如果有的话 移动到新建立的dom节点下）
    if ( !dom || !isSameNodeType( dom, vnode ) ) {
        out = document.createElement( vnode.tag );

        if ( dom ) {
            [ ...dom.childNodes ].map( out.appendChild );    // 将原来的子节点移到新节点下

            if ( dom.parentNode ) {
                dom.parentNode.replaceChild( out, dom );    // 移除掉原来的DOM对象
            }
        }
    }
    // 对比子节点 （给节点设一个key值，重新渲染时对比key值相同的节点。）
    if ( vnode.children && vnode.children.length > 0 || ( out.childNodes && out.childNodes.length > 0 ) ) {
        diffChildren( out, vnode.children );
    }
    // 对比属性
    diffAttributes( out, vnode );

    return out;

}

function diffChildren( dom, vchildren ) {

    const domChildren = dom.childNodes;
    const children = [];

    const keyed = {};

    if ( domChildren.length > 0 ) {
        for ( let i = 0; i < domChildren.length; i++ ) {
            const child = domChildren[ i ];
            const key = child.key;
            if ( key ) {
                keyedLen++;
                keyed[ key ] = child;
            } else {
                children.push( child );
            }
        }
    }

    if ( vchildren && vchildren.length > 0 ) {

        let min = 0;
        let childrenLen = children.length;

        for ( let i = 0; i < vchildren.length; i++ ) {

            const vchild = vchildren[ i ];
            const key = vchild.key;
            let child;
            // 如果有key，找到对应key值的节点
            if ( key ) {
                if ( keyed[ key ] ) {
                    child = keyed[ key ];
                    keyed[ key ] = undefined;
                }
                // 如果没有key，则优先找类型相同的节点
            } else if ( min < childrenLen ) {

                for ( let j = min; j < childrenLen; j++ ) {

                    let c = children[ j ];

                    if ( c && isSameNodeType( c, vchild ) ) {

                        child = c;
                        children[ j ] = undefined;

                        if ( j === childrenLen - 1 ) childrenLen--;
                        if ( j === min ) min++;
                        break;

                    }

                }

            }
            // 对比
            child = diffNode( child, vchild );
              // 更新dom
            const f = domChildren[ i ];
            if ( child && child !== dom && child !== f ) {
                // 如果更新前的对应位置为空 说明此节点是新增的
                if ( !f ) {
                    dom.appendChild(child);
                    // 如果更新后的节点和更新前对应位置的下一个节点一样儿 说明当前的节点被移除了
                } else if ( child === f.nextSibling ) {
                    removeNode( f );
                    // 将更新后的节点移动到正确的位置
                } else {
                    // 第一个参数 要插入的节点 第二个参数是已经存在的节点
                    dom.insertBefore( child, f );
                }
            }

        }
    }

}

// 对比组件
function diffComponent( dom, vnode ) {

    let c = dom && dom._component;
    let oldDom = dom;

    // 如果组件类型没有变化，则重新set props
    if ( c && c.constructor === vnode.tag ) {
        setComponentProps( c, vnode.attrs );
        dom = c.base;
    // 如果组件类型变化，则移除掉原来组件，并渲染新的组件
    } else {

        if ( c ) {
            unmountComponent( c );
            oldDom = null;
        }

        c = createComponent( vnode.tag, vnode.attrs );

        setComponentProps( c, vnode.attrs );
        dom = c.base;

        if ( oldDom && dom !== oldDom ) {
            oldDom._component = null;
            removeNode( oldDom );
        }

    }

    return dom;

}

function setComponentProps( component, props ) {

    if ( !component.base ) {
        if ( component.componentWillMount ) component.componentWillMount();
    } else if ( component.componentWillReceiveProps ) {
        component.componentWillReceiveProps( props );
    }

    component.props = props;

    renderComponent( component );

}

export function renderComponent( component ) {

    let base;

    const renderer = component.render();

    if ( component.base && component.componentWillUpdate ) {
        component.componentWillUpdate();
    }

    base = diffNode( component.base, renderer );

    component.base = base;
    base._component = component;

    if ( component.base ) {
        if ( component.componentDidUpdate ) component.componentDidUpdate();
    } else if ( component.componentDidMount ) {
        component.componentDidMount();
    }

    component.base = base;
    base._component = component;

}

function createComponent( component, props ) {

    let inst;

    if ( component.prototype && component.prototype.render ) {
        inst = new component( props );
    } else {
        inst = new Component( props );
        inst.constructor = component;
        inst.render = function() {
            return this.constructor( props );
        }
    }

    return inst;

}

function unmountComponent( component ) {
    if ( component.componentWillUnmount ) component.componentWillUnmount();
    removeNode( component.base);
}

// 是否是同一种节点类型
function isSameNodeType( dom, vnode ) {
    if ( typeof vnode === 'string' || typeof vnode === 'number' ) {
        return dom.nodeType === 3;
    }

    if ( typeof vnode.tag === 'string' ) {
        return dom.nodeName.toLowerCase() === vnode.tag.toLowerCase();
    }

    return dom && dom._component && dom._component.constructor === vnode.tag;
}

function diffAttributes( dom, vnode ) {

    const old = {};    // 当前DOM的属性
    const attrs = vnode.attrs;     // 虚拟DOM的属性

    for ( let i = 0 ; i < dom.attributes.length; i++ ) {
        const attr = dom.attributes[ i ];
        old[ attr.name ] = attr.value;
    }

    // 如果原来的属性不在新的属性当中，则将其移除掉（属性值设为undefined）
    for ( let name in old ) {

        if ( !( name in attrs ) ) {
            setAttribute( dom, name, undefined );
        }

    }

    // 更新新的属性值
    for ( let name in attrs ) {

        if ( old[ name ] !== attrs[ name ] ) {
            setAttribute( dom, name, attrs[ name ] );
        }

    }

}

// 移除节点
function removeNode( dom ) {

    if ( dom && dom.parentNode ) {
        dom.parentNode.removeChild( dom );
    }

}
