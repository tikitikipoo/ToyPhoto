/**
 * Twitter根底クラス
 *
 * require js/app/config.js
 * require js/vendor/oauth.js
 * require js/vendor/sha1.js
 *
 * @author tikitikipoo
 * @version 1.0
 * @lincense MIT License
 */
var TwitterBase = (function () {

    function TwitterBase () {

        this._api_key = ToyPhoto.twitpic.api_key;
	    this._consumer_token = ToyPhoto.twitter.consumer_key;
	    this._consumer_token_secret = ToyPhoto.twitter.consumer_secret; 
        this._oauth_verifier = '';

        this.re_token          = /oauth_token=([^&]+)/;
        this.re_token_secret   = /oauth_token_secret=([^&]+)/;
        this.re_oauth_verifier = /oauth_verifier=([^&]+)/;

    }

    // staticプロパティ
	TwitterBase._twitter_id  = localStorage.getItem('twitter_id') || '';
	TwitterBase._oauth_token = localStorage.getItem('auth_token') || '';
	TwitterBase._oauth_token_secret = localStorage.getItem('auth_token_secret') || '';
    TwitterBase._oauth_verifier = null;

    /**
     * 送信パラメータ生成関数
     */
    TwitterBase.prototype._message = function(url, params, httpMethod) {
        var that = {};
        var accessor = {
            consumerSecret: this._consumer_token_secret,
            tokenSecret: TwitterBase._oauth_token_secret
        };

        if(!httpMethod)
            httpMethod = 'POST';

        that.action = url;
        that.method = httpMethod;
        that.parameters = [
            ['oauth_consumer_key', this._consumer_token],
            ['oauth_signature_method', 'HMAC-SHA1']
        ];

        if (TwitterBase._oauth_token) {
            OAuth.setParameter(that, 'oauth_token', TwitterBase._oauth_token);
        }

        for (var prop in params) {
            if (params.hasOwnProperty(prop)) {
                OAuth.setParameter(that, prop, params[prop]);
            }
        }

        OAuth.completeRequest(that, accessor);
        return that;
    };

    /**
     * twitter_id取得
     */
    TwitterBase.prototype.getTwitterId = function() {
        return localStorage.getItem('twitter_id');
    };

    return TwitterBase;

})();
