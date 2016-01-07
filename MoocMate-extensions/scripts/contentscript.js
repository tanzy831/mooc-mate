console.log('notes ready');

var imgList = [];
chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
    var bdata = request.data;
    var img = document.createElement("img");
    img.style.width = "100px";
    img.src = bdata;
    img.onclick = function() {
        window.open(bdata);
    }
    imgList.push(img);
});

var Mooc = {
    xtzx: {
        getCourseTitle: function() {
            var title = "";
            var fullTitle = $(".global.slim h2").text().trim();
            var dept = $(".global.slim h2").children().text().trim();
            title = dept;
            title += $.trim( fullTitle.replace(dept, "") );
            return title || "获取课程名称失败";
        },

        getChapterTitle: function() {
            return Utils.trim( $(".xblock h2").text().trim() ) || "获取章节名称失败";
        },

        getOriginVideoPlayer: function() {
            return new Promise(function(res, rej) {
                setTimeout( function() {
                    res( $(".xt_video_player_wrap video")[0] );
                }, 0);
            });
        }

    },
    coursera: {}
}

var user = "";
var cur_url = window.location.href;
var cur_time = 0;
var Player;
var noteData;

// Site map
var siteMap = {
    "www.xuetangx.com": "学堂在线",
    "www.coursera.org": "Coursera",
};
var cur_domain = document.domain;
var cur_site_name = siteMap[cur_domain];

