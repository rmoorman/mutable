import _ from "lodash"
import defineType from "./defineType"
import BaseType from "./BaseType"
import number from "./number"
import {
    generateWithDefault
}
from "./defineTypeUtils"







export default class _Array extends BaseType {

    static defaults() {
        return [];
    }

    static test(value) {
        return Array.isArray(value);
    }

    static wrapValue(value, spec, isReadOnly, options) {

        if (value instanceof BaseType) {
            return value.__value__.map((itemValue) => {
                return this._wrapSingleItem(itemValue, isReadOnly, options);
            }, this);
        }

        return value.map((itemValue) => {
            return this._wrapSingleItem(itemValue, isReadOnly, options);
        }, this);
    }

    static _wrapSingleItem(itemValue, isReadOnly, options) {
        if (itemValue instanceof BaseType) {
            return itemValue;
        } else if (typeof options.subTypes === 'function') {
            return options.subTypes.create(itemValue, isReadOnly, options.subTypes.options);
        } else if (typeof options.subTypes === 'object') {
            var subType = options.subTypes[itemValue._type];
            return subType.create(itemValue, isReadOnly, subType.options);
        }
    }

    static of(subTypes, defaults, test) {
        return this.withDefault(defaults, test, {
            subTypes
        });
    };

    constructor(value = [], isReadOnly = false, options = {}) {
        if (options.subTypes && _.isArray(options.subTypes)) {
            var subTypesObj = {};
            options.subTypes.forEach(function(item) {
                subTypesObj[item.displayName] = item;
            });
            options.subTypes = subTypesObj;
        }
        BaseType.call(this, value, isReadOnly, options);
    }

    // To check with Nadav: map, pop, push, reverse, shift, sort 
    // Need to fix map so that it wraps items

    // Mutator methods

    copyWithin() {

    }

    fill() {

    }

    pop() {
        if (this.__isReadOnly__) {
            return null;
        }
        this.__isInvalidated__ = true;
        return this.__value__.pop();
    }

    push(newItem) {
        if (this.__isReadOnly__) {
            return null;
        }
        this.__isInvalidated__ = true;
        return this.__value__.push(this.constructor._wrapSingleItem(newItem, this.__isReadOnly__, this.__options__));
    }

    reverse() {
        if (this.__isReadOnly__) {
            return null;
        }
        this.__isInvalidated__ = true;
        return this.__value__.reverse();
    }

    shift() {
        if (this.__isReadOnly__) {
            return null;
        }
        this.__isInvalidated__ = true;
        return this.__value__.shift();
    }

    sort(cb) {
        if (this.__isReadOnly__) {
            return null;
        }
        this.__isInvalidated__ = true;
        return this.__value__.sort(cb);
    }


    setValue(newValue) {
        if (newValue instanceof _Array) {
            newValue = newValue.toJSON();
        }
        if (_.isArray(newValue)) {
            this.__value__ = [];
            _.forEach(newValue, (itemValue) => {
                this.push(itemValue);
            });
        }
    }

    splice(index, removeCount, ...addedItems) {
        if (this.__isReadOnly__) {
            return null;
        }
        this.__isInvalidated__ = true;
        var spliceParams = [index, removeCount];
        addedItems.forEach(function(newItem) {
            spliceParams.push(this.constructor._wrapSingleItem(newItem, this.__isReadOnly__, this.__options__))
        }.bind(this));
        return this.__value__.splice.apply(this.__value__, spliceParams);
        //return this.__value__.push(this.constructor._wrapSingleItem(newItem, this.__isReadOnly__, this.__options__));
    }

    unshift() {
        if (this.__isReadOnly__) {
            return null;
        }
        this.__isInvalidated__ = true;
        return this.__value__.unshift();
    }

    // Accessor methods
    at(index) {
        var item = this.__value__[index];
        return (this.__isReadOnly__ && item instanceof BaseType) ? item.$asReadOnly() : item;
    }

