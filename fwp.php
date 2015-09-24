<?php
  /*
    Template Name: FWP
  */
  get_header();
?>

<style media="screen">
    header {
        display: none;
    }

    .main {
        display: none;
    }
</style>

<script type="text/javascript">
    $ = jQuery.noConflict();
    $('body').addClass('fwp');
    FWP.create('.fwp', {
        apiURL: 'http://localhost:3000'
    });
</script>

<!-- <?php get_footer(); ?> -->
