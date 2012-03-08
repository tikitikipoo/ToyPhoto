/**
 * ToyPhoto設定画面クラス
 * 
 * @author tikitikipoo
 * @version 1.0
 * @lincense MIT
 */
ToyPhoto.Setting = (function() {

    /**
     * コンストラクタ
     */
    function Setting() {

        var that = this;

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
    Setting.prototype.registPageEvent = function() {
        var that = this;

        /*
        $("document").find("#setting").bind("pagebeforecreate", function(e) {
            alert("setting pagebeforecreate");
        });
        $("#setting").bind("pagebeforehide", function(e) {
            alert("setting pagebeforehide");
        });
        $("#setting").bind("pagebeforeshow", function(e) {
            alert("setting pagebeforeshow");
        });
        */

        // 詳細ページが生成されたとき（domが準備できたとき）発火
        $("#setting").live("pagecreate", function(e){
        
            that.updateDomEvent();
            that.updateContents();

        });
    };


    /**
     * dom要素にイベントを登録
     */
    Setting.prototype.updateDomEvent = function() {
        var that = this;

        // ログアウトイベント設定
        $("#setting").find("#logout")
                     .unbind("click")
                     .bind("click", function() {
        
            // ログアウト
            ToyPhoto.App.logout();
        });

        // @TODO あとで消す PCデバッグ用
        // ログイベント設定
        $("#setting").find("#twitter-login")
                     .unbind("click")
                     .bind("click", function() {
        
            // ログイン
            ToyPhoto.App.twitter.twitter_login(function(){});
        });
        
    };

    /**
     * コンテンツ更新
     */
    Setting.prototype.updateContents = function() {
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
    Setting.prototype.run = function( urlObj, options ) {
        var that  = this;
    };

    return Setting;

})();
