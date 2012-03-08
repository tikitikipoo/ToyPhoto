<?php

class Favorite extends AppModel
{

    protected $per_page = 30;

    public $name = "Favorite";

    public $validate = array(
        "picture_id" => array(
            "rule" => "notEmpty",
            "allowEmpty" => false
        ),
        "twitter_id" => array(
            "rule" => "notEmpty",
            "allowEmpty" => false
        ),
    );

    public function queryFindByTwitterId($params) {

        Configure::write('noRawQueryAlias',true);

        $page   = $this->getPageNum($params);
        $offset = $this->getOffset($page, $this->per_page);
        $limit  = $this->per_page;

        $sql = "SELECT  "
             . "    f.id, "
             . "    f.picture_id AS picture_id, "
             . "    f.twitter_id AS twitter_id, "
             . "    p.twitpic_id AS twitpic_id, "
             . "    p.url AS url, "
             . "    g.COUNT as count "
             . "FROM "
             . "    favorites AS f "
             . "    LEFT JOIN "
             . "        pictures AS p "
             . "        ON "
             . "            f.picture_id = p.id "
             . "    LEFT JOIN "
             . "        ("
             . "            SELECT "
             . "                f.`picture_id`, "
             . "                COUNT(*) AS COUNT "
             . "            FROM "
             . "                favorites AS f "
             . "            GROUP  BY f.`picture_id` "
             . "        ) AS g "
             . "        ON "
             . "            p.id = g.`picture_id` "
             . "WHERE  "
             . "    f.twitter_id = ? "
             . "    AND p.delete_flg = 0 "
             . "ORDER BY "
             . "    f.id ASC "
             . "LIMIT "
             . "   $offset, $limit ";

        $list = $this->query($sql, array($params["twitter_id"]), false);

        $listResult = array();
        foreach( $list as $data ) 
        {
            $listResult[] = $data[0];
        }

        $cntSql = 'SELECT COUNT(f.id) count FROM';
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
        if (!$params["picture_id"] || !$params["twitter_id"]) 
        {
            return false;
        }

        $sql = "SELECT "
             . "    id "
             . "FROM "
             . "    favorites "
             . "WHERE "
             . "    picture_id = ? "
             . "    AND twitter_id = ? ";

        $res =$this->query(
            $sql, 
            array($params["picture_id"], $params["twitter_id"]), 
            false);

        if ($res) 
            return false;
        else 
            return true;
    }
}
