/**
 * ToyPhoto共有写真詳細クラス
 * 
 * @author tikitikipoo
 * @version 1.0
 * @lincense MIT Licence
 */
ToyPhoto.GalleryDetail = (function(_super) {

    /**
     * 継承
     */
    __extends(GalleryDetail, _super);

    /**
     * コンストラクタ
     */
    function GalleryDetail() {

        // 親コンストラクタ呼び出し
        GalleryDetail.__super__.constructor.apply(this, arguments);

        var that = this;

        /**
         * 画像詳細データ(pulibc)
         */
        that.imageData = null;

        /**
         * 画像表示データ（dom）
         */
        that.imageDom = null;

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
    GalleryDetail.prototype.registPageEvent = function() {
        var that = this;

        // 詳細ページが生成されたとき（domが準備できたとき）発火
        $("#gallery-detail").live("pagecreate", function(e){

            // イベント、コンテンツ更新
            that.updateDomEvent(this);
            that.updateContents();

        });

    };

    /**
     * コンテンツ更新
     */
    GalleryDetail.prototype.updateContents = function() {

        var that = this;

        var imageTarget = document.getElementById("gallery-detail-content");

        ToyPhoto.Util.resizeDetail(that.imageDom);
        imageTarget.appendChild(that.imageDom);

    };

    /**
     * dom要素にイベントを登録
     *
     * @param dom HTMLテキスト
     */
    GalleryDetail.prototype.updateDomEvent = function(dom) {

        var that = this;

        $('#gallery-detail-act-btn').unbind("click").click(function(e) {

            if (!PhoneGap.available)
                return;

            // アクションシート生成
            var sheet = window.plugins.nativeControls.createActionSheet(
                ['Add favorite', 'cancel'], 
                '',
                '1'
            );

            // アクションシート選択時発火関数
            sheet.onActionSheetDismissed = function(index) {

                if (index === 0) {
                    // お気に入り追加
                    var postData= {
                        'data[Favorite][picture_id]': that.imageData.id,
                        'data[Favorite][twitter_id]': ToyPhoto.App.twitter.getTwitterId(),
                    };
                    ToyPhoto.App.myserver.addFavorite(postData,
                    function(data) {
                        if (data.result == true) {
                            navigator.notification.alert("Add favorite",
                                null,
                                "Result");
                        } else if (data.result == false 
                                && data.unique == false) {
                                navigator.notification.alert("You've already added favorite");
                        } else {
                            navigator.notification.alert("Sorry, unsuccessful, please try agein.");
                        }
                    });
                }
            };
        });
    };

    /**
     * ページ生成時実行
     *
     * 設計上、Ajaxで取得して詳細画面を表示しているため、
     * アプリ起動時のdom操作はできない。
     * そのためjQueryMobileのpagebeforechangeイベントが発火したとき
     * domに対して初期化処理をしている
     */
    GalleryDetail.prototype.run = function( urlObj, options ) {
        var that  = this,
            hash  = urlObj.hash || urlObj.filename + urlObj.search,
            query = urlObj.search,
            id    = query.split("&")[0].split("=")[1],
            tmp   = null;

        // ギャラリー一覧から遷移

        // 画像取得
        tmp = document.getElementById("gallery_content") ||
                document.getElementById("home_content");
        tmp = tmp.getElementsByClassName("data-detail-id"+id)[0];
        that.imageDom = tmp.cloneNode(true);

        // 該当データ取得
        that.imageData = ToyPhoto.App.collection.getPublic(id);

    };

    return GalleryDetail;

})(ToyPhoto.Detail);
