import {isFunction, extend} from 'lodash';
import {Mutable, Type} from "../types";
import {DirtyableYielder, AtomYielder} from "../lifecycle";
import {extras, untracked} from "mobx";
import {getMailBox} from "escalate";

/**
 * the schema of the class to define (input format)
 */
interface Schema{
    [fieldName:string] :  Type<any, any>;
}
const MAILBOX = getMailBox('mutable.extend');

export function nonPrimitiveElementsIterator(nonPrimitiveFields: Array<string>, parent: Mutable<any>) {
    return function typeDirtyableElementsIterator(yielder: DirtyableYielder) {
        for (let c of nonPrimitiveFields) {
            let k = this.__value__[c];
            if (k && isFunction(k.$setManager)) { // if value is dirtyable
                yielder(this, k);
            }
        }
        parent && isFunction(parent.$dirtyableElementsIterator) && parent.$dirtyableElementsIterator.call(this, yielder);
    };
}

export function atomsIterator(spec: Schema, parent: Mutable<any>) {
    return function atomsIterator(yielder: AtomYielder) {
        for (let c in spec) {
            if (spec.hasOwnProperty(c)) {
                yielder(extras.getAtom(this.__value__, c) as any);
            }
        }
        parent && isFunction(parent.$atomsIterator) && parent.$atomsIterator.call(this, yielder);
    };
}

export function fieldAttribute(fieldName: string) {
    return {
        get: function () {
            const value = this.__value__[fieldName];
            if (!this.__isReadOnly__ || value === null || value === undefined || !value.$asReadOnly) {
                return value;
            } else {
                return value.$asReadOnly();
            }
        },
        set: function (newValue:any) {
            if (this.$isDirtyable()) {
                this.$assignField(fieldName, newValue);
            } else {
                untracked(() => {
                    MAILBOX.warn(`Attempt to override a read only value ${JSON.stringify(this.__value__[fieldName])} at ${this.constructor.id}.${fieldName} with ${JSON.stringify(newValue)}`);
                });
            }
        },
        enumerable: true,
        configurable: false
    };
}
