<?php

// Register required dependencies
require_once(__DIR__ . '/php/required.php');

// create a new constant that holds the URI to the theme
define('THEME_ROOT', get_template_directory_uri());

// function that sets up basic settings/variables of theme
function setupTheme() {
  // show wordpress adminbar when admin
  if (!current_user_can('edit_posts')) {
    show_admin_bar( false );
  } else {
    show_admin_bar( true );
  }

  //add theme support for menus
  add_theme_support('menus');
  register_nav_menus(
    array(
      'main_menu' => 'Main Menu',
    )
  );
}
// run setup function
setupTheme();


// function that enqueues all JS scripts our theme uses
function enqueueJavaScripts() {
  $jsFiles = array(
    'bootstrapjs' => array(
      'src' => '/js/libs/bootstrap.min.js', // the file itself
      'deps' => array('jquery-core'), // the file dependencies
      'in_footer' => true
    ),
    'mainjs' => array(
      'src' => '/js/main.js', // the file itself
      'deps' => array('jquery-core'), // the file dependencies
      'in_footer' => true
    ),
    'classesjs' => array(
      'src' => '/js/classes.js', // the file itself
      'deps' => array('jquery-core'), // the file dependencies
      'in_footer' => true
    ),
    'localStorage' => array(
      'src' => '/js/localStorage.js', // the file itself
      'deps' => array(), // the file dependencies
      'in_footer' => true
    ),
    'bootstrapNavMenu' => array(
      'src' => '/js/bootstrapNavMenu.js', // the file itself
      'deps' => array('jquery-core'), // the file dependencies
      'in_footer' => true
    ),
      'headtacular' => array(
      'src' => '/js/libs/jquery.headtacular.js', // the file itself
      'deps' => array('jquery-core'), // the file dependencies
      'in_footer' => true
    ),
    /* keep adding them...
    'funnyScript2' => array(
      'src' => '/js/funnyScript2.js', // the file itself
      'deps' => array('bootstrapjs') // the file dependencies

    ),
    */
  );

  /**
   * Register the required JS scripts for this theme.
   *
   */
  foreach ($jsFiles as $key => $file) {
    /* example:
      wp_enqueue_script('bootstrapjs', 'js/libs/bootstrap.js', array('jquery-core'));
    */
    wp_enqueue_script($key, THEME_ROOT . $file['src'], $file['deps'], false, $file['in_footer']);
  }
}
// add our function to the wordpress boot cycle
add_action('wp_enqueue_scripts', 'enqueueJavaScripts');

function enqueueStylesheets() {
  // add your own CSS files to the array below
  $cssFiles = array(
    'stylescss' => array(
      'src' => '/css/all.css', // the file itself
      'deps' => array() // the file dependencies
    ),
    /*
    'funnycss' => array(
      'src' => '/css/funny.css', // the file itself
      'deps' => array('stylescss') // the file dependencies
    ),
    */
  );

  /**
   * Register the required CSS scripts for this theme.
   *
   */
  foreach ($cssFiles as $key => $file) {
    wp_enqueue_style($key, THEME_ROOT . $file['src'], $file['deps']);
  }
}
// add our function to the wordpress boot cycle
add_action('wp_enqueue_scripts', 'enqueueStylesheets');



// ==========================================================================
// PREPARE REST API
// ==========================================================================

function prepare_rest($data, $post, $request) {
  // thumbnail
  $_data = $data->data;
  // $thumbnail_id = get_post_thumbnail_id( $post->ID );
  // $thumbnail300x180 = wp_get_attachment_image( $thumbnail_id, '300x180' );


// categories
$cats = get_the_category( $post->ID );
$_data['cats'] = $cats;

// tags
$tags = wp_get_post_tags($post->ID);
$_data['tags'] = $tags;

// featured image
$featuredImg = wp_get_attachment_url( get_post_thumbnail_id($post->ID) );
$_data['featured_img'] = $featuredImg;

  // $_data['fi_300x180'] = $thumbnail300x180[0];
  $data->data = $_data;
  return $data;
}

add_filter('rest_prepare_post', 'prepare_rest', 10, 3 );

