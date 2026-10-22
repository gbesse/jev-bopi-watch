import test from 'node:test';import assert from 'node:assert/strict';import {mark,assessFiling} from '../src/index.mjs';
const valid={id:'id',name:'Alpha',territory:'FR',niceClasses:[9],goods:'software',status:'active'};
test('blank or coerced identities fail before the provider',async()=>{let calls=0;const provider={decide:async()=>{calls++;}};for(const key of ['id','name','territory'])for(const value of ['   ',0,true,{},[]]){assert.throws(()=>mark({...valid,[key]:value}),/invalid mark/);await assert.rejects(assessFiling(valid,{...valid,[key]:value},provider),/invalid mark/);}assert.equal(calls,0);});
test('valid user-authored identity is retained',()=>{const r=mark({...valid,name:'  École Alpha  '});assert.equal(r.name,'École Alpha');assert.equal(r.id,'id');});
