$(document).bind("mobileinit", function(){
    //apply overrides here
    $.mobile.fixedToolbars.setTouchToggleEnabled(false);

    /**
     * 小気味良い固定ツールバー、スクロールバーを実装
     *
     * iOS5の場合overflow:autoが動作するので
     * スクロール可能領域外にツールバーを作成。快適な固定ツールバーを実現。
     * だが、ステータスバーを押下してもトップにいかない、
     * 親要素のoverflow:hiddenを無視。それによって横スクロールバー表示。
     * その他情報
     * http://dev.screw-axis.com/doc/jquery_mobile/components/pages_dialogs/touchoverflow/
     */
//    $.mobile.touchOverflowEnabled = true;
//    $.mobile.hashListeningEnabled = false;
//    $.mobile.pushStateEnabled = true;
//    $.mobile.ajaxEnabled = false;
//    $.mobile.defaultPageTransition = "none";
    
});
