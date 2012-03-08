
<h1>Add Post</h1>
<?php
echo $this->Form->create('Picture');
echo $this->Form->text('twitpic_id');
echo $this->Form->text('twitter_id');
echo $this->Form->end('Save Post');
?>
