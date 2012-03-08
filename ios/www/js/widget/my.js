/**
 * ToyPhoto設定画面クラス
 * 
 * @author tikitikipoo
 * @version 1.0
 * @lincense MIT
 */
ToyPhoto.My = (function(_super) {

    /**
     * 継承
     */
    __extends(My, _super);

    /**
     * コンストラクタ
     */
    function My() {
        
        // 親コンストラクタ呼び出し
        My.__super__.constructor.apply(this, arguments);

        var that = this;

        /**
         * 表示ページ
         */
        that.page = 1;

        /**
         * 初期化メソッド
         */
        that.init = (function() {

            // イベント登録
            that.registPageEvent();

        })();

    }


    /**
     * ページイベント登録
     */
    My.prototype.registPageEvent = function() {
        var that = this;

        // ページが生成されたとき（domが準備できたとき）発火
        $("#my").live("pagecreate", function(e){
        
            // 初期化
            that.wrapDiv  = document.getElementById('my_content');
            that.photoDiv = document.getElementById('my_tmpl')
                            .getElementsByTagName('div')[0];

        });

        // 画面表示時常に発火
        $("#my").live("pagebeforeshow", function(e, data){

            // データベースから表示コンテンツ（HTML）取得
            ToyPhoto.App.dao.getContentByType(ToyPhoto.my_type,
            function(results) {
                if (!results.rows.length) {
                    ToyPhoto.App.collection.clearMyList();
                    that.updateDomEvent();
                    that.updateContents();
                    return;
                }

                var item = results.rows.item(0),
                    updated = item.updated,
                    nowTime = new Date().getTime();

                if ((nowTime - updated) > ToyPhoto.time_threshold
                    || !ToyPhoto.App.collection.getMyListLength()
                    || that.page == 1 ) {

                    ToyPhoto.App.collection.clearMyList();
                    that.page = 1;
                    that.updateContents();

                } else {

                    $("#my_content").html(results.rows.item(0).content);
                    // 詳細画面で削除した場合、該当するdomを削除する
                    if (ToyPhoto.MyDetail.delFlg) {

                        var node = document.getElementById("my");
                        node= node.getElementsByClassName("data-detail-id"+ToyPhoto.MyDetail.index)[0];
                        node = node.parentNode.parentNode;
                        node.parentNode.removeChild(node);
                        ToyPhoto.MyDetail.delFlg = false;
                    }

                }
                that.updateDomEvent();
            });
        });


        // 画面離脱時HTMLをデータベースに保存
        $("#my").live("pagebeforehide", function(e, data){
            ToyPhoto.App.dao.saveContentByType(
                ToyPhoto.my_type,
                $("#my_content").html());
        });
    };


    /**
     * dom要素にイベントを登録
     */
    My.prototype.updateDomEvent = function() {
        var that = this;

        that.autoLoad = false;
        that.autoLoader("#my_content", function(autoLoadCallback) {
            // 自サーバーから自分が投稿した画像取得
            ToyPhoto.App.myserver.getMyList(
                ++that.page,
                function(data) {
                    if (data.result == true) {
                        that.getListCallback(data, "my");
                    } else if (data.limit == true) {
                        that.autoLoad = false;
                    }
                    autoLoadCallback();
                }
            );
        });

        // リロード
        $('#my-reload-btn').unbind("click")
                                 .click(function(e) {

            // 取得ページを1に戻す
            that.page = 1;
            that.updateContents(true);
        });
    };

    /**
     * コンテンツ更新
     */
    My.prototype.updateContents = function(reload) {
        var that = this;

        // アクティビティインディケーター表示
        if (navigator && navigator.notificationEx)
        navigator.notificationEx.activityStart();

        // 自サーバーから自分が投稿した画像取得
        ToyPhoto.App.myserver.getMyList(
            that.page, 
            function(data) {
                that.getListCallback(data, "my", reload);

                // アクティビティインディケーター非表示
                if (navigator && navigator.notificationEx)
                navigator.notificationEx.activityStop();
            }
        );
    };

    return My;

})(ToyPhoto.List);
