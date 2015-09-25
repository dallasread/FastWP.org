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
    window.FWP = window.FWP.create('.fwp', {
        apiURL: 'http://localhost:3000',
        assetsURL: '<?php echo get_template_directory_uri(); ?>'
    });
</script>

<!-- <?php get_footer(); ?> -->
