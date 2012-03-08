/**
 * ToyPhotoデータベースクラス
 * 
 * @author tikitikipoo
 * @version 1.0
 * @lincense MIT
 */
var Database = (function () {

    function Database() {

        var that = this;

        /**
         * DB各種設定
         */
        that.options = {
            dbName:    'toyphoto',
            dbVersion: '1.0',
            dbDesc:    'toyphoto db',
            dbSize:    1024*1024
        };

        /**
         * DB接続インスタンス
         */
        that.db = null;

        /**
         * WebSQLDatabase 利用可能か
         */
        that.available = typeof window.openDatabase != 'undefined';

        /**
         * データベース初期化
         */
        var createDatabase = function() {

            that.db.transaction(function(tx) {

//                tx.executeSql('DROP TABLE history');
                tx.executeSql('CREATE TABLE IF NOT EXISTS ' +
                            'history(' +
                            'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                            'content TEXT NOT NULL, ' +
                            'type INTEGER NOT NULL, ' +
                            'updated TEXT NOT NULL)', [], 
                            function() {
                                tx.executeSql('DELETE FROM history');
                            },
                            function() {});

            });
        };

        /**
         * 各種初期化処理
         */
        that.init = (function () {

            if(!that.available) {
                return;
            }

            // DB接続
            that.connection();

            if( Database.isCreate === false ) {
                // テーブル作成
                createDatabase();
                Database.isCreate = true;
            }

        })();

    }

    // DB接続
    Database.prototype.connection = function() {

        var that = this;

        that.db = window.openDatabase(
            that.options.dbName,
            that.options.dbVersion,
            that.options.dbDesc,
            that.options.dbSize
        );
    };

    /**
     * DBテーブル作成済みフラグ
     */
    Database.isCreate = false;

    /**
     * DB接続インスタンス取得
     */
    Database.prototype.getDB = function() {
        return this.db;
    };

    /**
     * トランザクション
     */
    Database.prototype.transaction = function(query, callback, errCallback) {
    };

    /**
     * クエリ実行
     */
    Database.prototype.query = function(query, args, success, error) {
        this.db.transaction(function(tx) {
            tx.executeSql(query, args, success, error);
        });
    };

    Database.prototype.get = function(table, cols, where, success, error) {
        var values = [],
            where_column = [],
            columns = (cols != null && cols != '') ? cols.join(',') : '*',
            query = 'SELECT ' + columns + ' FROM ' + table;

        if (where) {
            for( col in where ) {
              where_column.push(col + ' = ?');
              values.push(where[col]);
            }
            where_column = where_column.join(' AND ');
            query += " WHERE " + where_column;
        }
        
        this.query(query, values, success, error);    
    };

    /**
     * インサート
     */
    Database.prototype.insert = function(table, data, success, error) {
        var columns = [], fields = [], values = [];
            
        for( col in data ) {
            fields.push(col);
            columns.push('?');
            values.push(data[col]);
        }

        fields = '(' + fields.join(',') + ')';
        columns = '(' + columns.join(',') + ')';

        this.query('INSERT INTO ' + table + ' ' + fields + ' VALUES ' + columns, values, success, error);

    };

    /**
     * 更新
     */
    Database.prototype.update = function(table, data, where, success, error) {
        var fields = [], values = [], where_column = [];
        
        for( col in data ) {
          fields.push(col + ' = ?');
          values.push(data[col]);
        }
        fields = fields.join(',');
        
        for( col in where ) {
          where_column.push(col + ' = ?');
          values.push(where[col]);
        }
        where_column = where_column.join(' AND ');
                
        this.query('UPDATE ' + table + ' SET ' + fields + ' WHERE ' + where_column, values, success, error)
        
    };
  
    /**
     * 削除
     */
    Database.prototype.del = function() {

    };

    return Database;

})();
