<?php
  /*
    Template Name: FWP
  */
  get_header();
?>

<div id="fwp"></div>
<script type="text/javascript">
    $ = jQuery.noConflict();
    $('body').attr('id', 'fwp');
    FWP.create('#fwp');
    $('header .menu, #top-bar').hide();
</script>

<?php get_footer(); ?>