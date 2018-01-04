// ==UserScript==
// @name        futaba_new_res_counter
// @namespace   https://github.com/akoya-tomo
// @description ふたクロでタブに新着レス数を表示する
// @include     http://*.2chan.net/*/res/*
// @include     https://*.2chan.net/*/res/*
// @version     1.0.0
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js
// @grant       none
// @license     MIT
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function ($) {
	/*
	 *	設定
	 */
	var USE_BOARD_NAME = true;		//タブに板名を表示する

	var script_name = "futaba_new_res_counter";
	var res = 0;	//新着レス数
	var serverName = document.domain.match(/^[^.]+/);
	var boardName = $("#tit").text().match(/^[^＠]+/);

	init();

	function init(){
		if(!isFileNotFound()){
	        set_title();
			check_futakuro_reload();
			check_thread_down();
		}
		reset_title();
	}

	/*
	 * 404チェック
	 */
	function isFileNotFound() {
		if(document.title == "404 File Not Found") {
			return true;
		}
		else {
			return false;
		}
	}

	/*
	 *ふたクロの新着の状態を取得
	 */
	function check_futakuro_reload() {
		target = $("#master").parent("form").get(0);
		config = { childList: true };
		var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				var nodes = $(mutation.addedNodes);
				//console.log(script_name + ":form nodes =");
				//console.dir(nodes);
				if (nodes.length) {
					change_title();
				}
			});
		});
		observer.observe(target, config);
	}

	/*
	 * タブに新着レス数・スレ消滅状態を表示
	 */
	function change_title() {
		var newres = $(".nb_left:last").text().match(/(\d+)件の新着レス/);	//ふたクロの新着レス数取得
		if(newres) {
			res += parseInt(newres[1]);
		}
		if ( res !== 0) {
			document.title = "(" + res + ")" + title_name();
		}
	}

	/*
	 * ふたクロのステータスからスレ消滅状態をチェック
	 */
	function check_thread_down() {
		target = $("#border_area").get(0);
		config = { childList: true };
		var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				var nodes = $(mutation.addedNodes);
				//console.log(script_name + ":#border_area nodes =");
				//console.dir(nodes);
				if (nodes.attr("id") == "thread_down") {
					document.title = "#" + title_name();
				}
			});
		});
		observer.observe(target, config);
	}

	function title_name() {
		var title = document.title;
		var title_num = title.match(/^(#|\(\d+\))/);
		var title_num_length;
		if(!title_num){
			title_num_length = 0;
		}
		else {
			title_num_length = title_num[0].length;
		}
		var act_title_name = title.substr(title_num_length);
		return act_title_name;
	}

	/*
	 * 新着レスをリセット
	 */
	function reset_title() {
		//ページ末尾でホイールダウンした時
		window.onwheel = function(event){
			//Windowsで拡大率使用時にwindow_yが小数点以下でずれる対応
			var window_y = Math.ceil($(window).height() + $(window).scrollTop());
			var window_ymax = $(document).height();
			//console.log(script_name + ": window_y,yamx,deltaY: " + window_y +',' + window_ymax + ',' + event.deltaY);
			if (event.deltaY > 0 && window_y >= window_ymax ) {
				reset_titlename();
			}
			return;
		};

		function reset_titlename() {
			res = 0;
			var title_char = title_name();
			document.title = title_char;
		}
	}

	/*
	 *タイトル設定
	 */
	// タイトルに板名を追加する
	function set_title() {
	  if ( USE_BOARD_NAME ) {
		if(boardName == "二次元裏"){
			boardName = serverName;
		}
	    document.title = boardName + " " + document.title;
      }
    }

})(jQuery);
