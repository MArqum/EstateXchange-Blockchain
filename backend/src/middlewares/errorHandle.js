const { isCelebrateError } = require('celebrate');

module.exports = (app) => {
    app.use((req, res, next) => {
        return res.status(404).json({
            data: null,
            success: false,
            message: 'API not found!'
        });
    }); 
    
    app.use((err, req, res, next) => {
        if (isCelebrateError(err)) {
            let errorMsg = 'Validation Error!';

            const errorBody = err.details.get('body');
            if(errorBody) {
                errorMsg = errorBody.details[0].message;
            }
            
            const errorParam = err.details.get('params');
            if(errorParam) {
                errorMsg = errorParam.details[0].message;
            }

            const errorQuery = err.details.get('query');
            if (errorQuery) {
                errorMsg = errorQuery.details[0].message;
            }
            
            return res.status(400).json({
                data: null,
                success: false,
                message: errorMsg
            });
        }

        res.status(err.status || 500).json({
            data: null,
            success: false,
            message: err.message || 'Something went wrong!'
        });
    });
};