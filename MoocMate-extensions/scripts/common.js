var root = "http://10.209.202.9:8080"
var api = {
    login: root + "/api/login",
    create: root + "/api/video/add",
    fetch: root + "/api/video/get",
    star: root + "/api/video/star",
}
var log = function(msg) {
    console.log(msg);
}

// Utils
var Utils = (function() {
    return {
        trim: function(str){
            return str.replace(/(^\s*)|(\s*$)/g,"");
        },
        urlParser: function(url) {
            console.log(url);
        },
        /** url, data **/
        requestGET: function(params) {
            return new Promise(function(res, rej) {
                $.ajax({
                    url: params.url,
                    dataType: "json",   // ret tpye
                    async: true,
                    data: params.data || {},
                    type: "GET",   //请求方式
                    success: function( ret ) {
                        res( ret );
                    },
                    error: function( err ) {
                        rej( err );
                    }
                });
            });
        },
        /** url, data **/
        requestPOST: function(params) {
            return new Promise(function(res, rej) {
                $.ajax({
                    url: params.url,
                    dataType: "json",   // ret tpye
                    async: true,
                    data: params.data || {},
                    type: "POST",   //请求方式
                    success: function( ret ) {
                        res( ret );
                    },
                    error: function( err ) {
                        rej( err );
                    }
                });
            });
        },

        screenShot: function(__player) {
            var canvas = document.createElement("canvas");
            var scale = 0.5;
            canvas.width = __player.videoWidth * scale;
            canvas.height = __player.videoHeight * scale;
            canvas.getContext('2d')
               .drawImage(__player, 0, 0, canvas.width, canvas.height);
            var img = document.createElement("img");
            img.crossOrigin = "Anonymous";
            img.crossOrigin = "*";
            img.src = canvas.toDataURL("image/png");
            $("body").append(img)
            // console.log( img );
        }

    }
})();
