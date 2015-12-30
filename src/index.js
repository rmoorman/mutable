import config from './typoramaConfiguration';
import define from './defineType';
import BaseType from './BaseType';
import PrimitiveBase from './PrimitiveBase';
import String from './string';
import Boolean from './boolean';
import Number from './number';
import Array from './array';
import Function from './function';
import Reference from './reference';
import defineEnum from "./defineEnum";
import validation from "./validation";
import { LifeCycleManager , revision} from "./lifecycle";
import {either} from './composite';
import Map from './map';

export default {
	validation,
	config,
    define,
    BaseType,
	PrimitiveBase,
    String,
    Boolean,
    Number,
    Array,
    Function,
	Reference,
    defineEnum,
    LifeCycleManager,
    either,
    revision,

    // This is temporarily alias included for backward compatibility.
    // In the future, Array should be renamed to List entirely.
    List:Array,

	// Stubs used only for declarations:
	Enum: {},
	GenericEnum: {},
	Map
};
