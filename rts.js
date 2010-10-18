function eval( x ) {
    while ( x && x.eOrV ) {
        if ( typeof x.eOrV == 'function' ) {
            x = x.eOrV() ;
        } else {
            x = x.eOrV ;
        }
    }
    return x ;
}

// Apply node, not enough args
AppLT.prototype = {
    applyN : function ( args ) {
        var needs = this.needsNrArgs() ;
        if ( args.length < needs ) {
            return new AppLT( this, args ) ;
        } else if ( args.length == needs ) {
            return this.fun.applyN( this.args.concat( args ) ) ;
        } else {
            var fun = eval( this.applyN( args.slice( 0, needs ) ) ) ;
            return {
                eOrV : function() {
                    return fun.applyN( args.slice( needs ) ) ;
                } } ;
        }
    } ,
    needsNrArgs : function() {
        return this.fun.needsNrArgs() - this.args.length ;
    } ,
}
function AppLT( fun, args ) {
    // this.needs = fun.needs - args.length ;
    this.fun = fun ;
    this.args = args ;
}

// Apply node, unknown how much is missing or too much
App.prototype = {
    applyN : function ( args ) {
        var fun = eval(this) ;
        return {
            eOrV : function() {
                return fun.applyN( args ) ;
            } } ;
    } ,
}
function App( fun, args ) {
    this.eOrV = function() {
        // var x = eval( fun.applyN( args ) ) ;
        var x = ( fun.applyN( args ) ) ;
        this.eOrV = x ;
        return x ;
    }
}

// Function node
Fun.prototype = {
    applyN : function ( args ) {
        if ( args.length < this.needs ) {
            return new AppLT( this, args ) ;
        } else if ( args.length == this.needs ) {
            var x = this.fun.apply( null, args ) ;
            return x ;
        } else {
            var fun = eval( this.fun.apply( null, args.slice( 0, this.needs ) ) ) ;
            var remargs = args.slice( this.needs ) ;
            return {
                eOrV : function() {
                    return fun.applyN( remargs ) ;
                } } ;
        }
    } ,
    needsNrArgs : function() {
        return this.needs ;
    } ,
}
function Fun( fun ) {
    this.needs = fun.length ;
    this.fun = fun ;
}

// lazy application wrappers
function _a0_(f) {
    return new App(f,[]) ;
}

// indirection
function ind() {
    return new App(function(){throw "ind: attempt to prematurely evaluate indirection";},[]) ;
}

function indset_(i,x) {
    i.eOrV = x ;
}

//[8
//]
// function construction wrappers
function fun(f) {
    return new Fun(f) ;
}

//[8
//]
// strict application wrappers
function eval1(f,a) {
    return eval( f.applyN([a]) ) ;
}

function eval2(f,a,b) {
    return eval( f.applyN([a,b]) ) ;
}

function _e3_(f,a,b,c) {
    return eval( f.applyN([a,b,c]) ) ;
}

function _e4_(f,a,b,c,d) {
    return eval( f.applyN([a,b,c,d]) ) ;
}

function _e5_(f,a,b,c,d,e) {
    return eval( f.applyN([a,b,c,d,e]) ) ;
}

function _eN_(f,a) {
    return eval( f.applyN(a) ) ;
}

//[8
// lazy application wrappers
function _a0_(f) {
    return new App(f,[]) ;
}
//]

function app1(f,a) {
    return new App(f,[a]) ;
}

function app2(f,a,b) {
    return new App(f,[a,b]) ;
}

function _a3_(f,a,b,c) {
    return new App(f,[a,b,c]) ;
}

function _a4_(f,a,b,c,d) {
    return new App(f,[a,b,c,d]) ;
}

function _a5_(f,a,b,c,d,e) {
    return new App(f,[a,b,c,d,e]) ;
}

function _aN_(f,a) {
    return new App(f,a) ;
}

//[8
// indirection
function ind() {
    return new App(function(){throw "ind: attempt to prematurely evaluate indirection";},[]) ; 
}

function indset_(i,x) {
    i.eOrV = x ;
}
//]

// setup
function init() {
}

function cons(x,y) { return [0,x,y]; }
function head(l) { return l[1]; }
function tail(l) { return l[2]; }
var nil = [1] ;
function isNil(x) { return x[0] == 1 ; }


function show( x ) {
    var x = eval(x) ;
    document.write( ""+eval(x) ) ;
}

function showList( l ) {
    var list = eval(l) ;
    switch (list[0]) {
        case 0 :
            document.write( eval(head(list)) + ":" ) ;
            showList( tail(list) ) ;
            break ;
        case 1 :
            document.write( "[]" ) ;
            break ;
    }
}

