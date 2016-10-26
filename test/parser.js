var parse = require('../dist/index.js');
var assert = require('assert');

describe('Parser', function() {
  it('should parse unnamed args', function() {
    assert.deepEqual(
      parse(['a', 'b', 'cde']),
      { _: ['a', 'b', 'cde'] }
    );
  });

  it('should parse single-letter opt w/ arg', function() {
    assert.deepEqual(
      parse(['-a', 'bcd']),
      { _: [], a: 'bcd' }
    );
  });

  it('should parse single-letter opt w/ arg, mixed with unnamed args', function() {
    assert.deepEqual(
      parse(['-a', 'bcd', 'def']),
      { _: ['def'], a: 'bcd' }
    );

    assert.deepEqual(
      parse(['-a', 'bcd', 'def', 'g']),
      { _: ['def', 'g'], a: 'bcd' }
    );

    assert.deepEqual(
      parse(['def', '-a', 'bcd', 'g']),
      { _: ['def', 'g'], a: 'bcd' }
    );
  });

  it('should parse single-letter opt w/o arg', function() {
    assert.deepEqual(
      parse(['-a']),
      { _: [], a: true }
    );
  });

  it('should parse a boolean-specified single-letter opt followed by unnamed arg', function() {
    assert.deepEqual(
      parse(['-a', 'bdcedf'], { boolean: ['a'] }),
      { _: ['bdcedf'], a: true }
    );
  });

  it('should parse multiple single-letter opts', function() {
    assert.deepEqual(
      parse(['-abc']),
      { _: [], a: true, b: true, c: true }
    );
  });

  it('should parse multiple single-letter opts with last letter getting arg', function() {
    assert.deepEqual(
      parse(['-abc', 'defgh']),
      { _: [], a: true, b: true, c: 'defgh' }
    );
  });

  it('should allow last letter of multiple single-letter opts to be set to boolean', function() {
    assert.deepEqual(
      parse(['-abc', 'defgh'], { boolean: ['c'] }),
      { _: ['defgh'], a: true, b: true, c: true }
    );
  });

  it('should parse multi-letter opt w/ arg', function(){
    assert.deepEqual(
      parse(['--asdf', 'ghjk']),
      { _: [], asdf: 'ghjk' }
    );
  });

  it('should parse multi-letter opt w/o arg', function(){
    assert.deepEqual(
      parse(['--asdf']),
      { _: [], asdf: true }
    );
  });

  it('should allow multi-letter opt to be set to boolean', function(){
    assert.deepEqual(
      parse(['--asdf', 'qwer'], { boolean: ['asdf'] }),
      { _: ['qwer'], asdf: true }
    );
  });

  it('should parse mixes of single- and multi-letter opts, w/ and w/o args', function(){
    assert.deepEqual(
      parse(['abc', '-abc', '--asdf']),
      { _: ['abc'], a: true, b: true, c: true, asdf: true }
    );

    assert.deepEqual(
      parse(['-abc', 'abc', '--asdf', 'abc']),
      { _: [], a: true, b: true, c: 'abc', asdf: 'abc' }
    );

    assert.deepEqual(
      parse(['-abc', 'abc', '--asdf', '-d']),
      { _: [], a: true, b: true, c: 'abc', d: true, asdf: true }
    );
  });

  it('should stop parsing opts after --', function(){
    assert.deepEqual(
      parse(['-a', '-bcd', 'def', 'xyz', '--', '-g', '-hij', 'klm']),
      { _: ['xyz', '-g', '-hij', 'klm'], a: true, b: true, c: true, d: 'def' }
    );
  });

  it('should allow collection of post -- args', function(){
    assert.deepEqual(
      parse(['-a', '-bcd', 'def', 'xyz', '--', '-g', '-hij', 'klm'], { '--': true }),
      { _: ['xyz'], '--': ['-g', '-hij', 'klm'], a: true, b: true, c: true, d: 'def' }
    );
  });
});
