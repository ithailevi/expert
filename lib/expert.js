/*
Expert.js - Copyright (c) 2013 Ithai Levi

Permission is hereby granted, free of charge, to any person obtaining a copy 
of this software and associated documentation files (the "Software"), to 
deal in the Software without restriction, including without limitation the 
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
sell copies of the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in 
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
DEALINGS IN THE SOFTWARE.
*/

var _ = require('underscore');

// Expert.js is a knowledge base system.
// It can manage a collection of concepts and their
// relationships and can be used to generate
// insights from otherwise unrelated bits of knowledge.
//
// Expert.js is greatly influenced by a python demo written by Joe Strout.

// To start using Expert.js you need to create a Domain.
// The Domain object contains a single semantic network
// of Concepts and Relations.
module.exports.Domain = function() {

   var _db = {
      _concepts  : {},
      _relations : {},
      _cid       : 0,
      _rid       : 0
   };

   // Concepts are the vertices in the semantic network. Concepts
   // can be linked using relations. 
   var Concept = function(descriptor) {
      descriptor = descriptor || {};
      this.id = descriptor.id || _db._cid++;
      this._links = {};
      _db._concepts[this.id] = this;
   };

   Concept.prototype.fact = function(relation, linkedConcept) {
      Fact(this, relation, linkedConcept);
      return this;
   };

   // get immediate links by relation
   Concept.prototype._immediateLinks = function(relation) {
      var result = this._links[relation.id] || [];
      // if the relation is trasitive, we need to recurse the relation
      // path through all linked concepts, for example, even if:
      //   ship > (bigger than) > mouse
      // may not be directly specified, using a delegate concept:
      //   ship > (bigger than) > car > (bigger than) > mouse 
      // can provide the required insight.
      if (relation.isTransitive) {
         var tmp = [];
         // traverse all linked objects, recursivly(!)
         for (var i = 0; i < result.length; i += 1) {
            tmp = tmp.concat(result[i]._immediateLinks(relation));
         }
         result = result.concat(tmp);
      }
      return result;
   };

   // get all (immediate and inherited) links by relation
   Concept.prototype._allLinks = function(relation) {
      var result  = this._immediateLinks(relation),
      parents = this._links[isa.id];
      // if this no is-a relations, just return what we have
      if (parents===undefined || relation===example) return result;
      // otherwide, add parent data to the result, recursivly(!)
      for (var i=0; i < parents.length; i++) {
         result = result.concat(parents[i]._allLinks(relation));
      }
      return result;
   };

   // link this concept to another concept using a relation
   Concept.prototype._link = function(relation, concept) {
      var links = this._links[relation.id];
      if (links===undefined) {
         // initialize links list for this relation 
         this._links[relation.id] = [concept];
      } else {
         // if it's not there already, add concept to the list
         if (links.indexOf(concept)<0) links.push(concept);
      }
   };
   
   Concept.prototype.any = function(relationId) {
      var relation = _db._relations[relationId];
      var links = this._allLinks(relation);
      return links[Math.floor(Math.random() * links.length)];
   };

   // Relations are the arcs that link concepts together. A relation 
   // can be transitive (meaning, it cascades further in the network),
   // and can have an inverse relation.
   var Relation = function (descriptor) {//(id, isTransitive, inverseFor) {
      descriptor = descriptor || {};
      var result = function(linkedConcepts, referencedByConcept) {
         
         // linkedConcepts can be a single concept or an array of concepts 
         // build and intersect the list of links for the given concepts
         var referencedByList = 
            _.intersection.apply(this,
               _.map([].concat(linkedConcepts),
                  function(lc) { return lc._allLinks(result);}));
         
         // if this is not a check, return list of linked concepts 
         if (referencedByConcept===undefined) {
            return referencedByList;
         }

         // otherwise, test existance of referenced concept in list
         if (referencedByList.length===0 || 
             referencedByList.indexOf(referencedByConcept)<0) {
            return false;
         } else {
            return true;
         }
      };

      result.id = descriptor.id || _db._rid++;
      result.isTransitive = descriptor.isTransitive;
      
      // The relation can also be a prototype function for thie 
      // domain Concept object, if it is a valid function name.
      if (_isValidFunctionName(descriptor.id)) {
         Concept.prototype[descriptor.id] = function(linkedConcept) {
            Fact(this, result, linkedConcept);
            return this;
         };
      }

      // provide a way to specify that a relation implies a more 
      // abstract relation, for example if (attached to) implies (part of):
      //    wheel > (attached to) > car
      // is also:
      //    wheel > (part of) > car
      result.implies = function(abstractRelation) {
         result._implies = abstractRelation;
         return result;
      };

      if (descriptor.inverseFor!==undefined) {
         result.inverseFor  = descriptor.inverseFor;
         descriptor.inverseFor.inverseFor = result;
      } 

      _db._relations[result.id] = result;

      return result;
   };


   var Fact = function (concept, relation, linkedConcept) {
      concept._link(relation, linkedConcept);

      if (relation.inverseFor!==undefined) {
         linkedConcept._link(relation.inverseFor, concept);
      }

      // recurse for implied relations. this actually creates additional
      // arcs in the network.
      if (relation._implies!==undefined) {
         Fact(concept,relation._implies,linkedConcept);
      }
   };

   // isa and example are special relations that support
   // inheritence. 
   var 
      isa     = Relation( {id: "isa",    isTransitive: true} ),
      example = Relation( {id: "example", isTransitive: true, inverseFor: isa} );

   return {
      // Concepts are the the vertices of your semantic
      // network. Concepts can be linked together using 
      // Relations. Concepts can be concrete objects or 
      // entities ("car","dog"), abstract concepts
      // ("action","feeling") or any other worldly 
      // concept you wish to store.
      Concept: {
         // To store a new concept in the network
         // and start linking it to other concepts
         // you first need to create it with a unique
         // ID.
         create: function(id) {
            return new Concept(id);
         },
         // Existing concepts can be fetched from 
         // the semantic network using the predefined
         // unique ID.
         fetch: function(id) {
            return _db._concepts[id];
         }
      },
      $: function(conceptId) {
         var c = _db._concepts[conceptId];
         if (c === undefined) c = new Concept(conceptId);
         return c;
      },
      // Relations are the arcs that connect 
      // Concepts in the semantic network.
      Relation: {
         create: Relation,
         fetch: function(id) {
            return _db._relations[id];
         }
      },
      Fact : {
         establish: Fact
      },
      isa: isa,
      example: example,
      serialize : function() {
         var output = {
            relations : {},
            concepts  : {}
         };
         _.each(_db._relations,function(i,e) {
            var rel = {};
            rel.isTransitive = _db._relations[e].isTransitive;
            if (_db._relations[e].inverseFor) rel.inverseFor = _db._relations[e].inverseFor.id;
            if (_db._relations[e]._implies) rel.implies = _db._relations[e]._implies.id;
            output.relations[e] = rel;
         });
         _.each(_db._concepts,function(i,e) {
            var c = {};
            c.relations = {};
            _.each(_db._concepts[e]._links,function(i,l) {
               _.each(_db._concepts[e]._links[l], function(i) {
                  if (_db._relations[l].inverseFor &&
                      output.concepts[i.id]  &&
                         output.concepts[i.id].relations[_db._relations[l].inverseFor.id]) {
                  } else {
                     if (c.relations[l] === undefined) c.relations[l] = [];
                     c.relations[l].push(i.id);
                  }  
               });
            });
            output.concepts[e] = c;
         });
         return output;
      }
   };
};

var _isValidFunctionName = function() {
  var validName = /^[$A-Z_][0-9A-Z_$]*$/i,
      reserved = {
         'try':true, 'delete':true, 'in':true, 'continue':true,
         'for':true, 'switch':true, 'while':true, 'this':true,
         'debugger':true, 'function':true, 'throw':true, 'default':true,
         'if':true, 'instanceof':true, 'typeof':true, 'break':true,
         'do':true, 'new':true, 'var':true, 'case':true,
         'else':true, 'return':true, 'void':true, 'catch':true
     };
  return function(s) {
     // Ensure a valid name and not reserved.
     return validName.test(s) && !reserved[s];
  };
}();
