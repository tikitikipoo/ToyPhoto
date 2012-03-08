/**
 * ToyPhotoデータベースユーティリティクラス
 * 
 * @author tikitikipoo
 * @version 1.0
 * @lincense MIT License
 */
var Dao = (function () {

    function Dao() {

        var that = this;

        /**
         * DBインスタンス
         */
        that.db = null;

        /**
         * 初期化処理
         */
        that.init = (function () {

            that.db = new Database();

        })();
    }

    // {{{ public

    /**
     * ギャラリー画面HTML取得
     */
    Dao.prototype.getContentByType = function(type, sCallback) {
        var that = this;

        that.db.get("history", ["*"], {"type" : type}, 
            function(tx, results) {
                sCallback(results);
            },
            function(err) {});
    };

    /**
     * ギャラリー画面HTML保存
     */
    Dao.prototype.saveContentByType = function(type, data) {
        var that = this;

        that.db.get("history", ["*"], {"type" : type}, 
            function(tx, results) {
                if (results.rows.length) {
                    // アップデート
                    that.db.update("history", {
                            "content": data,
                            "updated" : new Date().getTime(),
                        },
                        {
                            "type" : type
                        },
                        function(tx, results) {},
                        function(err) {}
                    );

                } else {
                    // インサート
                    that.db.insert("history", {
                            "content": data,
                            "type" : type,
                            "updated" : new Date().getTime(),
                        },
                        function(tx, results) {},
                        function(err) {}
                    );
                }
            },
            function(err) {});
    };


    return Dao;

})();
