
<h1>Add Post</h1>
<?php
echo $this->Form->create('Favorite');
echo $this->Form->text('picture_id');
echo $this->Form->text('twitter_id');
echo $this->Form->end('Save Post');
?>
