/**
 * ToyPhoto写真投稿画面クラス
 * 
 * @author tikitikipoo
 * @version 1.0
 * @lincense MIT License
 */
ToyPhoto.Action = (function() {

    /**
     * コンストラクタ
     */
    function Action() {

        var that = this;

        /**
         * ios用タブバー、ツールバー、
         * アクションシートを管理
         */
        that.nativeControls = null;

        /**
         * 投稿写真格納変数
         */
        that.file = null;

        /**
         * Twitpic
         */
        that.twitpic = null;

        /**
         * 初期化メソッド
         */
        that.init = (function() {

            // イベント登録
            that.registPageEvent();

            // twitpicインスタンス生成
            that.twitpic = new Twitpic();

            // アクションシートを利用するため保持
            that.nativeControls = window.plugins.nativeControls;

        })();

    }

    /**
     * ページイベント登録
     */
    Action.prototype.registPageEvent = function() {
        var that = this;

        // 詳細ページが生成されたとき（domが準備できたとき）発火
        $("#action").live("pagecreate", function(e){

            // 初期化
            that.file = null;
        
            that.updateDomEvent();
            that.updateContents();

        });
    };

    /**
     * dom要素にイベントを登録
     */
    Action.prototype.updateDomEvent = function() {
        var that = this,
            smallImage = document.getElementById('small-image'),
            postOnFlg  = false;

        // 投稿（アップロード）確認
        $('#post-btn').unbind("click").click(function(e) {

            if (postOnFlg)
                return;

            if (!PhoneGap.available)
                return;

            // 投稿写真存在チェック
            if(!that.file) {
                navigator.notification.alert("Please choose photo.");
                return;
            }

            // tweet可否判断
            if( tweetFlg() === true ) {

                // 文字制限チェック
                var isOver;
                if( (isOver = textCount()) === true ) {
                    navigator.notification.alert("Tweet text over.");
                    return;
                }
            }

            // アクションシート生成
            var sheet = that.nativeControls.createActionSheet(
                ['Really POST?', 'cancel'], 
                '',
                1
            );

            // アクションシート選択時発火関数
            sheet.onActionSheetDismissed = function(index) {

                // 二度押し防止
                postOnFlg = true;


                if (index === 0) {
                    // 確認後投稿

                    // アクティビティインディケーター表示
                    navigator.notificationEx.activityStart();

                    // 文字列取得
                    var tweetText = tweetFlg() === true
                                  ? document.getElementById("tweettextarea").value.trim()
                                  : undefined;

                    // twitpic アップロード
                    that.twitpic.upload(that.file, tweetText, function(data) {

                        postOnFlg = false;

                        if(data === false) {
                            navigator.notification.alert("Fail. Some thing went wrong. if you continue this matter, please logout and try once more.");
                            return;
                        }

                        // 自サーバー登録
                        var postData = {
                            'data[Picture][twitpic_id]' : data.id,
                            'data[Picture][twitter_id]' : data.user.id,
                            'data[Picture][screen_name]': data.user.screen_name,
                            'data[Picture][text]'       : data.text,
                            'data[Picture][url]'        : data.url,
                            'data[Picture][width]'      : data.width,
                            'data[Picture][height]'     : data.height,
                            'data[Picture][size]'       : data.size,
                            'data[Picture][type]'       : data.type,
                        };

                        // 自サーバー送信
                        ToyPhoto.App.myserver.addPublic(postData, function(myData) {
                            if (myData.result == true) {
                                navigator.notification.alert("Upload Success",
                                    null,
                                    "Result");
                            } else if (myData.result == false 
                                && myData.unique == false) {
                                navigator.notification.alert("Upload Success",
                                    null,
                                    "Result");
                            } else {
                                navigator.notification.alert("Upload Fail");
                            }
                        });
                    
                        // tweet可否判断
                        if( tweetFlg() === true ) {

                            tweetText = data.url + ' ' +  tweetText;

                            // 投稿
                            ToyPhoto.App.twitter.status_update(tweetText);
                        }

                        // アクティビティインディケーター非表示
                        navigator.notificationEx.activityStop();
                    });

                } else if (index === 1) {
                    // 確認後キャンセル
                }
            };
        });

        /** 投稿（アップロード）の確認をダイアログで出力する場合に使用していた*/
        /** 確認ダイアログの出力がタブバーより背面で出力されていたため止める
        // ポスト確認
        $('#confirm-tweet').unbind("click").live("click", function(e) {

            alert("confirm twee2");
        });
        */

        // アクションシート表示
        $('#small-image').unbind("click").click(function(e) {

            if (!PhoneGap.available)
                return;

            // アクションシート生成
            var sheet = that.nativeControls.createActionSheet(
                ['Choose From Library', 'Take New Photo', 'cancel'], 
                '',
                2
            );

            // アクションシート選択時発火関数
            sheet.onActionSheetDismissed = function(index) {

                if (index === 0) {
                    // フォトライブラリ起動
                    
                    $.mobile.showPageLoadingMsg();

                    navigator.camera.getPicture(function(data) {
                        
                        $.mobile.hidePageLoadingMsg();

                        smallImage.style.display = 'block';
                        smallImage.src = "data:image/jpeg;base64," + data;

                        // 写真データ保持
                        that.file = "data:image/jpeg;base64," + data;


                    }, function(cameraError) {
                        $.mobile.hidePageLoadingMsg();
                    }, { quality: 50, 
                        destinationType: Camera.DestinationType.DATA_URL,
                        sourceType : Camera.PictureSourceType.PHOTOLIBRARY, 
                    });

                } else if (index === 1) {
                    // カメラ起動
                    
                    navigator.camera.getPicture(function(data) {
                        
                        smallImage.style.display = 'block';
                        smallImage.src = "data:image/jpeg;base64," + data;

                        // 写真データ保持
                        that.file = "data:image/jpeg;base64," + data;

                    }, function(cameraError) {
                    }, { quality: 50, 
                        destinationType: Camera.DestinationType.DATA_URL,
                        sourceType : Camera.PictureSourceType.CAMERA, 
                    });
                }
            };
        });


        // @TODO 後で消す デバッグ用
        $('#fileselect').change(function(e) {
            var files = e.target.files || e.dataTransfer.files;

            that.file = files[0];
        });

        // @TODO 後で消す デバッグ用
        $('#twitpic-upload-debug').click(function(e) {

            // 画像ファイルチェック
            if (that.file) {

                // twitpic アップロード
                that.twitpic.upload(that.file, function(data) {

                    if(data === false) {
                        navigator.notification.alert("Fail. Some thing went wrong. if you continue this matter, please logout and try once more.");
                        return;
                    }

                    // 自サーバー登録
                    data = {
                        'data[Picture][twitpic_id]' : data.id,
                        'data[Picture][twitter_id]' : data.user.id,
                        'data[Picture][screen_name]': data.user.screen_name,
                        'data[Picture][text]'       : data.text,
                        'data[Picture][url]'        : data.url,
                        'data[Picture][width]'      : data.width,
                        'data[Picture][height]'     : data.height,
                        'data[Picture][size]'       : data.size,
                        'data[Picture][type]'       : data.type,
                    };

                    // 自サーバー送信
                    ToyPhoto.App.myserver.addPublic(data, function(data) {
                        if (data.result == true) {
                            navigator.notification.alert("Upload Success");
                        } else if (data.result == false 
                            && data.unique == false) {
                            navigator.notification.alert("Upload Success");
                        } else {
                            navigator.notification.alert("Upload Fail");
                        }
                    });

                    // tweet可否判断
                    if( document.getElementById("tweet-flg").selectedIndex === 1) {
                        // 文字列取得
                        var tweetText = document.getElementById("tweettextarea")
                                    .value.trim();
                        tweetText = data.url + " " + tweetText;

                        // 投稿
                        ToyPhoto.App.twitter.status_update(tweetText);
                    }


                    // 自サーバーに登録


                });
            }
        });

        var _picture_id = 1;

        // @TODO 後で消す デバッグ用
        $('#tweet').click(function(e) {

            // アクセストークン取得
            var access_token = ToyPhoto.App.myserver.getAccessToken();

            var data = null;

            // Picture add
            /*
            data = {
                'data[Picture][twitpic_id]': "8en5am",
                'data[Picture][twitter_id]': ToyPhoto.App.twitter.getTwitterId
                (),
                'data[Picture][screen_name]': "hyjujujuo",
                'data[Picture][text]': "あいうえお",
                'data[Picture][url]': "http://twitpic.com/8en5am",
                'data[Picture][width]': "150",
                'data[Picture][height]': "320",
                'data[Picture][size]': "6067",
                'data[Picture][type]': "png",
                'data[Picture][access_token]': access_token,
            };

            ToyPhoto.App.myserver.addPublic(data);
            */

            // Favorite add
            /*
            data = {
                "data[Favorite][picture_id]": "19873",
                "data[Favorite][twitter_id]": ToyPhoto.App.twitter.getTwitterId(),
                'data[Favorite][access_token]': access_token,
            };

            ToyPhoto.App.myserver.addFavorite(data);
            */
            
            // Favorite delete
            /*
            ToyPhoto.App.myserver.deleteFavorite(15);
            */

            // Favorite List
            /*
            ToyPhoto.App.myserver.getFavoriteList(1);
            */

            // My List
            /*
            ToyPhoto.App.myserver.getMyList(1);
            */

            /*
            var flg = document.getElementById("tweet-flg").selectedIndex;
            console.log(flg);
            var text = document.getElementById("tweet-flg").options[flg].text;
            console.log(text);
            */

            /*
            var tweetText = document.getElementById("tweettextarea").value;

            // tweet
            ToyPhoto.App.twitter.status_update(tweetText);
            */

        });

        // ツイートテキストをカウントするイベント登録
        $('#tweettextarea').unbind("change").bind("change", textCount);
        $('#tweettextarea').unbind("keyup").bind("keyup", textCount);
    };


    /**
     * コンテンツ更新
     */
    Action.prototype.updateContents = function() {
        var that = this;
    };


    // {{{ プライベートメソッド

    /**
     * ツイートのテキストをカウントする関数
     */
    var textCount = function() {

        // 
        var tweetText = document.getElementById("tweettextarea").value;
        var remaining = 110 - tweetText.length;
        var color = (remaining < 0) ? 'red' : 'green';
        document.getElementById("textcount").innerHTML = '<span style="color:' + color + ';">' 
            + remaining + '</span> chars left. Enter text:';

        return (remaining < 0)

    };

    /**
     * ツイートオンかどうか
     */
    var tweetFlg = function() { 
        return document.getElementById("tweet-flg").selectedIndex === 1;
    };

    // }}}
    return Action;

})();
