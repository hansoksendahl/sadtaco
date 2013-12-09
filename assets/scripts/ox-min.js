var ox=ox?ox:function(){};ox.describe=function __ox_describe(){var typeDescription=/([A-Z][a-z]+)\]$/i,nullType="[object Null]";return function ox_describe(a){var type;if(a===null){type=nullType}else if(a&&a.constructor.prototype.type){type=a.constructor.prototype.type}else{type=Object.prototype.toString.call(a)}return type.match(typeDescription)[1].toLowerCase()}}();ox.describe.type=function(type){function MutableType(){}mutableType.prototype.type="[object "+type+"]";return new MutableType};var ox=ox?ox:function(){};ox.merge=function ox_merge(target,src){var array=Array.isArray(src);var dst=array&&[]||{};if(array){target=target||[];dst=dst.concat(target);src.forEach(function(e,i){if(typeof target[i]==="undefined"){dst[i]=e}else if(typeof e==="object"){dst[i]=merge(target[i],e)}else{if(target.indexOf(e)===-1){dst.push(e)}}})}else{if(target&&typeof target==="object"){Object.keys(target).forEach(function(key){dst[key]=target[key]})}Object.keys(src).forEach(function(key){if(typeof src[key]!=="object"||!src[key]){dst[key]=src[key]}else{if(!target[key]){dst[key]=src[key]}else{dst[key]=merge(target[key],src[key])}}})}return dst};ox.interpolate=function ox_interpolate(a,b){function __ox_interpolate(b){b=typeof b!=="object"?Array.prototype.slice.call(arguments):b;return a.replace(/#\{([^\{\}]+)\}/g,function(c,d){return b[d]!==void 0?b[d].toString():""})}return b?__ox_interpolate(b):__ox_interpolate};ox.interpolate.function=function __ox_interpolate_function(){var t=ox.interpolate("function #{name} (#{parameters}) {#{body}}"),a={name:"",parameters:[],body:"/* OX-Tools*/"};return function ox_interpolate_function(b){var c=ox.merge(a,b);return t(c)}}();ox.interpolate.string=function __ox_interpolate_string(){var t='"#{value}"',a={value:""};return function ox_interpolate_string(b){var c=ox.merge(a,b);return t(c)}}();ox.interpolate.array=function __ox_interpolate_array(){var t="[#{members}]",u=", ",a={members:[]};return function ox_interpolate_array(b){var c=ox.merge(a,b);c.members=c.members.join(u);return t(c)}}();ox.interpolate.object=function __ox_interpolate_object(){var t="{#{members}}",u=": ",v=", ",a={members:[[]]};return function ox_interpolate_object(b){var c=ox.merge(a,b);c.members=c.members.map(function(d){return d.join(u)}).join(v);return t(c)}};ox.interpolate.number=function ox_interpolate_number(a){return Number(a.value)};ox.interpolate.null=function ox_interpolate_null(){return"null"};ox.interpolate.undefined=function ox_interpolate_undefined(){return"void(0)"};ox.extrapolate=function __ox_extrapolate(){var search=/\(?#\{([^\}]+)\}\)?/g,varbs="(.*)";return function ox_extrapolate(a,b){a=typeof a==="object"?a.toString().slice(1,-1):a;var tuple={},match=new RegExp(a.replace(search,varbs)),segment,i=0;while(segment=search.exec(a)){i+=1;if(segment[1])tuple[segment[1]]=i;else throw"OX-ToolsError: Malformed input for ox.extrapolate.  Input: "+a}function __extrapolate(b){var matches=b.match(match),key,result={};if(match){for(key in tuple){if(matches[tuple[key]])result[key]=matches[tuple[key]]}}return result}return b?__extrapolate(b):__extrapolate}}();ox.lambda={};ox.lambda.parse=function __ox_lambda_parse(s){var build=function(x){var reduction=x.reduce(function(a,b){return a(b)});return typeof reduction==="function"?reduction():reduction};build.term=function build_term(arg){return function(expression){return"function ("+build(arg)+") { return "+build(expression)+" }"}};build.argument=function build_argument(x){return build(x)};build.application=function build_application(x){return"("+build(x)+")"};build.expression=function build_expression(x){var s="",i=0;function __build_expression(y){if(!arguments.length)return s;s+=i>0&&y[0].name!=="build_application"?build.application(y):build(y);i+=1;return __build_expression}return __build_expression(x)};build.variable=function build_variable(x){if(ox.lambda[x])return'ox.lambda["'+x+'"]';return x};return function ox_lambda_parse(s){var a=s.match(/([\S])/g),o=[[]],reductions=[],i,l;function appendContext(n){return o[o.length-1].push(n)}function push(){var b=[];o[o.length-1].push(b);o.push(b)}function reduce(){if(!reductions.length)return false;o=o.slice(0,reductions.pop())}for(i=0;i<a.length;i+=1){l=a[i];switch(l){case"λ":push();appendContext(build.term);push();appendContext(build.argument);continue;case".":o.pop();push();appendContext(build.expression);continue;case"(":reductions.push(o.length);push();appendContext(build.application);push();appendContext(build.expression);continue;case")":reduce();continue;default:push();appendContext(build.variable);appendContext(l);o.pop()}}if(reductions.length===0)o=o.slice(0,1);if(reductions.length>0)return false;if(o.length>1)return false;try{var str=build([build.expression].concat(o[0])).match(/^[^\(]+\(([^\)]+)\)[^\{]+\{\s*(.+)\s*\}\s*$/);return new Function(str[1],str[2])}catch(e){throw'OX-ToolsError: ox.lambda.parse does not recognize the lambda term "'+s+'"'}}}();ox.lambda.eta=ox.lambda["η"]=ox.lambda.parse("λx.λy.x y");ox.lambda.omega=ox.lambda["ω"]=ox.lambda.parse("λx.x x");ox.lambda.Z=ox.lambda.parse("λf.ω(λx.λy.f (x x) y)");ox.lambda.B=ox.lambda.parse("λx.λy.λz.x (y z)");ox.lambda.I=ox.lambda.parse("λx.x");ox.lambda.K=ox.lambda.parse("λx.λy.x");ox.lambda.S=ox.lambda.parse("λx.λy.λz.x z (y z)");ox.lambda.C=ox.lambda.parse("λx.λy.λz.x z y");ox.lambda.W=ox.lambda.parse("λx.λy.x y y");ox.key=function __ox_key(){var search="#{namespace}:#{id}:#{member}:#{type}",idGen=function(){return Math.random().toString().slice(2)};keyGen=ox.interpolate(search);function ox_key(tuple){tuple=tuple||{};function generate(){var segments;segments={namespace:tuple["namespace"]===void 0?"ox":tuple["namespace"],id:tuple["id"],member:tuple["member"],type:tuple["type"]};return keyGen(segments)}generate.namespace=function key_namespace(x){if(!arguments.length)return tuple.namespace;tuple.namespace=x;return generate};generate.id=function key_id(x){if(!arguments.length)return tuple.id;tuple.id=x!==void 0?x:idGen();return generate};generate.member=function key_member(x){if(!arguments.length)return tuple.member;tuple.member=x;return generate};generate.type=function key_type(x){if(!arguments.length)return tuple["type"];tuple["type"]=x;return generate};return generate}ox_key.parse=ox.extrapolate(search);ox_key.idGen=function(x){if(!arguments.length)return idGen();idGen=x};return ox_key}();ox.record=function ox_record(tuple){var ox_db_record={},value;ox_db_record.key=tuple?ox.key(tuple):ox.key();ox_db_record.value=function(x,t){if(!arguments.length)return value;var type=ox.describe(x);ox_db_record.key.type(t||type);value=x;return ox_db_record};return ox_db_record};ox.merge=function ox_merge(target,src){var array=Array.isArray(src);var dst=array&&[]||{};if(array){target=target||[];dst=dst.concat(target);src.forEach(function(e,i){if(typeof target[i]==="undefined"){dst[i]=e}else if(typeof e==="object"){dst[i]=merge(target[i],e)}else{if(target.indexOf(e)===-1){dst.push(e)}}})}else{if(target&&typeof target==="object"){Object.keys(target).forEach(function(key){dst[key]=target[key]})}Object.keys(src).forEach(function(key){if(typeof src[key]!=="object"||!src[key]){dst[key]=src[key]}else{if(!target[key]){dst[key]=src[key]}else{dst[key]=merge(target[key],src[key])}}})}return dst};ox.reference=function __ox_reference(x,accessors){var capture="(.*)",typeAccessors={};function getForm(key){if(key.id()===void 0)key.id(capture);if(key.member()===void 0)key.member(capture);if(key.type()===void 0)key.type(capture);return new RegExp("^"+key()+"$")}function Reference(x,accessors){x=x||localStorage;accessors=accessors||{};var accessors=ox.merge(typeAccessors,accessors),self=this,key;this.context=x;this.cache={};this.typeAccessors={};for(key in accessors){this.typeAccessors[key]=function(type){return function(){accessors[type].apply(self,arguments)}}(key)}return this}typeAccessors["string"]=function ref_string(record){var key=record.key(),value=record.value();if(value===void 0){value=this.context[key];record.value(value)}this.context[key]=value};typeAccessors["number"]=function ref_number(record){var key=record.key();if(typeof record.value()==="undefined"){record.value(Number(this.context[key]));return record}this.context[key]=record.value()};typeAccessors["function"]=function(){var funcSearch=/^\s*function\s*\(([^\)]*)\)\s*\{([^\}]*)\}\s*$/,commaSplit=/\s*,\s*/;return function ref_function(record){var key=record.key(),value=record.value(),args=[],fArr;if(value===void 0){fArr=this.context[key].match(funcSearch);args=(fArr[1]||"").split(commaSplit).concat(fArr[2]);record.value(Function.prototype.constructor.apply(Function,args))}this.context[key]=value}}();typeAccessors["object"]=function ref_object(record){var key=record.key(),value=record.value(),result,returnValue,i,id,member;if(!value){result=this.read(ox.key({id:this.context[key]}));if(result.length){returnValue={};for(i=0;i<result.length;i+=1){returnValue[result[i].key.member()]=result[i].value()}Object.defineProperty(returnValue,"id",{enumerable:false,configurable:false,value:this.context[key]});record.value(returnValue)}}else{id=this.context[key]||ox.key.idGen();for(member in value){this.create(ox.record({id:id,member:member}).value(value[member]))}this.context[key]=id}};typeAccessors["array"]=function ref_array(record){var key=record.key(),value=record.value(),returnValue,result,member;if(!value){result=typeAccessors["object"](record);returnValue=[];for(member in result){returnValue[member]=result[member]}record.value(returnValue)}else{typeAccessors["object"](record)}};typeAccessors["regexp"]=function ref_regexp(record){var key=record.key(),value=record.value();if(value===void 0){value=RegExp(this.context[key]);record.value(value)}this.context[key]=record.value().toString().slice(1,-1)};typeAccessors["null"]=function ref_null(record){var key=record.key();if(!arguments.length)record.value(null);this.context[key]=""};typeAccessors["undefined"]=function ref_undefined(key){delete this.context[key]};Reference.prototype.__memo=function(record){var key=record.key(),value=record.value(),type=record.key.type(),member,newRecord,id;if(this.cache[key]&&value===void 0){record.value(this.cache[key].value())}else{this.typeAccessors[type](record);this.cache[key]=record}return record};Reference.prototype.create=function ox_reference_create(record){return this.__memo(record)};Reference.prototype.read=function ox_reference_read(key){var form=getForm(key),results=[],index,record;for(index in this.context){if(form.test(index)){record=ox.record(ox.key.parse(index));this.__memo(record);results.push(record)}}return results};Reference.prototype.update=function ox_reference_update(record){var form=getForm(record.key);for(key in this.context){if(form.test(key))this.__memo(record)}};Reference.prototype.delete=function ox_reference_delete(key){var form=getForm(key),index;for(index in this.context){if(form.test(index))delete this.context[index]}};Reference.prototype.graph=function(k){var graph={id:k.id(),nodes:[],links:[]},self=this,__nodes;function __graph(id,source){var results=self.read(k),i,record,key,type;for(i=0;i<results.length;i+=1){record=results[i];key=record.key();type=record.key.type();if(graph.nodes.indexOf(key)===-1){graph.nodes.push(key);if(source)graph.links.push([source.key(),key]);if(type==="object"||type==="array"||type==="function"){__graph(self.context[key],record)}}}}__graph(k.id());__nodes=graph.nodes.map(function(x){var record=self.cache[x];return{namespace:record.key.namespace(),id:record.key.id(),member:record.key.member(),type:record.key.type(),value:record.value()}});graph.links=graph.links.map(function(x){source=__nodes[graph.nodes.indexOf(x[0])];return{key:source.member,source:source,target:__nodes[graph.nodes.indexOf(x[1])]}});graph.nodes=__nodes;return graph};return function(x,accessors){return new Reference(x,accessors)}}();ox.graph=function ox_graph(x){var items=[],graph={nodes:[{type:"node",value:x}],links:[]};function __ox_graph(obj){var source,member,entry,node;items.push(obj);source=items.indexOf(obj);for(member in obj){entry=obj[member];type=typeof entry;node={value:entry};node.type=type==="function"||type==="object"?"node":"leaf";if(node.type==="node"){if(items.indexOf(entry)===-1){graph.nodes.push(node);__ox_graph(entry)}}else{graph.nodes.push(node);items.push(entry)}if(source!==-1){graph.links.push({source:graph.nodes[source],target:graph.nodes[items.lastIndexOf(entry)],key:member})}}}__ox_graph(x);return graph};ox.reduce=function(a){return a.reduce(function(a,b){return a(b)})};ox.expand=function ox_expand(){var a=Array.prototype.slice.call(arguments);return function(){var b=[a[0].apply(a[0],arguments)].concat(a.slice(1));return b.reduce(function(c,d){return d(c)})}};ox.table=function __ox_table(ctx){var context=ox.merge(ctx||{},{}),table=[context],ox_table={};function setContext(){context=table.length?table[table.length-1]:{}}ox_table.get=function ox_table_get(key){return context[key]};ox_table.set=function ox_table_set(key,value){context[key]=value;return ox_table};ox_table.push=function ox_table_push(ctx){table.push(ox.merge(ctx||context,{}));setContext();return ox_table};ox_table.pop=function ox_table_pop(){if(table.length>0)table.pop();setContext();return ox_table};return ox_table};