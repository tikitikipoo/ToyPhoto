<?php

class User extends AppModel
{

    protected $per_page = 30;

    public $name = "User";

    public $validate = array(
        "twitter_id" => array(
            "rule" => "notEmpty",
            "allowEmpty" => false
        ),
        "access_token" => array(
            "rule" => "notEmpty",
            "allowEmpty" => false
        ),
    );

    public function deleteByTwitterId($twitter_id)
    {

        $sql = "DELETE "
             . "FROM users "
             . "WHERE twitter_id =? ";

        $this->query($sql, array($twitter_id));
    }

}
