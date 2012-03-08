/**
 * ToyPhotoデータベースユーティリティクラス
 * 
 * @author tikitikipoo
 * @version 1.0
 * @lincense MIT License
 */
var MyServer = (function(){

    // {{{ 
    /**
     * コンストラクタ
     */
    function MyServer() {

        var that = this;

        /**
         * アクセストークン
         */
        that.access_toekn = null;

        /**
         * url
         */
        that.url = null;

        /**
         * 初期化処理
         */
        that.init = (function () {

            that.url = ToyPhoto.my_server_url;

        })();
    }
    // }}}

    // {{{
    /**
     * 写真公開取得関数 - http
     */
    MyServer.prototype.getPublicList = function(obj, sCallback, eCallback) {
        var that = this;

        ToyPhoto.Util.request({
            url: that.url + "/publics/index/" + obj["page"] + "/" + obj["id"],
            method: "GET",
        },function(result){
            if (sCallback != undefined)
                sCallback(JSON.parse(result));
        },function(result){
            if (eCallback != undefined)
                eCallback(JSON.parse(result));
        });
    };


    /**
     * 自分が撮った写真サーバーに登録
     */
    MyServer.prototype.addPublic = function(data, sCallback, eCallback) {
        var that = this;

        data["twitter_id"]   = ToyPhoto.App.twitter.getTwitterId();
        data["access_token"] = that.getAccessToken();

        ToyPhoto.Util.request({
            "method": "POST",
            "data"  : data,
            "url"   : that.url + "/publics/add",
        },function(result){
            if (sCallback != undefined)
                sCallback(JSON.parse(result));
        },function(result){
            if (eCallback != undefined)
                eCallback(JSON.parse(result));
        });
    };


    /**
     * お気に入り取得関数 - web sql
     */
    MyServer.prototype.getFavoriteList = function(page,sCallback,eCallback) {

        // Web SQL接続
        var that = this,
            data = {
            "twitter_id": ToyPhoto.App.twitter.getTwitterId(),
            "access_token": that.getAccessToken(),
            };

        ToyPhoto.Util.request({
            "method": "POST",
            "data"  : data,
            "url"   : that.url + "/favorites/index/" + page,
        },function(result){
            if (sCallback != undefined)
                sCallback(JSON.parse(result));
        },function(result){
            if (eCallback != undefined)
                eCallback(JSON.parse(result));
        });
    };


    /**
     * お気に入り写真サーバーに登録
     */
    MyServer.prototype.addFavorite = function(data, sCallback, eCallback) {
        var that = this;

        data["twitter_id"]   = ToyPhoto.App.twitter.getTwitterId();
        data["access_token"] = that.getAccessToken();

        ToyPhoto.Util.request({
            "method": "POST",
            "data"  : data,
            "url"   : that.url + "/favorites/add",
        },function(result){
            if (sCallback != undefined)
                sCallback(JSON.parse(result));
        },function(result){
            if (eCallback != undefined)
                eCallback(JSON.parse(result));
        });
    };


    /**
     * お気に入り削除関数 
     */
    MyServer.prototype.deleteFavorite = function(id, sCallback, eCallback) {
        var that = this,
            data = {
            "twitter_id": ToyPhoto.App.twitter.getTwitterId(),
            "access_token": that.getAccessToken(),
            };

        ToyPhoto.Util.request({
            "method": "POST",
            "data"  : data,
            "url"   : that.url + "/favorites/delete/" + id,
        },function(result){
            if (sCallback != undefined)
                sCallback(JSON.parse(result));
        },function(result){
            if (eCallback != undefined)
                eCallback(JSON.parse(result));
        });
    };

    /**
     * アクセストークン更新処理
     */
    MyServer.prototype.updateAccessToken = function(twitter_id, callback) {
        var that = this,
            ts = new Date().getTime();
            data = {
            "twitter_id" : twitter_id,
            "access_token" : ts,
            "s" : ToyPhoto.my_server_secret,
            };

        ToyPhoto.Util.request({
            "method": "POST",
            "data"  : data,
            "url"   : that.url + "/users/updateAccessToken/", 
        },function(result){
            result = JSON.parse(result)
            if (result.result == true) {
                that.setAccessToken(result.access_token);
                callback(true);
            } else {
                callback(false);
            }
        },function(result){});

    };

    /**
     * アクセストークン更新処理
     */
    MyServer.prototype.setAccessToken = function(access_token) {
        localStorage.setItem('my_access_token', access_token);
    };

    /**
     * アクセストークン処理
     */
    MyServer.prototype.getAccessToken = function() {
        return localStorage.getItem('my_access_token');
    };

    /**
     * 自分が投稿した写真取得関数 - web sql
     */
    MyServer.prototype.getMyList = function(page, sCallback, eCallback) {
        var that = this,
            data = {
            "twitter_id": ToyPhoto.App.twitter.getTwitterId(),
            "access_token": that.getAccessToken(),
            };

        ToyPhoto.Util.request({
            "method": "POST",
            "data"  : data,
            "url"   : that.url + "/my/index/" + page,

        },function(result){
            if (sCallback != undefined)
                sCallback(JSON.parse(result));
        },function(result){
            if (eCallback != undefined)
                eCallback(JSON.parse(result));
        });

    };

    /**
     * 自分が投稿した写真削除関数 - sql & http
     */
    MyServer.prototype.deleteMy = function(id, sCallback, eCallback) {
        var that = this,
            data = {
            "twitter_id": ToyPhoto.App.twitter.getTwitterId(),
            "access_token": that.getAccessToken(),
            };

        ToyPhoto.Util.request({
            "method": "POST",
            "data"  : data,
            "url"   : that.url + "/my/delete/" + id,
        },function(result){
            if (sCallback != undefined)
                sCallback(JSON.parse(result));
        },function(result){
            if (eCallback != undefined)
                eCallback(JSON.parse(result));
        });
    };

    // }}}

    return MyServer;

})();
