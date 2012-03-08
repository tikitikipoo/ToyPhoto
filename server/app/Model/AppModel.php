<?php
class AppModel extends Model {

    protected $per_page = 30;

    public function getOffset($page, $per_page)
    {
        if ($page === null || !is_numeric($page))
            $page = 1;
        if ($per_page == null)
            $per_page = $this->per_page;
        return ($page -1) * $per_page;
    }

    public function getPageNum($params)
    {
        $page = (isset($params["page"]))
              ? $params["page"]
              : 1;

        if ($page === null|| !is_numeric($page)) 
            $page = 1;

        return $page;
    }

    public function isOverGettingData($dataCount, $page) {

        $offset = $this->getOffset($page, $this->per_page);
        return $dataCount[0]["count"] < $offset + 1;
    }
}
