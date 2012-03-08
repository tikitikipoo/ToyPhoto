<?php
/**
 *
 */
class PublicsController extends AppController
{
    public $name = "Publics";
    public $uses = array("Picture");
    public $components = array("RequestHandler");
    public $helpers = array("Form", "Html");

    public function index($page = 1, $id = 0) 
    {
        $result = array();
        $condition["page"] = empty($page)
                           ? 1
                           : $page;
        $condition["id"] = $id;

        $pictures = $this->Picture->queryFindAll($condition);
        $result["data"] = $pictures["data"];
        $result["result"] = (empty($result["data"]))
                          ? false
                          : true;

        if( $this->Picture->isOverGettingData($pictures["count"], $page) )
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
            if( !$this->Picture->myIsUnique($this->request->data["Picture"])) 
            {
                $result["result"] = false;
                $result["unique"] = false;
                $this->jsonOut($result);
            }

            // 登録処理
            if ($this->Picture->save($this->request->data)) 
            {
                // 成功時
                $result["result"] = true;
            }
            else 
            {
                // 失敗時
                $errors = $this->Picture->invalidFields();

                $result["result"] = false;

                // エラー内容格納
                $result["errors"] = array();
                foreach( $errors as $field => $messages ) 
                {
                    $result["errors"][$field] = $messages[0];
                }
            }

            // 出力処理
            $this->jsonOut($result);
        }
    }

    public function root($page = 1, $id = 0) 
    {
        $this->layout = false;
        $this->autoRender = false;
        $this->autoLayout = false;
        header('Content-Type: text/html; charset=UTF-8');
        exit;
    }

}
