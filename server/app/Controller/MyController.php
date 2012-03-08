<?php
/**
 *
 */
class MyController extends AppController
{
    public $name = "My";
    public $uses = array("Picture");
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
              ? 1
              : $page;

        $condition = array();
        $condition["twitter_id"] = $this->request->data["twitter_id"];
        $condition["page"]       = $page;

        $pictures = $this->Picture->queryFindByTwitterId($condition);
        $result["data"] = $pictures["data"];
        $result["result"] = (empty($result["data"]))
                          ? false
                          : true;

        if( $this->Picture->isOverGettingData($pictures["count"], $page) )
            $result["limit"] = true;

        $this->jsonOut($result);
    }

    function delete($id) 
    {
        $result = array();
        $data   = array();

        if ($this->request->is('get')) {
//            throw new MethodNotAllowedException();
        }

        // 認証

        // 認証チェック
        if (!$this->checkVerification() )
        {
            $result["result"] = false;
            $this->jsonOut($result);
        }

        $data["id"] = $id;
        $data["delete_flg"] = true;

        // 削除処理
        if ($this->Picture->save($data)) 
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

    public function test($twitter_id, $page) {

        $result = array();
        $condition = array();
        $condition["twitter_id"] = $twitter_id;
        $condition["page"]       = $page;

        $pictures = $this->Picture->queryFindByTwitterId($condition);
        $result["data"] = $pictures["data"];
        $result["result"] = (empty($result["data"]))
                          ? false
                          : true;

        if( $this->Picture->isOverGettingData($pictures["count"], $page) )
            $result["limit"] = true;

        $this->jsonOut($result);
    }
}
