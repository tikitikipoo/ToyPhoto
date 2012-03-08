/**
 * ToyPhoto共有写真一覧クラス
 * 
 * @author tikitikipoo
 * @version 1.0
 * @lincense MIT License
 */
ToyPhoto.Gallery = (function(_super) {

    /**
     * 継承
     */
    __extends(Gallery, _super);

    /**
     * コンストラクタ
     */
    function Gallery() {

        // 親コンストラクタ呼び出し
        Gallery.__super__.constructor.apply(this, arguments);

        var that = this;

        /**
         * 表示ページ
         */
        that.page = 1;

        /**
         * 表示ページ
         */
        that.html = '';

        /**
         * 初期化メソッド
         */
        that.init = (function() {

            // 初期化
            ToyPhoto.App.collection.clearPublicList();
            that.wrapDiv  = document.getElementById('home_content');
            that.photoDiv = document.getElementById('home_tmpl')
                            .getElementsByTagName('div')[0];
            // イベント登録
            that.registPageEvent();
            that.updateDomEvent();
            that.updateContents();

        })();
    }

    /**
     * ページイベント登録
     */
    Gallery.prototype.registPageEvent = function() {

        var that = this;

        // ページが生成されたとき（domが準備できたとき）発火
        // タブバー、詳細画面から戻ってきた時も発火（画面表示時常に発火）
        $("#gallery").live("pagecreate", function(e){

            // 不要要素削除
            var home = document.getElementById("home_content");
            if (home) {
                home.parentNode.removeChild(home);
            }

            // 初期化
            that.wrapDiv = null, that.photoDiv = null;
            that.wrapDiv  = document.getElementById('gallery_content');
            that.photoDiv = document.getElementById('gallery_tmpl')
                            .getElementsByTagName('div')[0];

        });

        // 画面表示時常に発火
        $("#gallery").live("pagebeforeshow", function(e, data){

            // データベースから表示コンテンツ（HTML）取得
            ToyPhoto.App.dao.getContentByType(
                ToyPhoto.public_type,
                function(results) {
                if (!results.rows.length) {
                    ToyPhoto.App.collection.clearPublicList();
                    that.updateDomEvent();
                    that.updateContents();
                    return;
                }

                var item = results.rows.item(0),
                    updated = item.updated,
                    nowTime = new Date().getTime();

                
                that.updateDomEvent();
                if ((nowTime - updated) > ToyPhoto.time_threshold 
                    || !ToyPhoto.App.collection.getPublicListLength()
                    || that.page == 1) {
                    ToyPhoto.App.collection.clearPublicList();
                    that.page = 1;
                    that.updateContents();
                } else {
                    $("#gallery_content").html(item.content);
                }
            });
        });


        // 画面離脱時HTMLをデータベースに保存
        $("#gallery").live("pagebeforehide", function(e, data){
            ToyPhoto.App.dao.saveContentByType(
                ToyPhoto.public_type,
                $("#gallery_content").html());
        });
        
        // 詳細画面に遷移すると、domイベントが外れるので再設定する
        $("#home").live("pagebeforeshow", function(e, data){
            that.updateDomEvent();
        });

        // 画面離脱時HTMLをデータベースに保存
        $("#home").live("pagebeforehide", function(e, data){
            ToyPhoto.App.dao.saveContentByType(
                ToyPhoto.public_type,
                $("#home_content").html());
        });
    };

    /**
     * dom要素にイベントを登録
     */
    Gallery.prototype.updateDomEvent = function() {
        var that = this;

        var domName = (document.getElementById("gallery_content"))
                    ? "gallery_content"
                    : "home_content";

        that.autoLoader("#" + domName , function(autoLoadCallback) {

            // 表示最後尾のIDを取得
            var len = ToyPhoto.App.collection.getPublicListLength(),
                id = len ? ToyPhoto.App.collection.getPublic(0).id
                         : 0;

            // 自サーバーから自分が投稿した画像取得
            ToyPhoto.App.myserver.getPublicList(
                {"page":++that.page, 
                 "id": id },
                function(data) {
                    if (data.result == true) {
                        that.getListCallback(data, "gallery");
                    } else if (data.limit == true) {
                        that.autoLoad = false;
                    }
                    autoLoadCallback();
                }
            );
        });
        
        // リロード
        $('#home-reload-btn, #gallery-reload-btn').unbind("click")
                                                  .click(function(e) {

            // 取得ページを1に戻す
            that.page = 1;
            that.updateContents(true);
        });
    };


    /**
     * コンテンツ更新
     */
    Gallery.prototype.updateContents = function(reload) {
        var that = this;

        // アクティビティインディケーター表示
        if (navigator && navigator.notificationEx)
        navigator.notificationEx.activityStart();

        ToyPhoto.App.myserver.getPublicList(
            {"page":that.page, 
             "id": 0 },
            function(data){
                that.getListCallback(data, "gallery", reload);

                // アクティビティインディケーター非表示
                if (navigator && navigator.notificationEx)
                navigator.notificationEx.activityStop();
            }
        );
    };

    return Gallery;

})(ToyPhoto.List);
