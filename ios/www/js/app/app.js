$(function(){
        
//    window.AppInstance = new ToyPhoto.App();
//    AppInstance.run();
            
});

/**
 * ToyPhotoアプリケーションクラス
 * 
 * @author tikitikipoo
 * @version 1.0
 * @lincense MIT
 */
ToyPhoto.App = (function() {


    /**
     * コンストラクタ
     */
    function App() {

        var that = this;

        /**
         * ios用タブバー、ツールバー、
         * アクションシートを管理
         */
        that.nativeControls = null;

        /**
         * Twitterクラス
         */
        that.twitter = null;

        /**
         * Twitpicクラス
         */
        that.twitpic = null;

        /**
         * Galleryクラス
         */
        that.gallery = null;

        /**
         * GalleryDetailクラス
         */
        that.galleryDetail = null;

        /**
         * Favoriteクラス
         */
        that.favorite = null;

        /**
         * FavorieDetailクラス
         */
        that.favoriteDetail = null;

        /**
         * Actionクラス
         */
        that.action = null;

        /**
         * Myクラス
         */
        that.my = null;

        /**
         * MyDetailクラス
         */
        that.myDetail = null;

        /**
         * Settingクラス
         */
        that.setting = null;

        /**
         * 初期化メソッド
         */
        that.init = function() {

            // @TODO インディケーターシートを表示しないといけないかも

            // イベント登録
            that.registPageEvent();

            // ログインチェック
            App.isLogin = App.twitter.isLogin();

            // 認証確認、ユーザー情報取得
            App.twitter.verify(function(result, data) {

                if (result === true) {
                    // アクセストークン更新処理
                    ToyPhoto.App.myserver.updateAccessToken(data.id_str,
                        function(res) {

                            if (res === false) {
                            // 自サーバーの認証失敗時ログアウトさせる
                                App.logout();
                            }
                        });
                }
                App.isLogin = result;
                App.updateNativeControls();
            });

            // 各画面初期化
            that.gallery        = new ToyPhoto.Gallery();
            that.galleryDetail  = new ToyPhoto.GalleryDetail();
            that.favorite       = new ToyPhoto.Favorite();
            that.favoriteDetail = new ToyPhoto.FavoriteDetail();
            that.action         = new ToyPhoto.Action();
            that.my             = new ToyPhoto.My();
            that.myDetail       = new ToyPhoto.MyDetail();
            that.setting        = new ToyPhoto.Setting();

            // タブバー初期化
            _initNativeControls();
        };

        /**
         * タブバー生成
         */
        var _initNativeControls = function() {

            if (!PhoneGap.available)
                return;

            that.nativeControls = window.plugins.nativeControls;

            // ツールバー生成
            // twitterでログインボタン押下時実行されるアクション
            var isTapToolBar = false,
                onTapToolBar = function() {

                // 二度押し防止チェエク
                if (isTapToolBar === true) {
                    return;
                }

                isTapToolBar = true;

                App.twitter.twitter_login( function(res){

                    if(res == "success") {


                        // タブバー更新
                        that.nativeControls.hideToolBar();
                        that.nativeControls.showTabBar();
                        that.nativeControls.showTabBarItems(
                            "gallery", "favorite", "camera", "my", "setting", 
                            {'buttonImage':'camera_button_take.png', 
                             'highlightImage': 'tabBar_cameraButton_ready_matte.png'});
                        that.nativeControls.selectTabBarItem("gallery");

                    } else if (res == "authfail") {
                        if (!PhoneGap.available)
                        alert("login fail but if you are in debug, don't worry no problem");
                        else
                        navigator.notification.alert("Login Fail", null, "Result");
                    } 

                    // 二度押し防止を元に戻す
                    isTapToolBar = false;

                    // Twitter認証ウインドウ閉じる
                    App.twitter.close_childBrowser();

                }, function(result, data) {
                    // アクセストークン更新処理
                
                    if (result === true) {
                        ToyPhoto.App.myserver.updateAccessToken(data.id_str,
                        function(res) {

                            if (res === false) {
                            // 自サーバーの認証失敗時ログアウトさせる
                                App.logout();
                            }
                        });
                    }
                });
            }
            
            that.nativeControls.createToolBar({'top': false});
            that.nativeControls.createToolBarItem(
                '','','UIBarButtonSystemItemFixedSpace',null);
            that.nativeControls.createToolBarItem(
                '','Twitterでログイン','',{"onTap": onTapToolBar});
            that.nativeControls.createToolBarItem(
                '','','UIBarButtonSystemItemFixedSpace',null);

            // タブバー生成
            that.nativeControls.createTabBar();
            that.nativeControls.createTabBarItem(
                "gallery", "Gallery", "tabButton:Featured", 
                {"onSelect":function(){
                    $.mobile.changePage("gallery.html", 
                        { transition: "none", changeHash: true});  
                }});

            that.nativeControls.createTabBarItem(
                "favorite", "Favorite", "tabButton:Favorites", 
                {"onSelect":function(){
                    $.mobile.changePage("favorite.html", 
                        { transition: "none", changeHash: true});  
                }});

            that.nativeControls.createTabBarItem(
                "camera", "", "", 
                {"onSelect":function(){
                    $.mobile.changePage("action.html", 
                        { transition: "none", changeHash: true});
                }});

            that.nativeControls.createTabBarItem(
                "my", "My", "tabButton:History", 
                {"onSelect" : function() {
                    $.mobile.changePage("my.html", {transition: "none"});
                }});
                                                    
            that.nativeControls.createTabBarItem(
                "setting", "Setting", "tabButton:MostViewed", 
                {"onSelect" : function() {
                    $.mobile.changePage("setting.html", {transition: "none"});
                }});

            // ログインチェック
            if (App.isLogin) {
                // アプリケーション用のタブバーを表示
                that.nativeControls.showTabBar();
                that.nativeControls.showTabBarItems(
                    "gallery", "favorite", "camera", "my", "setting", 
                    {'buttonImage':'camera_button_take.png', 
                    'highlightImage': 'tabBar_cameraButton_ready_matte.png'});
                that.nativeControls.selectTabBarItem("gallery");

            } else {
                // ログインボタンがあるタブバーを表示
                that.nativeControls.showToolBar();
            }
        };

    }
    
    // {{{ static 
    /**
     * ログイン可否
     */
    App.isLogin = false;


    /**
     * ログアウト
     */
    App.logout = function() {

        App.isLogin = false;
        App.twitter.twitter_endsession();
        App.updateNativeControls();
    };

    // 複数の画面で使用するクラスをAppクラスで保持
    // 各画面はAppで生成した以下のインスタンスを持ちまわって
    // 使用することにする
    /**
     * DAOインスタンス
     */
    App.dao = new Dao();

    /**
     * コレクションインスタンス
     */
    App.collection = new Collection();

    /**
     * Twitterインスタンス
     */
    App.twitter = new Twitter();

    /**
     * MyServerインスタンス
     */
    App.myserver = new MyServer();

    /**
     * タブバー更新
     */
    App.updateNativeControls = function() {

        if (!PhoneGap.available)
            return;

        var nativeControls = window.plugins.nativeControls;

        // ログインチェック
        if (App.isLogin) {
            // アプリケーション用のタブバーを表示
            nativeControls.showTabBar();
            nativeControls.showTabBarItems(
                "gallery", "favorite", "camera", "my", "setting", 
                {'buttonImage':'camera_button_take.png', 
                'highlightImage': 'tabBar_cameraButton_ready_matte.png'});
            nativeControls.selectTabBarItem("gallery");

        } else {
            // ログインボタンがあるタブバーを表示
            nativeControls.hideTabBar();
            nativeControls.showToolBar();
            $.mobile.changePage("gallery.html", { transition: "none"});  

        }
    };

    // }}}


    // {{{ public
    /**
     * アプリケーション実行メソッド
     */
    App.prototype.run = function() {

        this.init();

    };


    /**
     * ページイベント登録
     */
    App.prototype.registPageEvent = function() {
        var that = this;

        $(document).unbind("pagebeforechange")
                     .bind("pagebeforechange", function(e, data){;


            if ( typeof data.toPage === "string" ) {

                // スクロールイベントの解除
                $(window).unbind("scroll");

                var u = $.mobile.path.parseUrl( data.toPage ),
                    __hash = u.hash || u.filename + u.search;

                if (__hash.search(/^gallery-detail.html/) !== -1) {

                    // ギャラリー詳細初期化
                    that.galleryDetail.run( u, data.options );

                } else if (__hash.search(/^favorite-detail.html/) !== -1) {

                    // お気に入り詳細初期化
                    that.favoriteDetail.run( u, data.options );

                } else if (__hash.search(/^my-detail.html/) !== -1) {

                    // 自分投稿詳細初期化
                    that.myDetail.run( u, data.options );

                } else if (__hash.search(/^setting.html/) !== -1) {

                    // 設定画面
                    that.setting.run( u, data.options );
                }

            }
        });

    };

    // }}}

    return App;
    
})();
