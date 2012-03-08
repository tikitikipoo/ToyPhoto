/**
 * Twitterクラス
 *
 * @author tikitikipoo
 * @version 1.0
 * @lincense MIT
 */
var Twitter = (function (_super) {

    /**
     * 継承
     */
    __extends(Twitter, _super);

    /**
     * コンストラクタ
     */
    function Twitter() {

        // 親コンストラクタ呼び出し
        Twitter.__super__.constructor.apply(this, arguments);

        /**
         * 子ウィンドウインスタンス
         */
        this.childBrowser = ChildBrowser.install();

        /**
         * PCデバッグ用に使用
         */
        (function(ref) {

            if (PhoneGap.available || __isIosSim)
                return;

            var loc = location.href;
            if (loc.indexOf("/?denied") >= 0)
                return;
            if (loc.indexOf("oauth_token") < 1) 
                return;
            TwitterBase._oauth_token   = ( ref.re_token.exec(loc)        || [] )[1];
            TwitterBase._oauth_verifier = ( ref.re_oauth_verifier.exec(loc) || [] )[1];
            if (TwitterBase._oauth_token 
                    && TwitterBase._oauth_verifier) 
                ref.twitter_authenticate(
                    function(){},
                    function(result, data) {

                        if (result === true) {
                            ToyPhoto.App.myserver.updateAccessToken(data.id_str);
                        }
                    }
                );

        })(this);

    }

    /**
     * ログインチェック
     */
    Twitter.prototype.isLogin = function() {
        return (TwitterBase._oauth_token != '' && TwitterBase._oauth_verifier != '');
    };

    /**
     * 認証が確証されているかチェック
     */
    Twitter.prototype.verify = function(callback) {

        var ref = this;
        
    	var message = this._message(
    	  'https://api.twitter.com/1/account/verify_credentials.json?skip_status=true',
          {},
    	  'GET'
    	);
    	$.ajax({
    	  type : message.method,
    	  url  : message.action,
    	  data : OAuth.getParameterMap(message.parameters),
    	  success: function(data) {
              localStorage.setItem('twitter_id', data.id_str);
              if (callback !=undefined)
                  callback(true, data);
    	  },
          error: function(request, status, data) {
              // デバッグ用分岐処理
              if( !(__isIos === false && ref.re_token.exec(location.href)) )
              ref.twitter_endsession();
              if (callback !=undefined)
                  callback(false);
          }
    	});
    };

    
    /*
     * OAuthでTwitterに認証リクエスト
     */
    Twitter.prototype.twitter_login = function(callback, verifyCallback) {
    
        var ref = this;

        // すでにログイン済みならリクエストしない
    	if (TwitterBase._oauth_token 
                && TwitterBase._oauth_token_secret) {
    		return;
    	}

        if (typeof this.childBrowser.onLocationChange !== "function") {

            this.childBrowser.onLocationChange = function(loc){

                // 認証不許可
                if (loc.indexOf("/?denied") > -1) {
                    ref.twitter_endsession();
                    ref.childBrowser.close();
                    callback("denied");
                    return;
                }
                
                // 認証時下記のリクエストが返却されるので退避しておく
                if (loc.match(/^https:\/\/api\.twitter\.com\/oauth\/authorize$/)) {
                    return;
                }
        
                // 認証しないでブラウザを閉じた場合
                if (loc.indexOf("oauth_token") < 1) {
                    ref.twitter_endsession();
                    ref.childBrowser.close();
                    callback("close");
                    return;
                }
        
                // アクセス認証トークン取得
                TwitterBase._oauth_token   = ( ref.re_token.exec(loc)        || [] )[1];
                TwitterBase._oauth_verifier = ( ref.re_oauth_verifier.exec(loc) || [] )[1];
                if (TwitterBase._oauth_token 
                        && TwitterBase._oauth_verifier) {
                    // 認証処理
                    ref.twitter_authenticate(callback, verifyCallback);
                }
            };
        }
    
        // リクエストパラメータ生成
    	var message = this._message(
    	  'https://api.twitter.com/oauth/request_token',
          {},
    	  'GET'
    	);
    
    	$.ajax({
    	  type : message.method,
    	  url  : message.action,
    	  data : OAuth.getParameterMap(message.parameters),
    	  success: function(data) {

    		  TwitterBase._oauth_token = ( ref.re_token.exec(data)        || [] )[1];
    		  TwitterBase._oauth_token_secret = ( ref.re_token_secret.exec(data) || [] )[1];

              localStorage.setItem('auth_token', TwitterBase._oauth_token);
              localStorage.setItem('auth_token_secret', TwitterBase._oauth_token_secret);
    
              var message = ref._message(
                  'https://api.twitter.com/oauth/authorize',
                  {},
                  'GET'
              );
              
              if (PhoneGap.available) {

                  ref.childBrowser.showWebPage(
                      OAuth.addToURL(message.action, message.parameters), 
                      { showLocationBar : false }
                  );

              } else {
                  // ブラウザのデバッグの場合
                  location.href = OAuth.addToURL(message.action, message.parameters);
              }
          },
          error: function(request, status, error) {
              callback("fail");
          }
        });
    };
    
    /**
     * 認証処理
     */
    Twitter.prototype.twitter_authenticate = function(callback, verifyCallback) {
    
        var ref = this;
    
        // パラメータ生成
        var message = this._message(
            'https://api.twitter.com/oauth/access_token',
            { 'oauth_verifier': TwitterBase._oauth_verifier},
    	    'POST'
        );

        $.ajax({
          type : message.method,
          url  : message.action,
          data : OAuth.getParameterMap(message.parameters),
          success: function(data) {

    		  TwitterBase._oauth_token = ( ref.re_token.exec(data)        || [] )[1];
    		  TwitterBase._oauth_token_secret = ( ref.re_token_secret.exec(data) || [] )[1];

              localStorage.setItem('auth_token', TwitterBase._oauth_token);
              localStorage.setItem('auth_token_secret', TwitterBase._oauth_token_secret);

              callback("success");
              // twitter情報取得のため再度リクエスト
              ref.verify(verifyCallback);
          },
          error: function(request, status, error) {

              // @TODO リファクタリング
              ref.twitter_endsession();
              callback("authfail");
          }  
        });
    };
    
    /**
     * ログアウト
     */
    Twitter.prototype.twitter_endsession = function() {
    
        localStorage.clear();
        TwitterBase._twitter_id         = '';
        TwitterBase._oauth_token        = '';
        TwitterBase._oauth_token_secret = '';
        TwitterBase._oauth_verifier     = '';
    
    };


    /**
     * ツイートアップデート処理
     */
    Twitter.prototype.status_update = function(tweetText) {
    
        if (tweetText.length < 1) 
            return;

        var ref = this;
        
    	var message = this._message(
    	  'https://api.twitter.com/1/statuses/update.json',
          {'status': tweetText,
           'trim_user': 'true'},
    	  'POST'
    	);
    	$.ajax({
    	  type : message.method,
    	  url  : message.action,
    	  data : OAuth.getParameterMap(message.parameters),
    	  success: function(data) {
    	  },
          error: function(request, status, data) {
          }
    	});
    };
    

    /**
     * 子ウィンドウを閉じる
     */
    Twitter.prototype.close_childBrowser = function() {
        this.childBrowser.close();
    };

    return Twitter;

})(TwitterBase);
