/**
 * ToyPhotoお気に入り画面
 * 
 * @author tikitikipoo
 * @version 1.0
 * @lincense MIT License
 */
ToyPhoto.Favorite = (function(_super) {

    /**
     * 継承
     */
    __extends(Favorite, _super);

    /**
     * コンストラクタ
     */
    function Favorite() {

        // 親コンストラクタ呼び出し
        Favorite.__super__.constructor.apply(this, arguments);

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
            ToyPhoto.App.collection.clearFavoriteList();

            // イベント登録
            that.registPageEvent();

        })();

    }


    /**
     * ページイベント登録
     */
    Favorite.prototype.registPageEvent = function() {
        var that = this;

        // ページが生成されたとき（domが準備できたとき）発火
        // タブバー、詳細画面から戻ってきた時も発火（画面表示時常に発火）
        $("#favorite").live("pagecreate", function(e){
        
            // 初期化
            that.wrapDiv  = document.getElementById('favorite_content');
            that.photoDiv = document.getElementById('favorite_tmpl')
                            .getElementsByTagName('div')[0];

        });

        // 画面表示時常に発火
        $("#favorite").live("pagebeforeshow", function(e, data){

            // データベースから表示コンテンツ（HTML）取得
            ToyPhoto.App.dao.getContentByType(ToyPhoto.favorite_type,
            function(results) {
                if (!results.rows.length) {
                    ToyPhoto.App.collection.clearFavoriteList();
                    that.updateDomEvent();
                    that.updateContents();
                    return;
                }

                var item = results.rows.item(0),
                    updated = item.updated,
                    nowTime = new Date().getTime();

                if ((nowTime - updated) > ToyPhoto.time_threshold
                    || !ToyPhoto.App.collection.getFavoriteListLength()
                    || that.page == 1 ) {
                    ToyPhoto.App.collection.clearFavoriteList();
                    that.page = 1;
                    that.updateContents();
                } else {
                    $("#favorite_content").html(results.rows.item(0).content);
                    // 詳細画面で削除した場合、該当するdomを削除する
                    if (ToyPhoto.FavoriteDetail.delFlg) {

                        var node = document.getElementById("favorite");
                        node= node.getElementsByClassName("data-detail-id"+ToyPhoto.MyDetail.index)[0];
                        node = node.parentNode.parentNode;
                        node.parentNode.removeChild(node);
                        ToyPhoto.FavoriteDetail.delFlg = false;
                    }
                }
                that.updateDomEvent();
            });
        });


        // 画面離脱時HTMLをデータベースに保存
        $("#favorite").live("pagebeforehide", function(e, data){
            ToyPhoto.App.dao.saveContentByType(
                ToyPhoto.favorite_type,
                $("#favorite_content").html());
        });
    };


    /**
     * dom要素にイベントを登録
     */
    Favorite.prototype.updateDomEvent = function() {
        var that = this;

        that.autoLoader("#favorite_content", function(autoLoadCallback) {
            // 自サーバーから自分が投稿した画像取得
            ToyPhoto.App.myserver.getFavoriteList(
                ++that.page,
                function(data) {
                    if (data.result == true) {
                        that.getListCallback(data, "favorite");
                    } else if (data.limit == true) {
                        that.autoLoad = false;
                    }
                    autoLoadCallback();
                }
            );
        });
        
        // リロード
        $('#favorite-reload-btn').unbind("click")
                                 .click(function(e) {

            // 取得ページを1に戻す
            that.page = 1;
            that.updateContents(true);
        });
    };

    /**
     * コンテンツ更新
     */
    Favorite.prototype.updateContents = function(reload) {
        var that = this;

        // アクティビティインディケーター表示
        if (navigator && navigator.notificationEx)
        navigator.notificationEx.activityStart();

        // 自サーバーからお気に入り画像取得
        ToyPhoto.App.myserver.getFavoriteList(
            that.page, 
            function(data) {
                that.getListCallback(data, "favorite", reload);

                // アクティビティインディケーター非表示
                if (navigator && navigator.notificationEx)
                navigator.notificationEx.activityStop();
            }
        );
    };


    /**
     * ページ生成時実行
     *
     * 設計上、Ajaxで取得して詳細画面を表示しているため、
     * アプリ起動時のdom操作はできない。
     * そのためjQueryMobileのpagebeforechangeイベントが発火したとき
     * domに対して初期化処理をしている
     */
    Favorite.prototype.run = function( urlObj, options ) {
        var that  = this;
    };

    return Favorite;

})(ToyPhoto.List);
