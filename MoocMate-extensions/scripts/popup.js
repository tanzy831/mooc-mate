chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        // sendResponse({data: "123"});
        chrome.tabs.captureVisibleTab(null, {

         format : "png",

         quality : 100

     }, function(data) {

         console.log(data)
        //  sendResponse({data: "123"})

     });

    }
);

chrome.storage.sync.get(["logined", "username"],
    function(data){
        // success
        if (data.logined) {
            $(".profile").show();
            // $(".cont").show();
            $(".profile .username").text(data.username);
        } else {
            $(".cont").show();
        }
    }
);

$("#login-btn").on('click', function() {
    var usr = $("#user").val().trim();
    var pw = $("#pw").val().trim();
    console.log(usr, pw);

    Utils.requestPOST({
        url: api.login,
        data: {
            username: usr,
            password: pw
        }
    })
    .then(function(ret) {
        var msg = ret.msg;
        console.log(ret);
        if (msg === "success") {
            $(".cont").hide();
            $(".profile").show();
            chrome.storage.sync.set({"logined": true, "username": usr},
                function(){
                    console.log("保存完毕");
                }
            );
        } else {
            // alert("Please check your username and password");
        }
    });

});

$("#reg-btn").on('click', function() {
    console.log('login reg');
});

$(".shot-btn").on('click', function() {
    chrome.tabs.captureVisibleTab(null, {

     format : "png",

     quality : 100

    }, function(data) {

     console.log(data)

     chrome.tabs.query({}, function(tabs) {
         for (var i = 0; i < tabs.length; i++) {
             var obj = tabs[i];
             var url = obj.url;
             if (url.indexOf("xuetangx") > 0  || url.indexOf("coursera") > 0) {
                    console.log(url);
                    console.log(obj.id);
                    chrome.tabs.sendRequest(obj.id, {data: data},function(res) {
                        console.log(res);
                    });
             }
         }
     })

    });
});
