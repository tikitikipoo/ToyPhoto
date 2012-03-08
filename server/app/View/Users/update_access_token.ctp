
<h1>Add Post</h1>
<?php
echo $this->Form->create('User');
echo $this->Form->text('twitter_id');
echo $this->Form->text('access_token');
echo $this->Form->end('Save Post');
?>
