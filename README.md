Expert.js
=========
[![Build Status](https://travis-ci.org/L3V3L9/expert.png)](https://travis-ci.org/L3V3L9/expert)
Expert.js is miniature semantic network framework written in JavaScript.

Motivation
----------
Representing knowledge for artificial intelligence applications can be simplified
by the flexibility of scripting languages. Expert.js provides a DSL-like constructs 
for building semantic networks. The result is a readable, easy to work with code.

Quick Example
-------------
```
var expert = require('expert'),
    _ = require('underscore');

var domain   = expert.Domain();
var Concept  = domain.Concept;
var Relation = domain.Relation;

var mammal = Concept.create({id:"mammal"}),
    fish = Concept.create({id:"fish"}),
    dog = Concept.create({id:"dog"}),
    cat = Concept.create({id:"cat"}),
    mouse = Concept.create({id:"mouse"}),
    whale = Concept.create({id:"whale"}),
    salmon = Concept.create({id:"salmon"}),

    fur = Concept.create({id:"fur"}),
    bark = Concept.create({id:"bark"}),
    swim = Concept.create({id:"swim"}),

    isa = domain.isa,
    kindOf = domain.kindOf,

    has = Relation.create({id:"has"}),
    whatHas = Relation.create({id:"what has",inverseFor:has}),

    can = Relation.create({id:"can"}),
    whatCan = Relation.create({id:"what can",inverseFor:can}),

    biggerThan = Relation.create({id:"biggerThan",isTransitive: true});
    smallerThan = Relation.create({id:"smallerThan",isTransitive: true, 
                                   inverseFor:biggerThan});

salmon
   .isa(fish)
   .can(swim);

whale
   .isa(mammal)
   .biggerThan(dog)
   .biggerThan(cat)
   .can(swim);

dog
   .isa(mammal)
   .has(fur)
   .can(bark)
   .biggerThan(mouse);

cat
   .isa(mammal)
   .has(fur)
   .biggerThan(mouse);

mouse
   .isa(mammal)
   .has(fur);

console.log("what has fur?");
var answer1 = whatHas(fur);
console.log(_.map( answer1, function(c){ return c.id; }));

console.log("what mammal is bigger than a mouse and can swim?");
var answer2 = _.intersection( kindOf(mammal), whatCan(swim),smallerThan(mouse));
console.log(_.map( answer2, function(c){ return c.id; }));

```

