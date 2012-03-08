/**
 * 共通処理メソッドファイル
 *
 * @author tikitikipoo
 * @version 1.0
 * @lisence MIT
 */

/**
 * 継承メソッド
 *
 * http://coffeescript.org/
 * from CoffeeScript
 */
var __hasProp = Object.prototype.hasOwnProperty;
var __extends = function(child, parent) { 

    for (var key in parent) { 
        if (__hasProp.call(parent, key)) 
            child[key] = parent[key]; 
    } 

    function ctor() { 
        this.constructor = child; 
    } 

    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    return child; 
};

/**
 * iOS シミュレーターかどうか
 * デバッグで使用
 */
var __isIosSim = (navigator.platform == "iPhone Simulator" && ('createTouch' in document));

/**
 * ネイティブiOSかどうか
 */
var __isIos = (function() {

    var p = navigator.platform;
    if( p === 'iPad' || p === 'iPhone' || p === 'iPod' ){
        return true;
    } else {
        return false;
    }
})();



ToyPhoto.Util = {

    /**
     * 画像リサイズ
     */
    resizeList: function() {

        // for safari, firefox
        var height = this.naturalHeight;
        var width  = this.naturalWidth;

        if (height > width) {

            height *= 130 / width;
            this.width = 130;
            this.style.top  = - (height - 130) / 2 + 'px';
            this.style.left = 0;
            this.style.position = 'absolute';

        } else {

            width *= 130 / height;
            this.height = 130;
            this.style.top  = 0;
            this.style.left = - (width - 130) / 2 + 'px';
            this.style.position = 'absolute';
        }

    },

    /**
     * 画像リサイズ
     */
    resizeDetail : function(that) {

        // for safari, firefox
        var height = that.naturalHeight;
        var width  = that.naturalWidth;

        if (height > width) {

            height *= 300 / width;
            that.width = 300;
            that.style.top  = - (height - 300) / 2 + 'px';
            that.style.left = 0;
            that.style.position = 'relative';

        } else {

            width *= 300 / height;
            that.height = 300;
            that.style.top  = 0;
            that.style.left = - (width - 300) / 2 + 'px';
            that.style.position = 'relative';
        }

    },

    /**
     * HTTPリクエスト
     */
    request: function(params, successCallback, errorCallback) {
        var url, sendData;

        var _sendData = "";
        if (params.data != null) {

            for( var name in params.data ) {
                if (_sendData != "")
                    _sendData += "&";
                _sendData += name + "=" + params.data[name];
            }
        }

        if (params.method.toUpperCase() == 'GET') {
            if (params.data != null && params.url.indexOf("?") == -1)
                params.url += "?";
            url = params.url + _sendData;
            sendData = null;
        }

        if(params.method.toUpperCase() == 'POST') {
            url = params.url;
            sendData = _sendData;
        }

        if(params.type == undefined) {
            params.type = "json";
        }

        var xhr = new XMLHttpRequest();
        xhr.open(params.method, url, true);

        // マルチパートの場合別途対応必要
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onreadystatechange = function() {

            if (this.readyState != 4) 
                return;

            if(xhr.status == 200 && xhr.responseText) {
                var parsedResponse = null;
                try {

                    if (params.type.toLowerCase() == "xml") {
                        if(successCallback != undefined)
                        successCallback( xhr.responseXML ) 
                    } else { 
                        if(successCallback != undefined)
                        successCallback( xhr.responseText );
                    }

                } catch(e) {}
            } else {
                if(errorCallback != undefined) 
                errorCallback(xhr);
            }
        };
        xhr.send(sendData);
    },
};

// 文字列にトリム関数を追加
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
}
