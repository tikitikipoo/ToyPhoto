/**
 * ToyPhotoお気に入り画面
 * 
 * @author tikitikipoo
 * @version 1.0
 * @lincense MIT License
 */
ToyPhoto.List = (function() {

    // {{{
    /**
     * コンストラクタ
     */
    function List() {

        var that = this;

        /**
         * 画像を表示する親DIV
         */
        that.wrapDiv = null;

        /**
         * 画像の表示に使用するテンプレートDIV
         */
        that.photoDiv = null;

        /**
         * 自動読み込みフラグ
         */
        that.autoLoad = false;
    }
    // }}}


    // {{{
    /**
     * 写真取得後実行されるコンテンツ更新関数
     */
    List.prototype.getListCallback = function(data, type, reload) {

        if (data.result != true) 
            return;

        var that = this,
            fragment = document.createDocumentFragment(),
            collection = ToyPhoto.App.collection,
            items = data.data,
            itemsLen = items.length,
            collectionLen = 0,
            htmlName = "",
            setListFunc;

        if (type == "gallery") {
            collectionLen = collection.getPublicListLength();
            htmlName = "gallery-detail.html";
            setListFunc = "setPublicList";
        } else if (type == "favorite") {
            collectionLen = collection.getFavoriteListLength();
            htmlName = "favorite-detail.html";
            setListFunc = "setFavoriteList";
        } else if (type == "my") {
            collectionLen = collection.getMyListLength();
            htmlName = "my-detail.html";
            setListFunc = "setMyList";
        }

        for(var i = 0; i < itemsLen; i++ ) {

            // 画像ブロックディープコピー
            var div_photo = that.photoDiv.cloneNode(true);

            var tag_alink = div_photo.getElementsByTagName('a')[0];
            var tag_img = div_photo.getElementsByTagName('img')[0];

            var img_src = ToyPhoto.twitpic.thumb_url + items[i].twitpic_id;

            // リンク設定
            tag_alink.href =  htmlName + "?id="+ collectionLen;
            tag_img.src = img_src;

            // リサイズ処理
            tag_img.onload = ToyPhoto.Util.resizeList;
            
            // クラス名設定
            tag_img.className += " data-detail-id" + collectionLen;

            // コレクションに追加
            collection[setListFunc](collectionLen, {
                'id' : items[i].id,
                'twitpic_id' : items[i].twitpic_id,
                'url' : img_src });

            collectionLen++;

            // フラグメント保存
            fragment.appendChild(div_photo);
        }

        if (reload) {
            // 要素の削除
            var range = document.createRange();
            range.selectNodeContents(that.wrapDiv);
            range.deleteContents();
        }

        // フラグメントとして保存したものを出力
        that.wrapDiv.appendChild(fragment);

        // 自動読み込み設定オン
        that.autoLoad = true;

    };

    /**
     * 自動読み込み処理
     */
    List.prototype.autoLoader = function(targetSelector, callback) {

        // 初期化
        var that = this
            _window = $(window),
            _target = $(targetSelector),
            _threshold = 30,
            _limitContent = 2000,
            _loading =  false;

        var _check = function() {

            if (!that.autoLoad)
                return;

            var content = _target.offset().top + _target.height();
            var display = _window.scrollTop() + _window.height();
            if (content > _limitContent){
                that.autoLoad = false;
            }
            if (content - display < _threshold){
                return true;
            } else {
                return false;
            }
        };

        var _load = function () {
            callback(function() {
                _loading = false; 
            });
        }

        // スクロールイベント発火設定
        _window.unbind("scroll").bind("scroll", function() {

            if (_check()) {

                if (_loading) {
                    return;
                }
                _loading = true;

                _load();
            }
        });

    };
    
    // }}}

    return List;
})();