// test: sieve
function testSieve() {
    var id = fun( function(a) {
        // trace( "id: " + a ) ;
        return a ;
    } ) ;
    var even = fun( function(a) {
        // return _eval_(a[0]) % 2 == 0 ;
        return app2( eq, app2( mod, a, 2 ), 0 ) ;
    } ) ;
    var eq = fun( function(a,b) {
        return eval(a) == eval(b) ;
    } ) ;
    var ne = fun( function(a,b) {
        return eval(a) != eval(b) ;
    } ) ;
    var add = fun( function(a,b) {
        return eval(a) + eval(b) ;
    } ) ;
    var sub = fun( function(a,b) {
        return eval(a) - eval(b) ;
    } ) ;
    var mul = fun( function(a,b) {
        return eval(a) * eval(b) ;
    } ) ;
    var div = fun( function(a,b) {
        return Math.floor ( eval(a) / eval(b) ) ;
    } ) ;
    var mod = fun( function(a,b) {
        return ( eval(a) % eval(b) ) ;
    } ) ;
    var from = fun( function(a) {
        return cons( a, app1( from, app2( add, a, 1 ) ) ) ;
    } ) ;
    var last = fun( function(a) {
        var list = eval(a) ;
        switch (list[0]) {
            case 0 :
                var list2 = eval(tail(list)) ;
                switch (list2[0]) {
                    case 0 :
                        return app1( last, tail(list) ) ;
                    case 1 :
                        return head(list) ;
                }
            case 1 :
                return undefined ;
        }
    } ) ;
    var take = fun( function(a,b) {
        var len  = eval(a) ;
        var list = eval(b) ;
        if ( len <= 0 || isNil(list) ) {
            return nil ;
        } else {
            return cons( head(list), app2( take, app2( sub, len, 1 ), tail(list) ) ) ;
        }
    } ) ;
    var filter = fun( function(a,b) {
        var list = eval(b) ;
        var test = eval1( a, head(list) ) ;
        if ( test ) {
            return cons( head(list), app2( filter, a, tail(list) ) ) ;
        } else {
            return app2( filter, a, tail(list) ) ;
        }
    } ) ;
    var notMultiple = fun( function(a,b) {
        return app2( ne, app2( mul, app2( div, b, a), a ), b ) ;
    } ) ;
    var notMultiple2 = fun( function(a,b) {
        var x = eval(a) ;
        var y = eval(b) ;
        return (Math.floor(y / x) * x) != y ;
    } ) ;
    var sieve = fun( function(a) {
        var list = eval(a) ;
        return cons( head(list), app1( sieve, app2( filter, app1( notMultiple2, head(list) ), tail(list) ) ) ) ;
    } ) ;
    var sieve2 = fun( function(nmz,a) {
        var list = eval(a) ;
        return cons( head(list), app2( sieve2, app1( id, nmz ), app2( filter, app1( nmz, head(list) ), tail(list) ) ) ) ;
    } ) ;
    var mainSieve = app2( take, 1000, app1( sieve, app1( from, 2 ) ) ) ;
    var mainSieve2 = app2( take, 500, app2( sieve2, app1( id, notMultiple2 ), app1( from, 2 ) ) ) ;
    
    // running it...
    evalCounter = 0 ;
    var d = new Date() ;
    var t1 = d.getTime() ;
    // showList( mainSieve ) ;
    show( app1( last, mainSieve ) ) ;
    d = new Date() ;
    var t2 = d.getTime() - t1 ;
    document.write("<hr/>time= " + t2 + " ms" + ((evalCounter>0) ? ", nreval= " + evalCounter + ", ms/ev= " + (t2/evalCounter) : "") + "<br/>") ;
}

function testMisc()  {
    trace("load & init ok") ;
    var plus = fun( function(a,b){return eval(a)+eval(b);}) ;
    trace("plus: " + plus) ;
    var inc1 = fun( function(a){trace("inc: " + a) ; var x = eval(a) ; return x+1;}) ;
    trace("inc1: " + inc1) ;
    var inc2 = plus.applyN([10]) ;
    trace("inc2: " + inc2) ;
    var two1 = 2 ;
    // var two2 = new AppN_WHNF(2) ;
    var two3 = new App(new Fun(0,function(){return 2;}),[]) ;
    var arr = [two1] ;
    // trace("two2: " + two2) ;
    trace("two3: " + two3) ;
    trace("two3 eval: " + eval(two3)) ;
    trace("two3: " + two3) ;
    trace("two3 eval: " + eval(two3)) ;
    trace("arr: " + arr) ;
    var x1 = inc2.applyN( arr ) ;
    trace("inc 2: " + x1) ;
    var x2 = new App( inc2, arr ) ;
    trace("inc del 2: " + x2) ;
    trace("inc del 2 eval: " + eval(x2)) ;
}

function tryOut() {
    var f = function(a,b) {} ;
    var l = cons(1,nil) ;
    // trace(ToPropertyDescriptor(f)) ;
    // trace(ToPropertyDescriptor(Function)) ;
    // trace(ToPropertyDescriptor("a")) ;
    // trace(ToPropertyDescriptor(String)) ;
    trace("f "+f.length) ;
}

function main() {
    init() ;
    // testMisc() ;
    // tryOut() ;
    testSieve() ;
}
