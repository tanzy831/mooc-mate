// chrome.extension.onRequest.addListener(
//     function(request, sender, sendResponse) {
//         // sendResponse({data: "123"});
//         chrome.tabs.captureVisibleTab(null, {
//
//          format : "png",
//
//          quality : 100
//
//      }, function(data) {
//
//          console.log(data)
//         //  sendResponse({data: "123"})
//
//      });
//
//     }
// );

// chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
//     if(request.greeting == "hello") {
//       sendResponse({farewell:"goodbye"});
//     //   chrome.extension.sendRequest({greeting: "hello"}, function(response) {
//     //     console.log(response);
//     //   });
//     }
// });