    concat(...addedArrays) {
        // Demands more work
        var arrHasType = function(el){
            if (el.__options__.subTypes instanceof function){
                return el.__options__.subTypes.displayName;
            } else {
                for(var item in el){
                    // I know...
                    return arrHasType(el);
                }
            }
        }
        for(var item in addedArrays){
            if(arrHasType(this) !== arrHasType(item)){
                throw new Error("Error");
            };    
        }
        

        var res = new this.constructor(this.__value__, false, this.__options__);
        addedArrays.forEach(function(arr) {
            arr.forEach(function(item) {
                res.push(item);
            });
        });
        return res;
    }

    // includes(){} ES7 Method

    join(separator ? = ',') {
        return this.__value__.join(separator);
    }

    toSource() {
        throw 'Slice not implemented yet. Please do.';
    }

    toString() {
        throw 'Slice not implemented yet. Please do.';
    }

    valueOf() {
        return this.__value__.map(function(item) {
            return item.valueOf();
        });
    }

    toLocaleString() {
        throw 'Slice not implemented yet. Please do.';
    }

    indexOf() {
        throw 'Slice not implemented yet. Please do.';
    }

    lastIndexOf() {
        throw 'Slice not implemented yet. Please do.';
    }

    // Iteration methods        

    forEach(cb) {
        var that = this;
        this.__value__.forEach(function(item, index, arr) {
            cb(item, index, that);
        });
    }

    entries() {
        throw 'Slice not implemented yet. Please do.';
    }

    find(cb) {
        var self = this;
        return _.find(this.__value__, function(element, index, array) {
            return cb(element, index, self);
        });
        return _.find(this.__value__, cb);
    }

    findIndex(cb) {
        var self = this;
        return _.findIndex(this.__value__, function(element, index, array) {
            return cb(element, index, self)
        })
        return _.findIndex(this.__value__, cb);
    }

    keys() {
        throw 'Slice not implemented yet. Please do.';
    }

    // Seeing as 'map' simply reads an array, and then duplicates it. Can I map a readOnly array?
    map(cb, ctx) {
        if (this.__isReadOnly__) {
            return null;
        }
        // this.__isInvalidated__= true;

        var arr = this.__value__.map(cb, ctx || this);
        return new this.constructor(arr, false, this.__options__)
    }

    reduce() {
        throw 'Slice not implemented yet. Please do.';
    }

    reduceRight() {
        throw 'Slice not implemented yet. Please do.';
    }

    values() {
        throw 'Slice not implemented yet. Please do.';
    }





    $asReadOnly() {
        if (!this.__readOnlyInstance__) {
            this.__readOnlyInstance__ = this.constructor.type.create(this.__value__, true, this.__options__);
        }
        return this.__readOnlyInstance__;
    }

    $isInvalidated() {
        if (this.__isInvalidated__ == -1) {
            var invalidatedField = _.find(this.__value__, (item, index) => {
                if (item instanceof BaseType) {
                    return item.$isInvalidated();
                }
            });
            if (invalidatedField) {
                this.__isInvalidated__ = true;
            } else {
                this.__isInvalidated__ = false;
            }
        }
        return this.__isInvalidated__;
    }

    $revalidate() {
        this.__isInvalidated__ = -1;
        _.forEach(this.__value__, (item, index) => {
            if (item instanceof BaseType) {
                item.$revalidate();
            }
        });
    }

    $resetValidationCheck() {
        this.__isInvalidated__ = this.__isInvalidated__ || -1;
        _.forEach(this.__value__, (item, index) => {
            if (item instanceof BaseType) {
                item.$resetValidationCheck();
            }
        });
    }

}

_Array.withDefault = generateWithDefault();



//['map', 'filter', 'forEach', 'concat', 'slice'].map(function(key){
['map', 'filter', 'slice'].forEach(function(key) {

    var loFn = _[key];

    _Array.prototype[key] = function(fn, ctx) {

        var valueArray = loFn(this.__value__, function() {
            return fn.apply(ctx || this, arguments);
        });

        return new this.constructor(valueArray, false, this.__options__);

    }


});
// ['every', 'some']
['every', 'some'].forEach(function(key) {

    var loFn = _[key];
    _Array.prototype[key] = function(fn, ctx) {

        var valueArray = loFn(this.__value__, function() {
            return fn.apply(ctx || this, arguments);
        });

        return valueArray;

    }


});



defineType('Array', {
    spec: function() {
        return {
            length: number.withDefault(0)
        };
    }
}, _Array);