if ( cur_domain in siteMap ) {

    // Switch website process
    var state = Mooc.xtzx;

    chrome.storage.sync.get(["logined", "username"],
        function(data) {
            // Logined already
            if (data.logined)
            {
                user = data.username;
                console.log(user, "logined success");

                    toastr.options = {
                      "closeButton": true,
                      "debug": false,
                      "positionClass": "toast-bottom-left",
                      "showDuration": "300",
                      "hideDuration": "3000",
                      "timeOut": "8000",
                      "onclick": function() {
                            return false;
                      },
                      "extendedTimeOut": "8000",
                      "showEasing": "swing",
                      "hideEasing": "linear",
                      "showMethod": "fadeIn",
                      "hideMethod": "fadeOut"
                    }

                    function loadAssets() {
                        var css_url = chrome.extension.getURL("styles/semantic.css");
                        var js_url  = chrome.extension.getURL("scripts/vendor/semantic.js");
                        var jq_url  = chrome.extension.getURL("scripts/vendor/jquery.js");
                        var __css = $('<link rel="stylesheet" type="text/css" href="'+css_url+'">');
                        var __facss = $('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">');
                        var __js = $('<script src="'+js_url+'"></script>');
                        var __jq = $('<script src="'+jq_url+'"></script>');
                        $("body").append(__css);
                        $("body").append(__jq);
                        $("body").append(__js);
                        $("body").append(__facss);

                        // Fix toastr container
                        var __toastr_cont = $('<style> #toast-container { bottom: 50px; } \
                                                .toast {padding-left:10px !important;}\
                                                .toast-success, .toast-warning { background-color:rgba(255,255,255,0.9) !important; border: 1px solid #ccc; } \
                                                .toast-warning { border: 2px solid #a40035 !important; } \
                                                .toast-close-button {color:#000;} \
                                                .toast-success .toast-title { color: #4f20b5; }\
                                                .toast-success .toast-message,.toast-warning .toast-message { color: #000; overflow:hidden; text-overflow:ellipsis; white-space: nowrap; }\
                                                .toast-warning .toast-title { color:#a40035; font-size: 15px; }</style>');
                        $("body").append(__toastr_cont);

                        var vendor = $('<div class="ex-vender"></div>');
                        $("body").append(vendor);

                        var __edite_btn = $('<button class="ui violet button moocmate-edit-btn" style="position:fixed;bottom:10px;left:10px;"><i class="fa fa-pencil-square-o"></i></button>');
                        vendor.append(__edite_btn);

                        var prev_state;
                        $(".moocmate-edit-btn").on('click', function() {
                            prev_state = Player.paused;
                            if (!prev_state) {
                                Player.pause();
                            }


                            // $("body").append($('<script>  var c = $("canvas")[0]; console.log(c.toDataURL()) </script>'));

                            var __modal_html_str = '<style type="text/css"> \
                                                        .mooc-mate-wrap {\
                                                            position: fixed;\
                                                            top: 0;\
                                                            left: 0;\
                                                            background: rgba(0,0,0,0.7);\
                                                            height: 100%;\
                                                            width: 100%;\
                                                            margin: 0 auto;\
                                                            z-index: 99999999999;\
                                                        }\
                                                        .container .card {\
                                                          width: 600px;\
                                                      }\
                                                        .ui.cards > .card, .ui.card {\
                                                          width: 600px;\
                                                      }\
                                                      .ui.card .content {width: 100%}\
                                                        .extra.content button {\
                                                          width: 100%;\
                                                      }\
                                                        .mooc-mate-wrap .mymodal {\
                                                            width: 600px;\
                                                            padding: 10px;\
                                                            position: absolute;\
                                                            left: 50%;\
                                                            top: 50%;\
                                                            transform: translate(-50%, -50%);\
                                                        }\
                                                        .moocmate-close:hover { \
                                                            cursor:pointer;\
                                                        }\
                                                    </style>\
                                                    <div class="mooc-mate-wrap">\
                                                        <div class="mymodal">\
                                                          <div class="ui card">\
                                                            <div class="content">\
                                                              <div class="header" style="float:left;">Create New Note</div>\
                                                              <div style="display: inline-block; float:right;" class="moocmate-close">\
                                                                <i class="fa fa-times"></i>\
                                                              </div>\
                                                            </div>\
                                                            <div class="content">\
                                                                <form class="ui form">\
                                                            <div class="field">\
                                                              <label>Title</label>\
                                                              <input type="text" name="first-name" placeholder="Plase input title for notes" class="moocmate-notes-title">\
                                                            </div>\
                                                            <div class="field">\
                                                              <label>Content</label>\
                                                              <textarea class="moocmate-notes-desc"></textarea>\
                                                              <div class="shot" style="margin-top:10px;"></div>\
                                                            </div>\
                                                          </form>\
                                                            </div>\
                                                            <div class="extra content">\
                                                              <button class="ui purple button moocmate-submit-btn" type="submit" class>Submit</button>\
                                                            </div>\
                                                          </div>\
                                                        </div>\
                                                    </div>';

                            vendor.append($(__modal_html_str));

                            for (var i = 0; i < imgList.length; i++) {
                                $(".shot").append(imgList[i]);
                            }
                            $(".moocmate-close").on(
                                'click',
                                function() {
                                    $(".mooc-mate-wrap").fadeOut();
                                    if (!prev_state) {
                                        Player.play();
                                    }
                                });

                            $(".moocmate-submit-btn")
                                .on(
                                    'click',
                                    function() {
                                        var img = "";
                                        if (imgList.length >0) {
                                            img = imgList[0].src;
                                        }
                                        var title = $(".moocmate-notes-title").val().trim();
                                        var content = $(".moocmate-notes-desc").val().trim();
                                        Utils.requestPOST({
                                            url: api.create,
                                            data: {
                                                username: user,
                                                url: cur_url,
                                                title: title,
                                                site: cur_site_name,
                                                course: state.getCourseTitle(),
                                                chapter: state.getChapterTitle(),
                                                content: content,
                                                current_time: cur_time,
                                                img:  img,
                                                time: (new Date()).valueOf()
                                            }
                                        })
                                            .then( function(ret) {
                                                console.log(ret);
                                                $(".mooc-mate-wrap").fadeOut();

                                                if (!prev_state) {
                                                    Player.play();
                                                }
                                            });

                                    }
                                )
                        });

                    }

                    function FetchNotes() {
                        return new Promise(function(res, rej) {
                            return Utils.requestPOST({
                                url: api.fetch,
                                data: {
                                    username: user,
                                    url: cur_url
                                }
                            }).then(function(ret) {
                                res(ret);
                            });
                        });
                    }

                    var init = false;
                    function videoDigestCycle( _player ) {
                        setInterval(function() {
                            if ( !_player.paused ) {
                                cur_time = parseInt( _player.currentTime );
                                console.log(cur_time);
                                var curData = noteData[cur_time];
                                if (curData != undefined) {
                                    $.each(curData, function(k, v) {
                                        if (v.star > 5) {
                                            toastr.warning(v.id, v.star, v.content, v.title);
                                        } else {
                                            toastr.success(v.id, v.star, v.content, v.title);
                                        }
                                    })
                                    if (!init) {
                                        $("#toast-container").on('click', function(t) {
                                            var target = t.target;
                                            if (target.className == "toast-close-button") {
                                                $(target).parent(".toast").fadeOut();
                                                return;
                                            }
                                            if( target.className == "thumb-up fa fa-thumbs-o-up" ) {
                                                var nid = $(target).data("id");
                                                sendStarRequest(nid, target);
                                                return;
                                            }
                                            var note_id = $(target).data("id");
                                            openNoteSpec(note_id);
                                        })
                                        init = true;
                                    }
                                }

                            }
                        }, 1000);

                    }

                    function sendStarRequest(nid, target) {
                        Utils.requestPOST({
                            url: api.star,
                            data: {
                                username: user,
                                id: nid
                            }
                        }).then(function(ret) {
                            console.log(ret);
                            var ostar = $(target).text().trim();
                            var o = ostar.replace('(', "");
                            var k = o.replace(')', "");
                            $(target).text(" ("+(++k)+")")
                        })
                    }

                    function openNoteSpec(noteid) {
                        var cur_note;

                        for (var k in noteData) {
                            if (noteData.hasOwnProperty(k)) {
                                var thisNotes = noteData[k];
                                for (var i = 0; i < thisNotes.length; i++) {
                                    if (thisNotes[i].id == noteid) {
                                        cur_note = thisNotes[i];
                                    }
                                }
                            }
                        }


                        /////////////////////////
                            var vendor = $(".ex-vender");
                            var read_prev_state = false;
                            read_prev_state = Player.paused;
                            if (!read_prev_state) {
                                Player.pause();
                            }

                            var __modal_html_str = '<style type="text/css"> \
                                                        .mooc-mate-wrap {\
                                                            position: fixed;\
                                                            top: 0;\
                                                            left: 0;\
                                                            background: rgba(0,0,0,0.7);\
                                                            height: 100%;\
                                                            width: 100%;\
                                                            margin: 0 auto;\
                                                            z-index: 99999999999;\
                                                        }\
                                                        .container .card {\
                                                          width: 600px;\
                                                      }\
                                                        .ui.cards > .card, .ui.card {\
                                                          width: 600px;\
                                                      }\
                                                      .ui.card .content {width: 100%}\
                                                        .extra.content button {\
                                                          width: 100%;\
                                                      }\
                                                        .mooc-mate-wrap .mymodal {\
                                                            width: 600px;\
                                                            padding: 10px;\
                                                            position: absolute;\
                                                            left: 50%;\
                                                            top: 50%;\
                                                            transform: translate(-50%, -50%);\
                                                        }\
                                                        .moocmate-close:hover { \
                                                            cursor:pointer;\
                                                        }\
                                                    </style>\
                                                    <div class="mooc-mate-wrap">\
                                                        <div class="mymodal">\
                                                          <div class="ui card">\
                                                            <div class="content">\
                                                              <div class="header" style="float:left;">Read A Note</div>\
                                                              <div style="display: inline-block; float:right;" class="moocmate-close">\
                                                                <i class="fa fa-times"></i>\
                                                              </div>\
                                                            </div>\
                                                            <div class="content">\
                                                                <form class="ui form">\
                                                            <div class="field">\
                                                              <h3>Title:</h3>\
                                                              <span>'+ cur_note.title +'</span>\
                                                            </div>\
                                                            <div class="field">\
                                                              <h3>Content:</h3>\
                                                              <div style="height:180px;width: 100%; overflow: auto;">'+ cur_note.content +'</div>\
                                                              <div class="shot" style="margin-top:10px;"> \
                                                                <a href="'+cur_note.img+'" target="_blank">\
                                                                  <img src="'+cur_note.img+'"/>\
                                                                 </a>\
                                                              </div>\
                                                            </div>\
                                                          </form>\
                                                            </div>\
                                                          </div>\
                                                        </div>\
                                                    </div>';

                            vendor.append($(__modal_html_str));

                            $(".moocmate-close").on(
                                'click',
                                function() {
                                    $(".mooc-mate-wrap").fadeOut();
                                    if (!read_prev_state) {
                                        Player.play();
                                    }
                                });

                            $(".moocmate-submit-btn")
                                .on(
                                    'click',
                                    function() {
                                        var title = $(".moocmate-notes-title").val().trim();
                                        var content = $(".moocmate-notes-desc").val().trim();
                                        Utils.requestPOST({
                                            url: api.create,
                                            data: {
                                                username: user,
                                                url: cur_url,
                                                title: title,
                                                site: cur_site_name,
                                                course: state.getCourseTitle(),
                                                chapter: state.getChapterTitle(),
                                                content: content,
                                                current_time: cur_time,
                                                time: (new Date()).valueOf()
                                            }
                                        })
                                            .then( function(ret) {
                                                console.log(ret);
                                                $(".mooc-mate-wrap").fadeOut();

                                                if (!read_prev_state) {
                                                    Player.play();
                                                }
                                            });

                                    }
                                )


                            ///////////////////////////////


                    }

                    // Global origin url

                    Utils.urlParser(cur_url);

                    log(Mooc.xtzx.getCourseTitle())
                    log(Mooc.xtzx.getChapterTitle())

                    loadAssets();

                    Mooc.xtzx.getOriginVideoPlayer().then(function( _player ) {
                                    Player = _player;

                                    FetchNotes()
                                        .then(
                                            function( notes ) {
                                                noteData = notes.data;
                                                console.log(noteData);
                                                videoDigestCycle(_player);
                                            }
                                        );
                                });


            }
            // Not logined
            else
            {

            }
        }
    );

} /* Not mooc end */
