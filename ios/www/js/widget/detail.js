/**
 * ToyPhoto共有写真詳細クラス
 * 
 * @author tikitikipoo
 * @version 1.0
 * @lincense MIT Licence
 */
ToyPhoto.Detail = (function() {

    /**
     * コンストラクタ
     */
    function Detail() {

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
    Detail.prototype.registPageEvent = function() {
    };

    /**
     * コンテンツ更新
     */
    Detail.prototype.updateContents = function() {
    };

    /**
     * dom要素にイベントを登録
     *
     * @param dom HTMLテキスト
     */
    Detail.prototype.updateDomEvent = function(dom) {

        var that = this;

    };

    /**
     * ページ生成時実行
     *
     * 設計上、Ajaxで取得して詳細画面を表示しているため、
     * アプリ起動時のdom操作はできない。
     * そのためjQueryMobileのpagebeforechangeイベントが発火したとき
     * domに対して初期化処理をしている
     */
    Detail.prototype.run = function( urlObj, options ) {
    };

    return Detail;

})();
