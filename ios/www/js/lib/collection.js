/**
 * ToyPhotoデータ一時的保持クラス
 * 
 * @author tikitikipoo
 * @version 1.0
 * @lincense MIT
 */
var Collection = (function () {

    function Collection() {
        
        var that = this;

        /**
         * DAOインスタンス
         */
        that.dao = null;

        /**
         * 写真公開リスト
         */
        that.pubicList = null;

        /**
         * お気に入りリスト
         */
        that.favoriteList = null;

        /**
         * 自分が投稿したリスト
         */
        that.myList = null;

        /**
         * 初期化処理
         */
        that.init = (function () {

            that.publicList   = [];
            that.favoriteList = [];
            that.myList       = [];

        })();

    }

    /**
     * 公開写真リスト取得
     */
    Collection.prototype.getPublicList = function() {
        return this.publicList;
    };

    /**
     * 公開写真指定したインデックス取得
     */
    Collection.prototype.getPublic = function(i) {
        return this.publicList[i];
    };

    /**
     * 公開写真を格納
     */
    Collection.prototype.setPublicList = function(index, data) {
        return this.publicList[index] = data;
    };

    /**
     * 公開写真を追加
     */
    Collection.prototype.pushPublicList = function(data) {
        this.publicList.push(data);
    };

    /**
     * 公開写真を追加
     */
    Collection.prototype.addPublicList = function(list) {
        if (typeof list !== Array) 
            return;
        this.publicList = this.publicList.concat(list);
    };
    
    /*
     * 公開写真を削除
     */
    Collection.prototype.clearPublicList = function() {
        this.publicList = [];
    };

    /**
     * 公開写真リスト数取得
     */
    Collection.prototype.getPublicListLength = function() {
        return this.publicList.length;
    };

    /**
     * お気に入り写真リストを取得
     */
    Collection.prototype.getFavoriteList = function() {
        return this.favoriteList;
    };

    /**
     * お気に入り写真指定したインデックス取得
     */
    Collection.prototype.getFavorite = function(i) {
        return this.favoriteList[i];
    };

    /**
     * お気に入り写真を格納
     */
    Collection.prototype.setFavoriteList = function(index, data) {
        return this.favoriteList[index] = data;
    };

    /**
     * お気に入り写真を追加
     */
    Collection.prototype.pushFavoriteList = function(data) {
        this.favoriteList.push(data);
    };

    /**
     * お気に入り写真を追加
     */
    Collection.prototype.addFavoriteList = function(list) {
        if (typeof list !== Array) 
            return;
        this.favoriteList = this.favoriteList.concat(list);
    };
    
    /*
     * お気に入り写真を削除
     */
    Collection.prototype.clearFavoriteList = function() {
        this.favoriteList = [];
    };

    /**
     * お気に入り写真リスト数取得
     */
    Collection.prototype.getFavoriteListLength = function() {
        return this.favoriteList.length;
    };

    /**
     * マイ写真リスト取得
     */
    Collection.prototype.getMyList = function() {
        return this.myList;
    };

    /**
     * マイ写真指定したインデックス取得
     */
    Collection.prototype.getMy = function(i) {
        return this.myList[i];
    };

    /**
     * マイ写真を格納
     */
    Collection.prototype.setMyList = function(index, data) {
        return this.myList[index] = data;
    };

    /**
     * マイ写真を追加
     */
    Collection.prototype.pushMyList = function(data) {
        this.myList.push(data);
    };

    /**
     * マイ写真を追加
     */
    Collection.prototype.addMyList = function(list) {
        if (typeof list !== Array) 
            return;
        this.myList = this.myList.concat(list);
    };
    
    /*
     * マイ写真を削除
     */
    Collection.prototype.clearMyList = function() {
        this.myList = [];
    };

    /**
     * マイ写真リスト数取得
     */
    Collection.prototype.getMyListLength = function() {
        return this.myList.length;
    };

    return Collection;

})();
