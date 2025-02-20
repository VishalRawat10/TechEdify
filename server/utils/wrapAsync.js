function wrapAsync(fn){
    return function (req, res, next){
        fn(req, res, next).catch((er)=>next(er));
    }
}

module.exports={wrapAsync} ;