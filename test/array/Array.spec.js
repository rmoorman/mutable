import Typorama from '../../src';
import {LifeCycleManager, revision} from '../../src/lifecycle.js';
import {aDataTypeWithSpec} from '../../test-kit/testDrivers/index';
import {expect} from 'chai';
import {lifecycleContract} from '../lifecycle.contract.spec.js';
import sinon from 'sinon';
import lifeCycleAsserter from './lifecycle.js';

describe('Array', function() {

	describe('lifecycle:',function() {
		lifeCycleAsserter.assertDirtyContract();
	});


});

require('./mutable/instance.spec');

require('./mutable/item-read.spec');

require('./mutable/views.spec');

require('./mutable/functional-programming.spec')

require('./mutable/set-value.spec');

require('./mutable/item-mutations.spec');

require('./mutable/in-place-mutations.spec');

describe('List data type', function () {
	it('should be identical with the Array data type', function () {
		expect(Typorama.List).to.equal(Typorama.Array);
	});
});
