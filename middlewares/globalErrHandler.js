export const globalErrhandler = (err, req, res, next) =>{
    //stack
    //message

    const stack = err?.stack;
    const statusCode = err?.statusCode? err?.statusCode : 500; 
    const message = err?.message? err?.message : "Something Went wrong";

    res.status(statusCode).json({
        stack:stack,
        message,
    });
};

//404 handler

export const notFound = (req, res, next) =>{
    const err = new Error(`Route ${req.originalUrl} not found`);
    next(err);
};