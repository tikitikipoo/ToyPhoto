/**
 * ToyPhoto共有写真詳細クラス
 * 
 * @author tikitikipoo
 * @version 1.0
 * @lincense MIT Licence
 */
ToyPhoto.MyDetail = (function(_super) {

    /**
     * 継承
     */
    __extends(MyDetail, _super);

    /**
     * コンストラクタ
     */
    function MyDetail() {

        // 親コンストラクタ呼び出し
        MyDetail.__super__.constructor.apply(this, arguments);

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

    // {{{ static

    /**
     * 選択した画像のコレクションオブジェクトのキーを保持
     */
    MyDetail.index = null; 

    /**
     * 削除したか
     */
    MyDetail.delFlg = false;

    // }}}

    // {{{ public 

    /**
     * ページイベント登録
     */
    MyDetail.prototype.registPageEvent = function() {
        var that = this;

        // 詳細ページが生成されたとき（domが準備できたとき）発火
        $("#my-detail").live("pagecreate", function(e){

            // イベント、コンテンツ更新
            MyDetail.delFlg = false;
            that.updateDomEvent(this);
            that.updateContents();

        });

    };

    /**
     * コンテンツ更新
     */
    MyDetail.prototype.updateContents = function() {

        var that = this;

        var imageTarget = document.getElementById("my-detail-content");

        ToyPhoto.Util.resizeDetail(that.imageDom);
        imageTarget.appendChild(that.imageDom);

    };

    /**
     * dom要素にイベントを登録
     *
     * @param dom HTMLテキスト
     */
    MyDetail.prototype.updateDomEvent = function(dom) {

        var that = this;

        // 削除処理
        $('#my-detail-act-btn').unbind("click").click(function(e) {

            if (!PhoneGap.available)
                return;

            // アクションシート生成
            var sheet = window.plugins.nativeControls.createActionSheet(
                ['Delete this photo?', 'cancel'], 
                '',
                '1',
                '0'
            );

            // アクションシート選択時発火関数
            sheet.onActionSheetDismissed = function(index) {

                if (index === 0) {
                    // 確認後投稿
                    ToyPhoto.App.myserver.deleteMy(that.imageData.id,
                    function(data) {
                        if (data.result == true) {
                            navigator.notification.alert("Delete Success");
                            MyDetail.delFlg = true;
                        } else {
                            navigator.notification.alert("Delete Fail");
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
    MyDetail.prototype.run = function( urlObj, options ) {
        var that  = this,
            hash  = urlObj.hash || urlObj.filename + urlObj.search,
            query = urlObj.search,
            id    = query.split("&")[0].split("=")[1],
            tmp   = null;

        // 画像取得
        tmp = document.getElementById("my");
        tmp = tmp.getElementsByClassName("data-detail-id"+id)[0];
        that.imageDom = tmp.cloneNode(true);

        // 該当データ取得
        that.imageData = ToyPhoto.App.collection.getMy(id);
        MyDetail.index = id;

    };

    // }}}

    return MyDetail;

})(ToyPhoto.Detail);
