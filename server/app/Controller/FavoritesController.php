<?php
/**
 * お気に入りコントローラークラス
 */
class FavoritesController extends AppController
{
    public $name = "Favorites";
    public $uses = array("Favorite");
    public $components = array("RequestHandler");
    public $helpers = array("Form", "Html");


    public function index($page = 1) 
    {

        $result = array();

        // 認証チェック
        if (!$this->checkVerification() )
        {
            $result["result"] = false;
            $this->jsonOut($result);
        }

        $page = empty($page)
              ? $_page
              : $page;

        $condition = array();
        $condition["twitter_id"] = $this->request->data["twitter_id"];
        $condition["page"]       = $page;


        $favorites = $this->Favorite->queryFindByTwitterId($condition);
        $result["data"] = $favorites["data"];
        $result["result"] = (empty($result["data"]))
                          ? false
                          : true;

        if( $this->Favorite->isOverGettingData($favorites["count"], $page) )
            $result["limit"] = true;

        $this->jsonOut($result);
    }

    public function add() 
    {
        $result = array();

        if ($this->request->is("post")) 
        {

            // 認証チェック
            if (!$this->checkVerification() )
            {
                $result["result"] = false;
                $this->jsonOut($result);
            }

            // ユニークチェック
            if( !$this->Favorite->myIsUnique($this->request->data["Favorite"])) 
            {
                $result["result"] = false;
                $result["unique"] = false;
                $this->jsonOut($result);
            }

            // 登録処理
            if ($this->Favorite->save($this->request->data)) 
            {
                // 成功時
                $result["result"] = true;

            } else {
                // 失敗時

                $errors = $this->Favorite->invalidFields();

                $result["result"] = false;

                // エラー内容格納
                $result["errors"] = array();
                foreach( $errors as $field => $messages ) 
                {
                    $result["errors"][$field] = $messages[0];
                }
            }
            $this->jsonOut($result);
        }
    }

    function delete($id) 
    {
        $result = array();

        if ($this->request->is('get')) {
//            throw new MethodNotAllowedException();
        }

        // 認証チェック
        if (!$this->checkVerification() )
        {
            $result["result"] = false;
            $this->jsonOut($result);
        }

        // 削除処理
        if ($this->Favorite->delete($id)) 
        {
            // 成功時
            $result["result"] = true;
        } 
        else 
        {
            // 失敗時
            $result["result"] = false;

            // エラー内容格納
            $result["errors"] = array();
            foreach( $errors as $field => $messages ) 
            {
                $result["errors"][$field] = $messages[0];
            }
        }

        $this->jsonOut($result);
    }
}
