<?php
/*

Plugin Name: BrilliantSidebar
Plugin URI: http://www.fastwordpress.org
Description: BrilliantSidebar is a simple events plugin.
Version: 1.0.0
Contributors: dallas22ca
Author: Dallas Read
Author URI: http://www.fastwordpress.org
Text Domain: brilliant-articles
Tags: sidebar
Requires at least: 3.6
Tested up to: 4.3
Stable tag: trunk
License: MIT

Copyright (c) 2015 Dallas Read.

ini_set("display_errors",1);
ini_set("display_startup_errors",1);
error_reporting(-1);
*/

class BrilliantSidebar {
    public static $brilliant_sidebar_instance;

    public static function init() {
        if ( is_null( self::$brilliant_sidebar_instance ) ) { self::$brilliant_sidebar_instance = new BrilliantSidebar(); }
        return self::$brilliant_sidebar_instance;
    }

    private function __construct() {
        add_action( 'save_post', array($this, 'save_post') );
        add_action( 'add_meta_boxes', array($this, 'add_meta_box') );
    }

    function add_meta_box() {
        $screens = array( 'page' );

        foreach ( $screens as $screen ) {
            add_meta_box(
                'brilliant-sidebar',
                __( 'Sidebar', 'brilliant-sidebar' ),
                array($this, 'meta_box_callback'),
                $screen,
                'side'
            );
        }
    }

    function meta_box_callback( $post ) {
        global $wp_registered_sidebars;

        wp_nonce_field( 'brilliant-sidebar-nonce', 'brilliant-sidebar-nonce' );

        $sidebar = get_post_meta( $post->ID, 'brilliant-sidebar', true );

        echo "<select name=\"brilliant-sidebar\">";
        echo "<option value=\"\">No Sidebar</option>";

        foreach ($wp_registered_sidebars as $key => $s) {
            echo "<option value=\"" . $s['id'] . "\" " . ($s['id'] == $sidebar ? ' selected="selected"' : '') . ">" . $s['name'] . "</option>";
        }

        echo "</select>";
    }

    function save_post( $post_id ) {
        if ( ! isset( $_POST['brilliant-sidebar-nonce'] ) ) {
            return;
        }

        if ( ! wp_verify_nonce( $_POST['brilliant-sidebar-nonce'], 'brilliant-sidebar-nonce' ) ) {
            return;
        }

        if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
            return;
        }

        if ( isset( $_POST['post_type'] ) && 'page' == $_POST['post_type'] ) {
            if ( ! current_user_can( 'edit_page', $post_id ) ) {
                return;
            }
        } else if ( ! current_user_can( 'edit_post', $post_id ) ) {
            return;
        }

        if ( !isset( $_POST['brilliant-sidebar'] ) ) {
            return;
        }

        $sidebar = sanitize_text_field( $_POST['brilliant-sidebar'] );

        update_post_meta( $post_id, 'brilliant-sidebar', $sidebar );
    }

}

BrilliantSidebar::init();

?>
