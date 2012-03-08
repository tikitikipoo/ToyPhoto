/**
 * ToyPhoto Twitpicユーティリティクラス
 * 
 * @author tikitikipoo
 * @version 1.0
 * @lincense MIT License
 */
var Twitpic = (function(_super) {

    __extends(Twitpic, _super);

    // {{{ 
    /**
     * コンストラクタ
     */
    function Twitpic() {

        this._signOauthEcho = function(xhr, url) {
            var signedData = this._message(url, {}, 'GET');
            signedData = OAuth.getParameterMap(signedData.parameters);

            xhr.setRequestHeader('X-Auth-Service-Provider', url);
            xhr.setRequestHeader('X-Verify-Credentials-Authorization', this._generateOauthHeader(signedData, true));
        };

        this._generateOauthHeader = function(signedData, includeRealm) {
            var authorization = 'OAuth ';

            if(includeRealm) {
                authorization += 'realm="http://api.twitter.com/", ';
            }

            authorization += 'oauth_consumer_key="' + signedData.oauth_consumer_key + '", ' +
            'oauth_signature_method="HMAC-SHA1", ' +
            'oauth_token="' + signedData.oauth_token + '", ' +
            'oauth_timestamp="' + signedData.oauth_timestamp + '", ' +
            'oauth_nonce="' + encodeURIComponent(signedData.oauth_nonce) + '", ' +
            'oauth_version="1.0", ' +
            'oauth_signature="' + encodeURIComponent(signedData.oauth_signature) + '"';
            return authorization;
        };

        Twitpic.__super__.constructor.apply(this, arguments);
    }
    // }}}

    // {{{
    Twitpic.prototype.upload = function(file, message, callback) {
    
        var ref = this;
        
        var xhr = new XMLHttpRequest();
        xhr.open('post', 'http://api.twitpic.com/2/upload.json', true);
        
        xhr.onreadystatechange = function() {
        
            if (this.readyState != 4) {
                return;
            }
        
            if(xhr.status == 200 && xhr.responseText) {
                var parsedResponse = null;
                try {
                    parsedResponse = JSON.parse(xhr.responseText);
                    if (callback != undefined)
                        callback(parsedResponse);
                } catch(e) {}
        
            } else {
                if (callback != undefined)
                    callback(false);
            }
        };
        
        this._signOauthEcho(
            xhr, 
            'https://api.twitter.com/1/account/verify_credentials.json'
        );
        
        var formData = new FormData();
        formData.append("media", file);
        formData.append("key",   this._api_key);
        formData.append("message", message ? message : '');
        
        xhr.send(formData);
    
    };
    // }}}

    return Twitpic;

})(TwitterBase);
