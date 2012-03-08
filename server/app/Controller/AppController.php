<?php
class AppController extends Controller {

    public $uses = array("User");


    function beforeFilter() 
    {
//        $this->RequestHandler->setContent('json');
//        $this->RequestHandler->respondAs('application/json; charset=UTF-8');
    }


    public function jsonOut($data) 
    {
        $this->layout = false;
        $this->autoRender = false;
        $this->autoLayout = false;
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode( $data );
        exit;
    }

    public function checkVerification()
    {
        $access_token = $this->request->data["access_token"];
        $twitter_id   = $this->request->data["twitter_id"];

        if (empty($twitter_id) || empty($access_token)) 
        {
            return false;
        }

        // user情報取得
        if (!$user = $this->User->findByTwitterId($twitter_id) )
        {
            return false;
        }

        if ($user["User"]["access_token"] != $access_token) 
        {
            return false;
        }

        return true; 
    }

    public function checkApplicationToken() 
    {
        $app_token = $this->request->data["s"];
        $config_app_token = Configure::read('my_server_secret');
        if ($app_token !== $config_app_token)
        {
            $result = array();
            $result["result"] = false;
            $this->jsonOut($result);
        }
    }
}
