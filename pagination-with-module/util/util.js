sap.ui.define(function(){

const getProductData = (url, onSuccess, context) => {
    return $.ajax({
        type: "GET",
        url: url,
        async: true,
        success: onSuccess.bind(context)
    });
};

return {getProductData};


});