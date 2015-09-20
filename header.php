<!DOCTYPE html>
<html <?php language_attributes(); ?>>
    <head>
        <title><?php is_front_page() ? bloginfo('description') : wp_title(''); ?> - <?php bloginfo('name'); ?></title>
        <meta charset="<?php bloginfo( 'charset' ); ?>">
        <meta content="initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" />
        <meta content="yes" name="apple-mobile-web-app-capable" />
        <meta content="black" name="apple-mobile-web-app-status-bar-style" />
        <link rel="shortcut icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/imgs/favicon.ico"/>
        <?php wp_head(); ?>
    </head>
    <body <?php body_class(); ?>>

    <?php if (is_active_sidebar('top-bar')) { dynamic_sidebar( 'top-bar' ); } ?>

    <header>
        <div class="container">
            <a href="<?php echo site_url(); ?>" id="logo">
                <img src="<?php echo get_template_directory_uri(); ?>/imgs/logo.png">
            </a>
            <?php
                wp_nav_menu(array(
                    "theme_location" => "main",
                    "menu_id" => "main"
                ));
            ?>
        </div>
    </header>

    <div class="content">
        <div class="container">
