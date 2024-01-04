(function(win, doc){
    'use strict';
    
    function isAn(typeObject) {
        return Object.prototype.toString.call(typeObject);
    }

    /**
    * @param {string} selector 
    */
    function DOM(selector) {
        if(typeof selector !== 'string')
            throw new Error('argument inválid: The argument selector must be an string');
        this.element = doc.querySelectorAll(selector);
    }
    
    /**
     * @param {string} eventType 
     * @param {function} cb
     */
    DOM.prototype.on = function on(eventType, cb) {
        Array.prototype.forEach.call(this.element, el => { el.addEventListener(eventType, cb); });
    }

    /**
     * @param {string} eventType 
     * @param {function} cb 
     */  
    DOM.prototype.off = function off(eventType, cb) {
        Array.prototype.forEach.call(this.element, el => { el.removeEventListener(eventType, cb); });
    }

    /**
     * @returns NodeList
     */
    DOM.prototype.get = function get() {
        if(this.element.length === 1) {
            return this.element[0];
        }
        return this.element;
    }

    /**
     * @param {function} cb
     * @returns void
     */
    DOM.prototype.forEach = function forEach(cb) {
        Array.prototype.forEach.call(this.element, cb);
    }

    /**
     * @param {function} cb 
     * @returns Array
     */
    DOM.prototype.map = function map(cb) {
        return Array.prototype.map.call(this.element, cb);
    }

    /**
     * @param {callbackfn} cb 
     * @param {initialValue} initialValue
     * @returns Array
     */
    DOM.prototype.reduce = function reduce() {
        return Array.prototype.reduce.apply(this.element, arguments);
    }

    /**
     * @param {callbackfn} cb
     * @param {initialValue} initialValue
     * @returns Array
     */
    DOM.prototype.reduceRight = function reduceRight() {
        return Array.prototype.reduceRight.apply(this.element, arguments);
    }

    /**
     * @param {predicate} cb 
     * @returns Array
     */
    DOM.prototype.filter = function filter(predicate) {
        return Array.prototype.filter.call(this.element, predicate);
    }

    /**
     * @param {predicate} cb 
     * @returns Boolean
     */
    DOM.prototype.some = function some(predicate) {
        return Array.prototype.some.call(this.element, predicate);
    }

    /**
     * @param {predicate} cb 
     * @returns Boolean
     */
    DOM.prototype.every = function every(predicate) {
        return Array.prototype.every.call(this.element, predicate);
    }

    /**
     * METODOS DE ESTÁTICOS
     */

    /**
     * @param {typeObject} typeObject 
     * @returns Boolean
     */
    DOM.isFunction = function isFunction(typeObject) {
        return isAn(typeObject) === '[object Function]';
    }

    /**
     * @param {typeObject} typeObject 
     * @returns Boolean
     */
    DOM.isArray = function isArray(typeObject) {
        return isAn(typeObject) === '[object Array]';
    }

    /**
     * @param {typeObject} typeObject 
     * @returns Boolean
     */
    DOM.isObject = function isObject(typeObject) {
        return isAn(typeObject) === '[object Object]';
    }

    /**
     * @param {typeObject} typeObject 
     * @returns Boolean
     */
    DOM.isNumber= function isNumber(typeObject) {
        return isAn(typeObject) === '[object Number]';
    }

    /**
     * @param {typeObject} typeObject 
     * @returns Boolean
     */
    DOM.isString = function isString(typeObject) {
        return isAn(typeObject) === '[object String]';
    }

    /**
     * @param {typeObject} typeObject 
     * @returns Boolean
     */
    DOM.isBoolean = function isBoolean(typeObject) {
        return isAn(typeObject) === '[object Boolean]';
    }

    /**
     * @param {typeObject} typeObject 
     * @returns Boolean
     */
    DOM.isNull = function isNull(typeObject) {
        let value = isAn(typeObject)
        return value === '[object Null]' || value === '[object Undefined]';
    }

    win.DOM = DOM;
})(window, document);
