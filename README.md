Expert.js
=========
[![Build Status](https://travis-ci.org/L3V3L9/expert.png)](https://travis-ci.org/L3V3L9/expert)
Expert.js is miniature semantic network framework written in JavaScript.

Motivation
----------
Representing knowledge for artificial intelligence applications can be simplified
by the flexibility of scripting languages. Expert.js provides a DSL-like constructs 
for building semantic networks. The result is readable code that's easy to work with.

Quick Example
-------------
```javascript
var expert = require('expert'),
    _ = require('underscore');

var domain   = expert.Domain(),
    Concept  = domain.Concept,
    Relation = domain.Relation,

    mammal = Concept.create({id:"mammal"}),
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
    example = domain.example,

    has = Relation.create({id:"has"}),
    whatHas = Relation.create({id:"what has",inverseFor:has}),

    can = Relation.create({id:"can"}),
    whatCan = Relation.create({id:"what can",inverseFor:can}),

    biggerThan = Relation.create({id:"biggerThan",isTransitive: true});
    smallerThan = Relation.create({id:"smallerThan",isTransitive: true, 
                                   inverseFor:biggerThan});

salmon
   .isa(fish)
   .biggerThan(mouse)
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

console.log("what mammal that a mouse is smaller than, can swim?");
var answer2 = _.intersection( example(mammal),
                              whatCan(swim),
                              smallerThan(mouse) );
console.log(_.map( answer2, function(c){ return c.id; }));

```

Step by Step
------------

We begin by including Expert.js and Underscore.js. Underscore's 
collection operators works great with Expert.js.

```javascript
var expert = require('expert'),
    _ = require('underscore');
```

To begin working with Expert.js you must first create a Domain object. 
Concepts and Relations are part of a Domain. You can separate different
semantic networks using different Domains. 
The Concept and Relation objects are mere references.

```javascript
var domain   = expert.Domain(),
    Concept  = domain.Concept,
    Relation = domain.Relation,
```

Concepts are the building blocks of your semantic network. You 
can also provide a unique identifier that can help you identify 
the concepts later. Concepts can be tangible or abstract. We will
soon see how you can describe the abstraction hierarchy of related
Concepts.

```javascript
    mammal = Concept.create({id:"mammal"}),
    fish = Concept.create({id:"fish"}),
    dog = Concept.create({id:"dog"}),
    cat = Concept.create({id:"cat"}),
    mouse = Concept.create({id:"mouse"}),
    whale = Concept.create({id:"whale"}),
    salmon = Concept.create({id:"salmon"}),

    fur = Concept.create({id:"fur"}),
    bark = Concept.create({id:"bark"}),
    swim = Concept.create({id:"swim"}),
```

Expert.js comes with 2 predefined relations: isa and example. You 
can use isa to express abstraction hierarchies of Concepts. In this
example we will use isa to indicate that a dog, a cat and a mouse
are kinds of mammal.

```javascript
    isa = domain.isa,
    example = domain.example,
```

You can define as many relation types as you wish. Relations
allow you to introduce facts to your network of Concepts.
Relations can also have unique identifiers. If you use an
identifier that is also a valid JavaScript function name,
Expert.js will create a method for your Domain's Concept
prototype - for syntactic sugar - as seen in this example.

```javascript
    has = Relation.create({id:"has"}),
    whatHas = Relation.create({id:"what has",inverseFor:has}),

    can = Relation.create({id:"can"}),
    whatCan = Relation.create({id:"what can",inverseFor:can}),

    biggerThan = Relation.create({id:"biggerThan",isTransitive: true});
    smallerThan = Relation.create({id:"smallerThan",isTransitive: true, 
                                   inverseFor:biggerThan});
```

Establishing facts is as easy as it gets, if you used valid relation identifiers.

```javascript
salmon
   .isa(fish)
   .biggerThan(mouse)
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
```

Finally, we can inspect our semantic network. Note how we use Underscore.js to :

```javascript
console.log("what has fur?");
var answer1 = whatHas(fur);
console.log(_.map( answer1, function(c){ return c.id; }));

console.log("what mammal that a mouse is small than, can swim?");
var answer2 = _.intersection( example(mammal),
                              whatCan(swim),
                              smallerThan(mouse) );
console.log(_.map( answer2, function(c){ return c.id; }));
```
