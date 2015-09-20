<?php

class FastWordPress {
  public static $fastwordpress_instance;

  public static function init() {
    if ( is_null( self::$fastwordpress_instance ) ) { self::$fastwordpress_instance = new FastWordPress(); }
    return self::$fastwordpress_instance;
  }

  private function __construct() {
    add_action( "wp_enqueue_scripts", array($this, "scripts") );
    add_action( "widgets_init", array($this, "sidebars") );

    add_filter( 'excerpt_more', array($this, 'excerpt_more') );
    add_filter( 'excerpt_length', array($this, 'excerpt_length') );

    FastWordPress::menus();
  }

  public static function scripts() {
    wp_enqueue_style( "style",        get_template_directory_uri() . "/style.css" );
    wp_enqueue_script( "script",      get_template_directory_uri() . "/js/fastwordpress.js", array("jquery") );
  }

  public static function excerpt_more($more) {
    return $more ? '...' : '';
  }

  public static function excerpt_length( $length ) {
    return 40;
  }

  public static function menus() {
    register_nav_menus( array(
      "footer" => "Footer",
      "main" => "Main",
    ) );
  }

  public static function sidebars() {
    register_sidebar( array(
      "name"          => "Main",
      "id"            => "main",
      "description"   => "Main sidebar that appears on the right hand side",
      "before_widget" => "<div class=\"widget block\">",
      "after_widget"  => "</div>",
      "before_title"  => "<h4 class=\"widget-title\">",
      "after_title"   => "</h4>",
    ) );

    register_sidebar( array(
      "name"          => "Top Bar CTA",
      "id"            => "top-bar",
      "description"   => "Top Bar CTA",
      "before_widget" => "<div id=\"top-bar\">",
      "after_widget"  => "</div>",
      "before_title"  => "<h4 class=\"widget-title\">",
      "after_title"   => "</h4>",
    ) );

    register_sidebar( array(
      "name"          => "Footer",
      "id"            => "footer",
      "description"   => "Right Footer",
      "before_widget" => "",
      "after_widget"  => "",
      "before_title"  => "",
      "after_title"   => "",
    ) );

    register_sidebar( array(
      "name"          => "Copyright",
      "id"            => "copyright",
      "description"   => "Right Copyright",
      "before_widget" => "",
      "after_widget"  => "",
      "before_title"  => "",
      "after_title"   => "",
    ) );
  }
}

require_once('plugins/brilliant-sidebar/index.php');

FastWordPress::init();

?>
