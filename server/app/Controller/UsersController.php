<?php
/**
 * お気に入りコントローラークラス
 */
class UsersController extends AppController
{
    public $name = "Users";
    public $uses = array("User");
    public $components = array("RequestHandler");
    public $helpers = array("Form", "Html");


    public function updateAccessToken() 
    {
        $result = array();

        if ($this->request->is('get')) {
//            throw new MethodNotAllowedException();
        }

        // シークレットトークン認証
        $this->checkApplicationToken(); 

        $this->User->set($this->request->data);

        // バリデート
        if( !$this->User->validates() ) 
        {
            // 失敗時

            // エラー箇所取得
            $errors = $this->User->invalidFields();

            $result["result"] = "false";

            // エラー内容取得
            $result["errors"] = array();
            foreach( $errors as $field => $messages ) 
            {
                $result["errors"][$field] = $messages[0];
            }
            $this->jsonOut($result);
        }

        // 削除
        $this->User->deleteByTwitterId(
            $this->request->data["twitter_id"]
        );

        // 登録
        if ($this->User->save($this->request->data)) 
        {
            // 成功時

            $result["result"] = true;
            $result["access_token"] = $this->request->data["access_token"];
        }
        $this->jsonOut($result);
    }
}
