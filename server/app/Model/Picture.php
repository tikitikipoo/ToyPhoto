<?php

class Picture extends AppModel
{

    protected $per_page = 20;

    public $name = "Picture";

    public $validate = array(
        "twitpic_id" => array(
            "rule" => "notEmpty",
            "allowEmpty" => false
        ),
        "twitter_id" => array(
            "rule" => "notEmpty",
            "allowEmpty" => false
        ),
    );

    public function queryFindAll($params) 
    {
        Configure::write('noRawQueryAlias',true);

        $bind   = array();
        $page   = $this->getPageNum($params);
        $offset = $this->getOffset($page, $this->per_page);
        $limit  = $this->per_page;

        $sql = "SELECT "
             . "    p.id, "
             . "    p.twitpic_id, "
             . "    p.twitter_id, "
             . "    p.screen_name, "
             . "    p.text, "
             . "    p.url, "
             . "    p.width, "
             . "    p.height, "
             . "    p.size, "
             . "    p.type, "
             . "    IFNULL( g.COUNT, 0) as count "
             . "FROM   pictures AS p "
             . "    LEFT JOIN "
             . "        ( "
             . "            SELECT "
             . "                f.`picture_id`, "
             . "                COUNT(*) AS COUNT "
             . "            FROM   "
             . "                favorites AS f "
             . "            GROUP BY "
             . "                f.`picture_id`"
             . "        ) AS g "
             . "        ON p.id = g.`picture_id` "
             . "WHERE "
             . "    p.delete_flg = 0 "
             . "ORDER BY "
             . "   p.id DESC "
             . "LIMIT "
             . "   $offset, $limit ";

        // 指定ID
        if ($params["id"] && is_numeric($params["id"])) {
            $sql = preg_replace('/WHERE/i', 'WHERE p.id <= ? AND ', $sql);
            $bind[] = $params["id"];
        }

        $list = $this->query($sql, $bind, false);

        $listResult = array();
        foreach( $list as $data ) 
        {
            $listResult[] = $data[0];
        }

        $cntSql = 'SELECT COUNT(p.id) count FROM';
        $sql = preg_replace('/^SELECT (.*?) FROM/i', $cntSql, $sql);
        $sql = preg_replace('/LIMIT.+/i', '', $sql);

        $count = $this->query($sql, $bind, false);
        $countResult = array();
        foreach( $count as $data ) 
        {
            $countResult[] = $data[0];
        }

        return array("data" => $listResult, "count" => $countResult);
    }


    public function queryFindByTwitterId($params) 
    {
        if (!$params["twitter_id"])
        {
            return array();
        }

        Configure::write('noRawQueryAlias',true);

        $page   = $this->getPageNum($params);
        $offset = $this->getOffset($page, $this->per_page);
        $limit  = $this->per_page;

        $sql = "SELECT "
             . "    p.id, "
             . "    p.twitpic_id, "
             . "    p.twitter_id, "
             . "    p.screen_name, "
             . "    p.text, "
             . "    p.url, "
             . "    p.width, "
             . "    p.height, "
             . "    p.size, "
             . "    p.type, "
             . "    IFNULL( g.COUNT, 0) as count "
             . "FROM   pictures AS p "
             . "    LEFT JOIN "
             . "        ( "
             . "            SELECT "
             . "                f.`picture_id`, "
             . "                COUNT(*) AS COUNT "
             . "            FROM   "
             . "                favorites AS f "
             . "            GROUP BY "
             . "                f.`picture_id`"
             . "        ) AS g "
             . "        ON p.id = g.`picture_id` "
             . "WHERE "
             . "    p.delete_flg = 0 "
             . "    AND p.twitter_id = ? "
             . "ORDER BY "
             . "   p.id ASC "
             . "LIMIT "
             . "   $offset, $limit ";

        $list = $this->query($sql, array($params["twitter_id"]), false);

        $listResult = array();
        foreach( $list as $data ) 
        {
            $listResult[] = $data[0];
        }

        $cntSql = 'SELECT COUNT(p.id) count FROM';
        $sql = preg_replace('/^SELECT (.*?) FROM/i', $cntSql, $sql);
        $sql = preg_replace('/LIMIT.+/i', '', $sql);

        $count = $this->query($sql, array($params["twitter_id"]), false);
        $countResult = array();
        foreach( $count as $data ) 
        {
            $countResult[] = $data[0];
        }

        return array("data" => $listResult, "count" => $countResult);
    }

    /**
     * ユニークのときtrue
     */
    public function myIsUnique($params) 
    {
        if (!$params["twitpic_id"] || !$params["twitter_id"]) 
        {
            return false;
        }

        $sql = "SELECT "
             . "    id "
             . "FROM "
             . "    pictures "
             . "WHERE "
             . "    delete_flg = 0 "
             . "    AND twitpic_id = ? "
             . "    AND twitter_id = ? ";

        $res =$this->query(
            $sql, 
            array($params["twitpic_id"], $params["twitter_id"]), 
            false);

        if ($res) 
            return false;
        else 
            return true;
    }

}
